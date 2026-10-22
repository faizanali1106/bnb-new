import Arrow from "./Arrow";
import TLink from "./TLink";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: "accent" | "white" | "tile" | "ghost" | "dark";
  size?: "md" | "sm";
  className?: string;
  external?: boolean;
};

export default function Btn({ href, children, variant = "accent", size = "md", className = "", external }: Props) {
  const arrow = variant === "accent" || variant === "dark" ? "white" : "accent";
  const cls = `btn btn--${variant}${size === "sm" ? " btn--sm" : ""} hover-arrow ${className}`;
  const inner = (
    <>
      <span className="btn__bg" />
      <span>{children}</span>
      <Arrow variant={arrow} />
    </>
  );
  if (external || /^(https?:|mailto:|tel:|#)/.test(href)) {
    return (
      <a href={href} className={cls} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {inner}
      </a>
    );
  }
  return (
    <TLink href={href} className={cls}>
      {inner}
    </TLink>
  );
}

/** Button-styled <button> for forms and tabs. */
export function ActionBtn({
  children,
  variant = "accent",
  className = "",
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Props["variant"] }) {
  const arrow = variant === "accent" || variant === "dark" ? "white" : "accent";
  return (
    <button className={`btn btn--${variant} hover-arrow ${className}`} {...rest}>
      <span className="btn__bg" />
      <span>{children}</span>
      <Arrow variant={arrow} />
    </button>
  );
}
