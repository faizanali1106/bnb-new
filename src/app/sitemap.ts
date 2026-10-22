import type { MetadataRoute } from "next";
import { publishedJobs } from "@/data/jobs";
import { loadMergedSiteContent } from "@/lib/cms/load-from-supabase";
import { liveServices, serviceGroups, serviceHref } from "@/data/services";
import { offers } from "@/data/site";
import { industries } from "@/data/industries";
import { caseStudies } from "@/data/work";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bitandbytes.net";

/** Re-generate hourly so CMS job openings show up without a redeploy. */
export const revalidate = 3600;

type Entry = MetadataRoute.Sitemap[number];

const entry = (
  route: string,
  priority: number,
  changeFrequency: Entry["changeFrequency"] = "monthly"
): Entry => ({ url: `${siteUrl}${route}`, lastModified: new Date(), changeFrequency, priority });

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const content = await loadMergedSiteContent();

  const entries: Entry[] = [
    entry("", 1.0, "weekly"),
    entry("/services", 0.9),
    entry("/work", 0.9),
    entry("/industries", 0.8),
    entry("/company", 0.8),
    entry("/company/team", 0.6),
    entry("/trust", 0.7),
    entry("/resources", 0.7),
    entry("/contact", 0.8),
    entry("/careers", 0.7, "daily"),
    ...offers.map((o) => entry(`/offers/${o.slug}`, 0.9)),
    ...serviceGroups.map((g) => entry(`/services/${g.slug}`, 0.9)),
    ...serviceGroups.flatMap((g) =>
      liveServices(g).map((s) => entry(serviceHref(g, s), s.hero ? 0.9 : 0.7))
    ),
    ...industries.map((i) => entry(`/industries/${i.slug}`, 0.8)),
    ...caseStudies.map((c) => entry(`/work/${c.slug}`, 0.8)),
    ...publishedJobs(content.jobs).map((job) => entry(`/careers/${job.id}`, 0.7, "weekly")),
  ];

  // A service can be listed under more than one group — keep the first (highest-priority) URL.
  const seen = new Set<string>();
  return entries.filter((e) => (seen.has(e.url) ? false : (seen.add(e.url), true)));
}
