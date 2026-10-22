import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { STORAGE_BUCKET } from "@/lib/cms/storage";
import { getSupabaseService } from "@/lib/supabase/service";
import { verifyRecaptchaToken } from "@/lib/verify-recaptcha";
import { buildSlackMessage, postSlackWebhook } from "@/lib/notify-slack";
import {
  ALREADY_APPLIED_MESSAGE,
  hasExistingApplication,
} from "@/lib/careers/already-applied";

export const runtime = "nodejs";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_EXT = new Set(["pdf", "doc", "docx", "txt"]);
const ALLOWED_MIME = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "application/octet-stream",
]);

function fileExt(name: string) {
  return name.split(".").pop()?.toLowerCase() || "";
}

function str(form: FormData, key: string) {
  const value = form.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function parseJsonArray(raw: string): unknown[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

type ScreeningAnswer = { questionId: string; question: string; answer: string };

function parseAnswers(raw: string): ScreeningAnswer[] {
  return parseJsonArray(raw)
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const o = item as Record<string, unknown>;
      return {
        questionId: String(o.questionId ?? ""),
        question: String(o.question ?? o.prompt ?? ""),
        answer: String(o.answer ?? "").trim(),
      };
    })
    .filter((item): item is ScreeningAnswer => item != null);
}

function parseQuestions(value: unknown): { id: string; prompt: string }[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const o = item as Record<string, unknown>;
      const prompt = String(o.prompt ?? "").trim();
      if (!prompt) return null;
      return { id: String(o.id ?? prompt), prompt };
    })
    .filter((item): item is { id: string; prompt: string } => item != null);
}

export async function POST(req: Request) {
  const supabase = getSupabaseService();
  if (!supabase) {
    return NextResponse.json({ error: "Applications are not configured." }, { status: 500 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
  }

  const jobTitle = str(form, "jobTitle");
  const firstName = str(form, "firstName");
  const lastName = str(form, "lastName");
  const email = str(form, "email").toLowerCase();
  const phone = str(form, "phone");
  const address = str(form, "address");

  if (!jobTitle || !firstName || !lastName || !email || !phone || !address) {
    return NextResponse.json({ error: "Please complete all required fields." }, { status: 400 });
  }

  const captchaOk = await verifyRecaptchaToken(str(form, "captchaToken"));
  if (!captchaOk) {
    return NextResponse.json({ error: "Please complete the captcha." }, { status: 400 });
  }

  const jobIdRaw = str(form, "jobId");
  const jobId = jobIdRaw && Number.isFinite(Number(jobIdRaw)) ? Number(jobIdRaw) : null;

  if (await hasExistingApplication({ jobId, jobTitle, email })) {
    return NextResponse.json({ error: ALREADY_APPLIED_MESSAGE }, { status: 409 });
  }

  const file = form.get("resume");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Please upload your resume." }, { status: 400 });
  }

  const ext = fileExt(file.name);
  if (!ALLOWED_EXT.has(ext)) {
    return NextResponse.json({ error: "Resume must be a PDF, DOC, DOCX, or TXT file." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Resume must be 5MB or smaller." }, { status: 400 });
  }

  const submittedAnswers = parseAnswers(str(form, "answers"));

  let requiredQuestions: { id: string; prompt: string }[] = [];
  if (jobId) {
    const { data: jobRow } = await supabase.from("jobs").select("*").eq("id", jobId).maybeSingle();
    requiredQuestions = parseQuestions(
      jobRow && typeof jobRow === "object" ? (jobRow as Record<string, unknown>).questions : []
    );
  }

  if (requiredQuestions.length) {
    const missing = requiredQuestions.some((question) => {
      const match = submittedAnswers.find(
        (answer) => answer.questionId === question.id || answer.question === question.prompt
      );
      return !match || !match.answer;
    });
    if (missing) {
      return NextResponse.json(
        { error: "Please answer all screening questions for this role." },
        { status: 400 }
      );
    }
  }

  const answers = requiredQuestions.length
    ? requiredQuestions.map((question) => {
        const match = submittedAnswers.find(
          (answer) => answer.questionId === question.id || answer.question === question.prompt
        );
        return {
          questionId: question.id,
          question: question.prompt,
          answer: match?.answer ?? "",
        };
      })
    : submittedAnswers.filter((answer) => answer.answer);

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80) || `resume.${ext}`;
  const objectPath = `applications/${Date.now()}-${randomUUID()}-${safeName}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const contentType =
    file.type && file.type !== "application/octet-stream"
      ? file.type
      : ext === "pdf"
        ? "application/pdf"
        : ext === "txt"
          ? "text/plain"
          : "application/octet-stream";

  const { error: upErr } = await supabase.storage.from(STORAGE_BUCKET).upload(objectPath, buffer, {
    contentType,
    upsert: false,
  });

  if (upErr) {
    console.error("[careers/apply] upload", upErr);
    return NextResponse.json({ error: "Could not store resume. Please try again." }, { status: 500 });
  }

  const { data: pub } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(objectPath);

  const row = {
    job_id: jobId,
    job_title: jobTitle,
    first_name: firstName,
    last_name: lastName,
    email,
    phone,
    address,
    linkedin: str(form, "linkedin"),
    website: str(form, "website"),
    cover_letter: str(form, "coverLetter"),
    education: parseJsonArray(str(form, "education")),
    experience: parseJsonArray(str(form, "experience")),
    resume_name: file.name,
    resume_url: pub.publicUrl,
    resume_path: objectPath,
    answers,
    status: "new",
  };

  let { error: insertErr } = await supabase.from("job_applications").insert(row);
  if (insertErr && /answers/i.test(insertErr.message ?? "")) {
    const { answers: _answers, ...withoutAnswers } = row;
    const retry = await supabase.from("job_applications").insert(withoutAnswers);
    insertErr = retry.error;
  }
  if (
    insertErr &&
    jobId &&
    insertErr.code !== "23505" &&
    !/duplicate|unique/i.test(insertErr.message ?? "")
  ) {
    const retry = await supabase.from("job_applications").insert({ ...row, job_id: null });
    insertErr = retry.error;
  }

  if (insertErr) {
    console.error("[careers/apply] insert", insertErr);
    if (insertErr.code === "23505" || /duplicate|unique/i.test(insertErr.message ?? "")) {
      return NextResponse.json({ error: ALREADY_APPLIED_MESSAGE }, { status: 409 });
    }
    return NextResponse.json(
      {
        error:
          insertErr.message?.includes("job_applications") || insertErr.code === "42P01"
            ? "Applications table is missing. Run supabase/migrations/006_job_applications.sql in Supabase."
            : "Could not save application. Please try again.",
      },
      { status: 500 }
    );
  }

  try {
    await postSlackWebhook(
      buildSlackMessage({
        type: "job",
        jobTitle,
        firstName,
        lastName,
        email,
        phone,
        answers: answers.map((a) => ({ question: a.question, answer: a.answer })),
      })
    );
  } catch (err) {
    console.error("[careers/apply] slack", err);
  }

  return NextResponse.json({ ok: true });
}
