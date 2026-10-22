"use client";

import { useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useIsoLayoutEffect } from "@/lib/useIsoLayoutEffect";

type Props = {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "ul" | "section" | "p";
  /** Animate direct children one after another instead of the wrapper as a whole. */
  stagger?: number;
  y?: number;
};

/** Fades and lifts content into view on scroll. */
export default function Reveal({ children, className, as = "div", stagger, y = 40 }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const targets = stagger ? Array.from(el.children) : el;
    const ctx = gsap.context(() => {
      gsap.fromTo(targets, { y, opacity: 0 }, {
        y: 0,
        opacity: 1,
        duration: 1.1,
        ease: "expo.out",
        stagger: stagger ?? 0,
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
    });
    return () => ctx.revert();
  }, [stagger, y]);

  const Tag = as as "div";
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
