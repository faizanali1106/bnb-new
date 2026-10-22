import type { ReactNode } from "react";
import { Mail } from "lucide-react";
import { TECH_LABELS } from "./tech-labels";
import type {
  ProjectRuntime,
  ProjectSerialized,
  SocialMediaRuntime,
  SocialMediaSerialized,
} from "./types";

/**
 * Tech/icon slugs the CMS understands (stored in `projects.icon_slugs`).
 * The original site rendered brand logos via react-icons/si; this port keeps the
 * slugs (used by /admin selects) and renders text labels instead, so no icon
 * package is required.
 */
export const KNOWN_ICON_SLUGS: string[] = [
  "react",
  "typescript",
  "nextdotjs",
  "tailwindcss",
  "python",
  "fastapi",
  "postgresql",
  "django",
  "nodedotjs",
  "rubyonrails",
  "docker",
  "stripe",
  "linkedin",
  "zapier",
  "twilio",
  "googlecalendar",
  "canva",
  "elasticsearch",
  "sqlalchemy",
];

const KNOWN = new Set(KNOWN_ICON_SLUGS);

export function iconSlugsToLists(slugs: string[]): ReactNode[] {
  return slugs
    .filter((slug) => KNOWN.has(slug))
    .map((slug, i) => (
      <span key={`${slug}-${i}`} title={TECH_LABELS[slug] ?? slug}>
        {TECH_LABELS[slug] ?? slug}
      </span>
    ));
}

export function hydrateProject(p: ProjectSerialized, index: number): ProjectRuntime {
  return {
    ...p,
    id: p.id ?? index + 1,
    iconLists: iconSlugsToLists(p.iconSlugs ?? []),
  };
}

export function hydrateSocial(s: SocialMediaSerialized): SocialMediaRuntime {
  const { useLucideMail, ...rest } = s;
  if (useLucideMail) {
    return { ...rest, icon: <Mail width={20} height={20} aria-hidden /> };
  }
  return rest;
}
