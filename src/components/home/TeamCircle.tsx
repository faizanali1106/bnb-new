"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useIsoLayoutEffect } from "@/lib/useIsoLayoutEffect";
import Btn from "../ui/Btn";
import Eyebrow from "../ui/Eyebrow";
import Pixels from "../ui/Pixels";
import Reveal from "../ui/Reveal";
import SplitText from "../ui/SplitText";

// Four tags on the top arc, four on the bottom; the sides stay clear for the words.
const ANGLES = [-135, -105, -75, -45, 45, 75, 105, 135];
const RADIUS = 46; // % of the circle box

type Person = { name: string; photo: string };

/** "Senior builders" ring: models and stack orbit three team portraits. */
export default function TeamCircle({ tags, people }: { tags: string[]; people: Person[] }) {
  const root = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const scrub = { trigger: ".circle", start: "top bottom", end: "bottom top", scrub: 1 };
      gsap.fromTo(".circle__ring", { rotate: -14 }, { rotate: 14, ease: "none", scrollTrigger: scrub });
      gsap.fromTo(".portrait--l", { rotate: -2, xPercent: -10 }, { rotate: -12, xPercent: -62, ease: "none", scrollTrigger: scrub });
      gsap.fromTo(".portrait--r", { rotate: 2, xPercent: 10 }, { rotate: 12, xPercent: 62, ease: "none", scrollTrigger: scrub });
      gsap.from(".circle__tag", {
        scale: 0,
        rotate: "+=40",
        duration: 1,
        ease: "back.out(1.8)",
        stagger: { each: 0.06, from: "center" },
        scrollTrigger: { trigger: ".circle", start: "top 75%", once: true },
      });
      gsap.from(".circle__word", {
        opacity: 0,
        x: (i) => (i === 0 ? -60 : 60),
        duration: 1.2,
        ease: "expo.out",
        scrollTrigger: { trigger: ".circle", start: "top 60%", once: true },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  const [c, l, r] = people;

  return (
    <section className="section" ref={root} id="team">
      <div className="container">
        <Eyebrow>Why Bit &amp; Bytes</Eyebrow>
        <SplitText as="h2" className="h2 team-sec__title" text="Senior builders on *every* call" />
        <div className="team-sec__text">
          <Pixels pattern="00b3/0330/3300/2000" />
          <Reveal>
            <p className="p-m soft">
              The engineers who scope your project are the ones who build it. No hand-off to a junior bench, and every phase ends
              with a Go / Adjust / Stop decision on numbers agreed up front.
            </p>
          </Reveal>
        </div>

        <div className="circle-row">
          <div className="circle">
            <div className="circle__ring">
              {tags.slice(0, 8).map((tag, i) => {
                const a = (ANGLES[i] * Math.PI) / 180;
                const style = {
                  left: `${50 + RADIUS * Math.cos(a)}%`,
                  top: `${50 + RADIUS * Math.sin(a)}%`,
                  // Tangent to the ring, flipped on the lower arc so labels stay upright.
                  transform: `rotate(${ANGLES[i] < 0 ? ANGLES[i] + 90 : ANGLES[i] - 90}deg)`,
                };
                return (
                  <div className="circle__tag" key={tag} style={style}>
                    <span>{tag}</span>
                  </div>
                );
              })}
            </div>

            <div className="circle__center">
              <div className="circle__word circle__word--l">
                <span className="serif">Senior</span>
              </div>
              <div className="portraits">
                {l ? (
                  <div className="portrait portrait--l">
                    <Image src={l.photo} alt={l.name} fill sizes="14rem" />
                  </div>
                ) : null}
                {r ? (
                  <div className="portrait portrait--r">
                    <Image src={r.photo} alt={r.name} fill sizes="14rem" />
                  </div>
                ) : null}
                {c ? (
                  <div className="portrait portrait--c">
                    <Image src={c.photo} alt={c.name} fill sizes="14rem" />
                  </div>
                ) : null}
                <div className="portraits__cta">
                  <Btn href="/company/team" variant="white" size="sm">
                    Meet the team
                  </Btn>
                </div>
              </div>
              <div className="circle__word circle__word--r">Builders</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
