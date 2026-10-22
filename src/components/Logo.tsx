import Image from "next/image";
import TLink from "./ui/TLink";

/** Bit & Bytes icon + wordmark (wordmark set in Unica One so it follows the theme colour). */
export default function Logo({ className = "" }: { className?: string }) {
  return (
    <TLink href="/" className={`logo ${className}`} aria-label="Bit & Bytes home">
      <Image src="/brand/bnb-icon.png" alt="" width={44} height={42} priority />
      <span className="logo__word">Bit and Bytes</span>
    </TLink>
  );
}
