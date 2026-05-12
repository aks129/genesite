import Reveal from "../components/Reveal";
import { passions } from "../data/passions";

export default function HobbiesPage() {
  const personal = passions.filter(p => p.kind === "personal");

  return (
    <>
      <Reveal>
        <header className="page-head">
          <div className="dateline">Outside work · the human stuff</div>
          <h1>Hobbies, family, side quests.</h1>
          <p className="lede">
            What I do when I am not in tabs. Mostly family, mostly outside,
            occasionally a guitar.
          </p>
        </header>
      </Reveal>

      <Reveal>
        <section aria-labelledby="passions-h">
          <h2 id="passions-h">The big ones</h2>
          <div className="passions-grid">
            {personal.map(p => (
              <div className="passion" key={p.title}>
                <span className="title">{p.title}</span>
                <p className="body">{p.body}</p>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section aria-labelledby="more-hobbies-h">
          <h2 id="more-hobbies-h">A few more</h2>
          <ul className="hobby-list">
            <li><strong>Cooking with the kids.</strong> Long Saturday cooks. Smoker on the deck when the weather plays along.</li>
            <li><strong>Pittsburgh sports.</strong> Steelers, Penguins, Pirates — in that order, most years.</li>
            <li><strong>Guitar.</strong> Self-taught, intermediate, mostly campfire-grade. Always trying to learn one more song.</li>
            <li><strong>Reading.</strong> Nonfiction-heavy. Recent: histories of the FDA, healthcare policy memoirs, the occasional sci-fi.</li>
            <li><strong>Travel research.</strong> Stacy plans the trips, I obsess over the maps.</li>
          </ul>
        </section>
      </Reveal>
    </>
  );
}
