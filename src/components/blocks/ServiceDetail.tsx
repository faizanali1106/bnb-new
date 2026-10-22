import { aiGates, serviceHref, type Service, type ServiceGroup } from "@/data/services";
import { guides, primaryCta, workCta } from "@/data/site";
import { casesBySlugs } from "@/data/work";
import { jsonLd, serviceSchema } from "@/lib/seo/schema";
import type { Testimonial } from "@/lib/testimonials";
import Btn from "../ui/Btn";
import Reveal from "../ui/Reveal";
import {
  CaseCards,
  EngagementTiles,
  IndustryChips,
  InfoTiles,
  OfferLadder,
  StackBlock,
  SubServiceCards,
  TrustStrip,
} from "./cards";
import { TestimonialCarousel } from "./Carousels";
import { ClosingCta } from "./ClosingCta";
import { FaqSection } from "./FaqSection";
import { LeadForm } from "./LeadForm";
import { PageHeader } from "./PageHeader";
import { ProcessSteps } from "./ProcessSteps";
import { Checks, Section, SectionHeading } from "./Section";

const aiGroups = new Set(["ai-agentic-solutions", "advisory-strategy", "cloud-devops-ai-ops"]);

/**
 * Service page template. `hero` (core services) renders the full 20-section page;
 * `sub` renders the shorter subset.
 */
export function ServiceDetail({
  group,
  service,
  variant,
  testimonials = [],
}: {
  group: ServiceGroup;
  service: Service;
  variant: "hero" | "sub";
  testimonials?: Testimonial[];
}) {
  const hero = variant === "hero";
  const path = serviceHref(group, service);
  const cases = casesBySlugs(service.proof).slice(0, 3);
  const team = service.team ?? group.team;
  const gates = service.gates ?? (aiGroups.has(group.slug) ? aiGates : undefined);
  const isAi = aiGroups.has(group.slug);

  const jump = [
    hero && { label: "Is this you?", href: "#symptoms" },
    { label: "What's included", href: "#included" },
    { label: "How we deliver", href: "#delivery" },
    cases.length && { label: "Case studies", href: "#cases" },
    { label: "How to start", href: "#start" },
    { label: "FAQ", href: "#faq" },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(serviceSchema({ name: service.title, description: service.summary, path, serviceType: group.title }))}
      />

      <PageHeader
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Services", href: "/services" },
          { name: group.title, href: `/services/${group.slug}` },
          { name: service.title },
        ]}
        eyebrow={service.title}
        title={service.h1}
        sub={service.summary}
        primary={primaryCta}
        secondary={workCta}
        jumpLinks={hero ? jump : undefined}
      />

      {hero && service.symptoms.length ? (
        <Section id="symptoms" className="section--flush-top">
          <SectionHeading eyebrow="You're here because…" title="Does this sound like *your team?*" />
          <Reveal className="grid grid--4" stagger={0.07} y={40}>
            {service.symptoms.map((s) => (
              <div className="tile tile--quote" key={s}>
                <p className="tile__p">&ldquo;{s}&rdquo;</p>
              </div>
            ))}
          </Reveal>
        </Section>
      ) : null}

      {hero && cases.length ? <TrustStrip names={cases.map((c) => c.client)} label="Proof from this service" /> : null}

      <Section id="included" tone="panel">
        <div className="split">
          <SectionHeading eyebrow="What's included" title={`What you get with *${service.title}*`} align="stack" />
          <Reveal>
            <Checks items={service.included} />
          </Reveal>
        </div>
      </Section>

      {hero ? (
        <Section id="related">
          <SectionHeading
            eyebrow={group.title}
            title="Related *services*"
            action={{ label: `All ${group.title}`, href: `/services/${group.slug}` }}
          />
          <SubServiceCards group={group} exclude={service.slug} />
        </Section>
      ) : null}

      <Section id="delivery" tone="dark">
        <SectionHeading eyebrow="How we deliver" title="Phases, timelines and what you *receive*" />
        <ProcessSteps phases={group.phases} />
      </Section>

      {hero && gates ? (
        <Section id="gates">
          <div className="split">
            <SectionHeading
              eyebrow="Decision gates"
              title="What we measure before Go / Adjust / *Stop*"
              sub="Every phase ends with a decision based on numbers agreed at the start."
              align="stack"
            />
            <InfoTiles
              cols={2}
              items={gates.map((g) => {
                const [name, ...rest] = g.split(": ");
                return { title: name, desc: rest.join(": ") };
              })}
            />
          </div>
        </Section>
      ) : null}

      <Section id="enquire" tone="panel">
        <div className="split split--even">
          <SectionHeading
            eyebrow="Talk to an engineer"
            title={`Get a plan for *${service.title}*`}
            sub="A few fields, no sales script. We reply within 1 business day with next steps."
            align="stack"
          />
          <Reveal y={50}>
            <LeadForm source={service.title} title="Quick enquiry" />
          </Reveal>
        </div>
      </Section>

      {cases.length ? (
        <Section id="cases">
          <SectionHeading eyebrow="Case studies" title="Where we've done this *before*" action={{ label: "All work", href: "/work" }} />
          <CaseCards cases={cases} cols={3} />
        </Section>
      ) : null}

      {hero ? (
        <Section id="team" className={cases.length ? "section--flush-top" : undefined}>
          <SectionHeading eyebrow="Who's on the team" title="Senior people, named *roles*" />
          <InfoTiles cols={4} items={team.map((t) => ({ title: t.role, desc: t.note }))} />
        </Section>
      ) : null}

      <Section id="stack" tone="panel">
        <SectionHeading eyebrow="Models & tech stack" title="What we build *with*" />
        <StackBlock focus={service.stackFocus} />
      </Section>

      {hero && service.industries.length ? (
        <Section id="industries">
          <SectionHeading eyebrow="Industries" title="Industries we deliver this *for*" />
          <IndustryChips slugs={service.industries} />
        </Section>
      ) : null}

      <Section id="start" className={hero && service.industries.length ? "section--flush-top" : undefined}>
        <SectionHeading
          eyebrow="How to start"
          title={isAi ? "Start small, with a clear *decision point*" : "Ways to work *with us*"}
          sub={isAi ? "Most AI work starts with a workshop or a 4–6 week pilot." : "Every project gets a written quote after a short scoping call."}
        />
        {isAi ? <OfferLadder compact /> : <EngagementTiles />}
      </Section>

      {hero && service.avoid?.length ? (
        <Section id="avoid" tone="panel">
          <div className="split">
            <SectionHeading eyebrow="What we avoid" title="Who this is not for, and what we *won't do*" align="stack" />
            <Reveal>
              <Checks items={service.avoid} x />
            </Reveal>
          </div>
        </Section>
      ) : null}

      {hero && testimonials.length ? (
        <Section id="testimonials">
          <TestimonialCarousel head={{ eyebrow: "Testimonials", title: "What clients *say*" }} items={testimonials} />
        </Section>
      ) : null}

      <FaqSection items={service.faqs} />

      {hero ? (
        <Section id="guide" tone="dark" className="section--flush-top">
          <div className="split split--even" style={{ alignItems: "center" }}>
            <div>
              <div className="label" style={{ marginBottom: "1rem" }}>
                Free guide
              </div>
              <h2 className="h4">{guides[0].title}</h2>
            </div>
            <Reveal>
              <p className="p-m soft" style={{ marginBottom: "2rem" }}>
                {guides[0].desc}
              </p>
              <Btn href="/contact?intent=guide">Request a copy</Btn>
            </Reveal>
          </div>
        </Section>
      ) : null}

      <ClosingCta source={service.title} heading={`Ready to talk about ${service.title}?`} />
    </>
  );
}
