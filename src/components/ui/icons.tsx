import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

export const ArrowUpRight = (p: P) => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="square" {...p}>
    <path d="M4 12 12 4M5.5 4H12v6.5" />
  </svg>
);

export const ArrowRight = (p: P) => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="square" {...p}>
    <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" />
  </svg>
);

export const ArrowLeft = (p: P) => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="square" {...p}>
    <path d="M13.5 8h-11M7 3.5 2.5 8 7 12.5" />
  </svg>
);

export const Chevron = (p: P) => (
  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={1.5} {...p}>
    <path d="m2.5 4.5 3.5 3.5 3.5-3.5" />
  </svg>
);

export const Plus = (p: P) => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
    <path d="M8 2v12M2 8h12" />
  </svg>
);

export const Minus = (p: P) => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
    <path d="M2 8h12" />
  </svg>
);

export const Moon = (p: P) => (
  <svg viewBox="0 0 16 16" fill="currentColor" {...p}>
    <path d="M13.6 10.2A6 6 0 0 1 5.8 2.4a6 6 0 1 0 7.8 7.8Z" />
  </svg>
);

export const Sun = (p: P) => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.6} {...p}>
    <circle cx="8" cy="8" r="3" fill="currentColor" />
    <path d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3 3l1 1M12 12l1 1M3 13l1-1M12 4l1-1" />
  </svg>
);

export const Instagram = (p: P) => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5} {...p}>
    <rect x="2" y="2" width="12" height="12" rx="3.5" />
    <circle cx="8" cy="8" r="2.8" />
    <circle cx="11.6" cy="4.4" r="0.6" fill="currentColor" stroke="none" />
  </svg>
);

export const LinkedIn = (p: P) => (
  <svg viewBox="0 0 16 16" fill="currentColor" {...p}>
    <path d="M2.2 5.6h2.6V14H2.2zM3.5 1.8a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM6.4 5.6h2.5v1.2c.4-.7 1.3-1.4 2.6-1.4 2.7 0 3.2 1.8 3.2 4.1V14h-2.6v-4c0-1 0-2.2-1.4-2.2s-1.6 1-1.6 2.1V14H6.4z" />
  </svg>
);

/** Small brand glyph: the Bit & Bytes diamond with a circuit trace. */
export const BitMark = (p: P) => (
  <svg viewBox="0 0 16 16" fill="currentColor" {...p}>
    <path d="M8.6 1.4a1.2 1.2 0 0 1 1.7 0l4.3 4.3a1.2 1.2 0 0 1 0 1.7L10.3 11.7a1.2 1.2 0 0 1-1.7 0L4.3 7.4a1.2 1.2 0 0 1 0-1.7Z" />
    <rect x="0.5" y="12.4" width="8" height="1.6" rx="0.8" />
    <circle cx="1.3" cy="13.2" r="1.3" />
  </svg>
);
