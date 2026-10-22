import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { verifyAdminSessionCookie, CMS_COOKIE_NAME } from "@/lib/cms/auth-cookie";
import type { JobSerialized, SiteContentSerialized } from "@/lib/cms/types";
import { persistSiteContent } from "@/lib/cms/persist-to-supabase";
import { getSupabaseService } from "@/lib/supabase/service";

function isStatCard(x: unknown): x is { value: string; label: string } {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return typeof o.value === "string" && typeof o.label === "string";
}

function validatePayload(body: unknown): SiteContentSerialized | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;
  if (!Array.isArray(b.projects)) return null;
  if (!Array.isArray(b.testimonials)) return null;
  if (!Array.isArray(b.workExperience)) return null;
  if (!Array.isArray(b.gridItems)) return null;
  if (!Array.isArray(b.companies)) return null;
  if (!Array.isArray(b.socialMedia)) return null;
  if (!b.settings || typeof b.settings !== "object") return null;
  const s = b.settings as Record<string, unknown>;
  if (!Array.isArray(s.homeStats) || !s.homeStats.every(isStatCard)) return null;
  if (!Array.isArray(s.portfolioStats) || !s.portfolioStats.every(isStatCard)) return null;
  if (!s.whatsapp || typeof s.whatsapp !== "object") return null;
  const w = s.whatsapp as Record<string, unknown>;
  if (
    typeof w.phone !== "string" ||
    typeof w.businessName !== "string" ||
    typeof w.defaultMessage !== "string"
  ) {
    return null;
  }
  if (typeof s.footerTagline !== "string") return null;

  for (const p of b.projects) {
    if (!p || typeof p !== "object") return null;
    const o = p as Record<string, unknown>;
    if (typeof o.title !== "string" || typeof o.des !== "string") return null;
    if (typeof o.img !== "string" || typeof o.link !== "string") return null;
    if (!Array.isArray(o.iconSlugs) || !o.iconSlugs.every((x) => typeof x === "string")) {
      return null;
    }
    if (o.hidden != null && typeof o.hidden !== "boolean") {
      return null;
    }
  }
  for (const t of b.testimonials) {
    if (!t || typeof t !== "object") return null;
    const o = t as Record<string, unknown>;
    if (typeof o.quote !== "string" || typeof o.name !== "string") return null;
    if (typeof o.title !== "string") return null;
  }
  for (const w of b.workExperience as unknown[]) {
    if (!w || typeof w !== "object") return null;
    const o = w as Record<string, unknown>;
    if (typeof o.title !== "string" || typeof o.desc !== "string") return null;
    if (typeof o.className !== "string" || typeof o.thumbnail !== "string") return null;
  }
  for (const g of b.gridItems as unknown[]) {
    if (!g || typeof g !== "object") return null;
    const o = g as Record<string, unknown>;
    if (typeof o.id !== "number" || typeof o.title !== "string") return null;
    if (typeof o.description !== "string" || typeof o.className !== "string") return null;
    if (
      typeof o.img !== "string" ||
      typeof o.imgClassName !== "string" ||
      typeof o.titleClassName !== "string" ||
      typeof o.spareImg !== "string"
    ) {
      return null;
    }
  }
  for (const c of b.companies as unknown[]) {
    if (!c || typeof c !== "object") return null;
    const o = c as Record<string, unknown>;
    if (typeof o.name !== "string" || typeof o.img !== "string" || typeof o.nameImg !== "string") {
      return null;
    }
  }
  for (const sm of b.socialMedia as unknown[]) {
    if (!sm || typeof sm !== "object") return null;
    const o = sm as Record<string, unknown>;
    if (typeof o.name !== "string" || typeof o.url !== "string") return null;
    if (o.img != null && typeof o.img !== "string") return null;
    if (o.display != null && typeof o.display !== "string") return null;
    if (o.useLucideMail != null && typeof o.useLucideMail !== "boolean") return null;
  }

  const teamMembers = Array.isArray(b.teamMembers) ? b.teamMembers : [];
  for (const member of teamMembers) {
    if (!member || typeof member !== "object") return null;
    const o = member as Record<string, unknown>;
    if (typeof o.name !== "string" || typeof o.role !== "string") return null;
    if (typeof o.department !== "string") return null;
    if (o.photo != null && typeof o.photo !== "string") return null;
    if (o.gender != null && o.gender !== "male" && o.gender !== "female") return null;
    if (o.hidden != null && typeof o.hidden !== "boolean") return null;
    if (o.id != null && (typeof o.id !== "number" || !Number.isFinite(o.id))) return null;
  }

  const jobs = Array.isArray(b.jobs) ? b.jobs : [];
  const employmentTypes = new Set(["Full-time", "Contract"]);
  const workModes = new Set(["Remote", "Onsite", "Hybrid"]);
  const isStringList = (value: unknown) =>
    Array.isArray(value) && value.every((item) => typeof item === "string");

  for (const job of jobs) {
    if (!job || typeof job !== "object") return null;
    const o = job as Record<string, unknown>;
    if (typeof o.title !== "string") return null;
    if (o.id != null && (typeof o.id !== "number" || !Number.isFinite(o.id))) return null;
    if (typeof o.department !== "string" || typeof o.location !== "string") return null;
    if (typeof o.summary !== "string" || typeof o.about !== "string") return null;
    if (typeof o.postedAt !== "string") return null;
    if (!employmentTypes.has(String(o.employmentType))) return null;
    if (!workModes.has(String(o.workMode))) return null;
    if (!isStringList(o.responsibilities) || !isStringList(o.requirements) || !isStringList(o.benefits)) {
      return null;
    }
    if (o.hidden != null && typeof o.hidden !== "boolean") return null;
    if (o.questions != null) {
      if (!Array.isArray(o.questions)) return null;
      for (const question of o.questions) {
        if (!question || typeof question !== "object") return null;
        const q = question as Record<string, unknown>;
        if (typeof q.prompt !== "string") return null;
        if (q.id != null && typeof q.id !== "string") return null;
      }
    }
  }

  return {
    ...(body as SiteContentSerialized),
    teamMembers: teamMembers.map((member) => {
      const o = member as Record<string, unknown>;
      return {
        id: typeof o.id === "number" ? o.id : undefined,
        name: String(o.name ?? "").trim(),
        role: String(o.role ?? "").trim(),
        department: String(o.department ?? "Engineering").trim() || "Engineering",
        photo: typeof o.photo === "string" ? o.photo : "",
        gender: o.gender === "female" ? ("female" as const) : ("male" as const),
        hidden: Boolean(o.hidden),
      };
    }),
    jobs: jobs.map((job) => {
      const o = job as JobSerialized;
      const questions = Array.isArray(o.questions)
        ? o.questions
            .map((question) => ({
              id: String(question.id || question.prompt).trim(),
              prompt: String(question.prompt ?? "").trim(),
            }))
            .filter((question) => question.prompt)
        : [];
      return { ...o, questions };
    }),
  };
}

export async function PUT(req: Request) {
  const cookie = (await cookies()).get(CMS_COOKIE_NAME)?.value;
  if (!verifyAdminSessionCookie(cookie)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!getSupabaseService()) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = validatePayload(json);
  if (!parsed) {
    return NextResponse.json(
      { error: "Invalid payload shape. Compare with GET /api/site-content." },
      { status: 400 }
    );
  }

  try {
    await persistSiteContent(parsed);
    // CMS data is used across many public routes — revalidate the whole tree.
    revalidatePath("/", "layout");
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[api/admin/content]", e);
    const msg =
      e instanceof Error && e.message
        ? e.message
        : e && typeof e === "object" && "message" in e && typeof (e as { message: unknown }).message === "string"
          ? (e as { message: string }).message
          : "Save failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
