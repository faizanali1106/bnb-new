import type { JobQuestion, JobSerialized } from "@/lib/cms/types";

export type { EmploymentType, WorkMode } from "@/lib/cms/types";

export interface Job {
  id: string;
  title: string;
  department: string;
  employmentType: import("@/lib/cms/types").EmploymentType;
  workMode: import("@/lib/cms/types").WorkMode;
  location: string;
  summary: string;
  about: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  postedAt: string;
  questions: JobQuestion[];
}

export const JOBS_PAGE_SIZE = 6;

export function toPublicJob(job: JobSerialized): Job | null {
  if (job.id == null || !Number.isFinite(job.id)) return null;
  return {
    id: String(job.id),
    title: job.title,
    department: job.department,
    employmentType: job.employmentType,
    workMode: job.workMode,
    location: job.location,
    summary: job.summary,
    about: job.about,
    responsibilities: job.responsibilities ?? [],
    requirements: job.requirements ?? [],
    benefits: job.benefits ?? [],
    postedAt: job.postedAt,
    questions: job.questions ?? [],
  };
}

export function publishedJobs(list: JobSerialized[] | undefined): Job[] {
  return (list ?? [])
    .filter((job) => !job.hidden)
    .map(toPublicJob)
    .filter((job): job is Job => job != null);
}

export function getPublishedJobById(
  list: JobSerialized[] | undefined,
  id: string
): Job | undefined {
  const numericId = Number(id);
  if (!Number.isFinite(numericId)) return undefined;
  const row = (list ?? []).find((job) => job.id === numericId && !job.hidden);
  return row ? toPublicJob(row) ?? undefined : undefined;
}

export function filterJobs(list: Job[], query: string): Job[] {
  const q = query.trim().toLowerCase();
  if (!q) return list;

  return list.filter((job) => {
    const haystack = [
      job.title,
      job.department,
      job.location,
      job.employmentType,
      job.workMode,
      job.summary,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(q);
  });
}

export function formatPostedAgo(value: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  const posted = match
    ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
    : new Date(value);
  if (Number.isNaN(posted.getTime())) return "";

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const startOfPosted = new Date(posted);
  startOfPosted.setHours(0, 0, 0, 0);

  const dayDiff = Math.round(
    (startOfToday.getTime() - startOfPosted.getTime()) / 86_400_000
  );

  if (dayDiff <= 0) return "Posted today";
  if (dayDiff === 1) return "Posted 1 day ago";
  if (dayDiff < 7) return `Posted ${dayDiff} days ago`;

  const weeks = Math.floor(dayDiff / 7);
  if (dayDiff < 30) {
    return weeks === 1 ? "Posted 1 week ago" : `Posted ${weeks} weeks ago`;
  }

  const months = Math.floor(dayDiff / 30);
  if (dayDiff < 365) {
    return months === 1 ? "Posted 1 month ago" : `Posted ${months} months ago`;
  }

  const years = Math.floor(dayDiff / 365);
  return years === 1 ? "Posted 1 year ago" : `Posted ${years} years ago`;
}
