"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/gsap";

const LEVELS = [0, 0.3, 0.6, 1];

/**
 * Grid of brand squares that softly twinkle. `pattern` rows are separated by "/";
 * digits 0-3 are purple opacity levels, letters a-c are cyan levels.
 */
export default function Pixels({ pattern, className = "" }: { pattern: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const raw = pattern.replace(/\//g, "").split("");
  const cells = raw.map((ch) => (/[a-c]/.test(ch) ? ch.charCodeAt(0) - 96 : Number(ch)));

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const nodes = Array.from(el.children) as HTMLElement[];
    const lit = nodes.map((_, i) => i).filter((i) => cells[i] > 0);
    const id = window.setInterval(() => {
      const i = lit[Math.floor(Math.random() * lit.length)];
      const node = nodes[i];
      if (!node) return;
      node.style.opacity = String(LEVELS[1 + Math.floor(Math.random() * 3)]);
      // Occasionally light a neighbour for a shimmering edge.
      const n = nodes[i + (Math.random() > 0.5 ? 1 : -1)];
      if (n && cells[nodes.indexOf(n)] === 0) {
        n.style.opacity = "0.3";
        window.setTimeout(() => (n.style.opacity = "0"), 700);
      }
    }, 420);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pattern]);

  return (
    <div ref={ref} className={`pixels ${className}`} aria-hidden>
      {cells.map((lvl, i) => (
        <i key={i} data-c={/[a-c]/.test(raw[i]) ? 2 : undefined} style={{ opacity: LEVELS[lvl] }} />
      ))}
    </div>
  );
}
