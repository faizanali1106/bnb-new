import { DEFAULT_SITE_CONTENT } from "./defaults";
import { getSupabaseService } from "@/lib/supabase/service";
import type {
  CompanySerialized,
  GridItemSerialized,
  JobQuestion,
  JobSerialized,
  ProjectSerialized,
  SiteContentSerialized,
  SiteSettings,
  SocialMediaSerialized,
  TeamMemberSerialized,
  TestimonialSerialized,
  WorkExperienceSerialized,
} from "./types";

function mapProject(r: Record<string, unknown>): ProjectSerialized {
  return {
    id: Number(r.id),
    title: String(r.title),
    des: String(r.des),
    img: String(r.img),
    link: String(r.link ?? "/portfolio"),
    iconSlugs: Array.isArray(r.icon_slugs)
      ? (r.icon_slugs as string[]).filter(Boolean)
      : [],
    hidden: Boolean(r.hidden),
  };
}

function mapTestimonial(r: Record<string, unknown>): TestimonialSerialized {
  return {
    id: Number(r.id),
    quote: String(r.quote),
    name: String(r.name),
    title: String(r.title ?? ""),
  };
}

function mapWork(r: Record<string, unknown>): WorkExperienceSerialized {
  return {
    id: Number(r.id),
    title: String(r.title),
    desc: String(r.description),
    className: String(r.class_name ?? "md:col-span-2"),
    thumbnail: String(r.thumbnail),
  };
}

function mapGrid(r: Record<string, unknown>): GridItemSerialized {
  return {
    id: Number(r.id),
    title: String(r.title),
    description: String(r.description ?? ""),
    className: String(r.class_name),
    img: String(r.img ?? ""),
    imgClassName: String(r.img_class_name ?? ""),
    titleClassName: String(r.title_class_name ?? ""),
    spareImg: String(r.spare_img ?? ""),
  };
}

function mapCompany(r: Record<string, unknown>): CompanySerialized {
  return {
    id: Number(r.id),
    name: String(r.name),
    img: String(r.img),
    nameImg: String(r.name_img),
  };
}

function mapTeamMember(r: Record<string, unknown>): TeamMemberSerialized {
  return {
    id: Number(r.id),
    name: String(r.name ?? ""),
    role: String(r.role ?? ""),
    department: String(r.department ?? "Engineering"),
    photo: String(r.photo ?? ""),
    gender: r.gender === "female" ? "female" : "male",
    hidden: Boolean(r.hidden),
  };
}

function mapSocial(r: Record<string, unknown>): SocialMediaSerialized {
  return {
    id: Number(r.id),
    name: String(r.name),
    img: String(r.img ?? ""),
    url: String(r.url),
    display: r.display != null ? String(r.display) : undefined,
    useLucideMail: Boolean(r.use_lucide_mail),
  };
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}

function asJobQuestions(value: unknown): JobQuestion[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const o = item as Record<string, unknown>;
      const prompt = String(o.prompt ?? "").trim();
      if (!prompt) return null;
      return {
        id: String(o.id ?? prompt),
        prompt,
      };
    })
    .filter((item): item is JobQuestion => item != null);
}

function mapJob(r: Record<string, unknown>): JobSerialized {
  const employmentType = r.employment_type === "Contract" ? "Contract" : "Full-time";
  const workMode =
    r.work_mode === "Remote" || r.work_mode === "Onsite" || r.work_mode === "Hybrid"
      ? r.work_mode
      : "Hybrid";
  return {
    id: Number(r.id),
    title: String(r.title),
    department: String(r.department ?? ""),
    employmentType,
    workMode,
    location: String(r.location ?? ""),
    summary: String(r.summary ?? ""),
    about: String(r.about ?? ""),
    responsibilities: asStringArray(r.responsibilities),
    requirements: asStringArray(r.requirements),
    benefits: asStringArray(r.benefits),
    postedAt: String(r.posted_at ?? "").slice(0, 10),
    questions: asJobQuestions(r.questions),
    hidden: Boolean(r.hidden),
  };
}

function parseSettingsRows(
  rows: { key: string; value: unknown }[] | null
): SiteSettings {
  const m = Object.fromEntries((rows ?? []).map((r) => [r.key, r.value]));
  const d = DEFAULT_SITE_CONTENT.settings;
  return {
    homeStats: (m.home_stats as SiteSettings["homeStats"]) ?? d.homeStats,
    portfolioStats:
      (m.portfolio_stats as SiteSettings["portfolioStats"]) ?? d.portfolioStats,
    whatsapp: (m.whatsapp as SiteSettings["whatsapp"]) ?? d.whatsapp,
    footerTagline:
      (m.footer_tagline as string) ?? d.footerTagline,
  };
}

export async function loadMergedSiteContent(): Promise<SiteContentSerialized> {
  const supabase = getSupabaseService();
  if (!supabase) return DEFAULT_SITE_CONTENT;

  const [
    { data: projRows, error: e1 },
    { data: testRows, error: e2 },
    { data: workRows, error: e3 },
    { data: gridRows, error: e4 },
    { data: compRows, error: e5 },
    { data: socRows, error: e6 },
    { data: setRows, error: e7 },
    { data: jobRows, error: e8 },
    { data: teamRows, error: e9 },
  ] = await Promise.all([
    supabase.from("projects").select("*").order("sort_order"),
    supabase.from("testimonials").select("*").order("sort_order"),
    supabase.from("work_experience").select("*").order("sort_order"),
    supabase.from("grid_items").select("*").order("sort_order"),
    supabase.from("companies").select("*").order("sort_order"),
    supabase.from("social_media").select("*").order("sort_order"),
    supabase.from("site_settings").select("key,value"),
    supabase.from("jobs").select("*").order("sort_order"),
    supabase.from("team_members").select("*").order("sort_order"),
  ]);

  if (e1 || e2 || e3 || e4 || e5 || e6 || e7) {
    console.error("[cms] supabase read error", {
      e1,
      e2,
      e3,
      e4,
      e5,
      e6,
      e7,
    });
    return DEFAULT_SITE_CONTENT;
  }

  const settings = parseSettingsRows(setRows ?? []);
  const jobsMissing =
    Boolean(e8) &&
    /schema cache|does not exist|could not find the table/i.test(String(e8?.message ?? ""));
  if (e8 && !jobsMissing) {
    console.error("[cms] jobs read error", e8);
  }
  const teamMissing =
    Boolean(e9) &&
    /schema cache|does not exist|could not find the table/i.test(String(e9?.message ?? ""));
  if (e9 && !teamMissing) {
    console.error("[cms] team_members read error", e9);
  }

  return {
    projects:
      projRows?.length ? projRows.map((r) => mapProject(r as Record<string, unknown>)) : DEFAULT_SITE_CONTENT.projects,
    testimonials:
      testRows?.length
        ? testRows.map((r) => mapTestimonial(r as Record<string, unknown>))
        : DEFAULT_SITE_CONTENT.testimonials,
    workExperience:
      workRows?.length
        ? workRows.map((r) => mapWork(r as Record<string, unknown>))
        : DEFAULT_SITE_CONTENT.workExperience,
    gridItems:
      gridRows?.length
        ? gridRows.map((r) => mapGrid(r as Record<string, unknown>))
        : DEFAULT_SITE_CONTENT.gridItems,
    companies:
      compRows?.length
        ? compRows.map((r) => mapCompany(r as Record<string, unknown>))
        : DEFAULT_SITE_CONTENT.companies,
    socialMedia:
      socRows?.length
        ? socRows.map((r) => mapSocial(r as Record<string, unknown>))
        : DEFAULT_SITE_CONTENT.socialMedia,
    jobs:
      !e8 && jobRows?.length
        ? jobRows.map((r) => mapJob(r as Record<string, unknown>))
        : DEFAULT_SITE_CONTENT.jobs,
    teamMembers:
      !e9 && teamRows?.length
        ? teamRows.map((r) => mapTeamMember(r as Record<string, unknown>))
        : DEFAULT_SITE_CONTENT.teamMembers,
    settings,
  };
}
