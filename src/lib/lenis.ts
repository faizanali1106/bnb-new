import type Lenis from "lenis";

// Shared handle to the Lenis instance created in <SmoothScroll />.
export const lenisRef: { current: Lenis | null } = { current: null };
