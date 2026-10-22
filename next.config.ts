import type { NextConfig } from "next";

/* --------------------------------------------------------------------------
   Supabase Storage (CMS uploads, resumes) → allow next/image to optimise them.
   -------------------------------------------------------------------------- */
function supabaseHostname(): string | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return null;
  try {
    return new URL(url).hostname;
  } catch {
    return null; // ignore invalid URL at build time
  }
}

const supabaseHost = supabaseHostname();

/* --------------------------------------------------------------------------
   Legacy URL redirects (ported from the previous site).
   -------------------------------------------------------------------------- */
const renamedGroups: Record<string, string> = {
  "ai-strategy": "advisory-strategy",
  "ai-agents": "ai-agentic-solutions",
  "voice-ai": "ai-agentic-solutions",
  "data-analytics": "data-intelligence",
  "product-engineering": "software-development",
  "ai-ops-cloud-security": "cloud-devops-ai-ops",
  compliance: "security-compliance",
  "growth-automation": "automation-growth",
};

const renamedServices: Record<string, string> = {
  "ai-discovery-and-readiness": "ai-discovery-workshop",
  "ai-use-case-roadmap": "ai-roadmap",
  "fractional-cto": "fractional-ai-lead",
  "rag-knowledge-assistants": "rag-development",
  "ai-chatbots-copilots": "ai-chatbot-development",
  "mcp-servers-integrations": "mcp-server-development",
  "ai-voice-agents": "voice-ai-agents",
  "ai-appointment-booking": "voice-ai-agents",
  "call-screening-transcription": "voice-ai-agents",
  "hipaa-compliant-telephony": "real-time-communication",
  "telehealth-video": "real-time-communication",
  "data-bi-forecasting": "data-engineering",
  "bi-dashboards-kpi-reporting": "bi-dashboard-development",
  "predictive-analytics-forecasting": "predictive-analytics",
  "web-scraping-data-pipelines": "web-scraping-services",
  "saas-product-development": "saas-development",
  "web-app-development": "web-application-development",
  "marketplace-platform-development": "marketplace-development",
  "ux-ui-ai-product-design": "ux-ui-design",
  "application-modernisation": "application-modernization",
  "llmops-ai-observability": "llmops-mlops",
  "ai-governance-guardrails": "ai-governance",
  "cloud-devops": "devops-services",
  "cloud-ai-cost-optimisation": "cloud-cost-optimization",
  "ai-security-red-teaming": "llm-red-teaming",
  "hipaa-compliant-software": "compliance-ready-development",
  "soc2-iso27001-readiness": "compliance-ready-development",
  "compliance-entity-management": "tax-compliance-automation",
  "crm-sales-automation": "gohighlevel-automation",
  "marketing-lifecycle-automation": "marketing-automation",
};

const oldCategories = [
  "ai-automation",
  "data-integration",
  "engineering",
  "compliance-software",
  "gohighlevel",
  "design-quality",
  "cloud-devops",
  "consulting-teams",
];

const to = (source: string, destination: string) => ({ source, destination, permanent: true });

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: supabaseHost
      ? [{ protocol: "https", hostname: supabaseHost, pathname: "/storage/v1/object/public/**" }]
      : [],
  },
  turbopack: {
    resolveAlias: {
      // pdfjs-dist@3 (client-side resume parsing) has a Node-only `require("canvas")`.
      canvas: "./src/lib/empty-module.ts",
    },
  },
  async redirects() {
    return [
      to("/customers/industries", "/industries"),
      to("/customers/industries/:slug", "/industries"),
      to("/customers", "/work"),
      to("/customers/:path*", "/work"),
      to("/portfolio", "/work"),
      to("/about", "/company"),
      to("/company/about", "/company"),
      to("/company/how-we-work", "/company#how-we-work"),
      to("/company/why-bit-and-bytes", "/company"),
      to("/our-team", "/company/team"),
      to("/resources/:section(blog|guides|news)", "/resources"),
      to("/offers", "/services"),
      to("/pricing", "/services"),
      to("/services/ai-pods", "/offers/ai-pod"),
      ...Object.entries(renamedServices).map(([from, dest]) =>
        to(`/services/${from}`, `/services/${dest}`)
      ),
      ...Object.entries(renamedGroups).flatMap(([from, dest]) => [
        to(`/services/${from}`, `/services/${dest}`),
        to(`/services/${from}/:service`, "/services/:service"),
      ]),
      ...oldCategories.flatMap((c) => [
        to(`/services/${c}`, "/services"),
        to(`/services/${c}/:path*`, "/services"),
      ]),
    ];
  },
};

export default nextConfig;
