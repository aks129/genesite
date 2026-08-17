import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

type Props = {
  children: ReactNode;
  /** Total travel in px across the element's full pass through the viewport. */
  distance?: number;
  className?: string;
};

/**
 * Drifts its children at a slightly different rate than the page scroll.
 * Subtle by design — parallax reads as depth, not as movement.
 */
export default function Parallax({ children, distance = 28, className }: Props) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  );
}
