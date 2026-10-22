import Image from "next/image";
import { logosForNames } from "@/data/companies";
import { industries } from "@/data/industries";
import { liveServices, serviceGroups, serviceHref, type ServiceGroup } from "@/data/services";
import { engagementModels, models, offers, products, stack, whyPoints } from "@/data/site";
import type { CaseStudy } from "@/data/work";
import Arrow from "../ui/Arrow";
import Glyph from "../ui/Glyph";
import Reveal from "../ui/Reveal";
import TLink from "../ui/TLink";
import { Checks } from "./Section";

/* ------------------------------------------------------------------------ */
/* Case studies                                                              */
/* ------------------------------------------------------------------------ */

export function CaseCard({ study }: { study: CaseStudy }) {
  const logo = logosForNames([study.client])[0];
  const stats = study.metrics.slice(0, 2);
  return (
    <TLink href={`/work/${study.slug}`} className="case-card hover-arrow" draggable={false}>
      <span className="case-card__bg" />
      <div className="case-card__media">
        {study.image ? (
          <Image src={study.image} alt={study.client} fill sizes="(min-width: 992px) 30vw, 90vw" />
        ) : (
          <span className="case-card__placeholder">{study.client}</span>
        )}
        {logo ? (
          <span className="case-card__logo">
            <Image src={logo.black} alt={`${study.client} logo`} fill sizes="9rem" />
          </span>
        ) : null}
      </div>
      <div className="case-card__body">
        <div className="label">
          {study.client} · {study.industry}
        </div>
        <h3 className="h5 case-card__hl">{study.highlight}</h3>
        <p className="p-s case-card__text">{study.headline}</p>
        {stats.length === 2 ? (
          <div className="case-card__end">
            {stats.map((s) => (
              <div className="stat" key={s.label}>
                <b>{s.value}</b>
                <span>{s.label}</span>
              </div>
            ))}
            <Arrow size="xl" />
          </div>
        ) : (
          <div className="case-card__end case-card__end--nostats">
            <span className="text-link">Read case study</span>
            <Arrow size="lg" />
          </div>
        )}
      </div>
    </TLink>
  );
}

export function CaseCards({ cases, cols = 4 }: { cases: CaseStudy[]; cols?: 2 | 3 | 4 }) {
  if (!cases.length) return null;
  return (
    <Reveal className={`grid grid--${cols}`} stagger={0.08} y={50}>
      {cases.map((c) => (
        <CaseCard key={c.slug} study={c} />
      ))}
    </Reveal>
  );
}

/* ------------------------------------------------------------------------ */
/* Offers, services, products                                                */
/* ------------------------------------------------------------------------ */

export function OfferLadder({ compact = false }: { compact?: boolean }) {
  return (
    <Reveal className="grid grid--3" stagger={0.1} y={50}>
      {offers.map((o) => (
        <TLink key={o.slug} href={`/offers/${o.slug}`} className="grow-tile hover-arrow">
          <span className="grow-tile__bg" />
          <div>
            <div className="grow-tile__meta" style={{ marginBottom: "2rem" }}>
              <span className="tag">{o.step}</span>
              <span className="label">{o.duration}</span>
            </div>
            <h3 className="h4 grow-tile__h" style={{ fontSize: "2.6rem", marginBottom: "0.75rem" }}>
              {o.name}
            </h3>
            <p className="p-m soft">{o.tagline}</p>
          </div>
          {!compact ? <Checks items={[o.deliverable]} /> : null}
          <div className="grow-tile__end">
            <span className="text-link">{o.cta}</span>
            <Arrow size="lg" />
          </div>
        </TLink>
      ))}
    </Reveal>
  );
}

export function ServiceGroupTiles() {
  return (
    <Reveal className="grid grid--2" stagger={0.06} y={40}>
      {serviceGroups.map((g) => (
        <TLink key={g.slug} href={`/services/${g.slug}`} className="grow-tile grow-tile--sm grow-tile--reveal hover-arrow">
          <span className="grow-tile__bg" />
          <div className="grow-tile__meta">
            <Glyph group={g.slug} className="grow-tile__icon" label={g.title} />
            <span className="label">{String(g.number).padStart(2, "0")}</span>
          </div>
          <h3 className="h5 grow-tile__h">{g.title}</h3>
          <div className="grow-tile__end">
            <p className="p-s grow-tile__text">{g.outcome}</p>
            <Arrow />
          </div>
        </TLink>
      ))}
    </Reveal>
  );
}

export function SubServiceCards({ group, exclude }: { group: ServiceGroup; exclude?: string }) {
  const items = liveServices(group).filter((s) => s.slug !== exclude);
  return (
    <Reveal className="grid grid--3" stagger={0.05} y={40}>
      {items.map((s) => (
        <TLink key={s.slug} href={serviceHref(group, s)} className="grow-tile grow-tile--sm hover-arrow">
          <span className="grow-tile__bg" />
          <div>
            <div className="grow-tile__meta" style={{ marginBottom: "1rem" }}>
              <h3 className="h6 grow-tile__h">{s.title}</h3>
              {s.hero ? <span className="tag">Core</span> : null}
            </div>
            <p className="p-s soft">{s.blurb}</p>
          </div>
          <div className="grow-tile__end" style={{ justifyContent: "flex-end" }}>
            <Arrow />
          </div>
        </TLink>
      ))}
    </Reveal>
  );
}

export function ProductsGrid() {
  return (
    <Reveal className="grid grid--3" stagger={0.1} y={40}>
      {products.map((p) => (
        <TLink key={p.name} href={p.href} className="grow-tile hover-arrow">
          <span className="grow-tile__bg" />
          <div>
            <span className="tag" style={{ marginBottom: "2rem" }}>
              {p.tag}
            </span>
            <h3 className="h4 grow-tile__h" style={{ fontSize: "2.6rem", margin: "1.5rem 0 0.75rem" }}>
              {p.name}
            </h3>
            <p className="p-s soft">{p.desc}</p>
          </div>
          <div className="grow-tile__end" style={{ justifyContent: "flex-end" }}>
            <Arrow size="lg" />
          </div>
        </TLink>
      ))}
    </Reveal>
  );
}

/* ------------------------------------------------------------------------ */
/* Lists & tiles                                                             */
/* ------------------------------------------------------------------------ */

const CheckIcon = () => (
  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M2 6.5 4.8 9 10 3" />
  </svg>
);

/** Compare-style rows (title + description). */
export function Rows({ items }: { items: { title: string; desc: string; when?: string }[] }) {
  return (
    <Reveal as="ul" className="rows" stagger={0.06} y={24}>
      {items.map((w) => (
        <li key={w.title} className="row-item">
          {w.when ? (
            <span className="row-item__when">{w.when}</span>
          ) : (
            <span className="row-item__icon">
              <CheckIcon />
            </span>
          )}
          <div>
            <div className="row-item__h">{w.title}</div>
            <p className="row-item__p">{w.desc}</p>
          </div>
        </li>
      ))}
    </Reveal>
  );
}

export function WhyRows() {
  return <Rows items={whyPoints} />;
}

/** Static info tiles in a grid. */
export function InfoTiles({
  items,
  cols = 3,
  icon,
}: {
  items: { title: string; desc: string; value?: string }[];
  cols?: 2 | 3 | 4 | 5;
  icon?: React.ReactNode;
}) {
  return (
    <Reveal className={`grid grid--${cols}`} stagger={0.07} y={40}>
      {items.map((t) => (
        <div className="tile" key={t.title}>
          {t.value ? <div className="tile__num">{t.value}</div> : null}
          {icon ? <div className="tile__icon">{icon}</div> : null}
          <h3 className="h6 tile__h">{t.title}</h3>
          {t.desc ? <p className="p-s tile__p">{t.desc}</p> : null}
        </div>
      ))}
    </Reveal>
  );
}

export function EngagementTiles() {
  return <InfoTiles items={engagementModels.map((m) => ({ title: m.name, desc: m.suits }))} />;
}

export function IndustryChips({ slugs }: { slugs?: string[] }) {
  const list = slugs ? industries.filter((i) => slugs.includes(i.slug)) : industries;
  return (
    <Reveal className="chips" stagger={0.04} y={16}>
      {list.map((i) => (
        <TLink key={i.slug} href={`/industries/${i.slug}`} className="chip chip--card">
          {i.title}
        </TLink>
      ))}
    </Reveal>
  );
}

export function StackBlock({ focus }: { focus?: string[] }) {
  const rows = [
    { label: "Models", items: models },
    { label: "Stack", items: focus?.length ? focus : stack },
  ];
  return (
    <Reveal className="grid grid--2" stagger={0.1}>
      {rows.map((r) => (
        <div className="tile tile--pad-lg" key={r.label}>
          <div className="label" style={{ marginBottom: "1.5rem" }}>
            {r.label}
          </div>
          <div className="chips">
            {r.items.map((t) => (
              <span className="chip" key={t}>
                {t}
              </span>
            ))}
          </div>
        </div>
      ))}
    </Reveal>
  );
}

/* ------------------------------------------------------------------------ */
/* Client logo marquee                                                       */
/* ------------------------------------------------------------------------ */

export function TrustStrip({ names, label = "Built for teams at" }: { names?: string[]; label?: string }) {
  const logos = logosForNames(names);
  if (!logos.length) return null;
  // Repeat short lists so the loop always spans the viewport, then double it for a seamless wrap.
  const base = Array.from({ length: Math.ceil(10 / logos.length) }, () => logos).flat();
  const track = [...base, ...base];
  const speed = names?.length && names.length < 8 ? 28 : 55;
  return (
    <div className="marquee">
      <div className="label marquee__label">{label}</div>
      <div className="marquee__viewport" style={{ "--marquee-duration": `${speed}s` } as React.CSSProperties}>
        <ul className="marquee__track" aria-label="Client logos">
          {track.map((c, i) => (
            <li key={`${c.name}-${i}`} className="marquee__logo" aria-hidden={i >= logos.length}>
              <Image src={c.black} alt={c.name} fill sizes="11rem" className="logo-light" />
              <Image src={c.white} alt="" fill sizes="11rem" className="logo-dark" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
