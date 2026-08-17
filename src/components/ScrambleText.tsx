import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/\\<>[]{}=*#%&$@";

type Props = {
  text: string;
  className?: string;
  /** ms per character revealed */
  speed?: number;
  /** ms before the run starts */
  delay?: number;
  /**
   * "mount"  — decode once when it appears
   * "hover"  — decode whenever the nearest [data-hud] ancestor is hovered
   */
  trigger?: "mount" | "hover";
};

/**
 * Decode-in text effect. The real string is always present in the DOM for
 * assistive tech and for layout (an invisible copy reserves the width, so a
 * proportional font can't shift the page while glyphs churn).
 */
export default function ScrambleText({
  text,
  className,
  speed = 26,
  delay = 0,
  trigger = "mount",
}: Props) {
  const reduce = useReducedMotion();
  const [out, setOut] = useState(text);
  const hostRef = useRef<HTMLSpanElement | null>(null);
  const rafRef = useRef(0);

  const run = useCallback(() => {
    if (reduce) return;
    cancelAnimationFrame(rafRef.current);
    const chars = Array.from(text);
    const startAt = performance.now() + delay;
    const total = chars.length * speed + 160;

    const tick = (now: number) => {
      const t = now - startAt;
      if (t < 0) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      if (t >= total) {
        setOut(text);
        return;
      }
      const revealed = t / speed;
      setOut(
        chars
          .map((ch, i) => {
            if (ch === " ") return " ";
            if (i < revealed) return ch;
            return GLYPHS[(Math.random() * GLYPHS.length) | 0];
          })
          .join(""),
      );
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [text, speed, delay, reduce]);

  useEffect(() => {
    if (reduce) {
      setOut(text);
      return;
    }
    if (trigger === "mount") {
      run();
      return () => cancelAnimationFrame(rafRef.current);
    }
    const host = hostRef.current?.closest("[data-hud]");
    if (!host) return;
    const onEnter = () => run();
    host.addEventListener("mouseenter", onEnter);
    return () => {
      host.removeEventListener("mouseenter", onEnter);
      cancelAnimationFrame(rafRef.current);
    };
  }, [run, trigger, reduce, text]);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  return (
    <span ref={hostRef} className={`scramble${className ? ` ${className}` : ""}`}>
      <span className="scramble-ghost" aria-hidden="true">{text}</span>
      <span className="scramble-live" aria-hidden="true">{out}</span>
      <span className="visually-hidden">{text}</span>
    </span>
  );
}
