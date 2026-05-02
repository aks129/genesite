import Reveal from "./Reveal";

export default function Contact() {
  return (
    <Reveal>
      <section aria-labelledby="contact-h">
        <h2 id="contact-h">Get in Touch</h2>
        <p className="contact-intro">
          Two ways. Email for anything async — I read everything and respond
          to most things within a week. Or grab time on my calendar if you'd
          rather just talk.
        </p>
        <div className="contact-actions">
          <a className="contact-mail" href="mailto:gene@fhiriq.com">
            gene@fhiriq.com
          </a>
          <a
            className="contact-book"
            href="https://calendar.app.google/EtMLLLeZmA42877T9"
            target="_blank"
            rel="noopener noreferrer"
          >
            Book a meeting →
          </a>
        </div>
      </section>
    </Reveal>
  );
}
