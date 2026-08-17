import { motion, useReducedMotion } from "framer-motion";
import Reveal from "./Reveal";
import ScrambleText from "./ScrambleText";
import { useMagnetic } from "../hooks/useMagnetic";
import { useCursorGlow } from "../hooks/useCursorGlow";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Contact() {
  const mag = useMagnetic();
  const glow = useCursorGlow();
  const reduce = useReducedMotion();

  const rise = (i: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 14 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-60px" },
          transition: { duration: 0.55, ease: EASE, delay: 0.06 * i },
        };

  return (
    <Reveal>
      <section aria-labelledby="contact-h">
        <h2 id="contact-h">Get in Touch</h2>
        <div className="contact-panel hud" data-hud {...glow}>
          <span className="hud-index">→</span>
          <motion.p className="contact-status" {...rise(0)}>
            <span className="contact-dot" aria-hidden="true" />
            <ScrambleText text="open to conversations" trigger="hover" speed={24} />
          </motion.p>
          <motion.p className="contact-intro" {...rise(1)}>
            The fastest path is the calendar. Email works for anything async.
          </motion.p>
          <motion.div className="contact-actions" {...rise(2)}>
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
          </motion.div>
        </div>
      </section>
    </Reveal>
  );
}
