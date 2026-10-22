"use client";

import { useRef, useState } from "react";
import { offers } from "@/data/site";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { useIsoLayoutEffect } from "@/lib/useIsoLayoutEffect";
import { Checks } from "../blocks/Section";
import Btn from "../ui/Btn";
import Pixels from "../ui/Pixels";
import Reveal from "../ui/Reveal";
import SplitText from "../ui/SplitText";

/** The offer ladder as a sticky MacBook + scrolling cards (Discovery → Pilot → Pod). */
export default function OfferSteps() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useIsoLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".x-card").forEach((card, i) =>
        ScrollTrigger.create({
          trigger: card,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => self.isActive && setActive(i),
        }),
      );
      if (!prefersReducedMotion()) {
        gsap.fromTo(
          ".laptop",
          { rotate: -5, y: 40 },
          { rotate: 3, y: -40, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 1 } },
        );
      }
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <div className="ladder" ref={root}>
      <div className="ladder__sticky">
        <Pixels pattern="00b3/0320/0000/0000" />
        <Pixels className="pixels--b" pattern="0000/3000/2a00/0300" />
        <div className="laptop" aria-hidden>
          <div className="laptop__lid">
            <span className="laptop__camera" />
            <div className="laptop__screen">
              <div className="device__bar">
                <i />
                <i />
                <i />
                <span>app.bitandbytes.net</span>
              </div>
              <WorkshopView hidden={active !== 0} />
              <PilotView hidden={active !== 1} />
              <PodView hidden={active !== 2} />
            </div>
          </div>
          <div className="laptop__base">
            <span className="laptop__notch" />
          </div>
        </div>
      </div>

      <div className="ladder__cards">
        {offers.map((o) => (
          <article className="x-card" key={o.slug}>
            <div className="x-card__top">
              <span className="tag">{o.step}</span>
              <span className="label">{o.duration}</span>
            </div>
            <SplitText as="h3" className="h4" text={o.name} />
            <SplitText as="p" className="x-card__sub serif" text={o.tagline} stagger={0.02} />
            <Reveal>
              <p className="p-m x-card__lead">{o.intro}</p>
            </Reveal>
            <h4 className="x-card__h">What you get</h4>
            <Reveal stagger={0.06} y={20}>
              <Checks items={o.youGet.slice(0, 4)} />
            </Reveal>
            <div className="x-card__cta">
              <Btn href={`/offers/${o.slug}`}>{o.cta}</Btn>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function WorkshopView({ hidden }: { hidden: boolean }) {
  const rows = [
    ["Call triage agent", 92],
    ["Invoice capture", 74],
    ["Lead follow-up", 61],
    ["Knowledge assistant", 48],
  ] as const;
  return (
    <div className={`device__view${hidden ? " is-hidden" : ""}`}>
      <div className="device__sub">Discovery · Day 1</div>
      <div className="device__title">Use-case map</div>
      <div className="device__cols">
        <div className="device__stack">
          {rows.map(([name, score]) => (
            <div key={name} className="device__stack" style={{ gap: "0.3rem" }}>
              <div className="device__row device__row--flat">
                {name}
                <i>{score}</i>
              </div>
              <div className="device__bar-track">
                <span style={{ width: `${score}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div className="device__stack">
          <div className="device__kpi">
            <b>3.4x</b>
            <span>Est. ROI</span>
          </div>
          <div className="device__kpi">
            <b>4–6 wk</b>
            <span>Pilot scope</span>
          </div>
          <div className="device__row">
            Data readiness
            <i>OK</i>
          </div>
        </div>
      </div>
    </div>
  );
}

function PilotView({ hidden }: { hidden: boolean }) {
  return (
    <div className={`device__view${hidden ? " is-hidden" : ""}`}>
      <div className="device__sub">AI Pilot · Week 5</div>
      <div className="device__title">KPI vs baseline</div>
      <div className="device__kpis">
        {[
          ["96%", "Quality"],
          ["1.2s", "Latency"],
          ["$0.04", "Cost / run"],
          ["212", "Edge cases"],
        ].map(([v, l]) => (
          <div className="device__kpi" key={l}>
            <b>{v}</b>
            <span>{l}</span>
          </div>
        ))}
      </div>
      <div className="device__chart">
        {[38, 52, 46, 64, 58, 72, 80, 76, 90, 84, 94, 98].map((h, i) => (
          <span key={i} style={{ height: `${h}%` }} />
        ))}
      </div>
      <div className="device__row">
        Decision gate
        <i>GO</i>
      </div>
    </div>
  );
}

function PodView({ hidden }: { hidden: boolean }) {
  const agents = [
    ["AI receptionist", "Live"],
    ["Call screening", "Live"],
    ["Booking agent", "Live"],
    ["Doc extraction", "Pilot"],
  ] as const;
  return (
    <div className={`device__view${hidden ? " is-hidden" : ""}`}>
      <div className="device__sub">AI Pod · Monthly report</div>
      <div className="device__title">Agents in production</div>
      <div className="device__cols">
        <div className="device__stack">
          {agents.map(([name, st]) => (
            <div className="device__row" key={name}>
              {name}
              <i style={st === "Pilot" ? { background: "#26b1ce" } : undefined}>{st}</i>
            </div>
          ))}
        </div>
        <div className="device__chart">
          {[60, 62, 58, 66, 70, 68, 74, 78].map((h, i) => (
            <span key={i} style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}
