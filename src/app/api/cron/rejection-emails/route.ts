import { NextResponse } from "next/server";
import { mapApplication } from "@/lib/cms/applications";
import { sendRejectionEmail } from "@/lib/send-rejection-email";
import { getSupabaseService } from "@/lib/supabase/service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authorized(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const header = req.headers.get("authorization") ?? "";
  if (header === `Bearer ${secret}`) return true;
  const url = new URL(req.url);
  return url.searchParams.get("secret") === secret;
}

export async function GET(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseService();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  const nowIso = new Date().toISOString();
  const { data, error } = await supabase
    .from("job_applications")
    .select("*")
    .eq("status", "rejected")
    .is("rejection_email_sent_at", null)
    .not("rejection_email_at", "is", null)
    .lte("rejection_email_at", nowIso)
    .limit(50);

  if (error) {
    const missing =
      /rejected_at|rejection_email/i.test(error.message ?? "") ||
      /column .* does not exist/i.test(error.message ?? "");
    return NextResponse.json(
      {
        error: missing
          ? "Rejection email columns are missing. Run supabase/migrations/011_rejection_email_schedule.sql in Supabase."
          : error.message,
      },
      { status: 500 }
    );
  }

  const rows = data ?? [];
  let sent = 0;
  let failed = 0;
  const results: { id: number; ok: boolean; error?: string }[] = [];

  for (const row of rows) {
    const app = mapApplication(row as Record<string, unknown>);
    try {
      const ok = await sendRejectionEmail({
        firstName: app.firstName,
        lastName: app.lastName,
        email: app.email,
        jobTitle: app.jobTitle,
      });
      if (!ok) {
        failed += 1;
        results.push({ id: app.id, ok: false, error: "EmailJS send failed" });
        continue;
      }

      const { error: updateErr } = await supabase
        .from("job_applications")
        .update({ rejection_email_sent_at: new Date().toISOString() })
        .eq("id", app.id)
        .eq("status", "rejected")
        .is("rejection_email_sent_at", null);

      if (updateErr) {
        failed += 1;
        results.push({ id: app.id, ok: false, error: updateErr.message });
        continue;
      }

      sent += 1;
      results.push({ id: app.id, ok: true });
    } catch (err) {
      failed += 1;
      results.push({
        id: app.id,
        ok: false,
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }

  return NextResponse.json({
    checked: rows.length,
    sent,
    failed,
    results,
  });
}

export async function POST(req: Request) {
  return GET(req);
}
