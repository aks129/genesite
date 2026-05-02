import { motion, useReducedMotion, useAnimationControls } from "framer-motion";
import { useEffect, useState, useCallback } from "react";

/**
 * A tiny LEGO minifigure of "Gene" who lives at the bottom of the page.
 * He walks side-to-side, hops periodically, and does a flip when clicked.
 * Hidden under reduced-motion (parks himself in the corner instead).
 */
export default function LegoGene() {
  const reduce = useReducedMotion();
  const controls = useAnimationControls();
  const [direction, setDirection] = useState<1 | -1>(1);
  const [hopCount, setHopCount] = useState(0);

  // Width of the play area: viewport width minus character width
  const playWidth = () =>
    Math.max(0, (typeof window !== "undefined" ? window.innerWidth : 1200) - 64);

  // Continuous walk loop: travel across, turn around, repeat.
  useEffect(() => {
    if (reduce) return;
    let alive = true;
    async function loop() {
      // Initial drop-in from off-screen
      await controls.start({
        x: 24,
        y: 0,
        transition: { type: "spring", stiffness: 120, damping: 14, delay: 1.2 },
      });
      while (alive) {
        const target = direction === 1 ? playWidth() - 24 : 24;
        await controls.start({
          x: target,
          transition: { duration: 14, ease: "linear" },
        });
        if (!alive) break;
        // Turn around — small pause, then flip facing
        await controls.start({
          rotateY: direction === 1 ? 180 : 0,
          transition: { duration: 0.4 },
        });
        setDirection(d => (d === 1 ? -1 : 1));
      }
    }
    loop();
    return () => {
      alive = false;
      controls.stop();
    };
    // controls/direction intentionally omitted from deps — would cancel the walk loop on every step
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);

  // Periodic hop while walking
  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => setHopCount(n => n + 1), 4200);
    return () => window.clearInterval(id);
  }, [reduce]);

  useEffect(() => {
    if (reduce || hopCount === 0) return;
    controls.start({
      y: [0, -34, 0],
      transition: { duration: 0.55, ease: [0.34, 1.56, 0.64, 1] },
    });
  }, [hopCount, reduce, controls]);

  const handleClick = useCallback(() => {
    if (reduce) return;
    controls.start({
      y: [0, -60, 0],
      rotate: [0, 360],
      transition: { duration: 0.7, ease: "easeOut" },
    });
  }, [reduce, controls]);

  return (
    <motion.button
      type="button"
      className="lego-gene"
      aria-label="LEGO Gene mascot — click to make him jump"
      animate={controls}
      initial={reduce ? { x: 16, y: 0 } : { x: -80, y: 0 }}
      onClick={handleClick}
      whileHover={reduce ? undefined : { scale: 1.08 }}
    >
      <LegoGeneSvg />
    </motion.button>
  );
}

/** The Lego minifigure SVG. Yellow head, dark blazer, blue jeans — matches the headshot vibe. */
function LegoGeneSvg() {
  return (
    <svg
      viewBox="0 0 48 64"
      width="48"
      height="64"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Head stud */}
      <rect x="20" y="0" width="8" height="3" rx="1" fill="#E0B60C" />
      <ellipse cx="24" cy="2" rx="3.6" ry="1.4" fill="#F2C420" />
      {/* Head */}
      <rect x="15" y="3" width="18" height="14" rx="3" fill="#F2C420" stroke="#1B1815" strokeWidth="0.6" />
      {/* Beard */}
      <path
        d="M16 11 Q 16 17 24 18 Q 32 17 32 11 L 30 11 Q 30 15 24 16 Q 18 15 18 11 Z"
        fill="#7A4626"
      />
      {/* Eyes */}
      <circle cx="20" cy="9" r="1.1" fill="#1B1815" />
      <circle cx="28" cy="9" r="1.1" fill="#1B1815" />
      {/* Eye highlights */}
      <circle cx="20.4" cy="8.6" r="0.35" fill="#FFFFFF" />
      <circle cx="28.4" cy="8.6" r="0.35" fill="#FFFFFF" />
      {/* Smile */}
      <path d="M20.5 13 Q 24 14.4 27.5 13" stroke="#1B1815" strokeWidth="0.7" fill="none" strokeLinecap="round" />
      {/* Neck */}
      <rect x="22" y="17" width="4" height="2" fill="#C9C9C9" />
      {/* Torso (dark blazer) */}
      <path
        d="M11 19 L 37 19 L 35 39 L 13 39 Z"
        fill="#1B1815"
      />
      {/* Light blue shirt triangle */}
      <path d="M22 19 L 26 19 L 27 25 L 21 25 Z" fill="#A8C8E8" />
      {/* Tie/buttons */}
      <circle cx="24" cy="28" r="0.6" fill="#F2C420" />
      <circle cx="24" cy="32" r="0.6" fill="#F2C420" />
      {/* Arms */}
      <rect x="6"  y="20" width="6" height="16" rx="2.5" fill="#1B1815" />
      <rect x="36" y="20" width="6" height="16" rx="2.5" fill="#1B1815" />
      {/* Hands (yellow) */}
      <ellipse cx="9"  cy="38" rx="3" ry="2.6" fill="#F2C420" stroke="#1B1815" strokeWidth="0.4" />
      <ellipse cx="39" cy="38" rx="3" ry="2.6" fill="#F2C420" stroke="#1B1815" strokeWidth="0.4" />
      {/* Hips */}
      <rect x="13" y="39" width="22" height="3" fill="#0A0A0A" />
      {/* Legs (denim) */}
      <rect x="14" y="42" width="8"  height="20" fill="#3B5A8A" stroke="#1B1815" strokeWidth="0.4" />
      <rect x="26" y="42" width="8"  height="20" fill="#3B5A8A" stroke="#1B1815" strokeWidth="0.4" />
      {/* Feet (black) */}
      <rect x="13" y="60" width="10" height="3" rx="1" fill="#0A0A0A" />
      <rect x="25" y="60" width="10" height="3" rx="1" fill="#0A0A0A" />
    </svg>
  );
}
