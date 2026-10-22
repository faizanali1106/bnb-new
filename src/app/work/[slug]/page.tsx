import { ArrowUpRight, Quote } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CaseCards } from "@/components/blocks/cards";
import { ClosingCta } from "@/components/blocks/ClosingCta";
import { Breadcrumbs } from "@/components/blocks/PageHeader";
import { Bullets, Section, SectionHeading } from "@/components/blocks/Section";
import Btn from "@/components/ui/Btn";
import Eyebrow from "@/components/ui/Eyebrow";
import Pixels from "@/components/ui/Pixels";
import Reveal from "@/components/ui/Reveal";
import SplitText from "@/components/ui/SplitText";
import TLink from "@/components/ui/TLink";
import { findServiceBySlug, serviceHref } from "@/data/services";
import { primaryCta } from "@/data/site";
import { caseStudies, getCaseStudy } from "@/data/work";
import { articleSchema, jsonLd } from "@/lib/seo/schema";
import { loadTestimonialFrom } from "@/lib/testimonials";

export const revalidate = 60;

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const study = getCaseStudy((await params).slug);
  if (!study) return { title: "Case study" };
  return {
    title: `${study.client}: ${study.headline}`,
    description: study.challenge[0],
    alternates: { canonical: `/work/${study.slug}` },
  };
}

export default async function CaseStudyPage({ params }: PageProps<"/work/[slug]">) {
  const study = getCaseStudy((await params).slug);
  if (!study) notFound();
  const quote = await loadTestimonialFrom(study.testimonialFrom);
  const services = study.services
    .map((s) => findServiceBySlug(s))
    .filter((f): f is NonNullable<typeof f> => Boolean(f))
    .map((f) => ({ title: f.service.title, href: serviceHref(f.group, f.service) }));
  const related = caseStudies.filter((c) => c.slug !== study.slug && c.groups.some((g) => study.groups.includes(g))).slice(0, 3);

  const glance = [
    { label: "Client", value: study.client },
    { label: "Industry", value: study.industry },
    { label: "Services", value: services.map((s) => s.title).join(", ") },
    ...(study.duration ? [{ label: "Duration", value: study.duration }] : []),
    { label: "Stack", value: study.stack.join(", ") },
    ...study.metrics,
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(articleSchema({ headline: study.headline, description: study.challenge[0], path: `/work/${study.slug}` }))}
      />

      <section className="page-head">
        <Pixels pattern="00a3/0320/0000/3000" />
        <div className="container">
          <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Work", href: "/work" }, { name: study.client }]} />
          <div className="cs-hero">
            <div>
              <Reveal y={20}>
                <Eyebrow>Case study · {study.client}</Eyebrow>
              </Reveal>
              <SplitText as="h1" className="h4" text={study.headline} trigger="load" stagger={0.025} />
              <Reveal>
                <p className="cs-hero__hl">{study.highlight}</p>
              </Reveal>
              {study.image ? (
                <Reveal className="cs-hero__img" y={60}>
                  <Image src={study.image} alt={study.client} fill sizes="(min-width: 992px) 55vw, 100vw" priority />
                </Reveal>
              ) : null}
            </div>
            <Reveal className="tile tile--pad-lg glance" y={50}>
              <h2 className="label" style={{ marginBottom: "2rem" }}>
                At a glance
              </h2>
              <dl>
                {glance.map((g) => (
                  <div key={g.label}>
                    <dt className="label">{g.label}</dt>
                    <dd>{g.value}</dd>
                  </div>
                ))}
              </dl>
              {study.links?.length ? (
                <div className="glance__links">
                  {study.links.map((l) => (
                    <Btn key={l.href} href={l.href} variant="tile" className="btn--block" external>
                      {l.label}
                    </Btn>
                  ))}
                </div>
              ) : null}
            </Reveal>
          </div>
        </div>
      </section>

      <Section className="section--flush-top">
        <Reveal className="grid grid--3" stagger={0.08} y={50}>
          {(
            [
              ["The challenge", study.challenge],
              ["Our approach", study.approach],
              ["Results", study.results],
            ] as const
          ).map(([title, items], i) => (
            <div key={title} className="tile tile--pad-lg">
              <div className="step__n" style={{ marginBottom: "1.5rem" }}>
                0{i + 1}
              </div>
              <h2 className="h5" style={{ marginBottom: "1.5rem" }}>
                {title}
              </h2>
              <Bullets items={[...items]} />
            </div>
          ))}
        </Reveal>
      </Section>

      {quote ? (
        <Section tone="dark" className="section--flush-top">
          <Reveal className="big-quote">
            <Quote size="3rem" className="accent" style={{ margin: "0 auto" }} />
            <blockquote>&ldquo;{quote.quote}&rdquo;</blockquote>
            <p className="label">
              {quote.name} · {quote.title}
            </p>
          </Reveal>
        </Section>
      ) : null}

      <Section tone="panel">
        <SectionHeading eyebrow="Related services" title="Services used on this *project*" />
        <Reveal className="chips" stagger={0.05} y={16}>
          {services.map((s) => (
            <TLink key={s.href} href={s.href} className="chip">
              {s.title} <ArrowUpRight size="1em" />
            </TLink>
          ))}
        </Reveal>
        <div className="btn-row" style={{ marginTop: "3rem" }}>
          <Btn href={primaryCta.href}>{primaryCta.label}</Btn>
        </div>
      </Section>

      {related.length ? (
        <Section>
          <SectionHeading eyebrow="More work" title="Related case *studies*" action={{ label: "All work", href: "/work" }} />
          <CaseCards cases={related} cols={3} />
        </Section>
      ) : null}

      <ClosingCta source={`Case study: ${study.client}`} heading={`Want results like ${study.client}?`} />
    </>
  );
}
