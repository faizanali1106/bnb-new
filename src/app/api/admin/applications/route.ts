import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { CMS_COOKIE_NAME, verifyAdminSessionCookie } from "@/lib/cms/auth-cookie";
import { mapApplication } from "@/lib/cms/applications";
import { getSupabaseService } from "@/lib/supabase/service";

export const runtime = "nodejs";

export async function GET(req: Request) {
  if (!verifyAdminSessionCookie((await cookies()).get(CMS_COOKIE_NAME)?.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseService();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").trim().toLowerCase();
  const status = searchParams.get("status");
  const jobId = searchParams.get("jobId");
  const jobTitle = (searchParams.get("jobTitle") ?? "").trim().toLowerCase();
  const questionId = (searchParams.get("questionId") ?? "").trim();
  const answerQuery = (searchParams.get("answer") ?? "").trim().toLowerCase();

  let query = supabase
    .from("job_applications")
    .select("*")
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (status === "new" || status === "reviewed" || status === "rejected") {
    query = query.eq("status", status);
  } else if (status === "favorite") {
    query = query.eq("featured", true).neq("status", "rejected");
  } else {
    // Default inbox: hide rejected (they live under the Rejected tab)
    query = query.neq("status", "rejected");
  }

  let { data, error } = await query;
  if (error && /featured/i.test(error.message ?? "")) {
    let fallback = supabase
      .from("job_applications")
      .select("*")
      .order("created_at", { ascending: false });
    if (status === "new" || status === "reviewed" || status === "rejected") {
      fallback = fallback.eq("status", status);
    } else if (status !== "favorite") {
      fallback = fallback.neq("status", "rejected");
    }
    const retry = await fallback;
    data = retry.data;
    error = retry.error;
  }
  if (error) {
    console.error("[admin/applications]", error);
    return NextResponse.json(
      {
        error:
          error.code === "42P01" || error.message?.includes("job_applications")
            ? "Applications table is missing. Run supabase/migrations/006_job_applications.sql in Supabase."
            : error.message,
      },
      { status: 500 }
    );
  }

  let applications = (data ?? []).map((row) => mapApplication(row as Record<string, unknown>));
  applications.sort((a, b) => Number(b.featured) - Number(a.featured));
  if (status === "favorite") {
    applications = applications.filter((item) => item.featured && item.status !== "rejected");
  } else if (!status || status === "all") {
    applications = applications.filter((item) => item.status !== "rejected");
  }

  const numericJobId = jobId && Number.isFinite(Number(jobId)) ? Number(jobId) : null;
  const normalizeTitle = (value: string) => value.trim().toLowerCase().replace(/\s+/g, " ");
  let dbTitle = "";
  if (numericJobId != null) {
    const { data: jobRow } = await supabase.from("jobs").select("title").eq("id", numericJobId).maybeSingle();
    dbTitle = normalizeTitle(String((jobRow as { title?: string } | null)?.title ?? ""));
  }
  const titles = [jobTitle, dbTitle].map(normalizeTitle).filter(Boolean);
  if (numericJobId != null || titles.length) {
    applications = applications.filter((item) => {
      if (numericJobId != null && Number(item.jobId) === numericJobId) return true;
      const applicationTitle = normalizeTitle(item.jobTitle);
      return titles.some(
        (title) =>
          applicationTitle === title ||
          applicationTitle.includes(title) ||
          title.includes(applicationTitle)
      );
    });
  }

  if (q) {
    applications = applications.filter((item) => {
      const haystack = [
        item.firstName,
        item.lastName,
        item.email,
        item.phone,
        item.jobTitle,
        item.address,
        ...(item.answers ?? []).flatMap((answer) => [answer.question, answer.answer]),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }

  if (questionId) {
    applications = applications.filter((item) =>
      (item.answers ?? []).some(
        (answer) =>
          answer.questionId === questionId &&
          (!answerQuery || answer.answer.toLowerCase().includes(answerQuery))
      )
    );
  } else if (answerQuery) {
    applications = applications.filter((item) =>
      (item.answers ?? []).some((answer) => answer.answer.toLowerCase().includes(answerQuery))
    );
  }

  return NextResponse.json({ applications });
}
