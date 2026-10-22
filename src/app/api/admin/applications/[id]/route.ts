import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { CMS_COOKIE_NAME, verifyAdminSessionCookie } from "@/lib/cms/auth-cookie";
import { mapApplication } from "@/lib/cms/applications";
import { STORAGE_BUCKET } from "@/lib/cms/storage";
import { rejectionEmailDueAt } from "@/lib/send-rejection-email";
import { getSupabaseService } from "@/lib/supabase/service";

export const runtime = "nodejs";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function parseId(raw: string) {
  const id = Number(raw);
  return Number.isFinite(id) ? id : null;
}

function clearRejectionSchedule() {
  return {
    rejected_at: null,
    rejection_email_at: null,
    rejection_email_sent_at: null,
  };
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!verifyAdminSessionCookie((await cookies()).get(CMS_COOKIE_NAME)?.value)) {
    return unauthorized();
  }

  const id = parseId((await params).id);
  if (id == null) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const supabase = getSupabaseService();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const payload = body as {
    status?: string;
    featured?: boolean;
    cancelRejectionEmail?: boolean;
  };
  const patch: Record<string, unknown> = {};
  if (payload.status === "new" || payload.status === "reviewed" || payload.status === "rejected") {
    patch.status = payload.status;
    if (payload.status === "rejected") {
      const now = new Date();
      patch.rejected_at = now.toISOString();
      patch.rejection_email_at = rejectionEmailDueAt(now).toISOString();
      patch.rejection_email_sent_at = null;
    } else {
      Object.assign(patch, clearRejectionSchedule());
    }
  }
  if (typeof payload.featured === "boolean") {
    patch.featured = payload.featured;
  }
  if (payload.cancelRejectionEmail === true) {
    patch.rejection_email_at = null;
    // Keep rejected status and rejected_at; only stop the automatic email.
  }
  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("job_applications")
    .update(patch)
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) {
    const missingFeatured = /featured/i.test(error.message ?? "");
    const missingRejection =
      /rejected_at|rejection_email/i.test(error.message ?? "") ||
      /column .* does not exist/i.test(error.message ?? "");
    return NextResponse.json(
      {
        error: missingFeatured
          ? "Featured column is missing. Run supabase/migrations/008_application_featured.sql in Supabase."
          : missingRejection
            ? "Rejection email columns are missing. Run supabase/migrations/011_rejection_email_schedule.sql in Supabase."
            : error.message,
      },
      { status: 500 }
    );
  }
  if (!data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ application: mapApplication(data as Record<string, unknown>) });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!verifyAdminSessionCookie((await cookies()).get(CMS_COOKIE_NAME)?.value)) {
    return unauthorized();
  }

  const id = parseId((await params).id);
  if (id == null) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const supabase = getSupabaseService();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  const { data: existing, error: loadErr } = await supabase
    .from("job_applications")
    .select("id, resume_path")
    .eq("id", id)
    .maybeSingle();

  if (loadErr) {
    return NextResponse.json({ error: loadErr.message }, { status: 500 });
  }
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const resumePath = String((existing as { resume_path?: string }).resume_path ?? "");
  if (resumePath) {
    await supabase.storage.from(STORAGE_BUCKET).remove([resumePath]);
  }

  const { error: deleteErr } = await supabase.from("job_applications").delete().eq("id", id);
  if (deleteErr) {
    return NextResponse.json({ error: deleteErr.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
