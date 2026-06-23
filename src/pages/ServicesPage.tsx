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
              NCQA on the next generation of digital quality measurement — the
              FHIR data plumbing and conformance work that has to be right
              before AI can be trusted anywhere near a measure.
            </li>
            <li>
              <strong>UPMC Health Plan · ~$180M cumulative impact.</strong>{" "}
              Five years leading HEDIS, patient-safety, and operational
              quality analytics — the discipline (measure validation,
              numerator/denominator integrity, gap closure) that AI work in
              this space still has to clear.
            </li>
            <li>
              <strong>b.well Connected Health · Samsung Health, Google Fitbit, ChatGPT Health.</strong>{" "}
              Architected the FHIR ingestion, provider directory, and
              clinical data layers — the data layer behind Samsung Health
              and Google Fitbit integrations during my tenure, and later
              selected by OpenAI to power ChatGPT Health.
            </li>
            <li>
              <strong>AI champion inside a product org.</strong> Stood up the
              adoption playbook — PM scoping, engineering prototyping, eval
              ownership, design-partner enablement — so AI work shipped
              instead of stalling in committee.
            </li>
            <li>
              <strong>HealthClaw · HIPAA-aware agentic governance.</strong>{" "}
              Founded the project that maps agentic AI controls (twelve MCP
              tools, multi-step human approval for clinical writes,
              HMAC-confirmed audit) to the OWASP Agentic AI Top 10 and the
              2025 HIPAA Security Rule update.
            </li>
            <li>
              <strong>CMS RFI · public response.</strong> Authored FHIR IQ's
              public response on the health-technology interoperability
              impasse and market design. Submitted to CMS.
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
