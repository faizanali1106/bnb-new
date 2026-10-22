import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseCards, ProductsGrid, SubServiceCards } from "@/components/blocks/cards";
import { ClosingCta } from "@/components/blocks/ClosingCta";
import { FaqSection } from "@/components/blocks/FaqSection";
import { PageHeader } from "@/components/blocks/PageHeader";
import { ProcessSteps } from "@/components/blocks/ProcessSteps";
import { Section, SectionHeading } from "@/components/blocks/Section";
import { ServiceDetail } from "@/components/blocks/ServiceDetail";
import { allServices, findServiceBySlug, getGroup, liveServices, serviceGroups } from "@/data/services";
import { primaryCta } from "@/data/site";
import { caseStudies } from "@/data/work";
import { jsonLd, serviceSchema } from "@/lib/seo/schema";
import { loadNamedTestimonials } from "@/lib/testimonials";

export const revalidate = 60;

export function generateStaticParams() {
  return [...serviceGroups.map((g) => ({ slug: g.slug })), ...allServices().map(({ service }) => ({ slug: service.slug }))];
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const group = getGroup(slug);
  if (group) return { title: group.title, description: group.summary, alternates: { canonical: `/services/${group.slug}` } };
  const found = findServiceBySlug(slug);
  if (found) {
    return { title: found.service.title, description: found.service.summary, alternates: { canonical: `/services/${found.service.slug}` } };
  }
  return { title: "Services" };
}

export default async function ServiceSlugPage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  if (getGroup(slug)) return <GroupPage slug={slug} />;

  const found = findServiceBySlug(slug);
  if (!found) notFound();
  if (!found.service.hero) return <ServiceDetail group={found.group} service={found.service} variant="sub" />;
  const testimonials = (await loadNamedTestimonials()).slice(0, 4);
  return <ServiceDetail group={found.group} service={found.service} variant="hero" testimonials={testimonials} />;
}

function GroupPage({ slug }: { slug: string }) {
  const group = getGroup(slug)!;
  const cases = caseStudies.filter((c) => c.groups.includes(group.slug)).slice(0, 2);
  const faqs = liveServices(group)
    .flatMap((s) => s.faqs.slice(0, 1))
    .slice(0, 5);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          serviceSchema({ name: group.title, description: group.summary, path: `/services/${group.slug}`, serviceType: group.title }),
        )}
      />
      <PageHeader
        crumbs={[{ name: "Home", href: "/" }, { name: "Services", href: "/services" }, { name: group.title }]}
        eyebrow={group.title}
        title={group.h1}
        sub={group.summary}
        primary={primaryCta}
        secondary={{ label: "See our work", href: "/work" }}
      />

      <Section id="services" className="section--flush-top">
        <SectionHeading eyebrow="Services in this group" title={`What we do in *${group.title}*`} sub={group.outcome} />
        <SubServiceCards group={group} />
      </Section>

      <Section id="proof" tone="panel" pixels>
        <SectionHeading eyebrow="Proof" title="Shipped work and *accelerators*" action={{ label: "All work", href: "/work" }} />
        {cases.length ? (
          <div style={{ marginBottom: "1rem" }}>
            <CaseCards cases={cases} cols={2} />
          </div>
        ) : null}
        <ProductsGrid />
      </Section>

      <Section id="delivery" tone="dark">
        <SectionHeading eyebrow="How we deliver" title="Phases, timelines and what you *receive*" />
        <ProcessSteps phases={group.phases} />
      </Section>

      <FaqSection items={faqs} />
      <ClosingCta source={group.title} />
    </>
  );
}
