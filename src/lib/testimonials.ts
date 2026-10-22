import { loadMergedSiteContent } from "@/lib/cms/load-from-supabase";

export type Testimonial = { quote: string; name: string; title: string };

/** Testimonials with a real company attribution (skips anonymous or self-titled ones). */
export async function loadNamedTestimonials(): Promise<Testimonial[]> {
  const content = await loadMergedSiteContent();
  return content.testimonials
    .filter((t) => t.quote?.trim() && t.title?.trim() && t.name.trim() !== t.title.trim())
    .map((t) => ({ quote: t.quote, name: t.name, title: t.title }));
}

export async function loadTestimonialFrom(company?: string): Promise<Testimonial | null> {
  if (!company) return null;
  const content = await loadMergedSiteContent();
  const t = content.testimonials.find((x) => x.title?.trim() === company && x.quote?.trim());
  return t ? { quote: t.quote, name: t.name, title: t.title } : null;
}
