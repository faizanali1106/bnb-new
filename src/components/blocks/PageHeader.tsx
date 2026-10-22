import { breadcrumbSchema, jsonLd } from "@/lib/seo/schema";
import { accent } from "@/lib/text";
import Btn from "../ui/Btn";
import Eyebrow from "../ui/Eyebrow";
import Pixels from "../ui/Pixels";
import Reveal from "../ui/Reveal";
import SplitText from "../ui/SplitText";
import TLink from "../ui/TLink";

export type Crumb = { name: string; href?: string };
type Cta = { label: string; href: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(breadcrumbSchema(items.map((i) => ({ name: i.name, path: i.href || "/" }))))}
      />
      <nav aria-label="Breadcrumb">
        <ol className="crumbs">
          {items.map((item, i) => {
            const last = i === items.length - 1;
            return (
              <li key={`${item.name}-${i}`}>
                {last || !item.href ? <span aria-current="page">{item.name}</span> : <TLink href={item.href}>{item.name}</TLink>}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}

/** Inner-page hero: breadcrumbs, eyebrow, big split title, copy + CTAs, facts and jump links. */
export function PageHeader({
  crumbs,
  eyebrow,
  title,
  sub,
  primary,
  secondary,
  facts,
  jumpLinks,
  accentWords = 1,
}: {
  crumbs?: Crumb[];
  eyebrow?: string;
  title: string;
  sub?: string;
  primary?: Cta;
  secondary?: Cta;
  facts?: { label: string; value: string }[];
  jumpLinks?: { label: string; href: string }[];
  accentWords?: number;
}) {
  return (
    <section className="page-head">
      <Pixels pattern="00a3/0320/0000/3000" />
      <div className="container">
        {crumbs ? <Breadcrumbs items={crumbs} /> : null}
        {eyebrow ? (
          <Reveal y={20}>
            <Eyebrow>{eyebrow}</Eyebrow>
          </Reveal>
        ) : null}
        <SplitText as="h1" className="h-page page-head__title" text={accent(title, accentWords)} trigger="load" />
        {sub || primary || secondary ? (
          <div className="page-head__row">
            <Reveal className="page-head__sub">
              {sub ? <p className="p-l">{sub}</p> : null}
              {primary || secondary ? (
                <div className="btn-row">
                  {primary ? <Btn href={primary.href}>{primary.label}</Btn> : null}
                  {secondary ? (
                    <Btn href={secondary.href} variant="ghost">
                      {secondary.label}
                    </Btn>
                  ) : null}
                </div>
              ) : null}
            </Reveal>
          </div>
        ) : null}
        {facts?.length ? (
          <Reveal as="div" stagger={0.08}>
            <dl className="facts">
              {facts.map((f) => (
                <div className="fact" key={f.label}>
                  <dt className="label">{f.label}</dt>
                  <dd>{f.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        ) : null}
        {jumpLinks?.length ? (
          <nav aria-label="On this page" className="jump">
            {jumpLinks.map((j) => (
              <a key={j.href} href={j.href} className="chip chip--card chip--sm">
                {j.label}
              </a>
            ))}
          </nav>
        ) : null}
      </div>
    </section>
  );
}
