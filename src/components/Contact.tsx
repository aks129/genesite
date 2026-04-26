import Reveal from "./Reveal";

export default function Contact() {
  return (
    <Reveal>
      <section aria-labelledby="contact-h">
        <h2 id="contact-h">Get in Touch</h2>
        <a className="contact-mail" href="mailto:eugene.vestel@gmail.com">
          eugene.vestel@gmail.com
        </a>
        <p className="contact-note">
          I read everything; I respond to most things within a week.
        </p>
      </section>
    </Reveal>
  );
}
