import type { Metadata } from "next";
import { InfoTiles, WhyRows } from "@/components/blocks/cards";
import { ClosingCta } from "@/components/blocks/ClosingCta";
import { PageHeader } from "@/components/blocks/PageHeader";
import { ProcessSteps } from "@/components/blocks/ProcessSteps";
import { Section, SectionHeading } from "@/components/blocks/Section";
import { TeamDirectory } from "@/components/blocks/TeamDirectory";
import Btn from "@/components/ui/Btn";
import Reveal from "@/components/ui/Reveal";
import { company, primaryCta } from "@/data/site";
import { loadMergedSiteContent } from "@/lib/cms/load-from-supabase";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "About Bit & Bytes",
  description:
    "A senior engineering team building AI products, voice AI and software for US and UK startups and SMBs. How we work, what we believe about AI, and the team.",
  alternates: { canonical: "/company" },
};

export default async function CompanyPage() {
  const content = await loadMergedSiteContent();
  return (
    <>
      <PageHeader
        crumbs={[{ name: "Home", href: "/" }, { name: "Company" }]}
        eyebrow="Company"
        title="A small senior team that ships AI to production"
        accentWords={2}
        sub="Who we are, how we work, and what we believe about building with AI."
        primary={primaryCta}
        secondary={{ label: "Trust & security", href: "/trust" }}
        jumpLinks={[
          { label: "Our story", href: "#story" },
          { label: "How we work", href: "#how-we-work" },
          { label: "What we believe", href: "#beliefs" },
          { label: "Numbers", href: "#numbers" },
          { label: "Team", href: "#team" },
          { label: "Careers", href: "#careers" },
        ]}
      />

      <Section id="story" className="section--flush-top">
        <div className="split">
          <SectionHeading eyebrow="Our story" title="From custom software to *AI products*" align="stack" />
          <Reveal className="prose">
            {company.story.map((p) => (
              <p key={p} className="p-l soft">
                {p}
              </p>
            ))}
          </Reveal>
        </div>
      </Section>

      <Section id="how-we-work" tone="dark">
        <SectionHeading eyebrow="How we work" title="Phases, communication and *time zones*" />
        <ProcessSteps />
        <div style={{ marginTop: "1rem" }}>
          <InfoTiles cols={4} items={company.howWeWork.map((h) => ({ title: h.title, desc: h.desc }))} />
        </div>
      </Section>

      <Section id="beliefs">
        <SectionHeading eyebrow="What we believe about AI" title="Four rules we *build by*" />
        <InfoTiles cols={4} items={company.beliefs.map((b) => ({ title: b.title, desc: b.desc }))} />
      </Section>

      <Section id="why" tone="panel" pixels>
        <div className="split">
          <SectionHeading eyebrow="Why Bit & Bytes" title="Why teams *choose us*" align="stack" />
          <WhyRows />
        </div>
      </Section>

      <Section id="numbers">
        <SectionHeading eyebrow="Numbers you can verify" title="What we can *point to*" />
        <InfoTiles cols={4} items={company.numbers.map((n) => ({ title: n.label, desc: "", value: n.value }))} />
      </Section>

      <Section id="team" tone="panel">
        <SectionHeading eyebrow="The team" title="The people you'll *work with*" action={{ label: "Full team page", href: "/company/team" }} />
        <TeamDirectory members={content.teamMembers} />
      </Section>

      <Section id="careers" tone="dark" className="section--flush-top">
        <div className="split split--even" style={{ alignItems: "center" }}>
          <div>
            <h2 className="h3">
              Want to build <span className="serif">with us?</span>
            </h2>
          </div>
          <Reveal>
            <p className="p-m soft" style={{ marginBottom: "2rem" }}>
              We hire engineers who like shipping AI to real users.
            </p>
            <Btn href="/careers">See open roles</Btn>
          </Reveal>
        </div>
      </Section>

      <ClosingCta source="Company" />
    </>
  );
}
