import { liveServices, serviceGroups, serviceHref } from "@/data/services";
import Btn from "../ui/Btn";
import Glyph from "../ui/Glyph";
import Reveal from "../ui/Reveal";
import SplitText from "../ui/SplitText";
import TLink from "../ui/TLink";

/** All service areas: sticky title column on the left, scrolling service list on the right. */
export function ServicesSticky() {
  return (
    <div>
      {serviceGroups.map((g) => (
        <section key={g.slug} id={g.slug} className="sgroup">
          <div className="sgroup__left">
            <div className="sgroup__num">{String(g.number).padStart(2, "0")}</div>
            <Glyph group={g.slug} className="sgroup__icon" label={g.title} />
            <SplitText as="h2" className="h4 sgroup__title" text={g.title} />
            <Btn href={`/services/${g.slug}`} variant="white" size="sm">
              Explore {g.title}
            </Btn>
          </div>
          <div>
            <Reveal>
              <p className="p-l sgroup__summary">{g.summary}</p>
              <p className="p-m sgroup__outcome">{g.outcome}</p>
            </Reveal>
            <Reveal as="ul" className="slist" stagger={0.04} y={20}>
              {liveServices(g).map((s) => (
                <li key={s.slug}>
                  <TLink href={serviceHref(g, s)}>
                    <span className="slist__t">
                      {s.title}
                      {s.hero ? <span className="tag">Core</span> : null}
                    </span>
                    <span className="p-s slist__d">{s.blurb}</span>
                  </TLink>
                </li>
              ))}
            </Reveal>
          </div>
        </section>
      ))}
    </div>
  );
}
