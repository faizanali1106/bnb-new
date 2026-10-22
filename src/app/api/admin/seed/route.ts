import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { verifyAdminSessionCookie, CMS_COOKIE_NAME } from "@/lib/cms/auth-cookie";
import { DEFAULT_SITE_CONTENT } from "@/lib/cms/defaults";
import { getSupabaseService } from "@/lib/supabase/service";
import { persistSiteContent } from "@/lib/cms/persist-to-supabase";
import { loadMergedSiteContent } from "@/lib/cms/load-from-supabase";

export async function POST() {
  const cookie = (await cookies()).get(CMS_COOKIE_NAME)?.value;
  if (!verifyAdminSessionCookie(cookie)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseService();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  const { count, error } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  const { count: jobCount, error: jobError } = await supabase
    .from("jobs")
    .select("*", { count: "exact", head: true });

  if (jobError && /schema cache|does not exist|could not find the table/i.test(jobError.message)) {
    return NextResponse.json(
      {
        error:
          "Jobs table is missing. Run supabase/migrations/004_jobs.sql in the Supabase SQL editor, then try again.",
      },
      { status: 500 }
    );
  }
  if (jobError) {
    return NextResponse.json({ error: jobError.message }, { status: 500 });
  }

  if ((count ?? 0) > 0) {
    if ((jobCount ?? 0) === 0) {
      try {
        const current = await loadMergedSiteContent();
        await persistSiteContent({
          ...current,
          jobs: DEFAULT_SITE_CONTENT.jobs,
        });
        // CMS data is used across many public routes — revalidate the whole tree.
        revalidatePath("/", "layout");
        return NextResponse.json({
          ok: true,
          seeded: true,
          message: "Seeded 2 job openings.",
        });
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Failed to seed jobs";
        return NextResponse.json({ error: msg }, { status: 500 });
      }
    }
    return NextResponse.json({ ok: true, skipped: true, message: "Database already has projects." });
  }

  try {
    await persistSiteContent(DEFAULT_SITE_CONTENT);
    // CMS data is used across many public routes — revalidate the whole tree.
    revalidatePath("/", "layout");
    return NextResponse.json({ ok: true, seeded: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Seed failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
