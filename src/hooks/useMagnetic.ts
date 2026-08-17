import type { MouseEvent } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Magnetic pull: the element leans toward the pointer while it's inside,
 * then springs back on leave. Writes transform straight to the node (no
 * React state), and no-ops entirely under reduced motion.
 */
export function useMagnetic(strength = 0.26, max = 10) {
  const reduce = useReducedMotion();
  if (reduce) return {};
  return {
    onMouseMove: (e: MouseEvent<HTMLElement>) => {
      const el = e.currentTarget;
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const cap = (v: number) => Math.max(-max, Math.min(max, v * strength));
      el.style.transform = `translate(${cap(dx)}px, ${cap(dy)}px)`;
    },
    onMouseLeave: (e: MouseEvent<HTMLElement>) => {
      e.currentTarget.style.transform = "";
    },
  };
}
