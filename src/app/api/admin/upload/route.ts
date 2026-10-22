import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { CMS_COOKIE_NAME, verifyAdminSessionCookie } from "@/lib/cms/auth-cookie";
import {
  STORAGE_BUCKET,
  UPLOAD_ALLOWED_MIME,
  UPLOAD_MAX_BYTES,
  type UploadFolder,
} from "@/lib/cms/storage";
import { getSupabaseService } from "@/lib/supabase/service";

const ALLOWED_FOLDERS = new Set<string>([
  "projects",
  "work",
  "grid",
  "companies",
  "social",
  "team",
  "misc",
]);

export async function POST(req: Request) {
  const cookie = (await cookies()).get(CMS_COOKIE_NAME)?.value;
  if (!verifyAdminSessionCookie(cookie)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseService();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = form.get("file");
  const folderRaw = (form.get("folder") as string) || "misc";
  const folder = ALLOWED_FOLDERS.has(folderRaw) ? folderRaw : "misc";

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  if (file.size > UPLOAD_MAX_BYTES) {
    return NextResponse.json(
      { error: `File too large (max ${UPLOAD_MAX_BYTES / 1024 / 1024}MB)` },
      { status: 400 }
    );
  }

  if (!UPLOAD_ALLOWED_MIME.has(file.type)) {
    return NextResponse.json(
      { error: "Unsupported type. Use JPEG, PNG, WebP, GIF, or SVG." },
      { status: 400 }
    );
  }

  const safeBase = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120) || "image";
  const objectPath = `${folder as UploadFolder}/${Date.now()}-${safeBase}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: upErr } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(objectPath, buffer, {
      contentType: file.type,
      upsert: true,
    });

  if (upErr) {
    console.error("[admin/upload]", upErr);
    return NextResponse.json(
      { error: upErr.message || "Upload failed. Did you create the bucket? (see supabase/migrations/002_storage_portfolio.sql)" },
      { status: 500 }
    );
  }

  const { data: pub } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(objectPath);

  return NextResponse.json({
    url: pub.publicUrl,
    path: objectPath,
    bucket: STORAGE_BUCKET,
  });
}
