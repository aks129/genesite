import Reveal from "./Reveal";
import { projects } from "../data/projects";

export default function Projects() {
  return (
    <Reveal>
      <section aria-labelledby="projects-h">
        <h2 id="projects-h">Projects</h2>
        {projects.map(p => (
          <div className="project" key={p.name}>
            <p>
              <span className="name">
                {p.href ? (
                  <a href={p.href} target="_blank" rel="noopener noreferrer">{p.name}</a>
                ) : (
                  p.name
                )}
              </span>{" "}
              — {p.description}
            </p>
          </div>
        ))}
      </section>
    </Reveal>
  );
}
