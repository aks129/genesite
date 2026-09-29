import { Link } from "react-router-dom";
import Reveal from "../components/Reveal";
import Waypoint from "../components/Waypoint";
import { useCursorGlow } from "../hooks/useCursorGlow";
import { practiceFor, type Offering, type PracticeSlug } from "../data/practices";

/*
 * One page shape for both practices, so AI and healthcare read as equals.
 *
 * Order follows what a buyer needs to decide: who it is for, what I do, the
 * proof, then how to start. The engagement ladder goes last on purpose: the
 * site-wide contact panel renders directly beneath it, so "how to start" runs
 * straight into the booking link.
 */
export default function PracticePage({ slug }: { slug: PracticeSlug }) {
  const p = practiceFor(slug);
  const other = practiceFor(p.bridge.to);
  const id = (s: string) => `${p.slug}-${s}-h`;

  return (
    <>
      <Reveal>
        <header className="page-head">
          <Waypoint />
          <div className="dateline">{p.dateline}</div>
          <h1>{p.headline}</h1>
          <p className="lede">{p.lede}</p>
          <dl className="practice-stats">
            {p.stats.map(s => (
              <div key={s.label}>
                <dt>{s.value}</dt>
                <dd>{s.label}</dd>
              </div>
            ))}
          </dl>
        </header>
      </Reveal>

      <Reveal>
        <section aria-labelledby={id("fit")}>
          <h2 id={id("fit")}>Who this is for</h2>
          <div className="practice-fit">
            <div>
              <h3 className="practice-fit-label">A good fit</h3>
              <ul>{p.forWho.map(x => <li key={x}>{x}</li>)}</ul>
            </div>
            <div>
              <h3 className="practice-fit-label practice-fit-label--no">Not a fit</h3>
              <ul>{p.notFor.map(x => <li key={x}>{x}</li>)}</ul>
            </div>
          </div>
        </section>
      </Reveal>

      {p.segments && (
        <Reveal>
          <section aria-labelledby={id("who")}>
            <h2 id={id("who")}>Who I help</h2>
            <ul className="practice-segments">
              {p.segments.map(s => (
                <li key={s.who}>
                  <span className="practice-segment-who">{s.who}</span>
                  <span className="practice-segment-need">{s.need}</span>
                </li>
              ))}
            </ul>
          </section>
        </Reveal>
      )}

      <Reveal>
        <section aria-labelledby={id("work")}>
          <h2 id={id("work")}>What I do</h2>
          <div className="project-cards">
            {p.offerings.map((o, i) => <OfferingCard key={o.name} offering={o} index={i + 1} />)}
          </div>
        </section>
      </Reveal>

      {p.regulatory && (
        <Reveal>
          <section aria-labelledby={id("rules")}>
            <h2 id={id("rules")}>The rules and the dates</h2>
            <div className="practice-rules">
              {p.regulatory.rules.map(r => (
                <article className="practice-rule" key={r.name}>
                  <h3>
                    <a href={r.href} target="_blank" rel="noopener noreferrer">
                      {r.name} <span aria-hidden="true">↗</span>
                    </a>
                  </h3>
                  <p className="practice-rule-scope">{r.scope}</p>
                  <ol>
                    {r.milestones.map(m => (
                      <li key={m.when}>
                        <span className="practice-rule-when">{m.when}</span>
                        <span>{m.what}</span>
                      </li>
                    ))}
                  </ol>
                </article>
              ))}
            </div>
            <p className="practice-note">{p.regulatory.note}</p>
          </section>
        </Reveal>
      )}

      <Reveal>
        <section aria-labelledby={id("read")}>
          <h2 id={id("read")}>Read first</h2>
          <ul className="practice-resources">
            {p.resources.map(r => (
              <li key={r.href}>
                <span className="practice-resource-kind">{r.kind}</span>
                <a href={r.href} target="_blank" rel="noopener noreferrer">
                  {r.label} <span aria-hidden="true">↗</span>
                </a>
              </li>
            ))}
          </ul>
          <p className="practice-bridge">
            {p.bridge.line}{" "}
            <Link to={`/${other.slug}`}>The {other.name.toLowerCase()} practice →</Link>
          </p>
        </section>
      </Reveal>

      <Reveal>
        <section aria-labelledby={id("start")}>
          <h2 id={id("start")}>How to start</h2>
          <ol className="practice-ladder">
            {p.ladder.map((r, i) => (
              <li key={r.name}>
                <span className="practice-ladder-step">{String(i + 1).padStart(2, "0")}</span>
                <h3>{r.name}</h3>
                <p className="practice-ladder-shape">{r.shape}</p>
                <p>{r.description}</p>
              </li>
            ))}
          </ol>
          <p className="practice-note">
            Every engagement starts with an intro call. Book one below.
          </p>
        </section>
      </Reveal>
    </>
  );
}

function OfferingCard({ offering, index }: { offering: Offering; index: number }) {
  const glow = useCursorGlow();
  return (
    <article className="project-card hud" data-hud {...glow}>
      <span className="hud-index">{String(index).padStart(2, "0")}</span>
      <header className="project-card-head">
        <h3 className="glitch-target">{offering.name}</h3>
      </header>
      <p className="service-tagline">{offering.plain}</p>
      <p className="project-card-body">{offering.description}</p>
      <ul className="stack" aria-label="Deliverables">
        {offering.deliverables.map(d => <li key={d}>{d}</li>)}
      </ul>
      {offering.proof && (
        <p className="service-proof">
          <span className="service-proof-label">Where I've done this:</span> {offering.proof}
        </p>
      )}
    </article>
  );
}
