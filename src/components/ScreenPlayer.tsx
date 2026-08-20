import { useEffect, useRef, useState } from "react";
import { writings } from "../data/writings";

/*
 * The screen on the wall, and the thing that plays on it.
 *
 * The control is a real button in the page, not a hotspot on the footage. That
 * keeps it keyboard-reachable, screen-reader-legible, and identical for the
 * people who never see the room at all — phones and reduced-motion get the
 * same button and the same player, just without a wall to hang it on.
 *
 * The plate projected onto the display in the footage (see WorldStage) is
 * decoration layered on top for anyone who does see the room.
 */

const SHOW = writings.find(w => w.kind === "podcast")!;
/** Derived from the show URL rather than hardcoded, so the two cannot drift. */
const SHOW_ID = SHOW.href.split("/show/")[1]?.split(/[?#]/)[0] ?? "";
const EMBED = `https://open.spotify.com/embed/show/${SHOW_ID}?utm_source=generator&theme=0`;

export function screenIsOn(): boolean {
  return document.body.classList.contains("screen-on");
}

export default function ScreenPlayer() {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // The plate on the wall brightens while the player is up: the screen is on.
  useEffect(() => {
    document.body.classList.toggle("screen-on", open);
    return () => document.body.classList.remove("screen-on");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    // Lenis keeps scrolling the page under a fixed overlay otherwise.
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      btnRef.current?.focus();
    };
  }, [open]);

  return (
    <>
      <div className="screen-slot">
        <button
          type="button"
          className="screen-power"
          ref={btnRef}
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
        >
          <span className="screen-power__glyph" aria-hidden="true">▸</span>
          Play <em>{SHOW.name}</em>
        </button>
        <p className="screen-slot__note">{SHOW.tagline}</p>
      </div>

      {open && (
        <div
          className="screen-modal"
          role="dialog"
          aria-modal="true"
          aria-label={`${SHOW.name} player`}
          onMouseDown={e => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div className="screen-modal__panel" ref={panelRef} tabIndex={-1}>
            <div className="screen-modal__head">
              <span className="screen-modal__eyebrow">now playing</span>
              <button
                type="button"
                className="screen-modal__close"
                onClick={() => setOpen(false)}
              >
                close ✕
              </button>
            </div>
            {/* Mounted only when open, so Spotify's player is never loaded on
                a plain page visit. */}
            <iframe
              className="screen-modal__frame"
              src={EMBED}
              title={`${SHOW.name} — Spotify player`}
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            />
            <p className="screen-modal__links">
              {SHOW.platforms?.map(p => (
                <a key={p.label} href={p.href} target="_blank" rel="noopener noreferrer">
                  {p.label}
                </a>
              ))}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
