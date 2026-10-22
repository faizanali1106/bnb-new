import Btn from "../ui/Btn";
import Eyebrow from "../ui/Eyebrow";
import Pixels from "../ui/Pixels";
import Reveal from "../ui/Reveal";
import SplitText from "../ui/SplitText";

type Tone = "plain" | "panel" | "dark";

/** Page section. `panel` wraps content in a large rounded card, `dark` in a dark noisy card. */
export function Section({
  id,
  tone = "plain",
  className = "",
  pixels = false,
  children,
}: {
  id?: string;
  tone?: Tone;
  className?: string;
  pixels?: boolean;
  children: React.ReactNode;
}) {
  const cls = `section${tone === "dark" ? " section--dark" : ""} ${className}`;
  if (tone === "plain") {
    return (
      <section id={id} className={cls}>
        <div className="container">{children}</div>
      </section>
    );
  }
  return (
    <section id={id} className={cls}>
      <div className="container">
        <div className="section__panel">
          {tone === "dark" ? <div className="section__noise" /> : null}
          {pixels ? (
            <>
              <Pixels className="pixels--tr" pattern="0033/00b2/0003/0000" />
              <Pixels className="pixels--bl" pattern="3000/2a00/3000/0000" />
            </>
          ) : null}
          <div style={{ position: "relative" }}>{children}</div>
        </div>
      </div>
    </section>
  );
}

/** Section heading: eyebrow + split-text title, optional copy and action. Wrap a word in *asterisks* for the serif accent. */
export function SectionHeading({
  eyebrow,
  title,
  sub,
  action,
  align = "split",
  size = "h3",
  children,
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
  action?: { label: string; href: string };
  align?: "split" | "center" | "stack";
  size?: "h2" | "h3" | "h4";
  children?: React.ReactNode;
}) {
  const hasSide = Boolean(sub || action || children);
  return (
    <div className={`sec-head${align === "center" ? " sec-head--center" : ""}${align === "stack" ? " sec-head--stack" : ""}`}>
      <div className="sec-head__main">
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <SplitText as="h2" className={size} text={title} />
      </div>
      {hasSide ? (
        <div className="sec-head__side">
          {sub || action ? (
            <Reveal className="sec-head__copy">
              {sub ? <p className="p-m soft">{sub}</p> : null}
              {action ? (
                <Btn href={action.href} variant="white" size="sm">
                  {action.label}
                </Btn>
              ) : null}
            </Reveal>
          ) : null}
          {children}
        </div>
      ) : null}
    </div>
  );
}

export function Bullets({ items, cols = 1 }: { items: string[]; cols?: 1 | 2 }) {
  return (
    <ul className={`bullets${cols === 2 ? " bullets--2" : ""}`}>
      {items.map((i) => (
        <li key={i}>{i}</li>
      ))}
    </ul>
  );
}

export function Checks({ items, x = false }: { items: string[]; x?: boolean }) {
  return (
    <ul className="checks">
      {items.map((i) => (
        <li key={i}>
          <span className={`check${x ? " check--x" : ""}`}>
            {x ? (
              <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="m3 3 6 6M9 3 3 9" />
              </svg>
            ) : (
              <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M2 6.5 4.8 9 10 3" />
              </svg>
            )}
          </span>
          <span>{i}</span>
        </li>
      ))}
    </ul>
  );
}
