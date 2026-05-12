import { useState } from "react";
import Reveal from "../components/Reveal";
import USMap from "../components/USMap";
import { career, type City } from "../data/career";

export default function CareerPage() {
  const [activeCity, setActiveCity] = useState<City | null>(null);

  return (
    <>
      <Reveal>
        <header className="page-head">
          <div className="dateline">Career · 2003 → present</div>
          <h1>From Brooklyn to Pittsburgh.</h1>
          <p className="lede">
            Two decades on a fairly specific path: pharmacy → payer → provider →
            digital health → AI. The throughline is the same — making clinical
            data actually move, actually count, and actually change what happens
            to patients.
          </p>
        </header>
      </Reveal>

      <Reveal>
        <USMap activeCity={activeCity} onCityHover={setActiveCity} />
      </Reveal>

      <Reveal>
        <section aria-labelledby="timeline-h">
          <h2 id="timeline-h">The timeline</h2>
          <ol className="career-timeline">
            {career.map((r, i) => (
              <li
                key={`${r.org}-${r.start}-${i}`}
                className={`career-item${activeCity === r.city ? " is-active" : ""}`}
                onMouseEnter={() => setActiveCity(r.city)}
                onMouseLeave={() => setActiveCity(null)}
              >
                <div className="career-when">
                  <span className="career-years">{r.start} → {r.end}</span>
                  <span className="career-city">{r.city === "NYC" ? "Brooklyn / NYC" : r.city === "NJ" ? "New Jersey" : "Pittsburgh"}</span>
                </div>
                <div className="career-what">
                  <div className="career-role">{r.role}</div>
                  <div className="career-org">{r.org}</div>
                  {r.note && <p className="career-note">{r.note}</p>}
                </div>
              </li>
            ))}
          </ol>
        </section>
      </Reveal>

      <Reveal>
        <section aria-labelledby="next-h">
          <h2 id="next-h">Where this is going</h2>
          <p>
            The next decade of healthcare data is being decided right now — at
            the seam where AI agents meet clinical systems. HealthClaw is my bet
            on what the runtime layer underneath that looks like, and the
            writing and speaking is the public side of trying to get the FHIR
            community to take this seriously before policy and audit catch up.
          </p>
        </section>
      </Reveal>
    </>
  );
}
