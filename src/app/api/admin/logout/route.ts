import { NextResponse } from "next/server";
import { CMS_COOKIE_NAME } from "@/lib/cms/auth-cookie";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(CMS_COOKIE_NAME, "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });
  return res;
}
