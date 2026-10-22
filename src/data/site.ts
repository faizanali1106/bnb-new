/** Site-wide content: contact details, offers, engagement models, trust, company, and homepage blocks. */

export type Faq = { q: string; a: string };

export const contactInfo = {
  email: "hr@bitandbytes.net",
  responseTime: "We reply within 1 business day.",
  /** Optional calendar embed (Calendly, Cal.com, HubSpot). Hidden when unset. */
  bookingUrl: process.env.NEXT_PUBLIC_BOOKING_URL || "",
};

export const primaryCta = { label: "Book a call", href: "/contact" };
export const workCta = { label: "See our work", href: "/work" };

/* -------------------------------------------------------------------------- */
/* Offer ladder                                                               */
/* -------------------------------------------------------------------------- */

export type Offer = {
  slug: string;
  step: string;
  name: string;
  tagline: string;
  duration: string;
  deliverable: string;
  h1: string;
  intro: string;
  forWho: string[];
  notFor: string[];
  youGet: string[];
  plan: { when: string; what: string }[];
  team: { role: string; note: string }[];
  gate: { go: string; adjust: string; stop: string };
  next: string;
  proof: string[];
  faqs: Faq[];
  cta: string;
};

export const offers: Offer[] = [
  {
    slug: "ai-discovery-workshop",
    step: "Step 1",
    name: "AI Discovery Workshop",
    tagline: "Find the AI use case worth building first.",
    duration: "1 day + written plan in 5 days",
    deliverable: "Use-case map, ROI estimate and a recommended pilot scope",
    h1: "AI Discovery Workshop – 1 day, written plan in 5 days",
    intro:
      "A focused working session with a senior AI engineer and your team. We map where AI can remove real work, check whether your data is ready, and leave you with a costed pilot plan you can take to us or to any other team.",
    forWho: [
      "Founders and operators with several AI ideas and no clear first move",
      "Teams whose last AI pilot stalled and need a reset with clear success criteria",
      "SMBs that want a low-risk way to test an AI partner before committing",
    ],
    notFor: [
      "Teams that already have a scoped use case and data access should start with the AI Pilot",
      "Companies looking for a slide deck rather than a buildable plan",
      "Projects that need a full enterprise AI strategy across many business units",
    ],
    youGet: [
      "Use-case map ranked by value, effort and risk",
      "ROI estimate for the top 1–2 use cases",
      "Data readiness check (sources, access, quality, privacy)",
      "Recommended pilot scope with success metrics",
      "Cost and timeline estimate for the pilot",
      "Architecture sketch and model options (Claude, OpenAI, Gemini, open-source)",
    ],
    plan: [
      { when: "Before the day", what: "Short intake form and a 30-minute prep call to collect goals, systems and sample data." },
      { when: "Workshop (morning)", what: "Walk through workflows, pain points and where time or money is lost today." },
      { when: "Workshop (afternoon)", what: "Score use cases, check data access and sketch the first pilot together." },
      { when: "Days 2–5", what: "We write up the plan: use-case map, ROI estimate, pilot scope, cost and risks." },
      { when: "Day 5", what: "Readout call to walk through the plan and answer questions." },
    ],
    team: [
      { role: "Lead AI Engineer", note: "Runs the session and owns the technical recommendation." },
      { role: "Product / Delivery Lead", note: "Maps workflows, ROI and the pilot plan." },
    ],
    gate: {
      go: "A use case with clear value, reachable data and a measurable KPI. Next step: the AI Pilot.",
      adjust: "The value is there, but data or access is not ready yet. We list the fixes first.",
      stop: "No use case clears the bar. You keep the plan and avoid an expensive build.",
    },
    next: "Teams that continue start the AI Pilot with the scope, KPI and data plan already agreed.",
    proof: ["solya-retail-ai", "fuzebox-agent-ops"],
    faqs: [
      { q: "Is the workshop remote or on-site?", a: "Remote by default over video, scheduled to overlap with US or UK working hours. On-site can be arranged separately." },
      { q: "What do you need from us?", a: "One decision-maker, one person who knows the workflow, and read access or samples of the data involved. We sign an NDA before anything is shared." },
      { q: "Do we have to build with you afterwards?", a: "No. The written plan is yours to use with any team." },
    ],
    cta: "Book the AI Discovery Workshop",
  },
  {
    slug: "ai-pilot",
    step: "Step 2",
    name: "AI Pilot",
    tagline: "One use case, working in 4–6 weeks.",
    duration: "4–6 weeks",
    deliverable: "A working pilot on your data with a KPI baseline and a go/stop decision",
    h1: "AI Pilot – one use case to a working system in 4–6 weeks",
    intro:
      "Most AI pilots stall because nobody agreed what success looks like. Ours start with a KPI baseline, run on your real data, and end with a clear Go / Adjust / Stop decision, so you never pay for a demo that cannot reach production.",
    forWho: [
      "Teams with a scoped use case (or a completed Discovery Workshop)",
      "Startups that need a working AI feature for customers or investors",
      "SMBs automating calls, documents, support or internal workflows",
    ],
    notFor: [
      "Open-ended research with no business owner or KPI",
      "Use cases where the data cannot be accessed during the pilot",
      "Teams that need a full product build (see Software Development)",
    ],
    youGet: [
      "KPI baseline agreed before build starts",
      "Working pilot connected to your real data and tools",
      "Evaluation results: quality, speed, cost per run and edge cases",
      "Monitoring and cost dashboard for the pilot",
      "Security and data-handling notes",
      "Production plan and cost estimate if the pilot passes",
    ],
    plan: [
      { when: "Days 1–3", what: "Scope lock: KPI baseline, success criteria, data access and integration list." },
      { when: "Weeks 1–4", what: "Build in weekly demos. You see working software every week, not slides." },
      { when: "Week 5", what: "Launch to a limited group of real users; measure against the baseline." },
      { when: "Week 6", what: "Evaluation report, handoff and the Go / Adjust / Stop decision." },
    ],
    team: [
      { role: "Lead AI Engineer", note: "Owns architecture, model choice and evaluation." },
      { role: "1–2 AI / Full-stack Engineers", note: "Build integrations, UI and data pipelines." },
      { role: "Product Designer (on demand)", note: "For user-facing assistants and dashboards." },
    ],
    gate: {
      go: "The pilot meets the agreed quality, speed and cost-per-run targets. Next step: production or an AI Pod.",
      adjust: "Close, but not there yet. We list what must change and what it costs.",
      stop: "The use case does not pay back. You stop with the evidence in hand.",
    },
    next: "Passing pilots move to a production build or continue as an AI Pod.",
    proof: ["phonefilter-ai-call-screening", "moonhub-ai-recruiting", "fuzebox-agent-ops"],
    faqs: [
      { q: "What does the pilot cover?", a: "Everything in the agreed scope: build, integrations, evaluation and handoff. Model usage (API tokens) and hosting are paid directly by you." },
      { q: "Who owns the code?", a: "You do. All custom code and prompts written for the pilot are yours." },
      { q: "Is our data used to train models?", a: "No. We use provider settings and contracts that keep your data out of model training, and can run open-source models in your own cloud if needed." },
      { q: "What if the pilot fails?", a: "That is what the decision gate is for. You get the evaluation report and code, and you avoid funding a production build that would not pay back." },
    ],
    cta: "Start a pilot",
  },
  {
    slug: "ai-pod",
    step: "Step 3",
    name: "AI Pod",
    tagline: "A dedicated AI team on your roadmap, monthly.",
    duration: "Monthly, cancel with 30 days' notice",
    deliverable: "2–3 engineers shipping, monitoring and improving AI in production",
    h1: "AI Pod – a dedicated 2–3 person AI team on your roadmap",
    intro:
      "Once an AI system is live, it needs someone to watch quality, control cost and ship the next use case. An AI Pod is a small senior team that does exactly that, with monthly reporting you can show your board.",
    forWho: [
      "Teams with a pilot that passed and needs to reach production",
      "Companies running several AI use cases that need ongoing care",
      "Startups without in-house AI engineers",
    ],
    notFor: [
      "One-off fixed-scope projects, which suit a project build better",
      "Teams that only need occasional advice (ask about advisory hours)",
      "Staff augmentation for non-AI roles",
    ],
    youGet: [
      "2–3 engineers led by a senior AI engineer",
      "Production monitoring: quality, latency, cost per run",
      "Monthly roadmap, demo and KPI report",
      "Guardrails, evaluations and incident response",
      "New use cases shipped from the backlog",
      "Model and cost reviews as providers change",
    ],
    plan: [
      { when: "Week 1", what: "Onboarding: access, monitoring setup, backlog and KPI review." },
      { when: "Each sprint (2 weeks)", what: "Ship improvements and new use cases; demo every sprint." },
      { when: "Monthly", what: "KPI and cost report, roadmap review and next-month priorities." },
      { when: "Quarterly", what: "Architecture and model review to keep cost and quality in line." },
    ],
    team: [
      { role: "Lead AI Engineer", note: "Accountable for quality, cost and the roadmap." },
      { role: "1–2 AI / Full-stack Engineers", note: "Ship features, integrations and fixes." },
      { role: "Specialists (on demand)", note: "Voice, data, DevOps or design when the backlog needs it." },
    ],
    gate: {
      go: "Each month the pod hits its KPI targets and the roadmap continues.",
      adjust: "Targets slip. We re-plan scope, team mix or model choice.",
      stop: "Cancel with 30 days' notice; you keep all code, prompts and documentation.",
    },
    next: "Pods can scale up or down each month, or hand the system over to your in-house team.",
    proof: ["fuzebox-agent-ops", "phonefilter-ai-call-screening"],
    faqs: [
      { q: "How fast can a pod start?", a: "Usually within 1–2 weeks of signing, faster if it continues straight from a pilot." },
      { q: "What hours does the pod work?", a: "We plan daily overlap with US Eastern or UK hours and agree a standing meeting time." },
      { q: "Can we change the team size?", a: "Yes, month to month, with notice." },
      { q: "Who owns what the pod builds?", a: "You own all code, prompts, evaluations and documentation." },
    ],
    cta: "Talk about an AI Pod",
  },
];

export function getOffer(slug: string) {
  return offers.find((o) => o.slug === slug);
}

/* -------------------------------------------------------------------------- */
/* Engagement models                                                          */
/* -------------------------------------------------------------------------- */

export const engagementModels = [
  { name: "Fixed-scope project", suits: "Clear scope and timeline. Scope agreed before code starts; change requests quoted separately." },
  { name: "Dedicated team / AI Pod", suits: "Evolving roadmap or AI systems in production. Monthly, scale up or down with notice." },
  { name: "Support & maintenance retainer", suits: "Live products that need fixes, updates, monitoring and small features each month." },
];

export const engagementFaqs: Faq[] = [
  { q: "How do you handle change requests?", a: "Anything outside the agreed scope is quoted in writing before work starts. Small changes can be swapped for scope of equal size." },
  { q: "Who pays for AI model (token) costs?", a: "You do, at cost. We estimate monthly usage during the pilot and can set it up on your own provider accounts so billing is transparent." },
  { q: "Who pays for hosting?", a: "Hosting runs on your cloud account (AWS, Azure, GCP or Vercel) so you own it. We can manage it for you under a retainer." },
];

/* -------------------------------------------------------------------------- */
/* Homepage blocks                                                            */
/* -------------------------------------------------------------------------- */

export const situations = [
  {
    title: "You have an AI idea and need a working pilot",
    desc: "We scope it, set a KPI baseline and ship a working pilot in 4–6 weeks.",
    href: "/offers/ai-pilot",
  },
  {
    title: "Your team handles calls and admin an AI agent could do",
    desc: "Voice agents and workflow automation that answer, book, screen and hand off to your people.",
    href: "/services/ai-voice-agents",
  },
  {
    title: "You have a prototype that must reach production",
    desc: "We harden Lovable, Replit or in-house prototypes with real auth, data, testing and hosting.",
    href: "/services/application-modernisation",
  },
  {
    title: "You need HIPAA or EU compliance handled properly",
    desc: "Healthcare and EU Digital Product Passport software with audit trails and access control built in.",
    href: "/services/compliance",
  },
];

export const products = [
  {
    name: "Fuzebox",
    tag: "Agent operations",
    desc: "Agent registry, orchestration, cost and quality dashboards, tracing and governance for AI agents in production.",
    href: "/work/fuzebox-agent-ops",
  },
  {
    name: "AI Booking Agent",
    tag: "Voice & chat",
    desc: "An appointment-booking agent that answers, qualifies and books into your calendar over phone or chat.",
    href: "/services/voice-ai-agents",
  },
  {
    name: "ChatAI",
    tag: "Assistant builder",
    desc: "Our internal builder for knowledge assistants and chatbots trained on your documents and tools.",
    href: "/services/rag-knowledge-assistants",
  },
];

export const processSteps = [
  { step: "01", name: "Discover", duration: "1–2 weeks", desc: "Workshop or assessment. You receive a use-case map, ROI estimate and pilot scope." },
  { step: "02", name: "Pilot", duration: "4–6 weeks", desc: "Working system on your data. You receive evaluation results and a Go / Adjust / Stop decision." },
  { step: "03", name: "Production", duration: "6–12 weeks", desc: "Hardened, integrated and monitored. You receive production code, docs and dashboards." },
  { step: "04", name: "Improve", duration: "Monthly", desc: "AI Pod or retainer. You receive monthly KPI and cost reports and new use cases shipped." },
];

export const whyPoints = [
  { title: "Senior builders on every call", desc: "The engineers who scope your project are the ones who build it. No hand-off to a junior bench." },
  { title: "Decision gates at every step", desc: "Every phase ends with a Go / Adjust / Stop decision on numbers agreed up front." },
  { title: "Voice AI and agent-ops proof", desc: "We have shipped AI call screening, HIPAA telephony and an agent operations platform." },
  { title: "Compliance experience", desc: "HIPAA-compliant healthcare communication and EU Digital Product Passport (ESPR) software." },
  { title: "You own all code", desc: "Code, prompts, evaluations and documentation are yours from day one." },
];

export const models = ["Claude", "OpenAI", "Gemini", "Whisper", "LLaMA", "Ollama"];
export const stack = [
  "Next.js",
  "React",
  "Django",
  "FastAPI",
  "Ruby on Rails",
  "Flutter",
  "AWS",
  "Azure",
  "Kubernetes",
];

export const homeFaqs: Faq[] = [
  { q: "How much does an AI project cost?", a: "It depends on scope, integrations and data. Most AI work starts with a one-day Discovery Workshop or a 4–6 week pilot, and every project gets a written quote after a short scoping call." },
  { q: "How long until something is working?", a: "A working AI pilot usually takes 4–6 weeks. A production system typically follows 6–12 weeks after a successful pilot." },
  { q: "Who owns the code?", a: "You do. All custom code, prompts and documentation we create for you are yours under the contract." },
  { q: "How do you handle time zones?", a: "We plan daily overlap with US Eastern and UK hours, with a fixed standing meeting time agreed at kickoff." },
  { q: "Is our data used to train AI models?", a: "No. We use provider settings and contracts that keep your data out of training, and can run open-source models in your own cloud when required." },
  { q: "Do you sign NDAs?", a: "Yes. Request an NDA on the contact form and we will sign before you share anything confidential." },
];

/* -------------------------------------------------------------------------- */
/* Trust                                                                      */
/* -------------------------------------------------------------------------- */

export const trust = {
  sections: [
    {
      id: "data-handling",
      title: "Data handling and NDAs",
      points: [
        "We sign mutual NDAs before any confidential material is shared.",
        "Client data is accessed only on systems and accounts you approve.",
        "Production data is not copied to personal devices; test data is anonymised where possible.",
        "Access is removed at the end of the engagement and confirmed in writing.",
      ],
    },
    {
      id: "model-training",
      title: "Keeping your data out of model training",
      points: [
        "We use AI provider APIs and enterprise settings that do not train on your inputs or outputs.",
        "Where required, we deploy open-source models (LLaMA, Ollama) inside your own cloud.",
        "Prompts, logs and evaluation data are stored in your accounts, not ours.",
      ],
    },
    {
      id: "access-ownership",
      title: "Access control and code ownership",
      points: [
        "Least-privilege access with named accounts and no shared logins.",
        "Code lives in your Git organisation from the first commit.",
        "You own all custom code, prompts and documentation under the contract.",
        "Secrets are stored in managed secret stores, never in code.",
      ],
    },
    {
      id: "frameworks",
      title: "Compliance frameworks we build to",
      points: [
        "HIPAA: encryption, audit logging, access control and BAA-ready hosting for PHI.",
        "GDPR: data minimisation, consent, data-subject requests and EU hosting options.",
        "EU ESPR: Digital Product Passport data models and access rules.",
        "SOC 2 readiness: we build the controls and evidence your auditor will ask for.",
      ],
    },
    {
      id: "certifications",
      title: "Certifications",
      points: [
        "We do not currently hold ISO 27001 or SOC 2 certification.",
        "We are preparing an ISO 27001 / SOC 2 readiness plan and will publish progress here.",
        "Client reviews will be published on Clutch.",
      ],
    },
    {
      id: "incidents",
      title: "Incident process",
      points: [
        "Suspected incidents are reported to your named contact within 24 hours.",
        "We contain, investigate and share a written incident report with root cause and fixes.",
        "For HIPAA work we follow the breach-notification terms in your BAA.",
      ],
    },
    {
      id: "company",
      title: "Company registration and contact",
      points: ["Bit & Bytes LLC", `Email: ${contactInfo.email}`],
    },
  ],
};

/* -------------------------------------------------------------------------- */
/* Company                                                                    */
/* -------------------------------------------------------------------------- */

export const company = {
  story: [
    "Bit & Bytes is a senior engineering team building AI products, voice AI and software for startups and small businesses in the US and UK.",
    "We started as a custom software shop. Over the last few years our work moved to AI agents, voice AI and compliance-heavy products, including call screening, HIPAA-compliant telephony, an agent operations platform and EU Digital Product Passport software.",
    "We stay deliberately small so the people you meet are the people who build. Every project has a named lead engineer, a fixed scope or a clear monthly plan, and a written definition of success.",
  ],
  beliefs: [
    { title: "No agent without a KPI baseline", desc: "If we cannot measure it before we build it, we cannot prove it worked." },
    { title: "Pilots must have a path to production", desc: "Every pilot ends with a Go / Adjust / Stop decision based on agreed numbers." },
    { title: "Humans stay in the loop where it matters", desc: "Agents escalate to people for decisions with money, health or legal risk." },
    { title: "Cost is a feature", desc: "We track cost per run from day one so AI stays affordable at scale." },
  ],
  numbers: [
    { value: "21", label: "Core projects shipped and documented" },
    { value: "10K+", label: "Downloads of the Get-In Wallet app we built" },
    { value: "6", label: "Model families shipped in production (Claude, OpenAI, Gemini, Whisper, LLaMA, Ollama)" },
    { value: "2", label: "Regulated frameworks delivered: HIPAA and EU ESPR" },
  ],
  howWeWork: [
    { title: "Phases with decision gates", desc: "Discover → Pilot → Production → Improve, each with a clear deliverable and a go/stop point." },
    { title: "Weekly demos", desc: "You see working software every week, recorded for anyone who misses the call." },
    { title: "Shared channels", desc: "Slack or Teams, a shared board and written weekly updates." },
    { title: "Time-zone overlap", desc: "Daily overlap with US Eastern and UK hours, with a fixed standing meeting." },
  ],
};

/* -------------------------------------------------------------------------- */
/* Resources                                                                  */
/* -------------------------------------------------------------------------- */

export const plannedArticles = [
  { type: "Comparison", title: "Hire an AI Agency vs Freelancer vs In-House" },
  { type: "How-to", title: "How We Monitor AI Agents in Production (cost, quality, latency)" },
  { type: "Industry", title: "AI for Car Dealerships: 6 Use Cases We've Built" },
  { type: "Compliance", title: "EU Digital Product Passport: What Manufacturers Need Before ESPR Deadlines" },
];

export const guides = [
  {
    title: "AI Pilot Playbook for SMBs: From Idea to Production in 6 Weeks",
    desc: "The exact scope template, KPI baseline and decision gates we use on every AI Pilot.",
  },
  {
    title: "HIPAA-Compliant AI Checklist",
    desc: "What to check before an AI feature touches patient data: hosting, BAAs, logging and access.",
  },
  {
    title: "AI Readiness Checklist",
    desc: "A 20-point self-assessment of your data, workflows and team before you start an AI project.",
  },
];

/* -------------------------------------------------------------------------- */
/* Lead form                                                                  */
/* -------------------------------------------------------------------------- */

export const leadNeeds = [
  "AI agent",
  "Voice AI",
  "New product",
  "Fix or modernise",
  "Data & dashboards",
  "Not sure",
];

