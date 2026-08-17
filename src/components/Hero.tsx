import { Link } from "react-router-dom";
import ScrambleText from "./ScrambleText";
import { useMagnetic } from "../hooks/useMagnetic";

export default function Hero() {
  const magA = useMagnetic();
  const magB = useMagnetic();
  const magC = useMagnetic();

  return (
    <section className="hero" aria-labelledby="hero-h">
      <div className="hero-text">
        <div className="dateline">
          <ScrambleText text="pittsburgh, pennsylvania" speed={20} />
        </div>
        <h1 id="hero-h" className="hero-h">
          <span className="hl"><span>Build things.</span></span>
          <span className="hl"><span>Make them <em>better.</em></span></span>
          <span className="hl"><span>Help people solve <em>real problems.</em></span></span>
        </h1>
        <p className="hero-id">
          Gene Vestel — host of <em>Out of the FHIR</em>, author of{" "}
          <em>FHIR IQ Playbook</em>, building{" "}
          <a href="https://healthclaw.io" target="_blank" rel="noopener noreferrer">HealthClaw</a>.
        </p>
        <div className="hero-ctas">
          <a
            className="hero-cta magnetic"
            href="https://open.spotify.com/show/6GBZT7KA1Ug8xMZ4l5LThU"
            target="_blank"
            rel="noopener noreferrer"
            data-hud
            {...magA}
          >
            <ScrambleText text="Listen to the podcast" trigger="hover" speed={22} />
          </a>
          <a
            className="hero-cta magnetic"
            href="https://evestel.substack.com/subscribe"
            target="_blank"
            rel="noopener noreferrer"
            data-hud
            {...magB}
          >
            <ScrambleText text="Subscribe to the newsletter" trigger="hover" speed={22} />
          </a>
          <Link className="hero-cta hero-cta-quiet magnetic" to="/expertise" data-hud {...magC}>
            <ScrambleText text="Work with me →" trigger="hover" speed={22} />
          </Link>
        </div>
      </div>
    </section>
  );
}
