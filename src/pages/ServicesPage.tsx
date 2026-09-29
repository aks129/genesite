import { Link } from "react-router-dom";
import Reveal from "../components/Reveal";
import Waypoint from "../components/Waypoint";
import { useCursorGlow } from "../hooks/useCursorGlow";
import { practices, type Practice } from "../data/practices";

/*
 * /expertise (and its /services alias): the threshold. Two doors, nothing else.
 *
 * Keep this page small. The moment it grows its own list of services it becomes
 * a third practice page and undoes the separation it exists to make.
 */
export default function ServicesPage() {
  return (
    <>
      <Reveal>
        <header className="page-head">
          <Waypoint />
          <div className="dateline">Expertise</div>
          <h1>Two practices.</h1>
          <p className="lede">
            AI and healthcare, kept separate on purpose. Each stands on its own
            work, and you only need to read the one you came for.
          </p>
        </header>
      </Reveal>

      <Reveal>
        <section aria-labelledby="doors-h">
          <h2 id="doors-h" className="visually-hidden">Choose a practice</h2>
          <div className="pillar-grid">
            {practices.map((p, i) => <Door key={p.slug} practice={p} index={i + 1} />)}
          </div>
        </section>
      </Reveal>
    </>
  );
}

function Door({ practice, index }: { practice: Practice; index: number }) {
  const glow = useCursorGlow();
  return (
    <article className="pillar hud" data-hud {...glow}>
      <span className="hud-index">{String(index).padStart(2, "0")}</span>
      <h3 className="glitch-target">{practice.name}</h3>
      <p>{practice.door}</p>
      <Link className="pillar-link" to={`/${practice.slug}`}>
        Enter the {practice.name.toLowerCase()} practice →
      </Link>
    </article>
  );
}
