import { NextResponse } from "next/server";
import { CMS_COOKIE_NAME, getExpectedSessionToken } from "@/lib/cms/auth-cookie";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const password = typeof body?.password === "string" ? body.password : "";
    if (
      !process.env.CMS_ADMIN_PASSWORD ||
      !process.env.CMS_SESSION_SECRET ||
      password !== process.env.CMS_ADMIN_PASSWORD
    ) {
      return NextResponse.json({ ok: false, error: "Invalid credentials" }, { status: 401 });
    }
    const token = getExpectedSessionToken();
    const res = NextResponse.json({ ok: true });
    res.cookies.set(CMS_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
