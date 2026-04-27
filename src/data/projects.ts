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
      "A security layer between AI agents and clinical data. Redacts PHI on every read. Enforces multi-step human approval for clinical writes (proposal, permission evaluation, HMAC confirmation, immutable audit log). Twelve MCP tools. FHIR R4/R6, US Core v9.",
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
    name: "Out of the FHIR",
    href: "https://evestel.substack.com/",
    description:
      "A podcast where healthcare data gets real. Twenty-five episodes in, with HL7 work-group chairs, founders, and CMS policy makers.",
  },
  {
    name: "FHIR IQ Playbook",
    href: "https://evestel.substack.com/",
    description:
      "A weekly newsletter on FHIR implementation, healthcare AI, and quality measurement. Written for the people doing the actual work. Now read by 550+ healthcare data professionals.",
  },
];
