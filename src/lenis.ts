import Lenis from "lenis";

/**
 * Module-level Lenis singleton so route changes (ScrollToTop) can jump
 * without fighting the smooth-scroll animation loop.
 */
let instance: Lenis | null = null;

export function startLenis(): void {
  if (!instance) {
    instance = new Lenis({ autoRaf: true, lerp: 0.085 });
  }
}

export function stopLenis(): void {
  instance?.destroy();
  instance = null;
}

export function jumpToTop(): void {
  if (instance) {
    instance.scrollTo(0, { immediate: true });
  } else {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }
}
