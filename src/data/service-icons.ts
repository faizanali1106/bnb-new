/** Maps service group slugs → files in public/services-icons/ */
export const serviceGroupIconSrc: Record<string, string> = {
  "ai-agentic-solutions": "/services-icons/ai-agentic-solutions.svg",
  "software-development": "/services-icons/software-development.svg",
  "mobile-apps": "/services-icons/mobile-app-development.svg",
  "data-intelligence": "/services-icons/data-intelligence.svg",
  "advisory-strategy": "/services-icons/advisory-strategy.svg",
  "cloud-devops-ai-ops": "/services-icons/cloud-devops-aiops.svg",
  "security-compliance": "/services-icons/security-compliance.svg",
  "automation-growth": "/services-icons/automation-growth.svg",
  "quality-support": "/services-icons/quality-support.svg",
  "finance-accounting": "/services-icons/finance-accounting.svg",
};

export function iconForGroup(slug: string) {
  return serviceGroupIconSrc[slug] ?? "/services-icons/software-development.svg";
}
