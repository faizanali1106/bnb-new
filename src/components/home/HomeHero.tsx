"use client";

import { Activity, Bot, CheckCircle2, PhoneCall, ShieldCheck } from "lucide-react";
import { useRef } from "react";
import { primaryCta, workCta } from "@/data/site";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { onPageReady } from "@/lib/pageReady";
import { useIsoLayoutEffect } from "@/lib/useIsoLayoutEffect";
import CircuitMark from "../art/CircuitMark";
import Arrow from "../ui/Arrow";
import Btn from "../ui/Btn";
import Eyebrow from "../ui/Eyebrow";
import Pixels from "../ui/Pixels";
import SplitText from "../ui/SplitText";
import TLink from "../ui/TLink";

const agents = [
  { name: "AI receptionist", channel: "Voice", status: "Live", icon: PhoneCall },
  { name: "Call screening", channel: "Voice", status: "Live", icon: ShieldCheck },
  { name: "Lead follow-up agent", channel: "Email · CRM", status: "Pilot", icon: Bot },
];
const gates = ["Quality", "Speed", "Cost per run", "Edge cases"];
const proof = ["AI Pilot in 4–6 weeks", "Voice AI & HIPAA proof", "You own all code"];

export default function HomeHero() {
  const root = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.set(".cm__line", { strokeDasharray: 1, strokeDashoffset: 1 });
      gsap.set(".cm__dot", { scale: 0, transformOrigin: "50% 50%" });
      gsap.set(".cm__packet", { opacity: 0 });
      gsap.set(".cm__cap", { scaleX: 0, transformOrigin: "0% 50%" });
      gsap.set(".cm__diamond", { scale: 0.6, rotate: -25, opacity: 0, transformOrigin: "66% 50%" });
      gsap.set([".hero__eyebrow", ".hero__info", ".hero__proof > *", ".agents-card"], { opacity: 0, y: 30 });

      // Scroll: the mark drifts and turns, traces stretch out.
      gsap
        .timeline({ scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: 1 } })
        .to(".hero__art svg", { yPercent: -12, ease: "none" }, 0)
        .to(".cm__diamond", { rotate: 14, ease: "none" }, 0)
        .to(".cm__traces", { x: -60, ease: "none" }, 0)
        .to(".agents-card", { yPercent: -45, ease: "none" }, 0);
    }, el);

    const off = onPageReady(() =>
      ctx.add(() => {
        gsap
          .timeline({ defaults: { ease: "expo.out" } })
          .to(".hero__eyebrow", { opacity: 1, y: 0, duration: 1 }, 0)
          .to(".hero__info", { opacity: 1, y: 0, duration: 1.2 }, 0.45)
          .to(".hero__proof > *", { opacity: 1, y: 0, duration: 1, stagger: 0.08 }, 0.6)
          .to(".cm__diamond", { scale: 1, rotate: 0, opacity: 1, duration: 1.8, ease: "elastic.out(1, 0.7)" }, 0.15)
          .to(".cm__line", { strokeDashoffset: 0, duration: 1.4, stagger: 0.08, ease: "power3.inOut" }, 0.35)
          .to(".cm__dot", { scale: 1, duration: 0.8, stagger: 0.08, ease: "back.out(2.5)" }, 0.35)
          .to(".cm__cap", { scaleX: 1, duration: 1.2, stagger: 0.12, ease: "power4.out" }, 0.9)
          .to(".agents-card", { opacity: 1, y: 0, duration: 1.2 }, 0.9)
          .add(() => {
            // Data packets travel along the traces forever.
            gsap.utils.toArray<SVGCircleElement>(".cm__packet").forEach((p, i) => {
              const line = p.parentElement?.querySelector(".cm__line");
              const d = line?.getAttribute("d") ?? "";
              const [, x1, , x2] = /M(\d+) (\d+) H(\d+)/.exec(d) ?? [];
              const dist = Number(x2) - Number(x1);
              gsap.fromTo(
                p,
                { x: 0, opacity: 0 },
                {
                  keyframes: [
                    { opacity: 1, duration: 0.15 },
                    { x: dist, duration: 1.2, ease: "power1.inOut" },
                    { opacity: 0, duration: 0.15 },
                  ],
                  repeat: -1,
                  repeatDelay: 1.2 + i * 0.35,
                  delay: i * 0.4,
                },
              );
            });
          }, 1.6);
      }),
    );
    return () => {
      off();
      ctx.revert();
    };
  }, []);

  return (
    <section className="hero" ref={root}>
      <div className="container">
        <Eyebrow className="hero__eyebrow">AI product &amp; automation partner for startups and SMBs</Eyebrow>
        <SplitText
          as="h1"
          className="h-hero hero__title"
          text="AI agents, voice AI and software that reach *production*"
          trigger="load"
          stagger={0.04}
        />
        <div className="hero__info">
          <p className="p-l soft">
            Built by a senior team for US and UK startups, SMBs and regulated industries, with short pilots, clear decision gates
            and a direct path from first call to production.
          </p>
          <div className="btn-row">
            <Btn href={primaryCta.href}>{primaryCta.label}</Btn>
            <Btn href={workCta.href} variant="ghost">
              {workCta.label}
            </Btn>
          </div>
        </div>
        <div className="hero__proof">
          {proof.map((p) => (
            <span key={p} className="chip chip--card">
              <CheckCircle2 size="1.1em" className="accent" /> {p}
            </span>
          ))}
        </div>
      </div>

      <div className="hero__art">
        <CircuitMark />
      </div>

      <TLink href="/work/fuzebox-agent-ops" className="agents-card hover-arrow" aria-label="See the agent operations case study">
        <span className="agents-card__bg" />
        <div className="agents-card__head">
          <span>
            <Activity /> Agents in production
          </span>
          <span className="agents-card__monitored">
            <span className="live-dot" /> monitored
          </span>
        </div>
        {agents.map((a) => (
          <div className="agent-row" key={a.name}>
            <span className="agent-row__icon">
              <a.icon />
            </span>
            <span>
              <span className="agent-row__name">{a.name}</span>
              <span className="agent-row__ch" style={{ display: "block" }}>
                {a.channel}
              </span>
            </span>
            <span className={`status status--${a.status === "Live" ? "live" : "pilot"}`}>{a.status}</span>
          </div>
        ))}
        <div className="agents-card__gates">
          <div className="label">Pilot decision gate</div>
          <ul>
            {gates.map((g) => (
              <li key={g}>
                <CheckCircle2 /> {g}
              </li>
            ))}
          </ul>
        </div>
        <div className="agents-card__foot">
          Go / Adjust / Stop → production
          <Arrow />
        </div>
      </TLink>

      <Pixels className="pixels--hero" pattern="0000/00b3/2300/01a0" />
    </section>
  );
}
