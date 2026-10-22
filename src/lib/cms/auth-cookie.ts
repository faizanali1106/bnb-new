import { createHmac, timingSafeEqual } from "crypto";

export const CMS_COOKIE_NAME = "bnb_cms_session";

export function getExpectedSessionToken(): string {
  const secret = process.env.CMS_SESSION_SECRET ?? "";
  const pass = process.env.CMS_ADMIN_PASSWORD ?? "";
  return createHmac("sha256", secret).update(pass).digest("base64url");
}

export function verifyAdminSessionCookie(cookieValue: string | undefined): boolean {
  if (!cookieValue || !process.env.CMS_SESSION_SECRET || !process.env.CMS_ADMIN_PASSWORD) {
    return false;
  }
  try {
    const a = Buffer.from(cookieValue, "utf8");
    const b = Buffer.from(getExpectedSessionToken(), "utf8");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
