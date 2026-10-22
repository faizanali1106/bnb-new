"use client";

import { usePathname } from "next/navigation";

/** Hides public site chrome (nav, footer, cover, smooth scroll) inside the /admin CMS. */
export default function ChromeGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/";
  if (pathname.startsWith("/admin")) return null;
  return <>{children}</>;
}
