import type { Metadata } from "next";
import { CaseCards, EngagementTiles, OfferLadder } from "@/components/blocks/cards";
import { ClosingCta } from "@/components/blocks/ClosingCta";
import { FaqSection } from "@/components/blocks/FaqSection";
import { PageHeader } from "@/components/blocks/PageHeader";
import { Section, SectionHeading } from "@/components/blocks/Section";
import { ServicesSticky } from "@/components/blocks/ServicesSticky";
import { primaryCta } from "@/data/site";
import { caseStudies } from "@/data/work";

export const metadata: Metadata = {
  title: "AI, Software & Automation Services",
  description:
    "AI and agentic solutions, software and mobile development, data, advisory, cloud and AI ops, security, automation, QA and finance services for US and UK startups and SMBs.",
  alternates: { canonical: "/services" },
};

const faqs = [
  { q: "Where should we start?", a: "If you are not sure what to build, start with the AI Discovery Workshop. If you have a clear use case, start with an AI Pilot." },
  { q: "Do you only do AI?", a: "No. AI is our focus, but we also build SaaS, web and mobile products, data platforms and compliance software. These are often the parts that get AI into production." },
  { q: "How do you price projects?", a: "Every project gets a written quote after a short scoping call. Ongoing work is billed monthly." },
  { q: "Can you work with our in-house team?", a: "Yes, as an AI Pod alongside your engineers, or by handing over with full documentation." },
  { q: "Which time zones do you cover?", a: "We plan daily overlap with US Eastern and UK hours." },
  { q: "Who owns the code?", a: "You do, from the first commit." },
  { q: "Do you sign NDAs?", a: "Yes, before anything confidential is shared." },
  { q: "Do you work with regulated data?", a: "Yes. We work with HIPAA for healthcare and GDPR / EU ESPR for EU products." },
];

export default function ServicesIndexPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ name: "Home", href: "/" }, { name: "Services" }]}
        eyebrow="Services"
        title="AI, software and automation services"
        accentWords={3}
        sub="For US and UK startups, SMBs and regulated industries that need AI running in production."
        primary={primaryCta}
        secondary={{ label: "Not sure? Start with the AI Discovery Workshop", href: "/offers/ai-discovery-workshop" }}
      />

      <Section id="start-here" className="section--flush-top">
        <SectionHeading eyebrow="Start here" title="Three ways to *begin*" />
        <OfferLadder />
      </Section>

      <Section id="groups" tone="panel">
        <SectionHeading
          eyebrow="All services"
          title="Ten service *areas*"
          sub="Core services are marked. That is where we have the most shipped work. Scroll each area: the title stays while the list moves."
        />
        <ServicesSticky />
      </Section>

      <Section id="engagement">
        <SectionHeading eyebrow="Engagement models" title="How we work *together*" />
        <EngagementTiles />
      </Section>

      <Section id="cases" className="section--flush-top">
        <SectionHeading eyebrow="Proof" title="Recent *work*" action={{ label: "All work", href: "/work" }} />
        <CaseCards cases={caseStudies.slice(0, 4)} />
      </Section>

      <FaqSection items={faqs} tone="panel" />
      <ClosingCta source="Services index" />
    </>
  );
}
