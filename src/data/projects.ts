export type ProjectStatus = "live" | "beta" | "early" | "archived";

export type Project = {
  name: string;
  href?: string;
  repo?: string;
  status?: ProjectStatus;
  stack?: string[];
  description: string;
};

export const projects: Project[] = [
  {
    name: "HealthClaw",
    href: "https://healthclaw.io",
    repo: "https://github.com/aks129",
    status: "beta",
    stack: ["TypeScript", "MCP", "FHIR R4/R6", "US Core v9", "HMAC audit"],
    description:
      "A HIPAA-aware security and audit layer for AI agents working on clinical data. Redacts PHI on every read. Enforces multi-step human approval for clinical writes (proposal, permission evaluation, HMAC confirmation, immutable audit log). Twelve MCP tools. Mapping to OWASP Agentic AI Top 10 and the 2025 HIPAA Security Rule update.",
  },
  {
    name: "HealthClawBench",
    status: "early",
    stack: ["Evaluation harness", "PHI redaction", "Agentic workflows"],
    description:
      "An open evaluation harness for PHI leakage in agentic clinical workflows. Inspired by HealthBench, focused on the failure modes that matter when an agent has read or write access to a real patient record.",
  },
  {
    name: "Smart Health Connect",
    status: "beta",
    stack: ["SMART-on-FHIR", "Epic", "Cerner", "OAuth2"],
    description:
      "A SMART-on-FHIR patient records platform that aggregates data from Epic, Cerner, and other EHRs into a single secure interface. The data layer HealthClaw agents work against.",
  },
  {
    name: "FHIR Builders",
    href: "https://fhirbuilders.com",
    status: "live",
    stack: ["FHIR patterns", "Implementer tooling"],
    description:
      "A companion site for the implementer community — patterns, examples, and small tools for people doing the actual FHIR work.",
  },
  {
    name: "AI NPI",
    href: "https://ainpi.dev",
    status: "early",
    stack: ["AI identity", "Healthcare", "Agents"],
    description:
      "An experiment in identity for AI agents operating in healthcare contexts. Early, opinionated, and small.",
  },
];
