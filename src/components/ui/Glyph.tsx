import { iconForGroup } from "@/data/service-icons";

/** Service-area icon from /public/services-icons, tinted with currentColor via CSS mask. */
export default function Glyph({ group, className = "", label }: { group: string; className?: string; label?: string }) {
  const src = iconForGroup(group);
  return (
    <span
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={`glyph ${className}`}
      style={{ maskImage: `url(${src})`, WebkitMaskImage: `url(${src})` }}
    />
  );
}
