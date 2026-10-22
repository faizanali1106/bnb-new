"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useIsoLayoutEffect } from "@/lib/useIsoLayoutEffect";

type Person = { name: string; role: string; photo: string };

// Resting pose for the card at depth i (0 = top of the deck).
const pose = (i: number) => ({
  x: `${i * 7}%`,
  y: `${i * -3}%`,
  rotate: i === 0 ? 0 : i % 2 ? i * 3.5 : i * -3,
  scale: 1 - i * 0.06,
  opacity: i > 3 ? 0 : 1,
  zIndex: 50 - i,
});

/** Deck of team cards: the top card flips to the back every few seconds; hover fans them out. */
export default function FooterDeck({ people }: { people: Person[] }) {
  const root = useRef<HTMLSpanElement>(null);

  useIsoLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const cards = gsap.utils.toArray<HTMLElement>(".deck__card", el);
    let order = cards.map((_, i) => i);
    const place = (duration: number) =>
      order.forEach((cardIdx, depth) => gsap.to(cards[cardIdx], { ...pose(depth), duration, ease: "expo.out", overwrite: "auto" }));

    const ctx = gsap.context(() => {
      order.forEach((cardIdx, depth) => gsap.set(cards[cardIdx], pose(depth)));
    }, el);
    if (prefersReducedMotion() || cards.length < 2) return () => ctx.revert();

    let fanned = false;
    const cycle = () => {
      if (fanned) return;
      const top = cards[order[0]];
      order = [...order.slice(1), order[0]];
      ctx.add(() => {
        gsap
          .timeline()
          .to(top, { x: "14%", y: "-95%", rotate: 14, opacity: 0, duration: 0.5, ease: "power3.in" })
          .set(top, { zIndex: 0 })
          .add(() => (fanned ? spread() : place(0.9)));
      });
    };
    const timer = window.setInterval(cycle, 2400);

    // Fan the deck out while the CTA is hovered.
    const trigger = el.closest(".footer__words") ?? el;
    const spread = () => {
      const visible = order.slice(0, 5);
      const mid = (visible.length - 1) / 2;
      visible.forEach((cardIdx, i) =>
        gsap.to(cards[cardIdx], {
          x: `${(i - mid) * 17}%`,
          y: `${Math.abs(i - mid) * 5 - 4}%`,
          rotate: (i - mid) * 9,
          scale: 0.92,
          opacity: 1,
          zIndex: 50 - Math.round(Math.abs(i - mid) * 2),
          duration: 0.7,
          ease: "back.out(1.6)",
          overwrite: "auto",
        }),
      );
    };
    const fan = () => {
      fanned = true;
      trigger.classList.add("is-fanned");
      spread();
    };
    const unfan = () => {
      fanned = false;
      trigger.classList.remove("is-fanned");
      place(0.7);
    };
    trigger.addEventListener("mouseenter", fan);
    trigger.addEventListener("mouseleave", unfan);

    return () => {
      window.clearInterval(timer);
      trigger.removeEventListener("mouseenter", fan);
      trigger.removeEventListener("mouseleave", unfan);
      ctx.revert();
    };
  }, [people.length]);

  return (
    <span className="deck" ref={root}>
      {people.map((p) => (
        <span className="deck__card" key={p.name}>
          <Image src={p.photo} alt={p.name} fill sizes="17rem" />
          <span className="deck__name">
            <b>{p.name}</b>
            <span>{p.role}</span>
          </span>
        </span>
      ))}
    </span>
  );
}
