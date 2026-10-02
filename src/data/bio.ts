/*
 * Speaker and press bio, for event organizers and podcast hosts to copy.
 *
 * Shape borrowed from how established healthcare executives present
 * themselves in press releases and speaker bios: title and organization
 * first, then what the person builds, then the arc from analysis to
 * leadership, then education last. Third person, so it can be pasted as is.
 *
 * Facts only from the rest of the site (career.ts, projects.ts, speaking.ts,
 * passions.ts). No em dashes.
 *
 * Known gap: the current role reads "at a technology platform" because
 * career.ts names no employer. Gene to decide how to name it.
 */

export type Bio = { short: string; long: string };

export const bio: Bio = {
  short:
    "Gene Vestel is VP of AI for Data, AI & Analytics at a technology platform and the founder of HealthClaw, open-source controls for AI agents working on clinical data. He hosts the Out of the FHIR podcast and writes the FHIR IQ Playbook newsletter. He has spent two decades in healthcare data, across pharmacy benefits, health plans, providers, and digital health.",
  long:
    "Gene Vestel is VP of AI for Data, AI & Analytics at a technology platform and the founder of HealthClaw, open-source controls for AI agents working on clinical data. He hosts the Out of the FHIR podcast and writes the FHIR IQ Playbook newsletter.\n\n" +
    "Gene started in pharmacy business analysis at Duane Reade, then worked on pharmacy benefit systems at Medco and Medicare Part D data reconciliation at Express Scripts. In Pittsburgh he managed business intelligence at Allegheny Health Network, spent five years leading HEDIS, patient-safety, and quality analytics at UPMC Health Plan, and was Director of Analytics at b.well Connected Health, where he built the FHIR data ingestion and clinical data layers. In 2025 he advised NCQA on digital quality measurement and FHIR.\n\n" +
    "He founded the Pittsburgh Health Analytics meetup, which has grown past 110 members. He holds an MBA in healthcare from the University of Pittsburgh Katz School of Business and a B.S. in business administration and management from Brooklyn College.",
};
