"use client";

import { useRef } from "react";
import type { Phase } from "@/data/services";
import { processSteps } from "@/data/site";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useIsoLayoutEffect } from "@/lib/useIsoLayoutEffect";

/** Four-phase timeline; the gradient line fills as you scroll through it. */
export function ProcessSteps({ phases }: { phases?: Phase[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const steps = phases
    ? phases.map((p, i) => ({ step: String(i + 1).padStart(2, "0"), name: p.name, duration: p.duration, desc: p.deliverable }))
    : processSteps;

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.to(".steps__line span", {
        scaleX: 1,
        scaleY: 1,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 55%", scrub: 1 },
      });
      gsap.fromTo(
        ".step",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "expo.out", stagger: 0.12, scrollTrigger: { trigger: el, start: "top 85%", once: true } },
      );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <div className="steps" ref={ref}>
      <div className="steps__line">
        <span />
      </div>
      {steps.map((s) => (
        <div className="step tile" key={s.step}>
          <div className="step__top">
            <span className="step__n">{s.step}</span>
            <span className="tag">{s.duration}</span>
          </div>
          <h3 className="h5 tile__h">{s.name}</h3>
          <p className="p-s tile__p">{s.desc}</p>
        </div>
      ))}
    </div>
  );
}
