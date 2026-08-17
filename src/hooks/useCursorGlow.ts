import type { MouseEvent } from "react";

/**
 * Tracks the pointer inside an element as --mx/--my custom properties so CSS
 * can render a glow that follows the cursor. No React state — the handler
 * writes straight to the node, so it never re-renders the tree.
 */
export function useCursorGlow() {
  return {
    onMouseMove: (e: MouseEvent<HTMLElement>) => {
      const el = e.currentTarget;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    },
  };
}
