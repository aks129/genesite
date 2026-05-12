export type Talk = {
  year: string;             // "2025", "2026", "Ongoing"
  upcoming?: boolean;       // true → highlight on the page
  title: string;
  venue: string;
  description: string;
  href?: string;
};

export const talks: Talk[] = [
  {
    year: "Jun 2026",
    upcoming: true,
    title: "FHIR DevDays",
    venue: "FHIR DevDays · Amsterdam",
    description:
      "Speaking on the cognitive layer being built above FHIR — and what the FHIR community needs to do about HIPAA-aware AI agents before policy and audit catch up.",
    href: "https://devdays.com",
  },
  {
    year: "2025",
    title: "Pitt Business Impact Conference on AI",
    venue: "Pitt Business · Panel",
    description:
      "Panelist alongside leaders from Microsoft, GE HealthCare, NIST, and Wharton on AI's emerging role across industries.",
  },
  {
    year: "2025",
    title: "Analytics on FHIR",
    venue: "FHIR Community Working Group",
    description:
      "Presenter on payer analytics, quality measurement, and the data plumbing required to make HEDIS work end-to-end on FHIR.",
  },
  {
    year: "2025",
    title: "CMS RFI on Health Technology",
    venue: "FHIR IQ — public response",
    description:
      "Authored FHIR IQ's public response on the interoperability impasse and market design. Submitted to CMS.",
  },
  {
    year: "Ongoing",
    title: "Pittsburgh Health Analytics",
    venue: "Founder and organizer",
    description:
      "Meetup community for healthcare analytics, FHIR, and data infrastructure in Pittsburgh. 110+ members.",
  },
];
