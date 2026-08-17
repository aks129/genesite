import { useState } from "react";
import Reveal from "../components/Reveal";
import USMap from "../components/USMap";
import Parallax from "../components/Parallax";
import CareerChart from "../components/CareerChart";
import { career, type City } from "../data/career";
import { expertise, tenureYears, tenureContext } from "../data/expertise";
import { events } from "../data/events";

export default function CareerPage() {
  const [activeCity, setActiveCity] = useState<City | null>(null);
  const work = career.filter(r => r.kind !== "education");
  const education = career.filter(r => r.kind === "education");

  return (
    <>
      <Reveal>
        <header className="page-head">
          <div className="dateline">Career · 2003 → present</div>
          <h1>From Brooklyn to Pittsburgh.</h1>
          <p className="lede">
            Two decades on a fairly specific path: pharmacy, then payer,
            provider, digital health, and now AI. The common thread is getting
            clinical data to move between systems and mean something when it
            arrives.
          </p>
        </header>
      </Reveal>

      <Reveal>
        <Parallax distance={22}>
          <USMap activeCity={activeCity} onCityHover={setActiveCity} />
        </Parallax>
      </Reveal>

      <Reveal>
        <section aria-labelledby="chart-h">
          <h2 id="chart-h">Timeline chart</h2>
          <CareerChart />
        </section>
      </Reveal>

      <Reveal>
        <section aria-labelledby="timeline-h">
          <h2 id="timeline-h">The timeline</h2>
          <ol className="career-timeline">
            {work.map((r, i) => (
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
        <section aria-labelledby="education-h">
          <h2 id="education-h">Education</h2>
          <ul className="education-list">
            {education.map(r => (
              <li key={r.org}>
                <span className="education-years">{r.start} → {r.end}</span>
                <div>
                  <div className="education-degree">{r.role}</div>
                  <div className="education-org">{r.org}</div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </Reveal>

      <Reveal>
        <section aria-labelledby="expertise-h" className="expertise-section">
          <h2 id="expertise-h">Subject-matter expertise</h2>
          <div className="tenure-banner" aria-label={`Over ${tenureYears} years in healthcare data`}>
            <span className="tenure-num">{tenureYears}+</span>
            <span className="tenure-label">
              <span className="tenure-years">years</span>
              <span className="tenure-context">{tenureContext}</span>
            </span>
          </div>

          <div className="expertise-grid">
            {expertise.map(group => (
              <div className="expertise-group" key={group.heading}>
                <h3>{group.heading}</h3>
                <ul>
                  {group.items.map(item => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section aria-labelledby="events-h">
          <h2 id="events-h">Connectathons &amp; hackathons</h2>
          <p>
            Standards live or die on whether people show up and plug their
            implementations into each other. These are the ones I attend.
          </p>
          <ul className="event-list">
            {events.map((e, i) => (
              <li key={`${e.title}-${i}`} className="event-item">
                <div className="event-when">
                  <span className="event-date">{e.when}</span>
                  <span className="event-org">{e.org}</span>
                </div>
                <div className="event-body">
                  <h3>
                    {e.href ? (
                      <a href={e.href} target="_blank" rel="noopener noreferrer">{e.title} ↗</a>
                    ) : e.title}
                    {e.location && <span className="event-location"> · {e.location}</span>}
                  </h3>
                  {e.tracks && e.tracks.length > 0 && (
                    <ul className="event-tracks">
                      {e.tracks.map(t => <li key={t}>{t}</li>)}
                    </ul>
                  )}
                  <p>{e.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </Reveal>

      <Reveal>
        <section aria-labelledby="next-h">
          <h2 id="next-h">What's next</h2>
          <p>
            Right now I'm focused on what happens when AI agents meet clinical
            systems. HealthClaw is the building side of that; the newsletter and
            the podcast are the writing-it-down side.
          </p>
        </section>
      </Reveal>
    </>
  );
}
