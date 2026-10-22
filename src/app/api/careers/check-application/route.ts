import { NextResponse } from "next/server";
import {
  ALREADY_APPLIED_MESSAGE,
  hasExistingApplication,
} from "@/lib/careers/already-applied";
import { getSupabaseService } from "@/lib/supabase/service";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!getSupabaseService()) {
    return NextResponse.json({ error: "Applications are not configured." }, { status: 500 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const o = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const email = typeof o.email === "string" ? o.email.trim() : "";
  const jobTitle = typeof o.jobTitle === "string" ? o.jobTitle.trim() : "";
  const jobIdRaw = o.jobId;
  const jobId =
    typeof jobIdRaw === "number" && Number.isFinite(jobIdRaw)
      ? jobIdRaw
      : typeof jobIdRaw === "string" && jobIdRaw.trim() && Number.isFinite(Number(jobIdRaw))
        ? Number(jobIdRaw)
        : null;

  if (!email || !jobTitle) {
    return NextResponse.json({ error: "Email and job are required." }, { status: 400 });
  }

  const alreadyApplied = await hasExistingApplication({ jobId, jobTitle, email });
  return NextResponse.json({
    alreadyApplied,
    message: alreadyApplied ? ALREADY_APPLIED_MESSAGE : null,
  });
}
