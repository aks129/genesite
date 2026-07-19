import Reveal from "../components/Reveal";
import { services, type Service, type ServiceCategory } from "../data/services";

const order: ServiceCategory[] = [
  "Strategy & Governance",
  "Implementation",
  "Data & Analytics",
  "Enablement",
];

export default function ServicesPage() {
  const grouped = order
    .map(cat => ({ cat, items: services.filter(s => s.category === cat) }))
    .filter(g => g.items.length > 0);

  return (
    <>
      <Reveal>
        <header className="page-head">
          <div className="dateline">Expertise</div>
          <h1>What I work on.</h1>
          <p className="lede">
            The areas where I spend the most time — the seam between AI, FHIR,
            and the analytics layer underneath. Below is what that looks like in
            practice, and where I've done it.
          </p>
        </header>
      </Reveal>

      <Reveal>
        <section aria-labelledby="track-record-h">
          <h2 id="track-record-h">Track record</h2>
          <ul className="track-record">
            <li>
              <strong>NCQA · Digital Quality & FHIR Advisor.</strong> Advised
              NCQA on the next generation of digital quality measurement and
              the FHIR conformance work underneath it.
            </li>
            <li>
              <strong>UPMC Health Plan · quality analytics.</strong>{" "}
              Five years leading HEDIS, patient-safety, and operational
              quality analytics, with roughly $180M in cumulative impact
              across those programs.
            </li>
            <li>
              <strong>b.well Connected Health · Director of Analytics.</strong>{" "}
              Built the FHIR ingestion, provider directory, and clinical data
              layers for a consumer health-records platform.
            </li>
            <li>
              <strong>AI adoption inside a product org.</strong> Set up the
              playbook for how PMs scope AI work, how engineers prototype it,
              who owns evals, and how design partners get enabled.
            </li>
            <li>
              <strong>HealthClaw · HIPAA-aware agent controls.</strong>{" "}
              Founded the project, which maps agent controls (PHI redaction,
              multi-step human approval for clinical writes, HMAC-confirmed
              audit) to the OWASP Agentic AI Top 10 and the 2025 HIPAA
              Security Rule update.
            </li>
            <li>
              <strong>CMS RFI · public response.</strong> Authored FHIR IQ's
              public response to CMS on health-technology interoperability
              and market design.
            </li>
          </ul>
        </section>
      </Reveal>

      {grouped.map(({ cat, items }) => (
        <Reveal key={cat}>
          <section aria-labelledby={slug(cat)}>
            <h2 id={slug(cat)}>{cat}</h2>
            <div className="project-cards">
              {items.map(s => <ServiceCard key={s.name} service={s} />)}
            </div>
          </section>
        </Reveal>
      ))}
    </>
  );
}

function ServiceCard({ service }: { service: Service }) {
  return (
    <article className="project-card">
      <header className="project-card-head">
        <h3>{service.name}</h3>
      </header>
      <p className="service-tagline">{service.tagline}</p>
      <p className="project-card-body">{service.description}</p>
      {service.outcomes && service.outcomes.length > 0 && (
        <ul className="stack" aria-label="Outcomes">
          {service.outcomes.map(o => <li key={o}>{o}</li>)}
        </ul>
      )}
      {service.proof && (
        <p className="service-proof">
          <span className="service-proof-label">Where I've done this:</span>{" "}
          {service.proof}
        </p>
      )}
    </article>
  );
}

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-h";
}
