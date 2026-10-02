import { useLayoutEffect, useRef, useState } from "react";
import Reveal from "./Reveal";
import { bio } from "../data/bio";

type Length = "short" | "long";

/**
 * A copyable speaker bio for organizers and hosts. Clipboard writes can be
 * refused (permissions, older browsers, insecure origins), so a failed copy
 * selects the text instead and says so, leaving one keystroke to finish it.
 */
export default function BioBlock() {
  const [length, setLength] = useState<Length>("short");
  const [status, setStatus] = useState("");
  const textRef = useRef<HTMLTextAreaElement>(null);
  const text = bio[length];

  // Grow the box to fit the bio at any width, so nobody has to scroll inside
  // it to see the end of what they are about to paste.
  useLayoutEffect(() => {
    const t = textRef.current;
    if (!t) return;
    const fit = () => { t.style.height = "auto"; t.style.height = `${t.scrollHeight + 2}px`; };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [text]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setStatus("Copied.");
    } catch {
      textRef.current?.focus();
      textRef.current?.select();
      setStatus("Selected. Press Cmd+C or Ctrl+C to copy.");
    }
  }

  return (
    <Reveal>
      <section aria-labelledby="bio-h">
        <h2 id="bio-h">Bio for organizers</h2>
        <div className="bio-block hud" data-hud>
          <div className="bio-tabs" role="group" aria-label="Bio length">
            {(["short", "long"] as Length[]).map(l => (
              <button
                key={l}
                type="button"
                className={l === length ? "bio-tab is-active" : "bio-tab"}
                aria-pressed={l === length}
                onClick={() => { setLength(l); setStatus(""); }}
              >
                {l === "short" ? "Short" : "Full"}
              </button>
            ))}
          </div>
          {/* aria-label, not a visually-hidden <label>: `.hud > *` forces
              position: relative on direct children, which un-hides it. */}
          <textarea
            id="bio-text"
            ref={textRef}
            className="bio-text"
            aria-label={length === "short" ? "Short bio" : "Full bio"}
            value={text}
            readOnly
            rows={4}
          />
          <div className="bio-actions">
            <button type="button" className="bio-copy" onClick={copy}>
              Copy {length === "short" ? "short" : "full"} bio
            </button>
            <span className="bio-status" role="status" aria-live="polite">{status}</span>
          </div>
        </div>
      </section>
    </Reveal>
  );
}
