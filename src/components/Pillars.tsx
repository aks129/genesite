import { Link } from "react-router-dom";
import Reveal from "./Reveal";

export default function Pillars() {
  return (
    <Reveal>
      <section aria-labelledby="pillars-h">
        <h2 id="pillars-h">Two things.</h2>
        <div className="pillar-grid">
          <article className="pillar">
            <h3>Artificial Intelligence</h3>
            <p>
              Agents, evals, guardrails. Making machines useful — and honest
              about what they touch.
            </p>
            <ul className="pillar-words" aria-hidden="true">
              <li>build</li>
              <li>eval</li>
              <li>guard</li>
              <li>ship</li>
            </ul>
            <Link className="pillar-link" to="/projects">See the projects →</Link>
          </article>
          <article className="pillar">
            <h3>Healthcare Technology</h3>
            <p>
              FHIR, clinical data, interoperability. Moving health data so
              care actually improves.
            </p>
            <ul className="pillar-words" aria-hidden="true">
              <li>connect</li>
              <li>measure</li>
              <li>move</li>
              <li>mend</li>
            </ul>
            <Link className="pillar-link" to="/career">See the work →</Link>
          </article>
        </div>
        <p className="pillars-thread">
          Separate on purpose. The thread between them is the same: build,
          improve, help.
        </p>
      </section>
    </Reveal>
  );
}
