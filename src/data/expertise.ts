export type ExpertiseGroup = {
  heading: string;
  items: string[];
};

export const expertise: ExpertiseGroup[] = [
  {
    heading: "Data & analytics",
    items: [
      "HEDIS quality measurement",
      "Claims data analysis",
      "Analytics roadmaps & strategy",
      "Data products",
      "Data management",
      "Data governance",
      "BI / data warehousing",
    ],
  },
  {
    heading: "AI & product",
    items: [
      "Agentic AI prototyping",
      "Product management",
      "Idea → working agent in days",
      "AI champion (product organization)",
      "Discovery & roadmapping",
      "Design partner enablement",
    ],
  },
  {
    heading: "Standards & interoperability",
    items: [
      "FHIR R4 / R6",
      "US Core v9",
      "SMART on FHIR",
      "CMS-0057 / TEFCA",
      "Da Vinci IGs",
      "HL7 v2 (legacy)",
      "Model Context Protocol",
    ],
  },
];

export const tenureYears = 15;
export const tenureContext =
  "Healthcare data — across pharmacy, payer, provider, and digital health.";
