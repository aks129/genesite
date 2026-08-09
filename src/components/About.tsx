import { Link } from "react-router-dom";
import Reveal from "./Reveal";

export default function About() {
  return (
    <Reveal>
      <section aria-labelledby="about-h">
        <h2 id="about-h">About</h2>
        <p>
          I'm Gene, a builder in Pittsburgh. The current thing is{" "}
          <a href="https://healthclaw.io" target="_blank" rel="noopener noreferrer"><em>HealthClaw</em></a>,
          an open-source security and audit layer for AI agents working on
          clinical data. I also host <em>Out of the FHIR</em>, a podcast, and
          write <em>FHIR IQ Playbook</em>, a newsletter — both live on the{" "}
          <Link to="/writing">writing page</Link>.
        </p>
        <p>
          The longer story — two decades across pharmacy, payer, provider,
          and digital health — is on the <Link to="/career">career page</Link>.
        </p>
      </section>
    </Reveal>
  );
}
