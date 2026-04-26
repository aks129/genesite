import Reveal from "./Reveal";
import { passions } from "../data/passions";

export default function Passions() {
  return (
    <Reveal>
      <section aria-labelledby="passions-h">
        <h2 id="passions-h">Passions</h2>
        <div className="passions-grid">
          {passions.map(p => (
            <div className="passion" key={p.title}>
              <span className="title">{p.title}</span>
              <p className="body">{p.body}</p>
            </div>
          ))}
        </div>
      </section>
    </Reveal>
  );
}
