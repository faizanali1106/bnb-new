import { ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseCards, InfoTiles } from "@/components/blocks/cards";
import { ClosingCta } from "@/components/blocks/ClosingCta";
import { FaqSection } from "@/components/blocks/FaqSection";
import { PageHeader } from "@/components/blocks/PageHeader";
import { Section, SectionHeading } from "@/components/blocks/Section";
import Arrow from "@/components/ui/Arrow";
import Reveal from "@/components/ui/Reveal";
import TLink from "@/components/ui/TLink";
import { getIndustry, industries } from "@/data/industries";
import { findServiceBySlug, serviceHref } from "@/data/services";
import { primaryCta, workCta } from "@/data/site";
import { casesBySlugs } from "@/data/work";

export function generateStaticParams() {
  return industries.map((i) => ({ industry: i.slug }));
}

export async function generateMetadata({ params }: PageProps<"/industries/[industry]">): Promise<Metadata> {
  const industry = getIndustry((await params).industry);
  if (!industry) return { title: "Industries" };
  return { title: industry.h1, description: industry.intro, alternates: { canonical: `/industries/${industry.slug}` } };
}

function serviceLink(slug: string) {
  const found = findServiceBySlug(slug);
  return found ? { title: found.service.title, href: serviceHref(found.group, found.service), summary: found.service.blurb } : null;
}

export default async function IndustryPage({ params }: PageProps<"/industries/[industry]">) {
  const industry = getIndustry((await params).industry);
  if (!industry) notFound();
  const relatedServices = industry.services.map(serviceLink).filter((s): s is NonNullable<ReturnType<typeof serviceLink>> => Boolean(s));
  const cases = casesBySlugs(industry.cases).slice(0, 2);
  const lower = industry.title.toLowerCase();

  return (
    <>
      <PageHeader
        crumbs={[{ name: "Home", href: "/" }, { name: "Industries", href: "/industries" }, { name: industry.title }]}
        eyebrow={industry.title}
        title={industry.h1}
        sub={industry.intro}
        primary={primaryCta}
        secondary={workCta}
      />

      <Section id="challenges" className="section--flush-top">
        <SectionHeading eyebrow="Industry challenges" title={`What ${lower} teams *tell us*`} />
        <Reveal className="grid grid--3" stagger={0.07} y={40}>
          {industry.challenges.map((c) => (
            <div className="tile tile--quote" key={c}>
              <p className="tile__p">{c}</p>
            </div>
          ))}
        </Reveal>
      </Section>

      <Section id="built" tone="panel" pixels>
        <SectionHeading eyebrow="What we've built here" title="Real projects in this *industry*" />
        <Reveal className="grid grid--2" stagger={0.08} y={40}>
          {industry.built.map((b) =>
            b.href ? (
              <TLink key={b.name} href={b.href} className="grow-tile hover-arrow">
                <span className="grow-tile__bg" />
                <div>
                  <h3 className="h5 grow-tile__h" style={{ marginBottom: "0.75rem" }}>
                    {b.name}
                  </h3>
                  <p className="p-s soft">{b.desc}</p>
                </div>
                <div className="grow-tile__end">
                  <span className="text-link">Read case study</span>
                  <Arrow />
                </div>
              </TLink>
            ) : (
              <div key={b.name} className="tile tile--pad-lg">
                <h3 className="h5 tile__h">{b.name}</h3>
                <p className="p-s tile__p">{b.desc}</p>
              </div>
            ),
          )}
        </Reveal>
      </Section>

      <Section id="use-cases">
        <SectionHeading eyebrow="AI use cases" title={`AI use cases for *${lower}*`} />
        <Reveal className="grid grid--2" stagger={0.08} y={40}>
          {industry.useCases.map((u) => {
            const svc = serviceLink(u.service);
            return svc ? (
              <TLink key={u.title} href={svc.href} className="grow-tile hover-arrow">
                <span className="grow-tile__bg" />
                <div>
                  <h3 className="h5 grow-tile__h" style={{ marginBottom: "0.75rem" }}>
                    {u.title}
                  </h3>
                  <p className="p-s soft">{u.desc}</p>
                </div>
                <div className="grow-tile__end">
                  <span className="text-link">Service: {svc.title}</span>
                  <Arrow />
                </div>
              </TLink>
            ) : (
              <div key={u.title} className="tile tile--pad-lg">
                <h3 className="h5 tile__h">{u.title}</h3>
                <p className="p-s tile__p">{u.desc}</p>
              </div>
            );
          })}
        </Reveal>
      </Section>

      <Section id="compliance" tone="dark" className="section--flush-top">
        <SectionHeading eyebrow="Compliance" title="What we deliver against each *framework*" />
        <InfoTiles icon={<ShieldCheck />} items={industry.compliance.map((c) => ({ title: c.framework, desc: c.delivers }))} />
      </Section>

      {cases.length ? (
        <Section id="cases">
          <SectionHeading eyebrow="Case studies" title="Proof from this *industry*" action={{ label: "All work", href: "/work" }} />
          <CaseCards cases={cases} cols={2} />
        </Section>
      ) : null}

      <Section id="services" tone="panel">
        <SectionHeading eyebrow="Relevant services" title={`Services we deliver for *${lower}*`} />
        <Reveal className="grid grid--4" stagger={0.06} y={40}>
          {relatedServices.map((s) => (
            <TLink key={s.href} href={s.href} className="grow-tile grow-tile--sm hover-arrow">
              <span className="grow-tile__bg" />
              <div>
                <h3 className="h6 grow-tile__h" style={{ marginBottom: "0.75rem" }}>
                  {s.title}
                </h3>
                <p className="p-s soft">{s.summary}</p>
              </div>
              <div className="grow-tile__end" style={{ justifyContent: "flex-end" }}>
                <Arrow />
              </div>
            </TLink>
          ))}
        </Reveal>
      </Section>

      <FaqSection items={industry.faqs} />
      <ClosingCta source={`Industry: ${industry.title}`} />
    </>
  );
}
