import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";

/**
 * Settles incoming page content in behind the route curtain, so the reveal
 * lands on motion rather than a hard cut. The delay is tuned to the moment
 * the curtain is fully covering (see RouteTransition COVER).
 */
export default function PageShell({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const { pathname } = useLocation();

  if (reduce) return <>{children}</>;

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
    >
      {children}
    </motion.div>
  );
}
