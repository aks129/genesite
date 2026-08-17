import { Link } from "react-router-dom";
import Reveal from "./Reveal";
import ScrambleText from "./ScrambleText";
import { useCursorGlow } from "../hooks/useCursorGlow";

type Pillar = {
  id: string;
  title: string;
  body: string;
  words: string[];
  to: string;
  cta: string;
};

const PILLARS: Pillar[] = [
  {
    id: "01",
    title: "Artificial Intelligence",
    body:
      "Agents, evals, guardrails. Making machines useful — and honest about what they touch.",
    words: ["build", "eval", "guard", "ship"],
    to: "/projects",
    cta: "See the projects →",
  },
  {
    id: "02",
    title: "Healthcare Technology",
    body:
      "FHIR, clinical data, interoperability. Moving health data so care actually improves.",
    words: ["connect", "measure", "move", "mend"],
    to: "/career",
    cta: "See the work →",
  },
];

export default function Pillars() {
  return (
    <Reveal>
      <section aria-labelledby="pillars-h">
        <h2 id="pillars-h">Two things.</h2>
        <div className="pillar-grid">
          {PILLARS.map(p => <PillarCard key={p.id} pillar={p} />)}
        </div>
        <p className="pillars-thread">
          Separate on purpose. The thread between them is the same: build,
          improve, help.
        </p>
      </section>
    </Reveal>
  );
}

function PillarCard({ pillar }: { pillar: Pillar }) {
  const glow = useCursorGlow();
  return (
    <article className="pillar hud" data-hud {...glow}>
      <span className="hud-index">{pillar.id}</span>
      <h3 className="glitch-target">{pillar.title}</h3>
      <p>{pillar.body}</p>
      <ul className="pillar-words" aria-hidden="true">
        {pillar.words.map(w => (
          <li key={w}><ScrambleText text={w} trigger="hover" speed={34} /></li>
        ))}
      </ul>
      <Link className="pillar-link" to={pillar.to}>{pillar.cta}</Link>
    </article>
  );
}
