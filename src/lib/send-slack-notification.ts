import type { SlackNotifyPayload } from "@/lib/notify-slack";

/** Fire-and-forget Slack notify. Never throws to the caller. */
export async function notifySlack(payload: SlackNotifyPayload) {
  try {
    await fetch("/api/notify/slack", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error("[notifySlack]", err);
  }
}
