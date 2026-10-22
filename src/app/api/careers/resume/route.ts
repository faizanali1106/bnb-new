import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { STORAGE_BUCKET } from "@/lib/cms/storage";
import { getSupabaseService } from "@/lib/supabase/service";

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

export async function POST(req: Request) {
  const supabase = getSupabaseService();
  if (!supabase) {
    return NextResponse.json({ error: "Storage is not configured." }, { status: 500 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing resume file." }, { status: 400 });
  }

  const ext = fileExt(file.name);
  if (!ALLOWED_EXT.has(ext)) {
    return NextResponse.json(
      { error: "Resume must be a PDF, DOC, DOCX, or TXT file." },
      { status: 400 }
    );
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Resume must be 5MB or smaller." }, { status: 400 });
  }

  if (file.type && !ALLOWED_MIME.has(file.type)) {
    return NextResponse.json({ error: "Unsupported resume file type." }, { status: 400 });
  }

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

  const { error: upErr } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(objectPath, buffer, {
      contentType,
      upsert: false,
    });

  if (upErr) {
    console.error("[careers/resume]", upErr);
    return NextResponse.json(
      { error: "Could not store resume. Please try again." },
      { status: 500 }
    );
  }

  const { data: pub } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(objectPath);

  return NextResponse.json({
    url: pub.publicUrl,
    path: objectPath,
    name: file.name,
  });
}
