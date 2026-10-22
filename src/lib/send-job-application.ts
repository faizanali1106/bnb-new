"use client";

import emailjs from "@emailjs/browser";

const HR_EMAIL = "hr@bitandbytes.net";

export type JobApplicationEmailPayload = {
  jobTitle: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  answers?: { question: string; answer: string }[];
};

export async function sendJobApplicationEmails(payload: JobApplicationEmailPayload) {
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
  const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;

  if (!publicKey || !serviceId || !templateId) {
    throw new Error("Email service is not configured.");
  }

  const fullName = `${payload.firstName} ${payload.lastName}`.trim();
  emailjs.init(publicKey);

  const title = `[Job Application] ${payload.jobTitle} — ${fullName}`;
  const screeningLines =
    payload.answers && payload.answers.length > 0
      ? [
          "",
          "Screening questions:",
          ...payload.answers.flatMap((item) => [`Q: ${item.question}`, `A: ${item.answer}`, ""]),
        ]
      : [];
  const hrResult = await emailjs.send(serviceId, templateId, {
    name: fullName,
    email: payload.email,
    title,
    subject: title,
    message: [
      `A new application was submitted for ${payload.jobTitle}.`,
      "",
      `Name: ${fullName}`,
      `Email: ${payload.email}`,
      `Phone: ${payload.phone}`,
      ...screeningLines,
      "Open /admin → Applications to review the full profile and CV.",
    ].join("\n"),
    to_email: HR_EMAIL,
    job_title: payload.jobTitle,
  });

  if (hrResult.status !== 200) {
    throw new Error("Failed to notify HR.");
  }
}
