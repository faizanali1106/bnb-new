/** Bucket used for CMS uploads (must match Supabase + .env). */
export const STORAGE_BUCKET =
  process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ?? "portfolio-media";

export const UPLOAD_MAX_BYTES = 5 * 1024 * 1024;

export const UPLOAD_ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

/** Folders under the bucket; must match API allowlist. */
export type UploadFolder =
  | "projects"
  | "work"
  | "grid"
  | "companies"
  | "social"
  | "team"
  | "misc";
