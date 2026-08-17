import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";

const SLATS = 7;
/** easeInOutQuart-ish — smooth through the middle, no snap */
const EASE = [0.62, 0, 0.30, 1] as const;
const COVER = 0.60;   // s, curtain falls
const HOLD = 0.16;    // s, fully covered
const LIFT = 0.70;    // s, curtain continues out of frame
const STAGGER = 0.055;
const SPAN = COVER + HOLD + LIFT;
const TOTAL_MS = (SPAN + STAGGER * Math.ceil(SLATS / 2)) * 1000 + 140;

const LABELS: Record<string, string> = {
  "/": "~/home",
  "/career": "~/career",
  "/expertise": "~/expertise",
  "/services": "~/expertise",
  "/projects": "~/projects",
  "/writing": "~/writing",
  "/speaking": "~/speaking",
  "/hobbies": "~/off-hours",
};

/** Distance from the centre slat, so the curtain opens outward from the middle. */
function centreOut(i: number) {
  return Math.abs(i - (SLATS - 1) / 2);
}

/**
 * Route curtain. Slats *translate* rather than scale — scaling a gradient
 * stretches its leading edge and reads as cheap. The curtain falls from
 * above, holds, then continues downward out of frame, so it passes through
 * instead of rewinding.
 */
export default function RouteTransition() {
  const { pathname } = useLocation();
  const reduce = useReducedMotion();
  const [run, setRun] = useState(0);
  const [label, setLabel] = useState("~/");
  const first = useRef(true);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (reduce) return;
    setLabel(LABELS[pathname] ?? "~/");
    setRun(n => n + 1);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setRun(0), TOTAL_MS);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  if (reduce || run === 0) return null;

  return (
    <div className="route-wipe" aria-hidden="true">
      <div className="route-wipe-slats">
        {Array.from({ length: SLATS }).map((_, i) => (
          <motion.span
            key={`${run}-${i}`}
            initial={{ y: "-101%" }}
            animate={{ y: ["-101%", "0%", "0%", "101%"] }}
            transition={{
              duration: SPAN,
              times: [0, COVER / SPAN, (COVER + HOLD) / SPAN, 1],
              ease: [EASE, "linear", EASE],
              delay: centreOut(i) * STAGGER,
            }}
            style={{ willChange: "transform" }}
          />
        ))}
      </div>
      <motion.span
        className="route-wipe-label"
        key={`label-${run}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: [0, 1, 1, 0], y: [10, 0, 0, -10] }}
        transition={{ duration: SPAN * 0.85, times: [0, 0.4, 0.62, 1], ease: "easeOut" }}
      >
        <span className="route-wipe-caret">▸</span> {label}
      </motion.span>
    </div>
  );
}
