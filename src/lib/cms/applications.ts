import type { ApplicationStatus, JobApplicationSerialized } from "./types";

function asRecordList(value: unknown): Record<string, unknown>[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is Record<string, unknown> => !!item && typeof item === "object");
}

export function mapApplication(row: Record<string, unknown>): JobApplicationSerialized {
  const education = asRecordList(row.education).map((item) => ({
    school: String(item.school ?? ""),
    degree: String(item.degree ?? ""),
    year: String(item.year ?? ""),
  }));
  const experience = asRecordList(row.experience).map((item) => ({
    company: String(item.company ?? ""),
    role: String(item.role ?? ""),
    duration: String(item.duration ?? ""),
    description: String(item.description ?? ""),
  }));
  const answers = asRecordList(row.answers).map((item) => ({
    questionId: String(item.questionId ?? item.question_id ?? ""),
    question: String(item.question ?? item.prompt ?? ""),
    answer: String(item.answer ?? ""),
  }));
  const status: ApplicationStatus =
    row.status === "reviewed"
      ? "reviewed"
      : row.status === "rejected"
        ? "rejected"
        : "new";

  return {
    id: Number(row.id),
    jobId: row.job_id == null || row.job_id === "" ? null : Number(row.job_id),
    jobTitle: String(row.job_title ?? ""),
    firstName: String(row.first_name ?? ""),
    lastName: String(row.last_name ?? ""),
    email: String(row.email ?? ""),
    phone: String(row.phone ?? ""),
    address: String(row.address ?? ""),
    linkedin: String(row.linkedin ?? ""),
    website: String(row.website ?? ""),
    coverLetter: String(row.cover_letter ?? ""),
    education,
    experience,
    resumeName: String(row.resume_name ?? ""),
    resumeUrl: String(row.resume_url ?? ""),
    resumePath: String(row.resume_path ?? ""),
    answers,
    featured: Boolean(row.featured),
    status,
    rejectedAt: row.rejected_at ? String(row.rejected_at) : null,
    rejectionEmailAt: row.rejection_email_at ? String(row.rejection_email_at) : null,
    rejectionEmailSentAt: row.rejection_email_sent_at ? String(row.rejection_email_sent_at) : null,
    createdAt: String(row.created_at ?? ""),
  };
}
