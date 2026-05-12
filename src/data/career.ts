/**
 * Career timeline data + geographic anchor for the SVG U.S. map.
 *
 * `city` is one of three pinned locations on the map. `mapX` and `mapY`
 * are approximate normalized coordinates (0-1) inside the U.S. East SVG
 * viewBox. They live with the city rather than each role so multiple
 * roles in the same city share the same pin.
 */

export type City = "NYC" | "NJ" | "PGH";

export const cityCoords: Record<City, { x: number; y: number; label: string }> = {
  NYC: { x: 0.78, y: 0.36, label: "Brooklyn / NYC" },
  NJ:  { x: 0.74, y: 0.41, label: "New Jersey" },
  PGH: { x: 0.58, y: 0.42, label: "Pittsburgh, PA" },
};

export type CareerRole = {
  start: string;          // e.g. "2003" or "Mar 2025"
  end: string;            // e.g. "2007" or "present"
  role: string;
  org: string;
  city: City;
  note?: string;
};

export const career: CareerRole[] = [
  {
    start: "2002",
    end: "2006",
    role: "B.S., Business Administration & Management",
    org: "Brooklyn College",
    city: "NYC",
    note: "Where it started. Working at Duane Reade through school.",
  },
  {
    start: "2003",
    end: "2007",
    role: "Manager, Pharmacy Business Analysis",
    org: "Duane Reade",
    city: "NYC",
  },
  {
    start: "2007",
    end: "2010",
    role: "Systems Analyst",
    org: "Medco Health Solutions",
    city: "NJ",
    note: "First post-college job. Pharmacy benefit management at scale.",
  },
  {
    start: "2010",
    end: "2013",
    role: "Sr. Data Reconciliation Analyst, Medicare Part D",
    org: "Express Scripts",
    city: "NJ",
  },
  {
    start: "2013",
    end: "2014",
    role: "Data Warehouse Architect → Sr. Data Warehouse Engineer",
    org: "I.D. Systems / EDMC",
    city: "PGH",
    note: "Move to Pittsburgh.",
  },
  {
    start: "2014",
    end: "2016",
    role: "Manager, Business Intelligence",
    org: "Allegheny Health Network",
    city: "PGH",
  },
  {
    start: "2016",
    end: "2018",
    role: "MBA, Healthcare",
    org: "University of Pittsburgh — Katz School of Business",
    city: "PGH",
  },
  {
    start: "2017",
    end: "2022",
    role: "Manager, Strategic Data Management & Quality Analytics",
    org: "UPMC Health Plan",
    city: "PGH",
    note: "Five years. Roughly $180M of cumulative impact across HEDIS, patient-safety, and operational programs.",
  },
  {
    start: "2022",
    end: "2025",
    role: "Director of Analytics",
    org: "b.well Connected Health",
    city: "PGH",
    note: "Architected FHIR data ingestion, provider directory, and clinical data layers. Platform later selected by OpenAI to power ChatGPT Health.",
  },
  {
    start: "Mar 2025",
    end: "Aug 2025",
    role: "Digital Quality & FHIR Advisor",
    org: "NCQA",
    city: "PGH",
  },
  {
    start: "2025",
    end: "present",
    role: "Founder",
    org: "HealthClaw",
    city: "PGH",
    note: "HIPAA-aware AI agent infrastructure for clinical data.",
  },
  {
    start: "2025",
    end: "present",
    role: "Senior Product Manager — Interoperability, AI & Analytics",
    org: "Pharmacy technology platform",
    city: "PGH",
  },
];
