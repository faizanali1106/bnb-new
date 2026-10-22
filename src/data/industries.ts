import type { Faq } from "@/data/site";

export type Industry = {
  slug: string;
  title: string;
  h1: string;
  intro: string;
  challenges: string[];
  built: { name: string; desc: string; href?: string }[];
  useCases: { title: string; desc: string; service: string }[];
  compliance: { framework: string; delivers: string }[];
  cases: string[];
  services: string[];
  faqs: Faq[];
};

export const industries: Industry[] = [
  {
    slug: "healthcare",
    title: "Healthcare",
    h1: "AI and software for healthcare",
    intro:
      "Clinics and healthcare providers are short-staffed, phones ring all day, and every tool that touches patient data must meet HIPAA. We build voice AI, secure communication and clinical tools that cut admin without adding risk.",
    challenges: [
      "Front desks overwhelmed by calls, missed calls after hours",
      "Staff texting patients from personal phones",
      "Paper fax and manual intake still common",
      "Every vendor touching PHI needs a BAA and audit trail",
      "AI tools that send patient data to unvetted providers",
    ],
    built: [
      { name: "RingRx", desc: "HIPAA-compliant phone, text, fax and video for healthcare practices.", href: "/work/ringrx-hipaa-telephony" },
      { name: "Phonefilter", desc: "AI call screening, transcription and summaries across web and mobile.", href: "/work/phonefilter-ai-call-screening" },
    ],
    useCases: [
      { title: "AI receptionist for clinic front desks", desc: "Answer, book and route calls 24/7, transferring urgent calls to staff.", service: "voice-ai-agents" },
      { title: "Appointment booking and reminders", desc: "Book into your practice system and cut no-shows with SMS reminders.", service: "voice-ai-agents" },
      { title: "Call summaries into the record", desc: "Transcribe and summarise calls, logged against the patient.", service: "ai-audio-video-processing" },
      { title: "Secure patient messaging and fax", desc: "Replace personal phones and paper fax with one compliant system.", service: "real-time-communication" },
      { title: "Staff knowledge assistant", desc: "Answer policy and procedure questions from your own documents.", service: "rag-development" },
    ],
    compliance: [
      { framework: "HIPAA", delivers: "Encryption, role-based access, audit logs of every PHI access, BAA-covered hosting and vendors." },
      { framework: "GDPR", delivers: "Data minimisation, consent records and data-subject request handling for EU patients." },
      { framework: "SOC 2 readiness", delivers: "Access reviews, change management and evidence your customers' auditors expect." },
    ],
    cases: ["ringrx-hipaa-telephony", "phonefilter-ai-call-screening"],
    services: ["voice-ai-agents", "compliance-ready-development", "rag-development", "llmops-mlops"],
    faqs: [
      { q: "Do you sign a BAA?", a: "Yes, for any engagement involving PHI, and we only use BAA-covered hosting and vendors." },
      { q: "Can an AI receptionist handle emergencies?", a: "No. It detects urgent calls and transfers them to staff immediately." },
      { q: "Can you integrate with our practice management system?", a: "Most systems with an API or HL7/FHIR interface can be integrated. We confirm during discovery." },
    ],
  },
  {
    slug: "automotive-dealerships",
    title: "Automotive Dealerships",
    h1: "AI and software for automotive dealership groups",
    intro:
      "Dealership groups run on a DMS, a CRM, inventory tools and inboxes that don't talk to each other. We connect that data into one view, automate follow-up and add AI where it moves sales and service numbers.",
    challenges: [
      "Data split across DMS, CRM and inventory systems",
      "Every rooftop reports numbers differently",
      "Lead follow-up depends on who is on shift",
      "Service departments miss calls and bookings",
      "Valuable data trapped in email threads",
    ],
    built: [
      { name: "Benchmark", desc: "CRM and email data automation turning dealership data into reporting.", href: "/work/benchmark-dealership-data" },
      { name: "QB", desc: "Dealership data integration and KPI reporting." },
    ],
    useCases: [
      { title: "Group-wide KPI dashboards", desc: "One view of sales, service and inventory across every rooftop.", service: "bi-dashboard-development" },
      { title: "Email and CRM data extraction", desc: "Turn lead and deal emails into structured CRM data.", service: "data-engineering" },
      { title: "AI service-desk receptionist", desc: "Answer service calls and book appointments after hours.", service: "voice-ai-agents" },
      { title: "Lead follow-up agent", desc: "Reply to new leads in minutes with personalised follow-up.", service: "ai-agent-development" },
    ],
    compliance: [
      { framework: "Privacy (GLBA / GDPR)", delivers: "Customer financial and personal data encrypted, access-controlled and logged." },
      { framework: "SOC 2 readiness", delivers: "Access and change controls suitable for enterprise dealer groups." },
    ],
    cases: ["benchmark-dealership-data"],
    services: ["data-engineering", "ai-agent-development", "voice-ai-agents", "gohighlevel-automation"],
    faqs: [
      { q: "Can you connect to our DMS?", a: "We work with DMS exports and APIs where available, plus CRM and inventory platforms." },
      { q: "Do you replace our CRM?", a: "No. We connect and clean up the systems you already use." },
    ],
  },
  {
    slug: "retail-ecommerce",
    title: "Retail & E-commerce",
    h1: "AI and software for multi-store retail and e-commerce",
    intro:
      "Multi-store retailers and online brands need to know what to stock, where, and how to bring customers back. We build forecasting, AI agents and lifecycle automation on top of your store and inventory data.",
    challenges: [
      "Stock-outs in one store, over-stock in another",
      "Planning based on last year's spreadsheet",
      "Generic marketing emails with low engagement",
      "Store and online data in separate systems",
    ],
    built: [
      { name: "Solya", desc: "AI agents and forecasting for multi-store retail.", href: "/work/solya-retail-ai" },
      { name: "Fanbase", desc: "Email automation with product recommendations and smart triggers." },
    ],
    useCases: [
      { title: "Demand forecasting by store", desc: "Predict demand per product and location to plan stock.", service: "predictive-analytics" },
      { title: "Retail operations agents", desc: "Agents that answer questions and act on store and inventory data.", service: "ai-agent-development" },
      { title: "Lifecycle email automation", desc: "Abandoned cart, win-back and recommendation flows.", service: "marketing-automation" },
      { title: "Customer chatbot", desc: "Order lookups, returns and product questions with human handoff.", service: "ai-chatbot-development" },
    ],
    compliance: [
      { framework: "PCI DSS awareness", delivers: "Card data kept out of your systems with hosted payment patterns." },
      { framework: "GDPR / CCPA", delivers: "Consent, preference centres and data-subject requests for marketing data." },
    ],
    cases: ["solya-retail-ai"],
    services: ["data-engineering", "ai-agent-development", "marketing-automation", "ai-chatbot-development"],
    faqs: [
      { q: "Which platforms do you work with?", a: "Shopify, WooCommerce, custom stores and POS systems with an API or export." },
      { q: "How much history do forecasts need?", a: "Ideally 12+ months of sales data; we assess what you have during discovery." },
    ],
  },
  {
    slug: "compliance-legaltech",
    title: "Compliance & LegalTech",
    h1: "Software for compliance teams and EU-regulated products",
    intro:
      "Compliance work runs on deadlines, evidence and audit trails. We build platforms for entity management and EU Digital Product Passports that replace spreadsheets with systems your auditors can trust.",
    challenges: [
      "Spreadsheet trackers and missed deadlines",
      "Evidence scattered across inboxes and drives",
      "New EU regulations (ESPR) with tight timelines",
      "Different stakeholders need different access to the same data",
    ],
    built: [
      { name: "Deply", desc: "EU Digital Product Passport (ESPR) platform.", href: "/work/deply-eu-digital-product-passport" },
      { name: "EmpireHQ", desc: "Compliance and entity management platform." },
    ],
    useCases: [
      { title: "Digital Product Passports", desc: "Collect supplier data and publish ESPR-compliant passports.", service: "eu-digital-product-passport" },
      { title: "Entity and filing management", desc: "Track entities, deadlines and evidence in one place.", service: "tax-compliance-automation" },
      { title: "Document review assistant", desc: "Search and summarise policies and contracts with citations.", service: "rag-development" },
      { title: "AI governance for regulated teams", desc: "Approvals, logs and evaluation for AI use.", service: "ai-governance" },
    ],
    compliance: [
      { framework: "EU ESPR", delivers: "Passport data models, public vs restricted access, versioning and data carriers." },
      { framework: "GDPR", delivers: "EU hosting, data minimisation and access logging." },
      { framework: "SOC 2 readiness", delivers: "Audit trails and access controls built into the product." },
    ],
    cases: ["deply-eu-digital-product-passport"],
    services: ["eu-digital-product-passport", "tax-compliance-automation", "saas-development", "rag-development"],
    faqs: [
      { q: "Do you provide legal advice?", a: "No. We build software to the requirements your legal team or advisors define." },
      { q: "Can you host in the EU?", a: "Yes, in AWS, Azure or GCP EU regions." },
    ],
  },
  {
    slug: "events-entertainment",
    title: "Events & Entertainment",
    h1: "Mobile apps and platforms for events and entertainment",
    intro:
      "Event organisers need ticketing, entry and fan engagement that work on the night, at scale, on every phone. We build the apps and scanners that make that happen.",
    challenges: [
      "Slow entry queues and ticket fraud",
      "Tickets spread across email, PDFs and screenshots",
      "Apps that crash under peak load",
      "No data on attendees after the event",
    ],
    built: [
      { name: "Get-In Wallet", desc: "Event ticket wallet app with 10K+ downloads.", href: "/work/get-in-wallet-event-apps" },
      { name: "Get-In Scanner", desc: "Fast ticket scanning app for event staff." },
    ],
    useCases: [
      { title: "Ticket wallet apps", desc: "All tickets in one app with offline access.", service: "mobile-app-development" },
      { title: "Entry scanning", desc: "Fast, offline-capable scanning with fraud checks.", service: "mobile-app-development" },
      { title: "Fan support chatbot", desc: "Answer event questions and ticket issues instantly.", service: "ai-chatbot-development" },
      { title: "Attendee analytics", desc: "Dashboards on sales, entry and engagement.", service: "bi-dashboard-development" },
    ],
    compliance: [
      { framework: "GDPR", delivers: "Attendee consent, data retention and deletion." },
      { framework: "App store policies", delivers: "Privacy labels, permissions and payment rules handled for release." },
    ],
    cases: ["get-in-wallet-event-apps"],
    services: ["mobile-app-development", "web-application-development", "ai-chatbot-development", "devops-services"],
    faqs: [
      { q: "Do the apps work offline?", a: "Yes. Tickets and scanning are designed to work without signal at the venue." },
      { q: "Can you handle peak load?", a: "We load-test and scale infrastructure for on-sale and entry peaks." },
    ],
  },
  {
    slug: "saas-martech",
    title: "SaaS & MarTech",
    h1: "AI and product engineering for SaaS and marketing technology",
    intro:
      "SaaS and MarTech teams need to ship AI features fast without breaking what customers rely on. We build products, AI features and the operations layer that keeps them reliable.",
    challenges: [
      "Competitors shipping AI features faster",
      "AI prototypes that never reach production",
      "Agent and model costs growing faster than revenue",
      "Small teams stretched across product and infrastructure",
    ],
    built: [
      { name: "Fuzebox", desc: "Agent operations platform: registry, orchestration, tracing and governance.", href: "/work/fuzebox-agent-ops" },
      { name: "Breevy AI", desc: "SEO and AI-search visibility assistant." },
      { name: "Quilly", desc: "SaaS product for marketing teams." },
      { name: "Lead Ninja", desc: "Client acquisition and automation platform for agencies." },
    ],
    useCases: [
      { title: "AI features in your product", desc: "Copilots, summaries and agents your customers use.", service: "ai-poc-mvp-development" },
      { title: "Agent observability", desc: "Trace, evaluate and control cost of AI in production.", service: "llmops-mlops" },
      { title: "Prototype to production", desc: "Harden AI-generated or stalled codebases.", service: "application-modernization" },
      { title: "AI-search visibility", desc: "Get cited in AI answers as well as search.", service: "ai-seo-geo" },
    ],
    compliance: [
      { framework: "SOC 2 readiness", delivers: "Access control, logging and change management built in." },
      { framework: "GDPR", delivers: "Data processing records, EU hosting and deletion flows." },
    ],
    cases: ["fuzebox-agent-ops", "moonhub-ai-recruiting"],
    services: ["saas-development", "ai-agent-development", "llmops-mlops", "application-modernization"],
    faqs: [
      { q: "Can you work inside our existing team?", a: "Yes, as an AI Pod or as engineers embedded in your repo and team routines." },
      { q: "Do you build multi-tenant SaaS?", a: "Yes. Auth, billing, roles and tenant isolation are standard." },
    ],
  },
];

export function getIndustry(slug: string) {
  return industries.find((i) => i.slug === slug);
}
