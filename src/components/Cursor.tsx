import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

const INTERACTIVE = 'a, button, [data-hud], input, [role="button"]';

/**
 * A HUD reticle that trails the pointer and locks on over interactive
 * elements. Fine pointers only (never on touch), and skipped under reduced
 * motion. Purely decorative: pointer-events are off and it is aria-hidden.
 */
export default function Cursor() {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const ringRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (reduce) return;
    const fine = window.matchMedia("(pointer: fine)");
    setEnabled(fine.matches);
    const onChange = () => setEnabled(fine.matches);
    fine.addEventListener("change", onChange);
    return () => fine.removeEventListener("change", onChange);
  }, [reduce]);

  useEffect(() => {
    if (!enabled) return;
    const ring = ringRef.current;
    if (!ring) return;

    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let rx = tx;
    let ry = ty;
    let raf = 0;
    let visible = false;

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!visible) {
        visible = true;
        ring.style.opacity = "1";
      }
      const hot = (e.target as Element | null)?.closest?.(INTERACTIVE);
      ring.classList.toggle("is-locked", !!hot);
    };
    const onLeave = () => {
      visible = false;
      ring.style.opacity = "0";
    };

    const frame = () => {
      rx += (tx - rx) * 0.16;
      ry += (ty - ry) * 0.16;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled]);

  if (reduce || !enabled) return null;

  return (
    <div className="cursor" aria-hidden="true">
      <div className="cursor-ring" ref={ringRef} />
    </div>
  );
}
