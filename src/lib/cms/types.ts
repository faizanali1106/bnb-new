import type { ReactNode } from "react";

export type StatCard = { value: string; label: string };

export type SiteSettings = {
  homeStats: StatCard[];
  portfolioStats: StatCard[];
  whatsapp: { phone: string; businessName: string; defaultMessage: string };
  footerTagline: string;
};

export type ProjectSerialized = {
  id?: number;
  title: string;
  des: string;
  img: string;
  link: string;
  iconSlugs: string[];
  /** When true, hidden from public API & site; still editable in /admin. */
  hidden?: boolean;
};

export type TestimonialSerialized = {
  id?: number;
  quote: string;
  name: string;
  title: string;
};

export type WorkExperienceSerialized = {
  id?: number;
  title: string;
  desc: string;
  className: string;
  thumbnail: string;
};

export type GridItemSerialized = {
  id: number;
  title: string;
  description: string;
  className: string;
  img: string;
  imgClassName: string;
  titleClassName: string;
  spareImg: string;
};

export type CompanySerialized = {
  id?: number;
  name: string;
  img: string;
  nameImg: string;
};

export type TeamDepartment =
  | "Leadership"
  | "HR"
  | "Engineering"
  | "Design"
  | "Business Development";

export type TeamMemberSerialized = {
  id?: number;
  name: string;
  role: string;
  department: TeamDepartment | string;
  photo: string;
  /** Used for avatar fallback when photo is empty */
  gender?: "male" | "female";
  /** When true, hidden from the public About team section */
  hidden?: boolean;
};

export type SocialMediaSerialized = {
  id?: number;
  name: string;
  img: string;
  url: string;
  display?: string;
  useLucideMail?: boolean;
};

export type EmploymentType = "Full-time" | "Contract";
export type WorkMode = "Remote" | "Onsite" | "Hybrid";

export type ApplicationStatus = "new" | "reviewed" | "rejected";

export type JobQuestion = {
  id: string;
  prompt: string;
};

export type JobQuestionAnswer = {
  questionId: string;
  question: string;
  answer: string;
};

export type JobApplicationSerialized = {
  id: number;
  jobId: number | null;
  jobTitle: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  linkedin: string;
  website: string;
  coverLetter: string;
  education: { school: string; degree: string; year: string }[];
  experience: { company: string; role: string; duration: string; description: string }[];
  resumeName: string;
  resumeUrl: string;
  resumePath: string;
  answers: JobQuestionAnswer[];
  featured: boolean;
  status: ApplicationStatus;
  rejectedAt: string | null;
  rejectionEmailAt: string | null;
  rejectionEmailSentAt: string | null;
  createdAt: string;
};

export type JobSerialized = {
  id?: number;
  title: string;
  department: string;
  employmentType: EmploymentType;
  workMode: WorkMode;
  location: string;
  summary: string;
  about: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  postedAt: string;
  questions: JobQuestion[];
  /** When true, hidden from the public careers page; still editable in /admin. */
  hidden?: boolean;
};

export type SiteContentSerialized = {
  projects: ProjectSerialized[];
  testimonials: TestimonialSerialized[];
  workExperience: WorkExperienceSerialized[];
  gridItems: GridItemSerialized[];
  companies: CompanySerialized[];
  socialMedia: SocialMediaSerialized[];
  jobs: JobSerialized[];
  teamMembers: TeamMemberSerialized[];
  settings: SiteSettings;
};

export type ProjectRuntime = ProjectSerialized & {
  iconLists: ReactNode[];
};

export type SocialMediaRuntime = Omit<
  SocialMediaSerialized,
  "useLucideMail"
> & {
  icon?: ReactNode;
  display?: string;
};
