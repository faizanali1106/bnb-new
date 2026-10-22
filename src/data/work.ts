export type ProjectLink = { label: string; href: string };

export type CaseStudy = {
  slug: string;
  client: string;
  headline: string;
  /** Short line shown on cards in place of a metric until client numbers are collected. */
  highlight: string;
  industry: string;
  industrySlug?: string;
  groups: string[];
  services: string[];
  duration?: string;
  stack: string[];
  metrics: { label: string; value: string }[];
  challenge: string[];
  approach: string[];
  results: string[];
  /** Matches the testimonial `title` field in the CMS. */
  testimonialFrom?: string;
  image?: string;
  links?: ProjectLink[];
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "phonefilter-ai-call-screening",
    links: [{ label: "Visit Phonefilter", href: "https://phonefilter.com/" }],
    client: "Phonefilter",
    headline: "AI call screening across web and mobile with FreeSWITCH, Whisper and OpenAI",
    highlight: "AI call screening on web + mobile",
    industry: "Voice & Telecom",
    groups: ["ai-agentic-solutions", "cloud-devops-ai-ops"],
    services: ["voice-ai-agents", "devops-services"],
    stack: ["FreeSWITCH", "Whisper", "OpenAI", "Kubernetes", "Web", "Mobile"],
    metrics: [
      { label: "Platforms", value: "Web + mobile" },
      { label: "Pipeline", value: "Speech → LLM" },
    ],
    challenge: [
      "Unknown and spam calls interrupt people and businesses all day.",
      "Users wanted calls screened before they answer, so they could see who was calling, why, and whether it mattered.",
      "The system had to work in real time on a live phone line, on web and mobile.",
    ],
    approach: [
      "Built the telephony layer on FreeSWITCH to answer and route calls programmatically.",
      "Used Whisper for real-time speech-to-text and OpenAI to classify intent and write summaries.",
      "Shipped web and mobile apps so users can see screened calls, transcripts and summaries.",
      "Deployed on Kubernetes so the call pipeline scales with volume.",
    ],
    results: [
      "Calls are screened, transcribed and summarised automatically before the user picks up.",
      "One platform covers telephony, voice AI and user apps.",
      "The same pipeline is the base for our AI receptionist and booking agent work.",
    ],
  },
  {
    slug: "ringrx-hipaa-telephony",
    links: [{ label: "Visit RingRx", href: "https://ringrx.com/" }],
    client: "RingRx",
    headline: "HIPAA-compliant phone, text, fax and video for healthcare practices",
    highlight: "HIPAA phone, SMS, fax & video",
    industry: "Healthcare",
    industrySlug: "healthcare",
    groups: ["ai-agentic-solutions", "security-compliance"],
    services: ["real-time-communication", "compliance-ready-development"],
    stack: ["React", "TypeScript", "VoIP", "Secure messaging"],
    metrics: [
      { label: "Channels", value: "Phone · SMS · Fax · Video" },
      { label: "Compliance", value: "HIPAA" },
    ],
    challenge: [
      "Healthcare practices need to call, text, fax and video-call patients without breaking HIPAA.",
      "Consumer tools and personal phones leave no audit trail and put PHI at risk.",
    ],
    approach: [
      "Built secure messaging, calling, digital fax and video into one system.",
      "Applied encryption, role-based access and audit logging across every channel.",
      "Designed a user-friendly interface so front-desk staff adopt it quickly.",
    ],
    results: [
      "Practices manage patient communication in one HIPAA-compliant platform.",
      "Every patient interaction is logged for compliance.",
    ],
    testimonialFrom: "RingX",
    image: "/projects/ringrx.png",
  },
  {
    slug: "fuzebox-agent-ops",
    links: [{ label: "Live demo", href: "https://fuze-box.vercel.app/live-monitor" }],
    client: "Fuzebox",
    headline: "An agent operations platform: registry, orchestration, tracing and governance",
    highlight: "Agent ops from prototype to v2",
    industry: "SaaS & AI",
    industrySlug: "saas-martech",
    groups: ["cloud-devops-ai-ops", "ai-agentic-solutions", "software-development"],
    services: ["llmops-mlops", "ai-governance", "ai-agent-development", "application-modernization"],
    stack: ["LLM agents", "Tracing", "Dashboards", "Cloud"],
    metrics: [
      { label: "Stage", value: "Prototype → v2" },
      { label: "Scope", value: "Registry · Tracing · Governance" },
    ],
    challenge: [
      "Teams deploying AI agents had no single place to see what agents exist, what they do and what they cost.",
      "Failures were hard to debug and spend was hard to control.",
      "An early prototype needed to become a production product.",
    ],
    approach: [
      "Designed an agent registry with versioning and ownership.",
      "Built orchestration, step-level tracing and cost and quality dashboards.",
      "Added governance: approvals, access control and audit logs.",
      "Took the product from prototype to a production v2.",
    ],
    results: [
      "Agents are registered, traced and governed in one platform.",
      "Cost and quality are visible per agent and per run.",
      "Fuzebox is now an accelerator we use on client agent projects.",
    ],
  },
  {
    slug: "moonhub-ai-recruiting",
    links: [{ label: "Visit Moonhub", href: "https://www.moonhub.ai/" }],
    client: "Moonhub",
    headline: "AI-assisted recruiting that matches candidates to roles from LinkedIn profiles",
    highlight: "AI candidate matching",
    industry: "HR & Recruiting",
    groups: ["ai-agentic-solutions", "software-development"],
    services: ["ai-agent-development", "ai-poc-mvp-development", "mvp-development"],
    stack: ["FastAPI", "Python", "SQLAlchemy", "Elasticsearch", "React"],
    metrics: [
      { label: "Search", value: "Elasticsearch + AI" },
      { label: "Stack", value: "FastAPI · React" },
    ],
    challenge: [
      "Recruiters spent hours searching and screening profiles by hand.",
      "Keyword search missed good candidates and surfaced poor matches.",
    ],
    approach: [
      "Built an AI-assisted platform that analyses LinkedIn profiles against job requirements.",
      "Combined Elasticsearch retrieval with AI scoring for job fit.",
      "Delivered a FastAPI backend and React interface for recruiters.",
    ],
    results: [
      "Recruiters get ranked candidate matches instead of raw search results.",
      "Complex AI features integrated smoothly into a usable product.",
    ],
    testimonialFrom: "Moonhub",
    image: "/projects/moonhub.png",
  },
  {
    slug: "solya-retail-ai",
    links: [{ label: "Visit Solya", href: "https://solya.app/" }],
    client: "Solya",
    headline: "AI agents and forecasting for multi-store retail",
    highlight: "Retail AI agents + forecasting",
    industry: "Retail",
    industrySlug: "retail-ecommerce",
    groups: ["ai-agentic-solutions", "data-intelligence", "advisory-strategy"],
    services: ["ai-agent-development", "predictive-analytics", "ai-discovery-workshop"],
    stack: ["LLM agents", "Python", "Forecasting"],
    metrics: [
      { label: "Scope", value: "Agents + forecasting" },
      { label: "Started with", value: "Discovery" },
    ],
    challenge: [
      "Multi-store retail teams juggle stock, sales and store data across systems.",
      "Planning relied on manual reports and gut feel.",
    ],
    approach: [
      "Started with discovery to pick the highest-value AI use cases.",
      "Built AI agents that answer questions and act on retail data.",
      "Added predictive analytics for demand and sales forecasting.",
    ],
    results: [
      "Retail teams query and act on their data through AI agents.",
      "Forecasts support stock and planning decisions.",
    ],
  },
  {
    slug: "benchmark-dealership-data",
    links: [{ label: "Visit Benchmark", href: "https://benchmarktm.com/" }],
    client: "Benchmark",
    headline: "CRM and email data automation turning dealership data into reporting",
    highlight: "CRM + email data → insights",
    industry: "Automotive",
    industrySlug: "automotive-dealerships",
    groups: ["data-intelligence"],
    services: ["data-engineering", "bi-dashboard-development"],
    stack: ["Python", "Data pipelines", "CRM integration", "BI"],
    metrics: [
      { label: "Sources", value: "CRM + email" },
      { label: "Output", value: "KPI reporting" },
    ],
    challenge: [
      "Important dealership data was buried in emails and CRM records.",
      "Turning it into usable reporting took manual effort.",
    ],
    approach: [
      "Built a backend that extracts and structures complex email data.",
      "Integrated CRM data into the same pipeline.",
      "Delivered reporting on top of the cleaned data.",
    ],
    results: [
      "Complex email data is transformed into meaningful insights.",
      "A reliable backend significantly improved the client's workflow.",
    ],
    testimonialFrom: "Benchmark",
  },
  {
    slug: "deply-eu-digital-product-passport",
    links: [{ label: "Visit Deply", href: "https://deply.it" }],
    client: "Deply",
    headline: "An EU Digital Product Passport platform built for ESPR",
    highlight: "EU Digital Product Passport (ESPR)",
    industry: "Compliance",
    industrySlug: "compliance-legaltech",
    groups: ["security-compliance", "software-development"],
    services: ["eu-digital-product-passport", "saas-development"],
    stack: ["SaaS", "Role-based access", "Audit trail"],
    metrics: [
      { label: "Regulation", value: "EU ESPR" },
      { label: "Type", value: "SaaS platform" },
    ],
    challenge: [
      "Manufacturers selling into the EU must publish Digital Product Passports under ESPR.",
      "Product data sits with suppliers, in ERPs and in spreadsheets.",
    ],
    approach: [
      "Designed a passport data model and supplier data collection.",
      "Built passport publishing with public and restricted access levels.",
      "Added versioning and audit trails for every change.",
    ],
    results: [
      "Manufacturers can collect, manage and publish passport data in one platform.",
      "A rare, specialised compliance product few agencies have built.",
    ],
  },
  {
    slug: "get-in-wallet-event-apps",
    links: [
      { label: "Wallet · App Store", href: "https://apps.apple.com/ua/app/getin-wallet/id6736987341" },
      { label: "Wallet · Google Play", href: "https://play.google.com/store/apps/details?id=xyz.getin.wallet.fans" },
      { label: "Scanner · App Store", href: "https://apps.apple.com/us/app/getin-scanner/id6737557061" },
      { label: "Scanner · Google Play", href: "https://play.google.com/store/apps/details?id=xyz.getin.scanner" },
    ],
    client: "Get-In",
    headline: "Event ticket wallet and scanner apps with 10K+ downloads",
    highlight: "10K+ app downloads",
    industry: "Events & Entertainment",
    industrySlug: "events-entertainment",
    groups: ["mobile-apps"],
    services: ["mobile-app-development"],
    stack: ["iOS", "Android", "Ticket scanning"],
    metrics: [
      { label: "Downloads", value: "10K+" },
      { label: "Apps", value: "Wallet + Scanner" },
    ],
    challenge: [
      "Attendees needed one place for tickets that works at the door.",
      "Staff needed fast, reliable scanning at busy entrances.",
    ],
    approach: [
      "Built Get-In Wallet for attendees to store and present tickets.",
      "Built Get-In Scanner for staff to validate tickets quickly.",
      "Released and maintained both apps on the iOS and Android stores.",
    ],
    results: ["Get-In Wallet passed 10,000 downloads.", "Entry and ticketing run through one connected app pair."],
  },
];

/** Core projects without a full case study yet. */
export type CoreProject = {
  name: string;
  summary: string;
  industry: string;
  industrySlug?: string;
  groups: string[];
  links: ProjectLink[];
  image?: string;
};

export const coreProjects: CoreProject[] = [
  {
    name: "Freelvy",
    summary: "An AI sales platform that turns a one-line prompt into a verified prospect list and personalised email and LinkedIn outreach.",
    industry: "Sales & MarTech",
    industrySlug: "saas-martech",
    groups: ["ai-agentic-solutions", "automation-growth", "software-development"],
    links: [{ label: "Visit Freelvy", href: "https://app.freelvy.com/" }],
  },
  {
    name: "EmpireHQ",
    summary: "An AI-powered command centre for owners of multiple entities: entity dashboard, ownership map, document vault, equity tracking and compliance alerts.",
    industry: "Compliance & LegalTech",
    industrySlug: "compliance-legaltech",
    groups: ["security-compliance", "software-development", "ai-agentic-solutions"],
    links: [{ label: "Visit EmpireHQ", href: "https://empirehq.ai" }],
  },
  {
    name: "Decode",
    summary: "An AI knowledge assistant with a mobile app, backed by retrieval over the client's content and deployed on AWS Fargate.",
    industry: "AI product",
    groups: ["ai-agentic-solutions", "software-development", "cloud-devops-ai-ops"],
    links: [{ label: "Visit Decode", href: "http://decode.ai" }],
  },
  {
    name: "Breevy AI",
    summary: "An AI assistant that improves search and AI-search visibility by analysing keywords and ranking strategy.",
    industry: "SaaS & MarTech",
    industrySlug: "saas-martech",
    groups: ["automation-growth", "ai-agentic-solutions", "software-development"],
    links: [{ label: "Visit Breevy", href: "https://www.breevy.ai/" }],
    image: "/projects/breevy.png",
  },
  {
    name: "Relin",
    summary: "A relationship-intelligence app that connects calendar, CRM and contacts to surface who is nearby, capture follow-ups and find warm intros.",
    industry: "Sales & Networking",
    groups: ["ai-agentic-solutions", "software-development"],
    links: [{ label: "Visit Relin", href: "https://www.relin.ai/" }],
  },
  {
    name: "QB Business Solutions",
    summary: "Dealer analytics for a warranty-reimbursement firm working with US auto dealerships on parts and labour data.",
    industry: "Automotive",
    industrySlug: "automotive-dealerships",
    groups: ["data-intelligence"],
    links: [{ label: "Visit QB", href: "https://qbbusinesssolutions.com/" }],
  },
  {
    name: "Lead Ninja",
    summary: "A client-acquisition and automation platform that streamlines lead capture and sales-funnel execution for agencies.",
    industry: "SaaS & MarTech",
    industrySlug: "saas-martech",
    groups: ["automation-growth", "software-development"],
    links: [{ label: "Visit Lead Ninja", href: "https://leadninjasystem.com" }],
    image: "/projects/leadninja.png",
  },
  {
    name: "Fanbase",
    summary: "An email automation platform for small businesses with product recommendations, campaign flows and smart triggers.",
    industry: "Retail & E-commerce",
    industrySlug: "retail-ecommerce",
    groups: ["automation-growth", "software-development"],
    links: [{ label: "Visit Fanbase", href: "https://platform.fanbasecollective.com/" }],
    image: "/projects/fanbase.png",
  },
  {
    name: "Quilly",
    summary: "A content-feedback platform that helps marketing teams review and ship better assets.",
    industry: "SaaS & MarTech",
    industrySlug: "saas-martech",
    groups: ["automation-growth", "software-development"],
    links: [{ label: "Live demo", href: "https://quily-app.vercel.app/login" }],
  },
  {
    name: "YourList",
    summary: "A real estate and investment networking platform for profiles, listings, groups and connecting with investors, with an AI assistant.",
    industry: "Real Estate & Investment",
    groups: ["software-development", "ai-agentic-solutions"],
    links: [{ label: "Visit YourList", href: "https://yourlist-lake.vercel.app/" }],
    image: "/projects/yourlist.png",
  },
  {
    name: "Thynkfuel",
    summary: "Web and technology work for Thynkfuel Media, a marketing, technology and commerce agency.",
    industry: "Marketing agency",
    industrySlug: "saas-martech",
    groups: ["software-development"],
    links: [{ label: "Visit Thynkfuel", href: "https://www.thynkfuelagency.com/" }],
  },
  {
    name: "Sherpa",
    summary: "A private client platform. Details available on request.",
    industry: "Private client",
    groups: ["software-development"],
    links: [],
  },
];

export function getCaseStudy(slug: string) {
  return caseStudies.find((c) => c.slug === slug);
}

export function casesBySlugs(slugs: string[]) {
  return slugs.map((s) => getCaseStudy(s)).filter(Boolean) as CaseStudy[];
}
