/** Display labels for project icon slugs (server-safe, no React icons). */
export const TECH_LABELS: Record<string, string> = {
  react: "React",
  typescript: "TypeScript",
  fastapi: "FastAPI",
  python: "Python",
  sqlalchemy: "SQLAlchemy",
  elasticsearch: "Elasticsearch",
  linkedin: "LinkedIn",
  zapier: "Zapier",
  stripe: "Stripe",
  twilio: "Twilio",
  googlecalendar: "Google Calendar",
  canva: "Canva",
  nodedotjs: "Node.js",
  rubyonrails: "Ruby on Rails",
  postgresql: "PostgreSQL",
  nextdotjs: "Next.js",
  tailwindcss: "Tailwind CSS",
  docker: "Docker",
  django: "Django",
};

export function techLabelsFromSlugs(slugs: string[] | undefined): string[] {
  return (slugs ?? []).map((s) => TECH_LABELS[s] || s);
}
