import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

export default function Hero() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, reduce ? 0 : -8]);

  return (
    <section className="hero" aria-labelledby="hero-name">
      <motion.img
        src="/headshot.jpg"
        alt="Eugene Vestel with family"
        className="hero-photo"
        style={{ y }}
        width={1200}
        height={900}
      />
      <div className="hero-text">
        <div className="dateline">
          Pittsburgh, Pennsylvania <span className="sep">·</span> April 2026
        </div>
        <h1 id="hero-name">Eugene Vestel</h1>
        <p className="lede">
          I'm building HIPAA-aware AI agents for clinical data, and writing about
          what's coming next.
        </p>
        <p className="hero-callout">
          <span className="tag">Upcoming</span>
          Speaking at{" "}
          <a href="https://devdays.com" target="_blank" rel="noopener noreferrer">FHIR DevDays</a>
          {" "}<span className="sep">·</span> June 2026
        </p>
      </div>
    </section>
  );
}
