import { Mail } from "lucide-react";
import type { Metadata } from "next";
import { InfoTiles } from "@/components/blocks/cards";
import { ContactMap } from "@/components/blocks/ContactMap";
import { LeadForm } from "@/components/blocks/LeadForm";
import { Breadcrumbs } from "@/components/blocks/PageHeader";
import { Section, SectionHeading } from "@/components/blocks/Section";
import Eyebrow from "@/components/ui/Eyebrow";
import Pixels from "@/components/ui/Pixels";
import Reveal from "@/components/ui/Reveal";
import SplitText from "@/components/ui/SplitText";
import { contactInfo } from "@/data/site";

export const metadata: Metadata = {
  title: "Book a Call",
  description:
    "Book a call with a senior Bit & Bytes engineer about AI agents, voice AI, product builds or compliance software. We reply within 1 business day.",
  alternates: { canonical: "/contact" },
};

const afterSteps = [
  { title: "We read it the same day", desc: "A senior engineer reviews your note." },
  { title: "You get a reply within 1 business day", desc: "With questions or a time to talk." },
  { title: "30-minute call", desc: "We discuss goals, constraints and the right first step." },
  { title: "Written next step", desc: "A workshop booking, a pilot proposal, or an honest 'not a fit'." },
];

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            mainEntity: {
              "@type": "Organization",
              name: "Bit & Bytes LLC",
              contactPoint: [{ "@type": "ContactPoint", contactType: "sales", email: contactInfo.email, areaServed: ["US", "GB", "Worldwide"], availableLanguage: ["English"] }],
            },
          }),
        }}
      />

      <section className="page-head">
        <Pixels pattern="00a3/0320/0000/3000" />
        <div className="container">
          <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Book a call" }]} />
          <div className="split split--even">
            <div>
              <Reveal y={20}>
                <Eyebrow>Book a call</Eyebrow>
              </Reveal>
              <SplitText as="h1" className="h-page" text="Talk to a senior engineer about what you want to *build*" trigger="load" />
              <Reveal>
                <p className="p-l soft" style={{ margin: "2.5rem 0 1.5rem" }}>
                  {contactInfo.responseTime} NDA available before you share anything confidential.
                </p>
                <div className="btn-row">
                  <a href={`mailto:${contactInfo.email}`} className="chip chip--card">
                    <Mail size="1.1em" className="accent" /> {contactInfo.email}
                  </a>
                  <span className="p-s soft">Working with teams across the US and UK</span>
                </div>
              </Reveal>
              <Reveal y={40}>
                <div style={{ marginTop: "4rem", maxWidth: "56rem" }}>
                  <ContactMap />
                </div>
              </Reveal>
            </div>
            <Reveal y={60}>
              <LeadForm source="Contact page" title="Tell us about your project" sub="A few fields. We'll come back with next steps." />
            </Reveal>
          </div>
        </div>
      </section>

      <Section tone="panel" className="section--flush-top">
        <SectionHeading eyebrow="Next steps" title="What happens after you *get in touch*" />
        <InfoTiles cols={4} items={afterSteps.map((s, i) => ({ title: s.title, desc: s.desc, value: String(i + 1).padStart(2, "0") }))} />
        {contactInfo.bookingUrl ? (
          <Reveal className="tile" y={40}>
            <iframe src={contactInfo.bookingUrl} title="Book a call" style={{ width: "100%", height: "680px", border: 0, marginTop: "1rem" }} loading="lazy" />
          </Reveal>
        ) : null}
      </Section>
    </>
  );
}
