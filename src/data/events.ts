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
      "Participant across multiple tracks at the Pittsburgh-hosted connectathon. Hands-on work on digital quality measurement and the conversational-interoperability track that is one of the staging grounds for the cognitive layer above FHIR.",
  },
  {
    when: "2025",
    org: "Devpost",
    title: "Agents Assemble AI Hackathon",
    description:
      "Multiple submissions exploring agentic clinical workflows, HIPAA-aware tool patterns, and the runtime guardrails that HealthClaw is built around.",
  },
  {
    when: "Ongoing",
    org: "HL7",
    title: "Working group connectathons",
    description:
      "Regular participant in quality-measure and interoperability tracks. Where standards meet implementation reality — the room where the actual seams get worked out.",
  },
];
