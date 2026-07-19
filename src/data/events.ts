export type Event = {
  when: string;
  org: string;
  title: string;
  location?: string;
  tracks?: string[];
  description: string;
  href?: string;
};

export const events: Event[] = [
  {
    when: "Sep 2025",
    org: "HL7 / CMS",
    title: "Connectathon",
    location: "Pittsburgh, PA",
    tracks: [
      "Quality measures — digital quality",
      "Scheduling",
      "Conversational interoperability",
    ],
    description:
      "Participant across multiple tracks at the Pittsburgh-hosted connectathon, with hands-on work on digital quality measurement and conversational interoperability.",
  },
  {
    when: "2025",
    org: "Devpost",
    title: "Agents Assemble AI Hackathon",
    description:
      "Multiple submissions exploring agentic clinical workflows, HIPAA-aware tool patterns, and the guardrails that became HealthClaw.",
  },
  {
    when: "Ongoing",
    org: "HL7",
    title: "Working group connectathons",
    description:
      "Regular participant in quality-measure and interoperability tracks — the fastest way to find out whether a spec survives contact with real implementations.",
  },
];
