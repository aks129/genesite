import { motion, useReducedMotion } from "framer-motion";
import Reveal from "./Reveal";
import { travels, ALBUM_URL } from "../data/travels";

// Deterministic pseudo-random rotation per index (-6° to +6°), so each
// polaroid's tilt is stable across renders but the scatter looks organic.
function tiltFor(i: number): number {
  const seed = (i * 9301 + 49297) % 233280;
  const r = seed / 233280;
  return (r - 0.5) * 12;
}

export default function Travels() {
  const reduce = useReducedMotion();

  return (
    <Reveal>
      <section aria-labelledby="travels-h">
        <h2 id="travels-h">Work Travels</h2>
        <p>
          Most of what makes a career interesting is the rooms you end up in. A
          scrapbook of recent trips with Stacy and the team — hover any photo to
          straighten it.
        </p>

        <motion.div
          className="travels-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={reduce ? undefined : { visible: { transition: { staggerChildren: 0.06 } } }}
        >
          {travels.map((t, i) => {
            const tilt = tiltFor(i);
            return (
              <motion.figure
                key={t.src}
                className="polaroid"
                style={{ rotate: reduce ? 0 : tilt }}
                whileHover={reduce ? undefined : { rotate: 0, scale: 1.04, y: -6, zIndex: 10 }}
                whileTap={reduce ? undefined : { rotate: tilt * 1.5, scale: 0.97 }}
                variants={reduce ? undefined : {
                  hidden: { opacity: 0, y: -40, rotate: tilt * 2 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    rotate: tilt,
                    transition: {
                      type: "spring",
                      stiffness: 110,
                      damping: 14,
                      mass: 0.9,
                    },
                  },
                }}
                transition={{ type: "spring", stiffness: 280, damping: 18 }}
              >
                <img
                  src={t.src}
                  alt={t.alt}
                  width={t.width}
                  height={t.height}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                />
              </motion.figure>
            );
          })}
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
