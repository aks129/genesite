import Reveal from "../components/Reveal";
import ScrambleText from "../components/ScrambleText";
import { useCursorGlow } from "../hooks/useCursorGlow";
import { projects, type Project } from "../data/projects";

export default function ProjectsPage() {
  return (
    <>
      <Reveal>
        <header className="page-head">
          <div className="dateline">Technical · Projects</div>
          <h1>What I'm building.</h1>
          <p className="lede">
            Most of this sits where FHIR, clinical data, and AI agents meet:
            tooling for letting agents work with health records without
            anyone getting hurt.
          </p>
          <p className="terminal-line">
            <span className="terminal-prompt">$</span>{" "}
            <ScrambleText text={`ls ~/projects — ${projects.length} tracked`} speed={18} />
          </p>
        </header>
      </Reveal>

      <Reveal>
        <section aria-labelledby="proj-grid">
          <h2 id="proj-grid" className="visually-hidden">Projects</h2>
          <div className="project-cards">
            {projects.map((p, i) => (
              <ProjectCard key={p.name} project={p} index={i} />
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="more-repos" aria-labelledby="more-h">
          <h2 id="more-h">More on GitHub</h2>
          <p>
            The full set of public repositories lives at{" "}
            <a href="https://github.com/aks129" target="_blank" rel="noopener noreferrer">
              github.com/aks129
            </a>{" "}
            and the{" "}
            <a href="https://github.com/FHIR-IQ" target="_blank" rel="noopener noreferrer">
              FHIR&#8209;IQ org
            </a>.
          </p>
        </section>
      </Reveal>
    </>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const glow = useCursorGlow();
  return (
    <article className="project-card hud" data-hud {...glow}>
      <span className="hud-index">{String(index + 1).padStart(2, "0")}</span>
      <header className="project-card-head">
        <h3 className="glitch-target">
          {project.href ? (
            <a href={project.href} target="_blank" rel="noopener noreferrer">
              {project.name} <span aria-hidden="true">↗</span>
            </a>
          ) : (
            project.name
          )}
        </h3>
        {project.status && (
          <span className={`status status-${project.status}`}>{project.status}</span>
        )}
      </header>
      <p className="project-card-body">{project.description}</p>
      {project.stack && project.stack.length > 0 && (
        <ul className="stack" aria-label="Stack">
          {project.stack.map(s => <li key={s}>{s}</li>)}
        </ul>
      )}
      {project.repo && (
        <p className="project-card-repo">
          <a href={project.repo} target="_blank" rel="noopener noreferrer">
            Source →
          </a>
        </p>
      )}
    </article>
  );
}
