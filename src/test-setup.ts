import "@testing-library/jest-dom/vitest";
import { beforeEach, vi } from "vitest";
// Deep import via the filesystem path because framer-motion's package
// exports don't expose this internal module. We need to reset its cached
// reduced-motion state between tests so per-test matchMedia mocks take effect.
// @ts-expect-error - no type declarations for this internal path
import * as motionReducedState from "../node_modules/framer-motion/dist/es/utils/reduced-motion/state.mjs";

const { hasReducedMotionListener, prefersReducedMotion } =
  motionReducedState as {
    hasReducedMotionListener: { current: boolean };
    prefersReducedMotion: { current: boolean | null };
  };

// jsdom does not implement IntersectionObserver, which framer-motion's
// whileInView relies on. Provide a minimal stub so motion components mount.
class IntersectionObserverStub {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn(() => []);
  root = null;
  rootMargin = "";
  thresholds = [];
}

Object.defineProperty(window, "IntersectionObserver", {
  writable: true,
  configurable: true,
  value: IntersectionObserverStub,
});
Object.defineProperty(globalThis, "IntersectionObserver", {
  writable: true,
  configurable: true,
  value: IntersectionObserverStub,
});

// framer-motion caches its reduced-motion read at module level. Reset before
// each test so per-test matchMedia overrides take effect.
beforeEach(() => {
  hasReducedMotionListener.current = false;
  prefersReducedMotion.current = null;
});
