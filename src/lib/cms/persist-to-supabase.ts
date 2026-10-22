import { getSupabaseService } from "@/lib/supabase/service";
import type { SiteContentSerialized } from "./types";

/** PostgREST errors are plain objects; throw Error so API routes can return a useful message. */
function throwIfSupabaseErr(
  err: { message?: string; details?: string; hint?: string; code?: string } | null | undefined
): void {
  if (!err) return;
  const parts = [err.message, err.details, err.hint, err.code && `code ${err.code}`].filter(
    (x): x is string => Boolean(x)
  );
  throw new Error(parts.length ? parts.join(" — ") : "Supabase error");
}

export async function persistSiteContent(content: SiteContentSerialized) {
  const supabase = getSupabaseService();
  if (!supabase) throw new Error("Supabase not configured");

  const { error: jobsProbeErr } = await supabase.from("jobs").select("id").limit(1);
  const jobsTableMissing = Boolean(
    jobsProbeErr &&
      /schema cache|does not exist|could not find the table/i.test(jobsProbeErr.message ?? "")
  );
  if (jobsTableMissing && (content.jobs ?? []).length) {
    throw new Error(
      "Jobs table is missing. Run supabase/migrations/004_jobs.sql in the Supabase SQL editor, then save again."
    );
  }

  const { error: teamProbeErr } = await supabase.from("team_members").select("id").limit(1);
  const teamTableMissing = Boolean(
    teamProbeErr &&
      /schema cache|does not exist|could not find the table/i.test(teamProbeErr.message ?? "")
  );
  if (teamTableMissing && (content.teamMembers ?? []).length) {
    throw new Error(
      "Team members table is missing. Run supabase/migrations/009_team_members.sql in the Supabase SQL editor, then save again."
    );
  }

  const runClear = async (table: string) => {
    const { error } = await supabase.from(table).delete().neq("id", 0);
    throwIfSupabaseErr(error);
  };

  await Promise.all([
    runClear("projects"),
    runClear("testimonials"),
    runClear("work_experience"),
    runClear("grid_items"),
    runClear("companies"),
    runClear("social_media"),
    ...(teamTableMissing ? [] : [runClear("team_members")]),
  ]);

  // Keep existing job rows so applications.job_id is not cleared by ON DELETE SET NULL.

  const { error: delSet } = await supabase
    .from("site_settings")
    .delete()
    .in("key", [
      "home_stats",
      "portfolio_stats",
      "whatsapp",
      "footer_tagline",
    ]);
  throwIfSupabaseErr(delSet);

  const projectRowsBase = content.projects.map((p, i) => ({
    sort_order: i,
    title: p.title,
    des: p.des,
    img: p.img,
    link: p.link || "/portfolio",
    icon_slugs: p.iconSlugs ?? [],
  }));

  /* Never send `hidden` on insert: PostgREST (PGRST204) rejects unknown columns before Postgres.
   * After rows exist, best-effort UPDATE for hidden=true when migration 003 is applied. */
  const { data: insertedProjects, error: p1 } = await supabase
    .from("projects")
    .insert(projectRowsBase)
    .select("id");
  throwIfSupabaseErr(p1);

  const ids = (insertedProjects ?? []).map((r) => Number((r as { id: number }).id));
  for (let i = 0; i < content.projects.length; i++) {
    if (!content.projects[i]?.hidden) continue;
    const id = ids[i];
    if (id == null || !Number.isFinite(id)) continue;
    const { error: hiddenErr } = await supabase.from("projects").update({ hidden: true }).eq("id", id);
    if (hiddenErr && !String(hiddenErr.message ?? "").toLowerCase().includes("hidden")) {
      throwIfSupabaseErr(hiddenErr);
    }
  }

  const { error: p2 } = await supabase.from("testimonials").insert(
    content.testimonials.map((t, i) => ({
      sort_order: i,
      quote: t.quote,
      name: t.name,
      title: t.title ?? "",
    }))
  );
  throwIfSupabaseErr(p2);

  const { error: p3 } = await supabase.from("work_experience").insert(
    content.workExperience.map((w, i) => ({
      sort_order: i,
      title: w.title,
      description: w.desc,
      class_name: w.className || "md:col-span-2",
      thumbnail: w.thumbnail,
    }))
  );
  throwIfSupabaseErr(p3);

  const { error: p4 } = await supabase.from("grid_items").insert(
    content.gridItems.map((g, i) => ({
      id: g.id,
      sort_order: i,
      title: g.title,
      description: g.description ?? "",
      class_name: g.className,
      img: g.img ?? "",
      img_class_name: g.imgClassName ?? "",
      title_class_name: g.titleClassName ?? "",
      spare_img: g.spareImg ?? "",
    }))
  );
  throwIfSupabaseErr(p4);

  const { error: p5 } = await supabase.from("companies").insert(
    content.companies.map((c, i) => ({
      sort_order: i,
      name: c.name,
      img: c.img,
      name_img: c.nameImg,
    }))
  );
  throwIfSupabaseErr(p5);

  const { error: p6 } = await supabase.from("social_media").insert(
    content.socialMedia.map((s, i) => ({
      sort_order: i,
      name: s.name,
      img: s.img ?? "",
      url: s.url,
      display: s.display ?? null,
      use_lucide_mail: Boolean(s.useLucideMail),
    }))
  );
  throwIfSupabaseErr(p6);

  if (!teamTableMissing) {
    const { error: pTeam } = await supabase.from("team_members").insert(
      (content.teamMembers ?? []).map((m, i) => ({
        sort_order: i,
        name: m.name,
        role: m.role ?? "",
        department: m.department || "Engineering",
        photo: m.photo ?? "",
        gender: m.gender === "female" ? "female" : "male",
        hidden: Boolean(m.hidden),
      }))
    );
    throwIfSupabaseErr(pTeam);
  }

  const { error: p7 } = await supabase.from("site_settings").insert([
    { key: "home_stats", value: content.settings.homeStats },
    { key: "portfolio_stats", value: content.settings.portfolioStats },
    { key: "whatsapp", value: content.settings.whatsapp },
    { key: "footer_tagline", value: content.settings.footerTagline },
  ]);
  throwIfSupabaseErr(p7);

  const jobRows = (content.jobs ?? []).map((j, i) => {
    const row: Record<string, unknown> = {
      sort_order: i,
      title: j.title,
      department: j.department,
      employment_type: j.employmentType,
      work_mode: j.workMode,
      location: j.location,
      summary: j.summary,
      about: j.about,
      responsibilities: j.responsibilities ?? [],
      requirements: j.requirements ?? [],
      benefits: j.benefits ?? [],
      posted_at: j.postedAt || new Date().toISOString().slice(0, 10),
      questions: (j.questions ?? []).filter((q) => q.prompt?.trim()),
      hidden: Boolean(j.hidden),
    };
    if (typeof j.id === "number" && Number.isFinite(j.id) && j.id > 0) {
      row.id = j.id;
    }
    return row;
  });

  if (jobsTableMissing && jobRows.length) {
    throw new Error(
      "Jobs table is missing. Run supabase/migrations/004_jobs.sql in the Supabase SQL editor, then save again."
    );
  }

  if (!jobsTableMissing) {
    const writeJobs = async (
      rows: Record<string, unknown>[],
      mode: "insert" | "upsert"
    ) => {
      const run = (payload: Record<string, unknown>[]) =>
        mode === "upsert"
          ? supabase.from("jobs").upsert(payload, { onConflict: "id" })
          : supabase.from("jobs").insert(payload);

      let { error } = await run(rows);
      if (error && /questions/i.test(error.message ?? "")) {
        const withoutQuestions = rows.map((row) => {
          const { questions: _questions, ...rest } = row;
          return rest;
        });
        const retry = await run(withoutQuestions);
        error = retry.error;
      }
      if (error && /slug/i.test(error.message ?? "")) {
        const withSlug = rows.map((row, i) => ({
          ...row,
          slug: typeof row.id === "number" ? `job-${row.id}` : `job-new-${i}`,
        }));
        const retry = await run(withSlug);
        error = retry.error;
      }
      throwIfSupabaseErr(error);
    };

    const keepIds = jobRows
      .map((row) => Number(row.id))
      .filter((id) => Number.isFinite(id) && id > 0);

    const { data: existingJobs, error: existingErr } = await supabase.from("jobs").select("id");
    throwIfSupabaseErr(existingErr);
    const staleIds = (existingJobs ?? [])
      .map((row) => Number((row as { id?: number }).id))
      .filter((id) => Number.isFinite(id) && !keepIds.includes(id));
    if (staleIds.length) {
      const { error: deleteStaleErr } = await supabase.from("jobs").delete().in("id", staleIds);
      throwIfSupabaseErr(deleteStaleErr);
    }

    const rowsWithId = jobRows.filter((row) => typeof row.id === "number");
    const rowsWithoutId = jobRows.filter((row) => typeof row.id !== "number");
    if (rowsWithId.length) await writeJobs(rowsWithId, "upsert");
    if (rowsWithoutId.length) await writeJobs(rowsWithoutId, "insert");

    const { data: savedJobs } = await supabase.from("jobs").select("id, title");
    for (const job of savedJobs ?? []) {
      const title = String((job as { title?: string }).title ?? "").trim();
      const id = Number((job as { id?: number }).id);
      if (!title || !Number.isFinite(id)) continue;
      await supabase.from("job_applications").update({ job_id: id }).eq("job_title", title);
    }
  }
}
