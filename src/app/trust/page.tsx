import { ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import { ClosingCta } from "@/components/blocks/ClosingCta";
import { PageHeader } from "@/components/blocks/PageHeader";
import { Bullets, Section } from "@/components/blocks/Section";
import Reveal from "@/components/ui/Reveal";
import { primaryCta, trust } from "@/data/site";

export const metadata: Metadata = {
  title: "Trust & Security",
  description:
    "How Bit & Bytes handles client data, keeps it out of AI model training, controls access, and builds to HIPAA, GDPR, EU ESPR and SOC 2 requirements.",
  alternates: { canonical: "/trust" },
};

export default function TrustPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ name: "Home", href: "/" }, { name: "Company", href: "/company" }, { name: "Trust & security" }]}
        eyebrow="Trust & security"
        title="How we protect your data, code and customers"
        accentWords={2}
        sub="The answers to the questions your procurement, security and compliance teams will ask, including what we don't have yet."
        primary={primaryCta}
        jumpLinks={trust.sections.map((s) => ({ label: s.title, href: `#${s.id}` }))}
      />
      <Section className="section--flush-top">
        <Reveal className="grid grid--2" stagger={0.06} y={40}>
          {trust.sections.map((s) => (
            <article key={s.id} id={s.id} className="tile tile--pad-lg">
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.75rem" }}>
                <span className="tile__icon" style={{ marginBottom: 0 }}>
                  <ShieldCheck />
                </span>
                <h2 className="h5">{s.title}</h2>
              </div>
              <Bullets items={s.points} />
            </article>
          ))}
        </Reveal>
      </Section>
      <ClosingCta source="Trust" heading="Need our security answers for a questionnaire?" />
    </>
  );
}
