import Image from "next/image";
import { homeFaqs, models, situations, stack } from "@/data/site";
import { caseStudies } from "@/data/work";
import { loadMergedSiteContent } from "@/lib/cms/load-from-supabase";
import { faqSchema, jsonLd, organizationSchema, websiteSchema } from "@/lib/seo/schema";
import { loadNamedTestimonials } from "@/lib/testimonials";
import { CaseCarousel, TestimonialCarousel } from "@/components/blocks/Carousels";
import {
  IndustryChips,
  ProductsGrid,
  ServiceGroupTiles,
  StackBlock,
  TrustStrip,
  WhyRows,
} from "@/components/blocks/cards";
import { ClosingCta } from "@/components/blocks/ClosingCta";
import { FaqSection } from "@/components/blocks/FaqSection";
import { ProcessSteps } from "@/components/blocks/ProcessSteps";
import { Section, SectionHeading } from "@/components/blocks/Section";
import HomeHero from "@/components/home/HomeHero";
import OfferSteps from "@/components/home/OfferSteps";
import TeamCircle from "@/components/home/TeamCircle";
import Arrow from "@/components/ui/Arrow";
import Reveal from "@/components/ui/Reveal";
import TLink from "@/components/ui/TLink";

export const revalidate = 60;

const featured = ["phonefilter-ai-call-screening", "fuzebox-agent-ops", "moonhub-ai-recruiting", "get-in-wallet-event-apps"];

export default async function Home() {
  const [testimonials, content] = await Promise.all([loadNamedTestimonials(), loadMergedSiteContent()]);
  const cases = [
    ...featured.map((s) => caseStudies.find((c) => c.slug === s)).filter((c): c is (typeof caseStudies)[number] => Boolean(c)),
    ...caseStudies.filter((c) => !featured.includes(c.slug)),
  ];
  const people = content.teamMembers
    .filter((m) => !m.hidden && m.photo?.trim())
    .slice(0, 3)
    .map((m) => ({ name: m.name, photo: m.photo }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd([organizationSchema(), websiteSchema(), faqSchema(homeFaqs)])}
      />

      <HomeHero />
      <TrustStrip />

      {/* Situations */}
      <Section id="situations">
        <SectionHeading
          eyebrow="Situations we get called into"
          title="Common reasons teams *contact us*"
          sub="Most clients come to us with one of these four problems."
        />
        <Reveal className="grid grid--4" stagger={0.08} y={50}>
          {situations.map((s) => (
            <TLink key={s.title} href={s.href} className="grow-tile hover-arrow">
              <span className="grow-tile__bg" />
              <div>
                <h3 className="h5 grow-tile__h" style={{ marginBottom: "1rem" }}>
                  {s.title}
                </h3>
                <p className="p-s soft">{s.desc}</p>
              </div>
              <div className="grow-tile__end">
                <span className="text-link">How we help</span>
                <Arrow />
              </div>
            </TLink>
          ))}
        </Reveal>
      </Section>

      {/* Offer ladder */}
      <Section id="offers" className="section--flush-top">
        <SectionHeading
          eyebrow="Start here"
          title="Three steps from idea to *AI in production*"
          sub="Fixed scope and clear deliverables, with a decision gate at every step."
          action={{ label: "All services", href: "/services" }}
        />
        <OfferSteps />
      </Section>

      {/* Services */}
      <Section id="services">
        <SectionHeading
          eyebrow="Services"
          title="Ten service areas, *AI first*"
          sub="AI and agentic solutions, backed by the software, data, cloud and security engineering that gets them to production."
          action={{ label: "All services", href: "/services" }}
        />
        <div className="svc">
          <Reveal className="svc__media" y={60}>
            <video src="/media/services.mp4" autoPlay muted loop playsInline preload="metadata" aria-hidden />
            <div className="svc__media-caption">
              <div>
                <strong>10</strong>
                <div className="p-s">service areas, one senior team</div>
              </div>
              <Image src="/brand/bnb-icon.png" alt="" width={48} height={46} />
            </div>
          </Reveal>
          <ServiceGroupTiles />
        </div>
      </Section>

      {/* Featured work */}
      <Section id="work" className="section--flush-top">
        <CaseCarousel
          head={{
            eyebrow: "Featured work",
            title: "Selected work, shipped to *production*",
            sub: "Voice AI, agent operations, AI recruiting and consumer apps we have shipped.",
            action: { label: "All work", href: "/work" },
          }}
          cases={cases}
        />
      </Section>

      {/* Products */}
      <Section id="products" tone="panel" pixels>
        <SectionHeading
          eyebrow="Products & accelerators"
          title="We start from these, so you *ship faster*"
          sub="Reusable building blocks from our own products, so your project starts from tested patterns."
        />
        <ProductsGrid />
      </Section>

      {/* How we work */}
      <Section id="how-we-work" tone="dark">
        <SectionHeading
          eyebrow="How we work"
          title="Discover → Pilot → Production → *Improve*"
          sub="What you receive at every step, and how long each one takes."
          action={{ label: "More on how we work", href: "/company#how-we-work" }}
        />
        <ProcessSteps />
      </Section>

      {/* Why */}
      <TeamCircle tags={[...models.slice(0, 4), ...stack.filter((s) => ["Next.js", "Django", "AWS", "Kubernetes"].includes(s))]} people={people} />
      <Section id="why" tone="panel" className="section--flush-top">
        <div className="split">
          <SectionHeading eyebrow="Why Bit & Bytes" title="Why teams *choose us*" align="stack" />
          <WhyRows />
        </div>
      </Section>

      {/* Industries */}
      <Section id="industries">
        <SectionHeading
          eyebrow="Industries"
          title="Where we have *real projects*"
          sub="We only list industries where we have shipped work."
          action={{ label: "All industries", href: "/industries" }}
        />
        <IndustryChips />
      </Section>

      {/* Testimonials */}
      {testimonials.length ? (
        <Section id="testimonials" className="section--flush-top">
          <TestimonialCarousel
            head={{ eyebrow: "Testimonials", title: "What clients *say*", sub: "In their own words, from teams we have shipped with." }}
            items={testimonials}
          />
        </Section>
      ) : null}

      {/* Models & stack */}
      <Section id="stack" className="section--flush-top">
        <SectionHeading eyebrow="Models & stack" title="Shipped on the models and frameworks you *already trust*" />
        <StackBlock />
      </Section>

      <FaqSection items={homeFaqs} tone="panel" />
      <ClosingCta source="Home" />
    </>
  );
}
