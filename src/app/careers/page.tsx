import { Heart, Sparkles, Users } from "lucide-react";
import type { Metadata } from "next";
import { PageHeader } from "@/components/blocks/PageHeader";
import { Section, SectionHeading } from "@/components/blocks/Section";
import { JobsExplorer } from "@/components/careers/JobsExplorer";
import Reveal from "@/components/ui/Reveal";
import TLink from "@/components/ui/TLink";
import { publishedJobs } from "@/data/jobs";
import { loadMergedSiteContent } from "@/lib/cms/load-from-supabase";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Careers - Join Our Team",
  description:
    "Join Bit & Bytes LLC and help build the future of technology. We're looking for talented developers, designers, and tech professionals to join our growing team.",
  alternates: { canonical: "/careers" },
};

const highlights = [
  { icon: Users, title: "Small teams, real ownership", copy: "You will work directly with clients and teammates instead of disappearing into a giant org chart." },
  { icon: Sparkles, title: "Craft over busywork", copy: "We care about the quality of what ships: clean code, considered design, and honest communication." },
  { icon: Heart, title: "Room to grow", copy: "Mentorship, varied client work, and a clear path from doing the work to leading it." },
];

export default async function CareersPage() {
  const content = await loadMergedSiteContent();
  const jobs = publishedJobs(content.jobs);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Careers at Bit & Bytes LLC",
            description: "Open roles at Bit & Bytes LLC, a software development company building web, mobile, and product experiences.",
            url: "https://bitandbytes.net/careers",
          }),
        }}
      />

      <PageHeader
        crumbs={[{ name: "Home", href: "/" }, { name: "Company", href: "/company" }, { name: "Careers" }]}
        eyebrow="Careers"
        title="Build with us"
        sub="Join a product-minded team shipping web, mobile, and enterprise software for clients worldwide."
        primary={{ label: "See open roles", href: "#openings" }}
        secondary={{ label: "Get in touch", href: "/contact" }}
      />

      <Section className="section--flush-top">
        <Reveal className="grid grid--3" stagger={0.08} y={40}>
          {highlights.map((h) => (
            <div key={h.title} className="tile tile--pad-lg">
              <div className="tile__icon">
                <h.icon />
              </div>
              <h2 className="h5 tile__h">{h.title}</h2>
              <p className="p-s tile__p">{h.copy}</p>
            </div>
          ))}
        </Reveal>
      </Section>

      <Section id="openings" tone="panel" pixels>
        <SectionHeading eyebrow="Open roles" title="Find a seat that fits your *craft*" align="center" />
        <JobsExplorer jobs={jobs} />
        <div style={{ textAlign: "center", marginTop: "3rem" }}>
          <TLink href="/contact" className="text-link">
            Don&apos;t see a fit? Reach out →
          </TLink>
        </div>
      </Section>
    </>
  );
}
