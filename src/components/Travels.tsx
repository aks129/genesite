import { motion, useReducedMotion } from "framer-motion";
import Reveal from "./Reveal";
import { travels, ALBUM_URL } from "../data/travels";

export default function Travels() {
  const reduce = useReducedMotion();

  return (
    <Reveal>
      <section aria-labelledby="travels-h">
        <h2 id="travels-h">Work Travels</h2>
        <p>
          Most of what makes a career interesting is the rooms you end up in. A
          handful of favorites from recent trips with Stacy and the team.
        </p>
        <motion.div
          className="travels-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={reduce ? undefined : { visible: { transition: { staggerChildren: 0.05 } } }}
        >
          {travels.map(t => (
            <motion.figure
              key={t.src}
              variants={reduce ? undefined : {
                hidden: { opacity: 0, y: 8 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
            >
              <img
                src={t.src}
                alt={t.alt}
                width={t.width}
                height={t.height}
                loading="lazy"
                decoding="async"
              />
            </motion.figure>
          ))}
        </motion.div>
        <p className="album-link">
          <a href={ALBUM_URL} target="_blank" rel="noopener noreferrer">
            See the full album on Google Photos →
          </a>
        </p>
      </section>
    </Reveal>
  );
}
