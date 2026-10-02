/*
 * The two practices, kept apart on purpose.
 *
 * AI and healthcare are separate pages so neither reads as a footnote to the
 * other, and so a buyer for one never has to wade through the other. They meet
 * in exactly one place on each page (`bridge`).
 *
 * Proof rule: a `proof` line appears only where the rest of the site already
 * backs it (career.ts, projects.ts, events.ts). An offering with no verified
 * proof ships without one rather than with an invented claim. Numbers in
 * `stats` follow the same rule.
 *
 * Copy rule: no em dashes, no marketing adjectives, descriptions short.
 */

export type PracticeSlug = "ai" | "healthcare";

export type Offering = {
  /** Gene's own name for the offering, shown as the card header. */
  name: string;
  /** One plain-language line under the header. */
  plain: string;
  description: string;
  deliverables: string[];
  /** Verified only. Omitted when the site has nothing to point to. */
  proof?: string;
};

export type Rung = { name: string; shape: string; description: string };
export type Resource = { label: string; kind: string; href: string };
export type Segment = { who: string; need: string };
export type Stat = { value: string; label: string };
export type Milestone = { when: string; what: string };
export type Rule = { name: string; scope: string; href: string; milestones: Milestone[] };

export type Practice = {
  slug: PracticeSlug;
  /** Nav label and the name on the doors of /expertise. */
  name: string;
  dateline: string;
  headline: string;
  lede: string;
  /** One line for the door on /expertise. */
  door: string;
  stats: Stat[];
  /** Market segments worked in, each with where. Verified against career.ts. */
  markets?: Stat[];
  forWho: string[];
  notFor: string[];
  offerings: Offering[];
  segments?: Segment[];
  regulatory?: { rules: Rule[]; note: string };
  /** Three rungs: a small first step, a fixed-scope build, ongoing advice. */
  ladder: [Rung, Rung, Rung];
  resources: Resource[];
  bridge: { to: PracticeSlug; line: string };
};

export const practices: Practice[] = [
  {
    slug: "ai",
    name: "AI",
    dateline: "Practice · Artificial intelligence",
    headline: "AI that does the work.",
    lede:
      "Agents, workflows, and the context layer under them, for teams with real data and real rules. The methods were proven in healthcare, where the data is protected and mistakes are expensive.",
    door: "Agents, AI brain systems, governance, and training.",
    stats: [
      { value: "15", label: "years in data and AI" },
      { value: "12", label: "MCP tools shipped open source in HealthClaw" },
      { value: "VP", label: "of AI for Data, AI & Analytics, 2025 to now" },
    ],
    forWho: [
      "Teams with a slow, manual workflow they understand well.",
      "Organizations whose data is sensitive and whose AI has to follow rules.",
      "Leaders who want their people building with AI, not only chatting with it.",
    ],
    notFor: [
      "A strategy deck with nothing running at the end.",
      "Training on one vendor's product.",
      "Replacing a team with a chatbot.",
    ],
    offerings: [
      {
        name: "AI agents & workflows",
        plain: "Agents that carry a task from start to finish.",
        description:
          "Agents and automated workflows built around one real process: tools, retrieval, approval steps where a human decides, and evals that show it works.",
        deliverables: ["Working agent", "Evals and test cases", "Human approval steps"],
        proof:
          "Several entries in the Agents Assemble AI Hackathon on agentic clinical workflows and tool patterns that respect HIPAA.",
      },
      {
        name: "AI brain systems",
        plain: "One body of knowledge your people and agents share.",
        description:
          "Your organization's knowledge made usable by AI: a governed glossary, a semantic layer, documents, and memory, so every agent answers from the same facts.",
        deliverables: ["Knowledge and semantic layer", "Retrieval over your documents", "Shared agent memory"],
      },
      {
        name: "Contextual reasoning",
        plain: "The right context in front of the model at the right time.",
        description:
          "Context engineering for models that reason about your business: what they see, in what order, from which sources, and how the answer gets checked.",
        deliverables: ["Context and retrieval design", "Tool and prompt design", "Reasoning evals"],
      },
      {
        name: "AI enterprise systems",
        plain: "AI inside the systems you already run.",
        description:
          "Models connected to the warehouse, BI tools, and business apps, with security, cost, and ownership settled before anything scales.",
        deliverables: ["Reference architecture", "BI with AI in Sigma, Power BI, or Tableau", "Build or buy review"],
      },
      {
        name: "AI governance",
        plain: "Rules for AI that hold up in an audit.",
        description:
          "Risk tiers, model and prompt registries, an evaluation schedule, and agent controls, written so engineers can build them rather than file them.",
        deliverables: ["Risk register", "Agent control mapping", "Evaluation schedule"],
        proof:
          "Founded HealthClaw, open-source controls for AI agents on protected data, mapped to the OWASP Agentic AI Top 10 and the 2025 HIPAA Security Rule update.",
      },
      {
        name: "AI training",
        plain: "Your team building with AI, not watching demos.",
        description:
          "Hands-on training by role for engineers, product, analysts, and leaders, plus the operating model: who scopes, who builds, who owns the evals.",
        deliverables: ["Workshops by role", "AI operating model", "Agentic coding setup"],
        proof:
          "Created the AI champion role and adoption playbook in a digital-health product org, from scoping to prototypes to eval ownership.",
      },
    ],
    ladder: [
      {
        name: "Working session",
        shape: "Half a day to two days",
        description: "Hands-on with your team on one real problem. You leave with a prototype or a trained group.",
      },
      {
        name: "Build sprint",
        shape: "Four to eight weeks, fixed scope",
        description: "One agent, workflow, or context layer, handed over with written specs, evals, and a runbook.",
      },
      {
        name: "Advisory",
        shape: "Monthly",
        description: "Ongoing review of architecture, governance, and vendor decisions as the work scales.",
      },
    ],
    resources: [
      { label: "HealthClaw on GitHub", kind: "Open source", href: "https://github.com/aks129/HealthClawGuardrails" },
      {
        label: "An AI Found a Clinically Dangerous Bug in the Code Another AI Helped Write",
        kind: "Essay",
        href: "https://evestel.substack.com/p/an-ai-found-a-clinically-dangerous",
      },
      {
        label: "Killing the Clipboard: Building an Autonomous Healthcare Agent in 5 Minutes",
        kind: "Essay",
        href: "https://evestel.substack.com/p/killing-the-clipboard-building-an",
      },
      { label: "Fear of New Tools", kind: "Essay", href: "https://evestel.substack.com/p/fear-of-new-tools" },
    ],
    bridge: {
      to: "healthcare",
      line: "Putting AI on health data? The healthcare practice covers FHIR, the CMS rules, and quality measurement.",
    },
  },
  {
    slug: "healthcare",
    name: "Healthcare",
    dateline: "Practice · Healthcare technology",
    headline: "Health data that moves.",
    lede:
      "Two decades across pharmacy, payer, provider, and digital health. FHIR, interoperability, and quality measurement for teams facing a rule, a deadline, or a number that has to be right.",
    door: "FHIR, the CMS rules, digital quality, and analytics.",
    stats: [
      { value: "20+", label: "years in healthcare data" },
      { value: "5", label: "years leading HEDIS at UPMC Health Plan" },
      { value: "~$180M", label: "cumulative impact from quality analytics" },
    ],
    markets: [
      { value: "Pharmacy benefits", label: "Medco, Express Scripts" },
      { value: "Medicare Part D", label: "Express Scripts" },
      { value: "Health plans", label: "UPMC Health Plan" },
      { value: "Providers", label: "Allegheny Health Network" },
      { value: "Consumer health", label: "b.well Connected Health" },
      { value: "Quality measurement", label: "NCQA" },
    ],
    forWho: [
      "Payers building the CMS-0057-F APIs or moving HEDIS to digital.",
      "Providers exchanging clinical data through FHIR and TEFCA.",
      "Health-tech vendors that must pass conformance and fit payer and EHR workflows.",
    ],
    notFor: [
      "Checkbox compliance with no plan to use the data.",
      "Staff augmentation for routine tickets.",
    ],
    segments: [
      {
        who: "Payers",
        need: "Patient Access, Provider Access, Payer-to-Payer, and Prior Authorization APIs, and HEDIS moving to FHIR and CQL.",
      },
      {
        who: "Providers",
        need: "Clinical data in and out of the EHR, SMART on FHIR apps, and exchange through TEFCA.",
      },
      {
        who: "Health-tech vendors",
        need: "US Core conformance, payer and EHR integration, and product bets that hold up against the rules.",
      },
      {
        who: "Quality & standards bodies",
        need: "Digital measure design and testing, and implementer feedback on specs.",
      },
    ],
    offerings: [
      {
        name: "FHIR & interoperability strategy",
        plain: "Architecture that survives the next rule.",
        description:
          "FHIR R4 and US Core architecture, SMART on FHIR, provider directories, and the data model underneath, checked against where the rules are going.",
        deliverables: ["Target architecture", "Implementation guide review", "Build plan"],
        proof:
          "Built the FHIR ingestion, provider directory, and clinical data layers at b.well Connected Health.",
      },
      {
        name: "CMS-0057-F API readiness",
        plain: "The four payer APIs due January 2027.",
        description:
          "Gap assessment and delivery support for the Patient Access, Provider Access, Payer-to-Payer, and Prior Authorization APIs, using the Da Vinci guides.",
        deliverables: ["Gap assessment", "Da Vinci guide mapping", "Test plan"],
        proof:
          "Authored FHIR IQ's public response to CMS on interoperability and market design.",
      },
      {
        name: "Digital quality measurement",
        plain: "HEDIS on FHIR and CQL, before the hybrid method ends.",
        description:
          "Quality measurement moved from hybrid and chart review to digital: ECDS, FHIR data, CQL logic, and parallel runs against current results.",
        deliverables: ["Measure readiness review", "Parallel run and variance", "Gap closure workflows"],
        proof:
          "Five years leading HEDIS and quality analytics at UPMC Health Plan, then Digital Quality & FHIR Advisor to NCQA. Digital quality track at the 2025 HL7/CMS Connectathon.",
      },
      {
        name: "Payer & provider analytics",
        plain: "Claims, clinical, and quality data people trust.",
        description:
          "Warehouses, shared definitions, and BI for payers and providers, from claims reconciliation to quality dashboards leadership acts on.",
        deliverables: ["Data model and governance", "Quality dashboards", "Analytics roadmap"],
        proof:
          "Business intelligence at Allegheny Health Network, Medicare Part D reconciliation at Express Scripts, and pharmacy benefit systems at Medco.",
      },
      {
        name: "FHIR app development",
        plain: "Working FHIR apps, built fast and tested.",
        description:
          "SMART on FHIR apps and FHIR services built with agentic coding, with US Core conformance tests and a person reviewing each step.",
        deliverables: ["SMART on FHIR app", "Conformance tests", "Handover docs"],
        proof:
          "Built Smart Health Connect, which pulls records from Epic, Cerner, and other EHRs, and FHIR Builders for implementers.",
      },
    ],
    regulatory: {
      rules: [
        {
          name: "CMS-0057-F",
          scope: "Medicare Advantage, Medicaid, CHIP, and federal-exchange plans",
          href: "https://www.cms.gov/initiatives/burden-reduction/overview/interoperability/policies-regulations/cms-interoperability-prior-authorization-final-rule-cms-0057-f",
          milestones: [
            { when: "Jan 1, 2026", what: "Prior authorization decision timeframes, denial reasons, and public metrics." },
            { when: "Jan 1, 2027", what: "Provider Access, Payer-to-Payer, and Prior Authorization APIs, plus Patient Access updates." },
          ],
        },
        {
          name: "NCQA digital HEDIS",
          scope: "Health plans reporting HEDIS",
          href: "https://www.ncqa.org/blog/ncqas-proposed-timeline-for-retiring-and-replacing-hedis-hybrid-measures/",
          milestones: [
            { when: "MY 2029", what: "Hybrid method retired; measures move to ECDS." },
            { when: "MY 2030", what: "HEDIS reporting fully digital, on FHIR and CQL." },
          ],
        },
        {
          name: "TEFCA",
          scope: "Networks, providers, and payers exchanging nationally",
          href: "https://www.healthit.gov/topic/interoperability/policy/trusted-exchange-framework-and-common-agreement-tefca",
          milestones: [{ when: "Live", what: "Exchange through Qualified Health Information Networks (QHINs)." }],
        },
      ],
      note: "Dates as published by CMS and NCQA. NCQA revised some measure-level timelines in January 2026.",
    },
    ladder: [
      {
        name: "Readiness review",
        shape: "One to two weeks",
        description: "A written read on where you stand against a rule, a measure set, or an architecture decision.",
      },
      {
        name: "Delivery support",
        shape: "Fixed scope, a quarter or less",
        description: "Hands-on help getting an API, measure pipeline, or FHIR app into production and passing tests.",
      },
      {
        name: "Advisory",
        shape: "Monthly",
        description: "A standing second opinion on specs, vendors, and the rules as they change.",
      },
    ],
    resources: [
      { label: "Out of the FHIR, the podcast", kind: "Podcast", href: "https://open.spotify.com/show/6GBZT7KA1Ug8xMZ4l5LThU" },
      {
        label: "Is TEFCA a Bridge to Nowhere?",
        kind: "Essay",
        href: "https://evestel.substack.com/p/is-tefca-a-bridge-to-nowhere-why",
      },
      {
        label: "The Illusion of Interoperability",
        kind: "Essay",
        href: "https://evestel.substack.com/p/the-illusion-of-interoperability",
      },
      { label: "FHIR Builders", kind: "Implementer tools", href: "https://fhirbuilders.com" },
    ],
    bridge: {
      to: "ai",
      line: "Putting AI on clinical data? The AI practice covers agents, governance, and the controls protected data needs.",
    },
  },
];

export function practiceFor(slug: PracticeSlug): Practice {
  const p = practices.find(x => x.slug === slug);
  if (!p) throw new Error(`unknown practice: ${slug}`);
  return p;
}
