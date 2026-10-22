import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { CMS_COOKIE_NAME, verifyAdminSessionCookie } from "@/lib/cms/auth-cookie";

export const runtime = "nodejs";

export async function GET() {
  const ok = verifyAdminSessionCookie((await cookies()).get(CMS_COOKIE_NAME)?.value);
  return NextResponse.json({ ok }, { status: ok ? 200 : 401 });
}
