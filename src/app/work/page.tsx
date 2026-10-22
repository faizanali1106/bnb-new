import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { ProductsGrid } from "@/components/blocks/cards";
import { ClosingCta } from "@/components/blocks/ClosingCta";
import { PageHeader } from "@/components/blocks/PageHeader";
import { Section, SectionHeading } from "@/components/blocks/Section";
import { WorkFilter } from "@/components/blocks/WorkFilter";
import Reveal from "@/components/ui/Reveal";
import { logosForNames } from "@/data/companies";
import { industries } from "@/data/industries";
import { serviceGroups } from "@/data/services";
import { primaryCta } from "@/data/site";
import { caseStudies, coreProjects } from "@/data/work";

export const metadata: Metadata = {
  title: "Work & Case Studies",
  description:
    "Case studies in voice AI, AI agents, agent operations, HIPAA software, EU Digital Product Passports and mobile apps from Bit & Bytes.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  const groupTitle = new Map(serviceGroups.map((g) => [g.slug, g.title]));
  const groupOptions = serviceGroups
    .filter((g) => caseStudies.some((c) => c.groups.includes(g.slug)))
    .map((g) => ({ value: g.slug, label: g.title }));
  const industryOptions = industries
    .filter((i) => caseStudies.some((c) => c.industrySlug === i.slug))
    .map((i) => ({ value: i.slug, label: i.title }));

  return (
    <>
      <PageHeader
        crumbs={[{ name: "Home", href: "/" }, { name: "Work" }]}
        eyebrow="Work"
        title="Case studies and shipped products"
        accentWords={2}
        sub="Voice AI, AI agents, agent operations, compliance software and apps we have built. Filter by service or industry."
        primary={primaryCta}
      />

      <Section id="case-studies" className="section--flush-top">
        <SectionHeading eyebrow="Case studies" title="Filter by service and *industry*" />
        <WorkFilter cases={caseStudies} groups={groupOptions} industries={industryOptions} />
      </Section>

      <Section id="products" tone="panel" pixels>
        <SectionHeading
          eyebrow="Products & accelerators"
          title="Our own *products*"
          sub="Building blocks we reuse on client projects so you ship faster."
        />
        <ProductsGrid />
      </Section>

      <Section id="more">
        <SectionHeading
          eyebrow="More core projects"
          title="Other products *we've built*"
          sub="AI agents, SaaS platforms and automation tools shipped for clients."
        />
        <Reveal className="grid grid--auto" stagger={0.05} y={40}>
          {coreProjects.map((p) => {
            const logo = logosForNames([p.name])[0];
            return (
              <article key={p.name} className="case-card">
                <span className="case-card__bg" />
                <div className="case-card__media" style={{ aspectRatio: "16 / 8" }}>
                  {p.image ? (
                    <Image src={p.image} alt={p.name} fill sizes="(min-width: 992px) 30vw, 90vw" />
                  ) : logo ? (
                    <div style={{ position: "absolute", inset: "22% 18%" }}>
                      <Image src={logo.black} alt={p.name} fill sizes="20rem" className="logo-light" style={{ objectFit: "contain" }} />
                      <Image src={logo.white} alt="" fill sizes="20rem" className="logo-dark" style={{ objectFit: "contain" }} />
                    </div>
                  ) : (
                    <span className="case-card__placeholder">{p.name}</span>
                  )}
                </div>
                <div className="case-card__body">
                  <div className="label">{p.industry}</div>
                  <h3 className="h5 case-card__hl">{p.name}</h3>
                  <p className="p-s soft" style={{ marginBottom: "1.25rem" }}>
                    {p.summary}
                  </p>
                  <div className="chips" style={{ marginBottom: "1.25rem" }}>
                    {p.groups.map((g) => (
                      <span key={g} className="chip chip--sm">
                        {groupTitle.get(g)}
                      </span>
                    ))}
                  </div>
                  {p.links.length ? (
                    <div className="btn-row" style={{ marginTop: "auto" }}>
                      {p.links.map((l) => (
                        <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="text-link">
                          {l.label} <ArrowUpRight />
                        </a>
                      ))}
                    </div>
                  ) : null}
                </div>
              </article>
            );
          })}
        </Reveal>
      </Section>

      <ClosingCta source="Work" />
    </>
  );
}
