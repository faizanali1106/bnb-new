const HR_EMAIL = "hr@bitandbytes.net";
const REJECTION_DELAY_MS = 7 * 24 * 60 * 60 * 1000;

export function rejectionEmailDueAt(from = new Date()) {
  return new Date(from.getTime() + REJECTION_DELAY_MS);
}

export function buildRejectionEmailBody(firstName: string, jobTitle: string) {
  const role = jobTitle.trim() || "the open position";
  return [
    `Thank you for your interest in the ${role} position at Bit & Bytes and for taking the time to participate in our hiring process.`,
    "",
    "After careful consideration, we have decided to move forward with other candidates whose experience and skills more closely align with our current requirements.",
    "",
    "We sincerely appreciate your time and effort throughout the process and wish you the very best in your career journey. We hope to have the opportunity to connect with you for a suitable position in the future.",
    "",
    "Best regards,",
    "Bit & Bytes HR",
  ].join("\n");
}

async function sendEmailjs(templateId: string, params: Record<string, string>) {
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
  if (!publicKey || !serviceId || !templateId) return false;

  const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      template_params: params,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error("[rejection-email] EmailJS failed", res.status, text);
    return false;
  }
  return true;
}

export async function sendRejectionEmail(payload: {
  firstName: string;
  lastName: string;
  email: string;
  jobTitle: string;
}) {
  const templateId =
    process.env.NEXT_PUBLIC_EMAILJS_REJECTION_TEMPLATE_ID ||
    process.env.NEXT_PUBLIC_EMAILJS_APPLICATION_REPLY_TEMPLATE_ID ||
    process.env.NEXT_PUBLIC_EMAILJS_APPLICATION_TEMPLATE_ID ||
    process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;

  if (!templateId) {
    console.error("[rejection-email] No EmailJS template configured");
    return false;
  }

  const fullName = `${payload.firstName} ${payload.lastName}`.trim();
  const role = payload.jobTitle.trim() || "the open position";

  return sendEmailjs(templateId, {
    name: "Bit & Bytes HR",
    email: HR_EMAIL,
    reply_to: HR_EMAIL,
    to_email: payload.email,
    to_name: fullName || payload.firstName,
    subject: `Update on your application for ${role} at Bit & Bytes`,
    message: buildRejectionEmailBody(payload.firstName, payload.jobTitle),
    job_title: role,
    first_name: payload.firstName,
  });
}
