"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useSyncExternalStore } from "react";

/** Embla carousel with prev/next state for external arrow buttons. */
export function useCarousel() {
  const [viewportRef, api] = useEmblaCarousel({ align: "start", containScroll: "trimSnaps", dragFree: false });

  const subscribe = useCallback(
    (cb: () => void) => {
      api?.on("select", cb).on("reInit", cb).on("init", cb);
      return () => {
        api?.off("select", cb).off("reInit", cb).off("init", cb);
      };
    },
    [api],
  );
  const state = useSyncExternalStore(
    subscribe,
    () => (api ? `${+api.canScrollPrev()}${+api.canScrollNext()}` : "01"),
    () => "01",
  );

  return {
    viewportRef,
    arrows: {
      canPrev: state[0] === "1",
      canNext: state[1] === "1",
      prev: () => api?.scrollPrev(),
      next: () => api?.scrollNext(),
    },
  };
}
