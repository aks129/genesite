import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { stations, embedUrl, watchUrl, type Station } from "../data/radio";
import { SCREEN_EVENT } from "./ScreenPlayer";

/*
 * A radio in the house.
 *
 * Mounted in App outside <Routes>, alongside the world and the mascot, so the
 * music does not stop when you walk into another room. That is the whole point
 * of it: the site is one building, and sound carries.
 *
 * Two rules shape the implementation:
 *
 *   1. The iframe is created only when a station is picked, so the click that
 *      picks it is the user gesture that lets it play unmuted. Nothing loads
 *      from YouTube on a plain page visit.
 *   2. Once created it is never unmounted or hidden until the visitor stops it.
 *      Collapsing the dial only folds the station list away; the player itself
 *      stays exactly where it is, playing.
 *
 * The video is shown rather than hidden. Hiding it to take the audio would be
 * both against YouTube's terms and worse looking — a small window onto a rainy
 * forest is very much the point.
 */

const LAST_KEY = "gene.radio.station";

export default function Radio() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState<Station | null>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);

  // Remember the last dial position, but never start on its own: audio that
  // begins without being asked for is the rudest thing a page can do.
  const [remembered, setRemembered] = useState<string | null>(null);
  useEffect(() => {
    try { setRemembered(localStorage.getItem(LAST_KEY)); } catch { /* private mode */ }
  }, []);

  function tune(s: Station) {
    setPlaying(s);
    setOpen(false);
    try { localStorage.setItem(LAST_KEY, s.name); } catch { /* private mode */ }
  }

  function off() {
    setPlaying(null);
    setOpen(false);
    toggleRef.current?.focus();
  }

  /*
   * Yield to the podcast. Two things playing at once is the obvious failure of
   * putting a radio and a screen in the same house, and the visitor should not
   * have to fix it. The radio pauses and stays tuned; restarting is one click.
   *
   * If the postMessage does not land the worst case is the old behaviour, so
   * this needs no fallback.
   */
  useEffect(() => {
    const onScreen = (e: Event) => {
      if (!(e as CustomEvent).detail?.open) return;
      frameRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: "command", func: "pauseVideo", args: [] }), "*",
      );
    };
    window.addEventListener(SCREEN_EVENT, onScreen);
    return () => window.removeEventListener(SCREEN_EVENT, onScreen);
  }, []);

  // Escape closes the dial; it does not stop the music, which would be a
  // surprising thing for Escape to do.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    const onDown = (e: MouseEvent) => {
      if (!dockRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, [open]);

  const label = playing ? playing.name : "radio";

  return (
    <div className={`radio${playing ? " is-on" : ""}`} ref={dockRef}>
      {playing && (
        <div className="radio-player">
          <iframe
            key={playing.video}
            ref={frameRef}
            className="radio-player__frame"
            src={embedUrl(playing)}
            title={`${playing.name} — ${playing.source}`}
            allow="autoplay; encrypted-media; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
          />
          <div className="radio-player__meta">
            <span className="radio-player__channel">{playing.channel}</span>
            <a href={watchUrl(playing)} target="_blank" rel="noopener noreferrer">
              open on YouTube ↗
            </a>
          </div>
        </div>
      )}

      {open && (
        <ul className="radio-dial" aria-label="Stations">
          {stations.map((s, i) => (
            <li key={s.video}>
              <button
                type="button"
                className={`radio-station${playing?.video === s.video ? " is-current" : ""}`}
                onClick={() => tune(s)}
              >
                <span className="radio-station__no">{String(i + 1).padStart(2, "0")}</span>
                <span className="radio-station__body">
                  <span className="radio-station__name">
                    {s.name}
                    {!playing && remembered === s.name && (
                      <span className="radio-station__last"> · last played</span>
                    )}
                  </span>
                  <span className="radio-station__blurb">{s.blurb}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {open && (
        <p className="radio-dial__note">plays from YouTube · nothing loads until you pick one</p>
      )}

      <div className="radio-bar">
        <button
          type="button"
          className="radio-toggle"
          ref={toggleRef}
          aria-expanded={open}
          onClick={() => setOpen(o => !o)}
        >
          <span className={`radio-eq${playing && !reduce ? " is-live" : ""}`} aria-hidden="true">
            <i /><i /><i />
          </span>
          <span className="radio-toggle__label">{label}</span>
        </button>
        {playing && (
          <button type="button" className="radio-off" onClick={off} aria-label="Stop the radio">
            stop
          </button>
        )}
      </div>

      <p className="visually-hidden" aria-live="polite">
        {playing ? `Radio playing: ${playing.name}, from ${playing.channel}.` : "Radio off."}
      </p>
    </div>
  );
}
