"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";

type Props = ComponentProps<typeof Link> & { href: string };

/** Internal link that plays the page-cover transition before navigating to another page. */
export default function TLink({ href, onClick, ...rest }: Props) {
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    if (!href.startsWith("/")) return;
    const target = new URL(href, window.location.href);
    // Same page (only the hash or query differs): let Next/Lenis handle it without the cover.
    if (target.pathname === window.location.pathname) return;
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("page:leave", { detail: href }));
  };

  return <Link href={href} onClick={handle} {...rest} />;
}
