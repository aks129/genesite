import Reveal from "./Reveal";
import { useMagnetic } from "../hooks/useMagnetic";

export default function Contact() {
  const mag = useMagnetic();
  return (
    <Reveal>
      <section aria-labelledby="contact-h">
        <h2 id="contact-h">Get in Touch</h2>
        <p className="contact-intro">
          The fastest path is the calendar. Email works for anything async.
        </p>
        <div className="contact-actions">
          <a
            className="contact-book magnetic"
            href="https://calendar.app.google/EtMLLLeZmA42877T9"
            target="_blank"
            rel="noopener noreferrer"
            {...mag}
          >
            Book a meeting →
          </a>
          <a className="contact-mail" href="mailto:gene@fhiriq.com">
            gene@fhiriq.com
          </a>
        </div>
      </section>
    </Reveal>
  );
}
