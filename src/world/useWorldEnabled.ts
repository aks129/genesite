import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/*
 * One gate, shared by everything that behaves differently when the world is
 * running: the backdrop itself, the route curtain it replaces, the page-head
 * chip, and the aurora it stands in for. Keeping it in one place is what stops
 * the site from ending up half in the world and half out of it.
 *
 * Desktop pointer devices only. Phones get the existing aurora and download no
 * footage at all.
 */
export const WORLD_MQ = "(min-width: 861px) and (pointer: fine)";

function matches(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
  return window.matchMedia(WORLD_MQ).matches;
}

export function useWorldEnabled(): boolean {
  const reduce = useReducedMotion();
  // Measured synchronously: resolving this in an effect would paint one frame
  // of the non-world layout on every desktop visit.
  const [wide, setWide] = useState(matches);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const mq = window.matchMedia(WORLD_MQ);
    const apply = () => setWide(mq.matches);
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return !reduce && wide;
}
