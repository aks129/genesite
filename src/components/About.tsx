import Reveal from "./Reveal";

export default function About() {
  return (
    <Reveal>
      <section aria-labelledby="about-h">
        <h2 id="about-h">About Me</h2>
        <p>
          My current bet is{" "}
          <a href="https://healthclaw.io" target="_blank" rel="noopener noreferrer"><em>HealthClaw</em></a>,
          an open-source HIPAA-aware security and audit layer for AI agents
          working on clinical data. The thesis is that the cognitive layer above
          FHIR is being rebuilt for agents and most of the FHIR community is not
          paying attention. OpenAI launched ChatGPT Health on consumer FHIR data
          in January 2026. Anthropic published a healthcare MCP repo the same
          month. Microsoft followed in April with an Agent Governance Toolkit
          mapping HIPAA to OWASP Agentic AI Top 10. HealthClaw is the runtime
          layer that policy and audit will eventually require.
        </p>
        <p>
          Day to day, I am Senior Product Manager at{" "}
          <a href="https://www.outcomes.com" target="_blank" rel="noopener noreferrer">Outcomes</a>,
          where I lead interoperability, AI, and analytics for a $50M payer
          pillar. Outcomes is the pharmacy technology platform behind 50,000+
          U.S. independent pharmacies and the country's leading CMR/MTM vendor.
          I built that pillar's interoperability strategy from zero and serve
          as the AI champion for the product organization.
        </p>
        <p>
          I write <em>FHIR IQ Playbook</em> on Substack and host{" "}
          <em>Out of the FHIR</em>, a podcast on healthcare data, AI, and the
          standards underneath them.
        </p>
        <p>
          Before this, I spent fifteen years inside large U.S. payer, provider,
          and digital health organizations. Director of Analytics at b.well
          Connected Health from 2022 to 2025, where I architected FHIR data
          ingestion, the provider directory, and clinical data layers; the
          platform was later selected by OpenAI to power ChatGPT Health. Five
          years at UPMC, an $18B integrated payer-provider, leading quality
          analytics that delivered roughly $180M in cumulative impact across
          HEDIS, patient safety, and operational programs. Earlier roles at
          Allegheny Health Network, Express Scripts, Medco, and Duane Reade.
        </p>
        <p>
          I hold an MBA in Healthcare from the University of Pittsburgh's Katz
          School of Business and live in Pittsburgh.
        </p>
      </section>
    </Reveal>
  );
}
