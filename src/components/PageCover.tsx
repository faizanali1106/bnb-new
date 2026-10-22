"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { lenisRef } from "@/lib/lenis";
import { setPageReady } from "@/lib/pageReady";

/** Scroll to the URL hash target (or the top) after a navigation. */
function restoreScroll() {
  const hash = decodeURIComponent(window.location.hash.slice(1));
  const target = hash ? document.getElementById(hash) : null;
  if (target) {
    if (lenisRef.current) lenisRef.current.scrollTo(target, { offset: -100, immediate: true, force: true });
    else target.scrollIntoView();
    return;
  }
  lenisRef.current?.scrollTo(0, { immediate: true, force: true });
  window.scrollTo(0, 0);
}

/**
 * Dark rounded panel that lifts away on first load and after each route change,
 * and slides up to cover the screen before navigating (see <TLink />).
 */
export default function PageCover() {
  const ref = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const first = useRef(true);

  // Reveal: runs on mount and whenever the route changes.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    restoreScroll();

    if (prefersReducedMotion()) {
      gsap.set(el, { autoAlpha: 0 });
      setPageReady(true);
      return;
    }

    const isFirst = first.current;
    first.current = false;
    const tl = gsap.timeline();
    tl.set(el, { autoAlpha: 1, yPercent: 0, borderRadius: "0rem 0rem 0rem 0rem" });
    if (isFirst) {
      tl.fromTo(markRef.current, { scale: 0.4, rotate: -45, opacity: 0 }, { scale: 1, rotate: 0, opacity: 1, duration: 0.7, ease: "back.out(2)" });
    }
    tl.to(markRef.current, { opacity: 0, y: -20, duration: 0.3, ease: "power2.in" }, isFirst ? "+=0.15" : 0)
      .to(el, { yPercent: -100, borderRadius: "0rem 0rem 4rem 4rem", duration: 1.05, ease: "expo.inOut" }, "<")
      .call(() => setPageReady(true), [], "-=0.6")
      .set(el, { autoAlpha: 0 })
      .call(() => {
        ScrollTrigger.refresh();
        if (window.location.hash) restoreScroll();
      });
    return () => {
      tl.kill();
    };
  }, [pathname]);

  // Cover: triggered by <TLink /> clicks.
  useEffect(() => {
    const onLeave = (e: Event) => {
      const href = (e as CustomEvent<string>).detail;
      const el = ref.current;
      setPageReady(false);
      if (!el || prefersReducedMotion()) {
        router.push(href, { scroll: false });
        return;
      }
      gsap.set(markRef.current, { opacity: 0, y: 0 });
      gsap.fromTo(
        el,
        { autoAlpha: 1, yPercent: 100, borderRadius: "4rem 4rem 0rem 0rem" },
        {
          yPercent: 0,
          borderRadius: "0rem 0rem 0rem 0rem",
          duration: 0.85,
          ease: "expo.inOut",
          onComplete: () => router.push(href, { scroll: false }),
        },
      );
    };
    window.addEventListener("page:leave", onLeave);
    return () => window.removeEventListener("page:leave", onLeave);
  }, [router]);

  return (
    <div ref={ref} className="page-cover" aria-hidden>
      <div ref={markRef}>
        <Image src="/brand/bnb-icon.png" alt="" width={96} height={91} className="page-cover__mark" priority />
      </div>
    </div>
  );
}
