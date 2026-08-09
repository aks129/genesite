import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-h">
      <div className="hero-text">
        <div className="dateline">Pittsburgh, Pennsylvania</div>
        <h1 id="hero-h">
          Build things.
          <br />
          Make them <em>better.</em>
          <br />
          Help people solve <em>real problems.</em>
        </h1>
        <p className="hero-id">
          Gene Vestel — host of <em>Out of the FHIR</em>, author of{" "}
          <em>FHIR IQ Playbook</em>, building{" "}
          <a href="https://healthclaw.io" target="_blank" rel="noopener noreferrer">HealthClaw</a>.
        </p>
        <div className="hero-ctas">
          <a
            className="hero-cta"
            href="https://open.spotify.com/show/6GBZT7KA1Ug8xMZ4l5LThU"
            target="_blank"
            rel="noopener noreferrer"
          >
            Listen to the podcast
          </a>
          <a
            className="hero-cta"
            href="https://evestel.substack.com/subscribe"
            target="_blank"
            rel="noopener noreferrer"
          >
            Subscribe to the newsletter
          </a>
          <Link className="hero-cta hero-cta-quiet" to="/expertise">
            Work with me →
          </Link>
        </div>
      </div>
    </section>
  );
}
