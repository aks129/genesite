import Reveal from "./Reveal";

export default function About() {
  return (
    <Reveal>
      <section aria-labelledby="about-h">
        <h2 id="about-h">About Me</h2>
        <p>
          I have spent two decades building the data systems that healthcare runs on
          — BI at hospitals, quality analytics at one of the country's largest
          integrated payer-providers, interoperability platforms used by Walgreens
          and Samsung. The throughline is the same: making clinical data actually
          move, actually count, and actually change what happens to patients.
        </p>
        <p>
          For five years at UPMC, an $18B integrated payer-provider, the work
          translated to roughly $180M of cumulative impact across HEDIS,
          patient-safety, and operational programs. Then three years as Director of
          Analytics at b.well Connected Health, where the platform I architected
          connected 300+ healthcare organizations through national exchanges and
          powered consumer experiences for Walgreens and Samsung Health. Before
          that, BI at Allegheny Health Network and earlier roles at Express Scripts,
          Medco, and Duane Reade.
        </p>
        <p>
          These days the work has two homes. I run{" "}
          <a href="https://fhiriq.com" target="_blank" rel="noopener noreferrer">FHIR IQ</a>,
          an independent practice and open-source studio where I host the{" "}
          <em>Out of the FHIR</em> podcast, write the <em>FHIR IQ Playbook</em>{" "}
          Substack, and ship small open-source tools — <em>HealthClaw</em>, a
          HIPAA-aware security layer for AI agents working on clinical data, and{" "}
          <em>Smart Health Connect</em>, a SMART-on-FHIR personal health record.
          And I lead the interoperability, AI, and analytics product for a $50M
          payer pillar at{" "}
          <a href="https://www.outcomes.com" target="_blank" rel="noopener noreferrer">Outcomes</a>,
          the pharmacy technology company behind 50,000+ U.S. independent
          pharmacies.
        </p>
        <p>
          MBA in Healthcare from the University of Pittsburgh's Katz School of
          Business. Live in Pittsburgh.
        </p>
      </section>
    </Reveal>
  );
}
