import Reveal from "./Reveal";
import { socials } from "../data/socials";

export default function Socials() {
  return (
    <Reveal>
      <section aria-labelledby="socials-h">
        <h2 id="socials-h">Socials</h2>
        <ul className="socials">
          {socials.map(s => (
            <li key={s.href}>
              <a href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</a>
            </li>
          ))}
        </ul>
      </section>
    </Reveal>
  );
}
