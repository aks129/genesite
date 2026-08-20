import Reveal from "../components/Reveal";
import { talks } from "../data/speaking";
import Waypoint from "../components/Waypoint";
import ScreenPlayer from "../components/ScreenPlayer";

export default function SpeakingPage() {
  const upcoming = talks.filter(t => t.upcoming);
  const past = talks.filter(t => !t.upcoming);

  return (
    <>
      <Reveal>
        <header className="page-head">
          <Waypoint />
          <div className="dateline">Speaking · panels · meetups</div>
          <h1>Talks, panels, and the meetup.</h1>
          <p className="lede">
            A handful of speaking engagements each year — conference talks,
            panels, podcast guesting, and internal AI + FHIR sessions for
            product teams.
          </p>
        </header>
      </Reveal>

      <ScreenPlayer />

      {upcoming.length > 0 && (
        <Reveal>
          <section className="upcoming-block" aria-labelledby="upcoming-h">
            <h2 id="upcoming-h">Upcoming</h2>
            <ul className="talk-list">
              {upcoming.map(t => (
                <li key={t.title} className="talk-item is-upcoming">
                  <div className="talk-when">
                    <span className="tag">Upcoming</span>
                    <span className="talk-year">{t.year}</span>
                  </div>
                  <div className="talk-body">
                    <h3>
                      {t.href ? (
                        <a href={t.href} target="_blank" rel="noopener noreferrer">{t.title} ↗</a>
                      ) : t.title}
                    </h3>
                    <div className="talk-venue">{t.venue}</div>
                    <p>{t.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </Reveal>
      )}

      <Reveal>
        <section aria-labelledby="past-h">
          <h2 id="past-h">Recent</h2>
          <ul className="talk-list">
            {past.map((t, i) => (
              <li key={`${t.title}-${i}`} className="talk-item">
                <div className="talk-when">
                  <span className="talk-year">{t.year}</span>
                </div>
                <div className="talk-body">
                  <h3>
                    {t.href ? (
                      <a href={t.href} target="_blank" rel="noopener noreferrer">{t.title} ↗</a>
                    ) : t.title}
                  </h3>
                  <div className="talk-venue">{t.venue}</div>
                  <p>{t.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </Reveal>

      <Reveal>
        <section aria-labelledby="invite-h">
          <h2 id="invite-h">Want me to speak?</h2>
          <p>
            Available for conference talks, panels, podcast guesting, and
            internal AI + FHIR sessions.{" "}
            <a href="mailto:gene@fhiriq.com">Get in touch.</a>{" "}
            Or{" "}
            <a href="https://calendar.app.google/EtMLLLeZmA42877T9" target="_blank" rel="noopener noreferrer">
              grab time directly on my calendar
            </a>.
          </p>
        </section>
      </Reveal>
    </>
  );
}
