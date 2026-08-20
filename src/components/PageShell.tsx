import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { isFilmRoute } from "../world/timeline";
import { useWorldEnabled } from "../world/useWorldEnabled";

/**
 * Settles incoming page content in behind the route curtain, so the reveal
 * lands on motion rather than a hard cut. The delay is tuned to the moment
 * the curtain is fully covering (see RouteTransition COVER).
 */
export default function PageShell({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const { pathname } = useLocation();
  const world = useWorldEnabled();

  if (reduce) return <>{children}</>;

  // With the world up there is no curtain: the page waits out most of the
  // camera move so the visitor watches the room arrive, not a text swap.
  const delay = world && !isFilmRoute(pathname) ? 0.55 : 0.12;

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
