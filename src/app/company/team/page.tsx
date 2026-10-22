import type { Metadata } from "next";
import { ClosingCta } from "@/components/blocks/ClosingCta";
import { PageHeader } from "@/components/blocks/PageHeader";
import { Section } from "@/components/blocks/Section";
import { TeamDirectory } from "@/components/blocks/TeamDirectory";
import { loadMergedSiteContent } from "@/lib/cms/load-from-supabase";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Our Team",
  description: "Meet the Bit & Bytes team behind design, engineering, and delivery.",
  alternates: { canonical: "/company/team" },
};

export default async function CompanyTeamPage() {
  const content = await loadMergedSiteContent();
  return (
    <>
      <PageHeader
        crumbs={[{ name: "Home", href: "/" }, { name: "Company", href: "/company" }, { name: "Team" }]}
        eyebrow="Our team"
        title="The engineers, designers and leads behind every project"
        accentWords={2}
        sub="The people who scope your project are the people who build it."
        secondary={{ label: "See open roles", href: "/careers" }}
      />
      <Section className="section--flush-top">
        <TeamDirectory members={content.teamMembers} />
      </Section>
      <ClosingCta source="Team" />
    </>
  );
}
