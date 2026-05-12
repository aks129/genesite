import Reveal from "../components/Reveal";
import { projects, type Project } from "../data/projects";

export default function ProjectsPage() {
  return (
    <>
      <Reveal>
        <header className="page-head">
          <div className="dateline">Technical · Projects</div>
          <h1>What I'm building.</h1>
          <p className="lede">
            Twenty-six public repositories, one bet. The work below sits at the
            seam where FHIR, clinical data, and AI agents meet — the cognitive
            layer above FHIR being rebuilt for agents.
          </p>
        </header>
      </Reveal>

      <Reveal>
        <section aria-labelledby="proj-grid">
          <h2 id="proj-grid" className="visually-hidden">Projects</h2>
          <div className="project-cards">
            {projects.map(p => <ProjectCard key={p.name} project={p} />)}
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
            </a>. Some are production-ready, most are experiments.
          </p>
        </section>
      </Reveal>
    </>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="project-card">
      <header className="project-card-head">
        <h3>
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
