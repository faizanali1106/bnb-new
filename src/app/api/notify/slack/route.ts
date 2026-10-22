import { NextResponse } from "next/server";
import {
  buildSlackMessage,
  postSlackWebhook,
  type SlackNotifyPayload,
} from "@/lib/notify-slack";

export const runtime = "nodejs";

function isContact(payload: unknown): payload is Extract<SlackNotifyPayload, { type: "contact" }> {
  if (!payload || typeof payload !== "object") return false;
  const o = payload as Record<string, unknown>;
  return (
    o.type === "contact" &&
    typeof o.name === "string" &&
    typeof o.email === "string" &&
    typeof o.subject === "string" &&
    typeof o.message === "string"
  );
}

function isJob(payload: unknown): payload is Extract<SlackNotifyPayload, { type: "job" }> {
  if (!payload || typeof payload !== "object") return false;
  const o = payload as Record<string, unknown>;
  return (
    o.type === "job" &&
    typeof o.jobTitle === "string" &&
    typeof o.firstName === "string" &&
    typeof o.lastName === "string" &&
    typeof o.email === "string" &&
    typeof o.phone === "string"
  );
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!isContact(body) && !isJob(body)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  try {
    const result = await postSlackWebhook(buildSlackMessage(body));
    return NextResponse.json({ ok: true, skipped: result.skipped });
  } catch (err) {
    console.error("[notify/slack]", err);
    return NextResponse.json({ error: "Slack notify failed" }, { status: 500 });
  }
}
