export type SlackContactNotify = {
  type: "contact";
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type SlackJobNotify = {
  type: "job";
  jobTitle: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  answers?: { question: string; answer: string }[];
};

export type SlackNotifyPayload = SlackContactNotify | SlackJobNotify;

function truncate(value: string, max = 500) {
  const text = value.trim();
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1)}…`;
}

export function buildSlackMessage(payload: SlackNotifyPayload) {
  if (payload.type === "contact") {
    return [
      "*New contact message*",
      `*Name:* ${payload.name}`,
      `*Email:* ${payload.email}`,
      `*Subject:* ${payload.subject}`,
      `*Message:*\n${truncate(payload.message)}`,
    ].join("\n");
  }

  const fullName = `${payload.firstName} ${payload.lastName}`.trim();
  const lines = [
    "*New job application*",
    `*Role:* ${payload.jobTitle}`,
    `*Name:* ${fullName}`,
    `*Email:* ${payload.email}`,
    `*Phone:* ${payload.phone}`,
  ];

  if (payload.answers?.length) {
    lines.push("", "*Screening answers:*");
    for (const item of payload.answers) {
      lines.push(`• *${item.question}*\n  ${truncate(item.answer, 300)}`);
    }
  }

  lines.push("", "Open `/admin` → Applications to review the CV.");
  return lines.join("\n");
}

export async function postSlackWebhook(text: string) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL?.trim();
  if (!webhookUrl) return { skipped: true as const };

  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(body || `Slack webhook failed (${res.status})`);
  }

  return { skipped: false as const };
}
