import Reveal from "./Reveal";

export default function About() {
  return (
    <Reveal>
      <section aria-labelledby="about-h">
        <h2 id="about-h">About Me</h2>
        <p>
          I created{" "}
          <a href="https://healthclaw.io" target="_blank" rel="noopener noreferrer"><em>HealthClaw</em></a>,
          an open-source HIPAA-aware security and audit layer for AI agents
          working on clinical data. Over the past year OpenAI, Anthropic, and
          Microsoft have all shipped tooling that puts agents next to health
          records. HealthClaw is my attempt at the security and audit layer
          that work is going to need.
        </p>
        <p>
          I write <em>FHIR IQ Playbook</em> on Substack and host{" "}
          <em>Out of the FHIR</em>, a podcast on healthcare data, AI, and the
          standards underneath them. In June 2026 I am speaking at{" "}
          <a href="https://devdays.com" target="_blank" rel="noopener noreferrer">FHIR DevDays</a>.
        </p>
        <p>
          Before this, I spent fifteen years inside large U.S. payer, provider,
          and digital health organizations. Most recently I was Director of
          Analytics at b.well Connected Health, where I built the FHIR data
          ingestion, provider directory, and clinical data layers. Before that, five years
          leading quality analytics at UPMC across HEDIS, patient safety, and
          operational programs. Earlier roles at Allegheny Health Network,
          Express Scripts, Medco, and Duane Reade.
        </p>
        <p>
          By day, VP of AI — leading data and AI strategy across product,
          engineering, and analytics teams. My work spans applied AI and data:
          in healthcare around FHIR and clinical data, and increasingly well
          beyond it.
        </p>
        <p>
          I hold an MBA in Healthcare from the University of Pittsburgh's Katz
          School of Business and live in Pittsburgh.
        </p>
      </section>
    </Reveal>
  );
}
