import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";

const SLATS = 9;
const DURATION = 0.78;
const TOTAL_MS = 1020;

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

/**
 * Cyberpunk route wipe: vertical slats sweep down over the outgoing page and
 * retract, with a mono readout of the destination. A timer (not framer's
 * onAnimationComplete) controls unmount — the wrapper's own animation settles
 * immediately and would otherwise cut the slats off mid-sweep.
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
            initial={{ scaleY: 0 }}
            animate={{ scaleY: [0, 1, 1, 0] }}
            transition={{
              duration: DURATION,
              times: [0, 0.34, 0.5, 1],
              ease: [0.76, 0, 0.24, 1],
              delay: i * 0.026,
            }}
          />
        ))}
      </div>
      <motion.span
        className="route-wipe-label"
        key={`label-${run}`}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: [0, 1, 1, 0], y: [8, 0, 0, -8] }}
        transition={{ duration: DURATION, times: [0, 0.35, 0.6, 1] }}
      >
        <span className="route-wipe-caret">▸</span> {label}
      </motion.span>
    </div>
  );
}
