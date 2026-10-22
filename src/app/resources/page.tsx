import { BookOpen, FileText } from "lucide-react";
import type { Metadata } from "next";
import { ClosingCta } from "@/components/blocks/ClosingCta";
import { FaqSection } from "@/components/blocks/FaqSection";
import { PageHeader } from "@/components/blocks/PageHeader";
import { Section, SectionHeading } from "@/components/blocks/Section";
import Arrow from "@/components/ui/Arrow";
import Reveal from "@/components/ui/Reveal";
import TLink from "@/components/ui/TLink";
import { engagementFaqs, guides, homeFaqs, offers, plannedArticles } from "@/data/site";

export const metadata: Metadata = {
  title: "Resources: Guides, Articles & FAQ",
  description: "Guides, articles and answers on AI pilots, AI agent costs, voice AI, HIPAA-compliant AI and EU Digital Product Passports.",
  alternates: { canonical: "/resources" },
};

const allFaqs = [...homeFaqs, ...engagementFaqs, ...offers.flatMap((o) => o.faqs.slice(0, 1))].filter(
  (f, i, list) => list.findIndex((x) => x.q === f.q) === i,
);

export default function ResourcesPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ name: "Home", href: "/" }, { name: "Resources" }]}
        eyebrow="Resources"
        title="Guides and answers for buying AI work"
        accentWords={2}
        sub="Practical material on AI pilots, costs, voice AI and compliance, written by the engineers who build these systems."
        jumpLinks={[
          { label: "Guides", href: "#guides" },
          { label: "Articles", href: "#articles" },
          { label: "FAQ", href: "#faq" },
        ]}
      />

      <Section id="guides" className="section--flush-top">
        <SectionHeading eyebrow="Guides" title="Checklists and *playbooks*" sub="Ask for a copy and we'll send it as soon as it's published." />
        <Reveal className="grid grid--3" stagger={0.08} y={50}>
          {guides.map((g) => (
            <TLink key={g.title} href="/contact?intent=guide" className="grow-tile hover-arrow" style={{ minHeight: "24rem" }}>
              <span className="grow-tile__bg" />
              <div>
                <div className="tile__icon">
                  <BookOpen />
                </div>
                <h3 className="h5 grow-tile__h" style={{ marginBottom: "1rem" }}>
                  {g.title}
                </h3>
                <p className="p-s soft">{g.desc}</p>
              </div>
              <div className="grow-tile__end">
                <span className="text-link">Request a copy</span>
                <Arrow />
              </div>
            </TLink>
          ))}
        </Reveal>
      </Section>

      <Section id="articles" tone="panel" pixels>
        <SectionHeading eyebrow="Articles" title="Coming soon on the *blog*" />
        <Reveal className="grid grid--2" stagger={0.06} y={30}>
          {plannedArticles.map((a) => (
            <div key={a.title} className="row-item" style={{ alignItems: "center" }}>
              <span className="row-item__icon">
                <FileText />
              </span>
              <div>
                <div className="label">{a.type}</div>
                <div className="row-item__h" style={{ marginTop: "0.25rem" }}>
                  {a.title}
                </div>
              </div>
            </div>
          ))}
        </Reveal>
      </Section>

      <FaqSection items={allFaqs} title="*FAQ*" sub="The questions buyers ask us most." />
      <ClosingCta source="Resources" />
    </>
  );
}
