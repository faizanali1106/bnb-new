import type { Metadata } from "next";
import { ClosingCta } from "@/components/blocks/ClosingCta";
import { PageHeader } from "@/components/blocks/PageHeader";
import { Section } from "@/components/blocks/Section";
import Arrow from "@/components/ui/Arrow";
import Reveal from "@/components/ui/Reveal";
import TLink from "@/components/ui/TLink";
import { industries } from "@/data/industries";
import { primaryCta } from "@/data/site";

export const metadata: Metadata = {
  title: "Industries",
  description:
    "AI and software for healthcare, automotive dealerships, retail, compliance, events and SaaS, the sectors where we have shipped projects.",
  alternates: { canonical: "/industries" },
};

export default function IndustriesPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ name: "Home", href: "/" }, { name: "Industries" }]}
        eyebrow="Industries"
        title="Industries where we have shipped real work"
        accentWords={2}
        sub="We only list sectors where we have built and launched projects. Each page shows what we built and the AI use cases that fit."
        primary={primaryCta}
      />
      <Section className="section--flush-top">
        <Reveal className="grid grid--3" stagger={0.08} y={50}>
          {industries.map((i, n) => (
            <TLink key={i.slug} href={`/industries/${i.slug}`} className="grow-tile hover-arrow" style={{ minHeight: "30rem" }}>
              <span className="grow-tile__bg" />
              <div>
                <div className="grow-tile__meta" style={{ marginBottom: "2.5rem" }}>
                  <span className="sgroup__num">{String(n + 1).padStart(2, "0")}</span>
                  <span className="tag">{i.built.length} shipped</span>
                </div>
                <h2 className="h4 grow-tile__h" style={{ fontSize: "2.8rem", marginBottom: "1rem" }}>
                  {i.title}
                </h2>
                <p className="p-s soft">{i.intro}</p>
              </div>
              <div>
                <p className="label" style={{ marginBottom: "1.25rem" }}>
                  Built here: {i.built.map((b) => b.name).join(" · ")}
                </p>
                <div className="grow-tile__end">
                  <span className="text-link">Explore {i.title}</span>
                  <Arrow size="lg" />
                </div>
              </div>
            </TLink>
          ))}
        </Reveal>
      </Section>
      <ClosingCta source="Industries" />
    </>
  );
}
