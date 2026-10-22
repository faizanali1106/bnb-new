"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { lenisRef } from "@/lib/lenis";

/** Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger stays in sync. */
export default function SmoothScroll() {
  useEffect(() => {
    // Every page starts at the top; the page cover handles the reveal.
    history.scrollRestoration = "manual";
    if (prefersReducedMotion()) return;
    const lenis = new Lenis({ lerp: 0.1, anchors: { offset: -100 } });
    lenisRef.current = lenis;
    if (process.env.NODE_ENV === "development") Object.assign(window, { lenis });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);
  return null;
}
