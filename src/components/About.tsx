import Reveal from "./Reveal";

export default function About() {
  return (
    <Reveal>
      <section aria-labelledby="about-h">
        <h2 id="about-h">About Me</h2>
        <p>
          Right now I am Senior Lead for Payer Interoperability, Analytics, and AI at{" "}
          <a href="https://www.outcomes.com" target="_blank" rel="noopener noreferrer">Outcomes</a>,
          the pharmacy technology company behind 50,000+ U.S. independent pharmacies and
          the country's leading CMR/MTM vendor. I built that pillar's interoperability
          strategy from scratch and serve as the AI champion for the product organization
          — helping teams move from PowerPoint mocks to working agentic prototypes in
          days rather than months.
        </p>
        <p>
          In parallel I run <a href="https://fhiriq.com" target="_blank" rel="noopener noreferrer">FHIR IQ</a>,
          an independent practice and open-source studio. There I host the{" "}
          <em>Out of the FHIR</em> podcast, write the <em>FHIR IQ Playbook</em> Substack,
          and ship small open-source tools — including <em>HealthClaw</em>, a HIPAA-aware
          security layer for AI agents working on clinical data, and{" "}
          <em>Smart Health Connect</em>, a SMART-on-FHIR personal health record.
        </p>
        <p>
          Before this, I was Director of Analytics at b.well Connected Health from 2022
          to 2025, where the platform I architected was used by Walgreens and Samsung
          Health and connected to over 300 healthcare organizations through national
          exchanges. For five years before that I led quality analytics at UPMC, an $18B
          integrated payer-provider, where the work translated to roughly $180M of
          cumulative impact across HEDIS, patient-safety, and operational programs.
          Earlier still, I built BI for Allegheny Health Network and worked at Express
          Scripts, Medco, and Duane Reade.
        </p>
        <p>
          I hold an MBA in Healthcare from the University of Pittsburgh's Katz School of
          Business and live in Pittsburgh.
        </p>
      </section>
    </Reveal>
  );
}
