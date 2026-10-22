import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseCards, InfoTiles, Rows } from "@/components/blocks/cards";
import { ClosingCta } from "@/components/blocks/ClosingCta";
import { FaqSection } from "@/components/blocks/FaqSection";
import { PageHeader } from "@/components/blocks/PageHeader";
import { Checks, Section, SectionHeading } from "@/components/blocks/Section";
import Btn from "@/components/ui/Btn";
import Reveal from "@/components/ui/Reveal";
import { getOffer, offers } from "@/data/site";
import { casesBySlugs } from "@/data/work";
import { jsonLd, serviceSchema } from "@/lib/seo/schema";

export function generateStaticParams() {
  return offers.map((o) => ({ offer: o.slug }));
}

export async function generateMetadata({ params }: PageProps<"/offers/[offer]">): Promise<Metadata> {
  const offer = getOffer((await params).offer);
  if (!offer) return { title: "Offers" };
  return { title: `${offer.name} (${offer.duration})`, description: offer.intro, alternates: { canonical: `/offers/${offer.slug}` } };
}

export default async function OfferPage({ params }: PageProps<"/offers/[offer]">) {
  const offer = getOffer((await params).offer);
  if (!offer) notFound();
  const others = offers.filter((o) => o.slug !== offer.slug);
  const proof = casesBySlugs(offer.proof).slice(0, 2);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(serviceSchema({ name: offer.name, description: offer.intro, path: `/offers/${offer.slug}`, serviceType: "AI consulting" }))}
      />

      <PageHeader
        crumbs={[{ name: "Home", href: "/" }, { name: "Services", href: "/services" }, { name: offer.name }]}
        eyebrow={`${offer.step} · ${offer.name}`}
        title={offer.h1}
        accentWords={3}
        sub={offer.intro}
        primary={{ label: offer.cta, href: "#contact" }}
        secondary={{ label: "See our work", href: "/work" }}
        facts={[
          { label: "Duration", value: offer.duration },
          { label: "You get", value: offer.deliverable },
        ]}
      />

      <Section id="fit" className="section--flush-top">
        <SectionHeading eyebrow="Fit" title="Who it's for and who it *isn't*" />
        <Reveal className="grid grid--2" stagger={0.1}>
          <div className="tile tile--pad-lg">
            <h3 className="h5" style={{ marginBottom: "2rem" }}>
              Good fit
            </h3>
            <Checks items={offer.forWho} />
          </div>
          <div className="tile tile--pad-lg">
            <h3 className="h5" style={{ marginBottom: "2rem" }}>
              Not a fit
            </h3>
            <Checks items={offer.notFor} x />
          </div>
        </Reveal>
      </Section>

      <Section id="deliverables" tone="panel" pixels>
        <div className="split">
          <SectionHeading eyebrow="What you get" title="*Deliverables*" align="stack" />
          <Reveal>
            <Checks items={offer.youGet} />
          </Reveal>
        </div>
      </Section>

      <Section id="plan">
        <SectionHeading eyebrow="The plan" title="Exactly what happens, and *when*" />
        <Rows items={offer.plan.map((p) => ({ title: p.what, desc: "", when: p.when }))} />
      </Section>

      <Section id="team" tone="panel">
        <SectionHeading eyebrow="Team" title="Who you'll *work with*" />
        <InfoTiles items={offer.team.map((t) => ({ title: t.role, desc: t.note }))} />
      </Section>

      <Section id="gate">
        <SectionHeading eyebrow="Decision gate" title="Go / Adjust / *Stop*" sub="How we decide what happens at the end." />
        <Reveal className="grid grid--3" stagger={0.1} y={40}>
          {(
            [
              ["Go", offer.gate.go, "go"],
              ["Adjust", offer.gate.adjust, "adjust"],
              ["Stop", offer.gate.stop, "stop"],
            ] as const
          ).map(([label, text, kind]) => (
            <div key={label} className={`tile tile--pad-lg gate gate--${kind}`}>
              <h3 className="h4">{label}</h3>
              <p className="p-s tile__p">{text}</p>
            </div>
          ))}
        </Reveal>
      </Section>

      <Section id="next" tone="dark" className="section--flush-top">
        <div className="split split--even" style={{ alignItems: "center" }}>
          <div>
            <div className="label" style={{ marginBottom: "1rem" }}>
              What happens next
            </div>
            <p className="h5">{offer.next}</p>
          </div>
          <div className="btn-row" style={{ justifyContent: "flex-end" }}>
            {others.map((o) => (
              <Btn key={o.slug} href={`/offers/${o.slug}`} variant="tile">
                {o.name}
              </Btn>
            ))}
          </div>
        </div>
      </Section>

      {proof.length ? (
        <Section id="proof">
          <SectionHeading eyebrow="Proof" title="Projects that started *this way*" action={{ label: "All work", href: "/work" }} />
          <CaseCards cases={proof} cols={2} />
        </Section>
      ) : null}

      <FaqSection items={offer.faqs} tone="panel" />
      <ClosingCta heading={offer.cta} source={offer.name} defaultNeed="AI agent" />
    </>
  );
}
