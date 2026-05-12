import Reveal from "../components/Reveal";
import { writings } from "../data/writings";

export default function WritingPage() {
  return (
    <>
      <Reveal>
        <header className="page-head">
          <div className="dateline">Writing · podcast · Substack</div>
          <h1>The thing I publish in the open.</h1>
          <p className="lede">
            One newsletter, one podcast, one thesis: the cognitive layer above
            FHIR is being rebuilt for agents, and the FHIR community needs to
            be paying attention.
          </p>
        </header>
      </Reveal>

      {writings.map(w => (
        <Reveal key={w.name}>
          <section className="writing-entry" aria-labelledby={`w-${w.name.replace(/\s+/g, "-")}`}>
            <div className="writing-kind">{w.kind === "newsletter" ? "Newsletter" : "Podcast"}</div>
            <h2 id={`w-${w.name.replace(/\s+/g, "-")}`}>
              <a href={w.href} target="_blank" rel="noopener noreferrer">{w.name} ↗</a>
            </h2>
            <p className="writing-tagline">{w.tagline}</p>
            <p>{w.description}</p>
            {w.platforms && w.platforms.length > 0 && (
              <ul className="platforms" aria-label="Where to find it">
                {w.platforms.map(p => (
                  <li key={p.href}>
                    <a href={p.href} target="_blank" rel="noopener noreferrer">{p.label}</a>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </Reveal>
      ))}

      <Reveal>
        <section aria-labelledby="archive-h">
          <h2 id="archive-h">Archive</h2>
          <p>
            Older essays, talks, and the public CMS RFI response live across{" "}
            <a href="https://evestel.substack.com/" target="_blank" rel="noopener noreferrer">Substack</a>
            {" "}and{" "}
            <a href="https://github.com/aks129" target="_blank" rel="noopener noreferrer">GitHub</a>.
            If you want to be on the list for new issues, the Substack is the
            place.
          </p>
        </section>
      </Reveal>
    </>
  );
}
