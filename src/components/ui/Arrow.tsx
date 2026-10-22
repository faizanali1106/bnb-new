import { ArrowUpRight } from "./icons";

type Props = { variant?: "accent" | "white" | "soft"; size?: "md" | "lg" | "xl"; className?: string };

/** Square arrow box. A dark fill sweeps in and the arrow swaps on hover of any `.hover-arrow` ancestor. */
export default function Arrow({ variant = "accent", size = "md", className = "" }: Props) {
  const cls = ["arrow", variant !== "accent" && `arrow--${variant}`, size !== "md" && `arrow--${size}`, className]
    .filter(Boolean)
    .join(" ");
  return (
    <span className={cls} aria-hidden>
      <span className="arrow__bg" />
      <span className="arrow__box">
        <ArrowUpRight />
        <ArrowUpRight />
      </span>
    </span>
  );
}
