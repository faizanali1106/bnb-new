"use client";

import { Fragment, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { onPageReady } from "@/lib/pageReady";
import { useIsoLayoutEffect } from "@/lib/useIsoLayoutEffect";

type Props = {
  text: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "div" | "span";
  className?: string;
  /** "load" plays once the page cover lifts; "scroll" plays when scrolled into view. */
  trigger?: "load" | "scroll";
  delay?: number;
  stagger?: number;
};

/** Splits text into masked words that rise into place. Wrap words in *asterisks* to set them in the serif italic. */
export default function SplitText({ text, as = "div", className, trigger = "scroll", delay = 0, stagger = 0.035 }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const words = el.querySelectorAll(".sw__i");
    const from = { y: 0, yPercent: 115, rotate: 3 };
    const to = { y: 0, yPercent: 0, rotate: 0, duration: 1.15, ease: "expo.out", stagger, delay };
    const ctx = gsap.context(() => {
      if (trigger === "scroll") {
        gsap.fromTo(words, from, { ...to, scrollTrigger: { trigger: el, start: "top 90%", once: true } });
      } else {
        gsap.set(words, from);
      }
    });
    const off = trigger === "load" ? onPageReady(() => ctx.add(() => gsap.fromTo(words, from, to))) : undefined;
    return () => {
      off?.();
      ctx.revert();
    };
  }, [trigger, delay, stagger]);

  // Flatten into words, remembering which ones sit inside *serif* markers and
  // which ones touch the previous word (e.g. punctuation right after an accent).
  const tokens: { word: string; serif: boolean; glue: boolean }[] = [];
  const parts = text.split(/(\*[^*]+\*)/g).filter(Boolean);
  parts.forEach((part, pi) => {
    const serif = part.startsWith("*") && part.endsWith("*");
    const body = serif ? part.slice(1, -1) : part;
    const prev = parts[pi - 1];
    const touches = pi > 0 && !/^\s/.test(body) && !/\s$/.test(prev ?? "");
    body
      .split(/\s+/)
      .filter(Boolean)
      .forEach((word, wi) => tokens.push({ word, serif, glue: wi === 0 && touches }));
  });

  const children = tokens.map(({ word, serif }, i) => (
    <Fragment key={i}>
      <span className="sw">
        <span className={`sw__i${serif ? " serif" : ""}`}>{word}</span>
      </span>
      {i < tokens.length - 1 && !tokens[i + 1].glue ? " " : ""}
    </Fragment>
  ));

  const Tag = as as "div";
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
