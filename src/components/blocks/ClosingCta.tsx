import { contactInfo } from "@/data/site";
import { accent } from "@/lib/text";
import Eyebrow from "../ui/Eyebrow";
import Reveal from "../ui/Reveal";
import SplitText from "../ui/SplitText";
import { LeadForm } from "./LeadForm";
import { Checks } from "./Section";

/** Final call to action with the enquiry form, shown at the end of most pages. */
export function ClosingCta({
  heading = "What do you want AI to take off your team's plate?",
  source,
  defaultNeed,
}: {
  heading?: string;
  source: string;
  defaultNeed?: string;
}) {
  return (
    <section id="contact" className="section">
      <div className="container">
        <div className="section__panel">
          <div className="closing">
            <div>
              <Eyebrow>Start the conversation</Eyebrow>
              <SplitText as="h2" className="h3" text={accent(heading, 2)} />
              <Reveal>
                <p className="p-m soft" style={{ marginTop: "2rem" }}>
                  Tell us in a few lines. A senior engineer reads every enquiry.
                </p>
                <Checks items={[contactInfo.responseTime, "NDA available on request", "You own all code from day one"]} />
              </Reveal>
            </div>
            <Reveal y={60}>
              <LeadForm source={source} defaultNeed={defaultNeed} title="Start the conversation" />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
