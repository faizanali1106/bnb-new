import { NextResponse } from "next/server";
import { verifyRecaptchaToken } from "@/lib/verify-recaptcha";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let token = "";
  try {
    const body = (await req.json()) as { token?: string };
    token = typeof body.token === "string" ? body.token : "";
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const ok = await verifyRecaptchaToken(token);
  if (!ok) {
    return NextResponse.json(
      { ok: false, error: "Please complete the captcha." },
      { status: 400 }
    );
  }

  return NextResponse.json({ ok: true });
}
