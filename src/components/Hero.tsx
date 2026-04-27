import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

export default function Hero() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, reduce ? 0 : -8]);

  return (
    <section className="hero" aria-labelledby="hero-name">
      <motion.img
        src="/headshot.jpg"
        alt="Eugene Vestel, head and shoulders, dark blazer over light blue shirt"
        className="hero-photo"
        style={{ y }}
        width={220}
        height={220}
      />
      <div>
        <div className="dateline">
          Pittsburgh, Pennsylvania <span className="sep">·</span> April 2026
        </div>
        <h1 id="hero-name">Eugene Vestel</h1>
        <p className="lede">
          I'm building HIPAA-aware AI agents for clinical data, and writing about
          what's coming next.
        </p>
      </div>
    </section>
  );
}
