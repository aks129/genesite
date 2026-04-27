export type Project = {
  name: string;
  href?: string;
  description: string;
};

export const projects: Project[] = [
  {
    name: "HealthClaw",
    href: "https://healthclaw.io",
    description:
      "A HIPAA-aware security and audit layer for AI agents working on clinical data. Redacts PHI on every read. Enforces multi-step human approval for clinical writes (proposal, permission evaluation, HMAC confirmation, immutable audit log). Twelve MCP tools. FHIR R4/R6, US Core v9. Mapping to OWASP Agentic AI Top 10 and the 2025 HIPAA Security Rule update.",
  },
  {
    name: "HealthClawBench",
    description:
      "An open evaluation harness for PHI leakage in agentic clinical workflows. Inspired by HealthBench, focused on the failure modes that matter when an agent has read or write access to a real patient record. Early.",
  },
  {
    name: "Smart Health Connect",
    description:
      "A SMART-on-FHIR patient records platform that aggregates data from Epic, Cerner, and other EHRs into a single secure interface. The data layer HealthClaw agents work against.",
  },
  {
    name: "FHIR Builders",
    href: "https://fhirbuilders.com",
    description:
      "A companion site for the implementer community — patterns, examples, and small tools for people doing the actual FHIR work.",
  },
  {
    name: "AI NPI",
    href: "https://ainpi.dev",
    description:
      "An experiment in identity for AI agents operating in healthcare contexts. Early, opinionated, and small.",
  },
  {
    name: "FHIR IQ Playbook",
    href: "https://evestel.substack.com/",
    description:
      "A Substack on FHIR implementation, healthcare AI, and the cognitive layer being built above the standards. Written for the people doing the actual work. 550+ subscribers in the first year.",
  },
  {
    name: "Out of the FHIR",
    href: "https://evestel.substack.com/",
    description:
      "Twenty-five episodes in, conversations with HL7 work-group chairs, founders, and CMS policy makers. The stories behind the standards.",
  },
];
