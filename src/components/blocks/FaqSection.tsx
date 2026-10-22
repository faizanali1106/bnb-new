import type { Faq } from "@/data/site";
import { faqSchema, jsonLd } from "@/lib/seo/schema";
import Reveal from "../ui/Reveal";
import { FaqAccordion } from "./Faq";
import { Section, SectionHeading } from "./Section";

export function FaqSection({
  id = "faq",
  items,
  title = "Frequently asked *questions*",
  sub = "Straight answers on cost, timelines, ownership and data.",
  tone = "plain",
}: {
  id?: string;
  items: Faq[];
  title?: string;
  sub?: string;
  tone?: "plain" | "panel";
}) {
  if (!items.length) return null;
  return (
    <Section id={id} tone={tone}>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faqSchema(items))} />
      <div className="split">
        <SectionHeading eyebrow="FAQ" title={title} sub={sub} align="stack" />
        <Reveal>
          <FaqAccordion items={items} />
        </Reveal>
      </div>
    </Section>
  );
}
