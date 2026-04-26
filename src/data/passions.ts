export type Passion = {
  kind: "professional" | "personal";
  title: string;
  body: string;
};

export const passions: Passion[] = [
  {
    kind: "professional",
    title: "FHIR and interoperability",
    body:
      "Healthcare data is mostly a coordination problem dressed up as a technical one. I keep working on the seams — payer/provider, EHR/agent, standard/implementation — because that is where the leverage is.",
  },
  {
    kind: "professional",
    title: "AI safety in clinical contexts",
    body:
      "Agents writing to clinical systems is a fundamentally different problem than agents writing emails. HealthClaw is my attempt to take that difference seriously: redaction by default, multi-step human approval, immutable audit.",
  },
  {
    kind: "professional",
    title: "Building the Pittsburgh community",
    body:
      "I founded Pittsburgh Health Analytics and helped grow it past 110 members. The point is the room — the conversations between sessions are usually worth more than the talks.",
  },
  {
    kind: "personal",
    title: "Travel with Stacy",
    body:
      "My wife Stacy and I plan trips the way other people plan careers. The work-travel section below is mostly her doing.",
  },
  {
    kind: "personal",
    title: "Sports and fishing with the kids",
    body:
      "Most weekends find us on a field, a court, or a dock. Fishing with the kids is the closest thing I have to a meditation practice.",
  },
  {
    kind: "personal",
    title: "Music, history, reading",
    body:
      "I listen across genres without much loyalty to any of them. History and long-form reading are the counterweight to a job that mostly happens in tabs.",
  },
];
