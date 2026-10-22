const HR_EMAIL = "hr@bitandbytes.net";

type NotifyPayload = {
  jobTitle: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

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

  return res.ok;
}

export async function notifyApplicationEmails(payload: NotifyPayload) {
  const hrTemplateId =
    process.env.NEXT_PUBLIC_EMAILJS_APPLICATION_TEMPLATE_ID ||
    process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
  if (!hrTemplateId) return;

  const fullName = `${payload.firstName} ${payload.lastName}`.trim();

  try {
    await sendEmailjs(hrTemplateId, {
      name: fullName,
      email: payload.email,
      reply_to: payload.email,
      to_email: HR_EMAIL,
      subject: `New application: ${payload.jobTitle} — ${fullName}`,
      message: [
        `A new application was submitted for ${payload.jobTitle}.`,
        "",
        `Name: ${fullName}`,
        `Email: ${payload.email}`,
        `Phone: ${payload.phone}`,
        "",
        "Open /admin → Applications to review the full profile and CV.",
      ].join("\n"),
      job_title: payload.jobTitle,
    });
  } catch (err) {
    console.error("[notify-application] HR email failed", err);
  }

  const replyTemplateId =
    process.env.NEXT_PUBLIC_EMAILJS_APPLICATION_REPLY_TEMPLATE_ID || hrTemplateId;

  try {
    await sendEmailjs(replyTemplateId, {
      name: "Bit & Bytes HR",
      email: HR_EMAIL,
      reply_to: HR_EMAIL,
      to_email: payload.email,
      subject: `We received your application for ${payload.jobTitle}`,
      message: [
        `Hi ${payload.firstName},`,
        "",
        `Thanks for applying for ${payload.jobTitle} at Bit & Bytes.`,
        "",
        "We have received your application and our HR team will review it. If there is a fit, we will follow up by email.",
        "",
        "Best,",
        "Bit & Bytes HR",
      ].join("\n"),
      job_title: payload.jobTitle,
    });
  } catch (err) {
    console.error("[notify-application] applicant email failed", err);
  }
}
