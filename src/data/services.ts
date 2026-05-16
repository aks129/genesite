export type ServiceCategory =
  | "Strategy & Governance"
  | "Implementation"
  | "Data & Analytics"
  | "Enablement";

export type Service = {
  name: string;
  category: ServiceCategory;
  tagline: string;
  description: string;
  outcomes?: string[];
  proof?: string;
};

export const services: Service[] = [
  {
    name: "AI Implementation Services",
    category: "Implementation",
    tagline: "From pilot to production",
    description:
      "End-to-end delivery of AI features inside healthcare and analytics products — model selection, prompt and tool design, retrieval, evals, and the boring deployment plumbing that decides whether the thing actually ships.",
    outcomes: ["Production rollouts", "Evals + guardrails", "Vendor-agnostic"],
    proof:
      "Led AI feature adoption inside a digital-health product org as the internal AI champion — the FHIR data layer I architected at b.well was later selected by OpenAI to power ChatGPT Health.",
  },
  {
    name: "AI Governance",
    category: "Strategy & Governance",
    tagline: "Policy that survives an audit",
    description:
      "Pragmatic AI governance for regulated organizations — risk tiering, model and prompt registries, evaluation cadence, PHI/PII handling, and the HIPAA-aware controls that the 2025 Security Rule update has started to demand.",
    outcomes: ["Risk register", "Evaluation cadence", "Auditable controls"],
    proof:
      "Digital Quality & FHIR Advisor to NCQA on the next generation of digital quality measurement. Founded HealthClaw, which maps HIPAA-aware agent controls to the OWASP Agentic AI Top 10 and the 2025 HIPAA Security Rule update.",
  },
  {
    name: "Information Modeling & Semantic Layer",
    category: "Data & Analytics",
    tagline: "The layer your AI actually needs",
    description:
      "Designing the conceptual, logical, and physical data layers behind a working semantic model — entities, measures, lineage, glossary — so dashboards, agents, and downstream apps speak the same language about the same facts.",
    outcomes: ["Conformed dimensions", "Governed metrics", "Agent-ready schema"],
  },
  {
    name: "Sigma · Power BI · Tableau with AI",
    category: "Data & Analytics",
    tagline: "Dashboards that explain themselves",
    description:
      "Building analytics in Sigma, Power BI, or Tableau augmented with AI — natural-language exploration, narrative insights, anomaly callouts, and lightweight agents that sit alongside the dashboard instead of replacing it.",
    outcomes: ["NL exploration", "Narrative insights", "Embedded agents"],
  },
  {
    name: "AI Prototyping 101",
    category: "Implementation",
    tagline: "Working demo in days, not quarters",
    description:
      "A focused engagement that takes a real internal idea from sketch to a working prototype — Claude or another frontier model, a thin UI, and just enough data plumbing to make the decision about whether to invest further.",
    outcomes: ["Working prototype", "Go/no-go decision", "Reusable scaffold"],
  },
  {
    name: "AI Operating Model for Engineering + Product",
    category: "Strategy & Governance",
    tagline: "Wire AI into how teams actually ship",
    description:
      "An operating model for engineering and product orgs adopting AI: how PMs scope, how engineers prototype, where evals live, who owns model decisions, and how the work gets reviewed. Less framework, more how-we-work.",
    outcomes: ["Roles & rituals", "Eval ownership", "Adoption metrics"],
    proof:
      "Stood up the AI champion role and adoption playbook inside a digital-health product org — from PM scoping through engineering prototyping, eval ownership, and design-partner enablement.",
  },
  {
    name: "Data Analysis with AI",
    category: "Data & Analytics",
    tagline: "Analyst-augmented, not replaced",
    description:
      "Pairing analysts with AI on real questions — SQL drafting, schema exploration, hypothesis testing, narrative write-ups. Focused on raising the floor of every analyst on the team, not building a magic chatbot.",
    outcomes: ["Faster cycle time", "Reproducible analyses", "Analyst leverage"],
  },
  {
    name: "AI Training for Teams",
    category: "Enablement",
    tagline: "Hands-on, role-specific",
    description:
      "Workshops and cohort training tuned to the role — engineers, product, analysts, clinical informatics. Every session ships something the team uses the next day. No generic 'prompt engineering' decks.",
    outcomes: ["Role-specific tracks", "Working artifacts", "Cohort follow-up"],
  },
  {
    name: "Quality Measurement with AI",
    category: "Data & Analytics",
    tagline: "HEDIS, CQM, and the rest",
    description:
      "Quality measurement built on FHIR with AI in the loop — chart abstraction, numerator/denominator validation, gap closure workflows, and narrative explanations of why a member did or didn't qualify for a measure.",
    outcomes: ["Measure validation", "Chart abstraction", "Gap closure"],
    proof:
      "Five years leading HEDIS and quality analytics at UPMC Health Plan with ~$180M cumulative impact across HEDIS, patient-safety, and operational programs. Later served as Digital Quality & FHIR Advisor to NCQA.",
  },
  {
    name: "FHIR Application Development with Agentic Coding",
    category: "Implementation",
    tagline: "Ship real FHIR apps faster",
    description:
      "Building production FHIR applications using agentic coding workflows — SMART-on-FHIR auth, US Core conformance, and the agent-driven loop that turns specs into tested code with humans in the right places.",
    outcomes: ["SMART-on-FHIR apps", "US Core conformance", "Agentic delivery"],
    proof:
      "Architected the FHIR ingestion, provider directory, and clinical data layers at b.well (selected by OpenAI to power ChatGPT Health). Currently shipping HealthClaw, Smart Health Connect, and FHIR Builders with agentic coding loops end-to-end.",
  },
  {
    name: "Claude Code for Healthcare",
    category: "Enablement",
    tagline: "Agentic coding inside HIPAA",
    description:
      "Standing up Claude Code (and the broader agentic-coding stack) inside healthcare orgs — repo setup, hooks, MCP servers, PHI-aware workflows, review gates, and the policy work needed to make it acceptable to security and compliance.",
    outcomes: ["Repo + MCP setup", "PHI-aware workflows", "Compliance sign-off"],
    proof:
      "Built HealthClaw — twelve MCP tools, HMAC-confirmed clinical writes, and an immutable audit log designed for HIPAA-aware agentic coding. Founder + organizer of the Pittsburgh Health Analytics meetup (110+ members).",
  },
];
