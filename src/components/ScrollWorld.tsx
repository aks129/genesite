import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useReducedMotion } from "framer-motion";
import Hero from "./Hero";
import { publishU } from "../world/engine";
import { loadClip } from "../world/clips";
import { toU, SCENES as WORLD_SCENES } from "../world/timeline";
import ScrambleText from "./ScrambleText";
import { useMagnetic } from "../hooks/useMagnetic";

/*
 * Scroll-scrubbed fly-through for the home hero.
 *
 * Three frame-locked clips render as one continuous camera move: down the
 * boardwalk, through the open glass, out to the valley. Scroll position drives
 * `currentTime` rather than playback.
 *
 * The scroll-world skill ships a `mountScrollWorld` engine, but it is built for
 * a standalone page — seven of its layers are `position: fixed; inset: 0`, so
 * mounting it inside Home would pin an opaque stage over Pillars/About/Socials
 * for the rest of the page. This is a scoped equivalent (sticky stage inside a
 * tall container) that keeps the engine's hard-won playback techniques:
 *
 *   - clips fetched as Blobs, so seeking never depends on HTTP range support
 *   - seeks coalesced (never queue one while the decoder is still resolving)
 *   - target lerped, so a flick reads as a glide instead of a jump
 *   - the poster still holds until a real frame has painted
 *
 * Desktop + motion only. Under reduced motion or on small/coarse screens this
 * renders the original <Hero /> and downloads no video at all.
 */

type Scene = {
  id: string;
  label: string;
  clip: string;
  poster: string;
  /** viewport-heights of scroll this leg occupies */
  weight: number;
};

const SCENES: Scene[] = [
  { id: "approach", label: "Arrive",  clip: "/world/vid/approach.mp4", poster: "/world/approach.jpg", weight: 1.3 },
  { id: "inside",   label: "The work", clip: "/world/vid/inside.mp4",   poster: "/world/inside.jpg",   weight: 0.9 },
  { id: "valley",   label: "The point", clip: "/world/vid/valley.mp4",  poster: "/world/valley.jpg",   weight: 0.9 },
];

const FADE = 0.045; // crossfade width, in units of total progress
const SEEK_EPS = 0.008;
const LERP = 0.18;

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const smooth = (x: number) => { const c = clamp(x); return c * c * (3 - 2 * c); };

type SceneRuntime = {
  el: HTMLDivElement | null;
  video: HTMLVideoElement | null;
  loading: boolean;
  ready: boolean;
  cur: number;
  target: number;
  start: number;
  end: number;
};

export default function ScrollWorld() {
  const reduce = useReducedMotion();
  // Measured synchronously on first render — a useEffect would paint <Hero />
  // for a frame and then pop into the film on every desktop visit.
  const [enabled, setEnabled] = useState(
    () => window.matchMedia("(min-width: 861px) and (pointer: fine)").matches,
  );

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 861px) and (pointer: fine)");
    const apply = () => setEnabled(mq.matches);
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  if (reduce || !enabled) return <Hero />;
  return <Film />;
}

function Film() {
  const hostRef = useRef<HTMLDivElement>(null);
  const sceneRefs = useRef<(HTMLDivElement | null)[]>([]);
  const copyRefs = useRef<(HTMLDivElement | null)[]>([]);

  const magA = useMagnetic();
  const magB = useMagnetic();
  const magC = useMagnetic();

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const total = SCENES.reduce((a, s) => a + s.weight, 0);
    let acc = 0;
    const rt: SceneRuntime[] = SCENES.map((s, i) => {
      const start = acc / total;
      acc += s.weight;
      return {
        el: sceneRefs.current[i] ?? null,
        video: null, loading: false, ready: false,
        cur: 0, target: 0, start, end: acc / total,
      };
    });

    let alive = true;
    let raf = 0;
    let ticking = false;

    function ensureClip(i: number) {
      const s = rt[i];
      if (s.loading || !s.el) return;
      s.loading = true;
      loadClip(SCENES[i].clip)
        .then(url => {
          if (!alive || !s.el) return;
          const v = document.createElement("video");
          v.className = "sw-scene__video";
          v.muted = true;
          v.playsInline = true;
          v.preload = "auto";
          v.setAttribute("muted", "");
          v.setAttribute("playsinline", "");
          v.src = url;
          v.addEventListener("loadedmetadata", () => { s.ready = true; });
          // Only hide the poster once a real frame has actually painted.
          v.addEventListener("seeked", () => { s.el?.classList.add("has-clip"); }, { once: true });
          v.addEventListener("loadeddata", () => { try { v.pause(); } catch { /* noop */ } });
          s.el.appendChild(v);
          s.video = v;
        })
        .catch(() => { s.loading = false; });
    }

    function read() {
      ticking = false;
      const vh = window.innerHeight;
      const rect = host!.getBoundingClientRect();
      const range = host!.offsetHeight - vh;
      if (range <= 0) return;
      const p = clamp(-rect.top / range);

      let ci = 0;
      for (let i = 0; i < rt.length; i++) if (p >= rt[i].start) ci = i;

      for (let i = 0; i < rt.length; i++) {
        const s = rt[i];
        if (!s.el) continue;
        if (p > s.start - 0.5 && p < s.end + 0.5) ensureClip(i);

        s.target = clamp((p - s.start) / (s.end - s.start));

        let outside = 0;
        if (p < s.start) outside = s.start - p;
        else if (p > s.end) outside = p - s.end;
        const op = smooth(1 - outside / FADE);
        s.el.style.opacity = String(op);
        s.el.style.zIndex = i === ci ? "3" : String(1 + Math.round(op));
      }

      // Copy: the hero greets on landing, the later beats peak mid-leg.
      let maxCopy = 0;
      for (let i = 0; i < rt.length; i++) {
        const c = copyRefs.current[i];
        if (!c) continue;
        const s = rt[i];
        const pr = clamp((p - s.start) / (s.end - s.start));
        let op: number;
        if (i === 0) op = p > s.end ? 0 : smooth(1 - pr / 0.62);
        else op = p < s.start || p > s.end ? 0 : smooth(1 - Math.abs(pr - 0.5) / 0.5);
        if (op > maxCopy) maxCopy = op;
        c.style.opacity = String(op);
        // Keep the CSS -50% centering; drift is layered on top of it.
        c.style.transform = `translateY(calc(-50% + ${((0.5 - pr) * 3).toFixed(2)}vh))`;
        c.style.pointerEvents = op > 0.5 ? "auto" : "none";
        // pointer-events alone still leaves the CTAs in the tab order, so a
        // keyboard user could focus an invisible link mid-film.
        c.style.visibility = op < 0.02 ? "hidden" : "visible";
      }

      // Hand the camera position to the world engine, so navigating to a tab
      // flies on from this exact frame instead of restarting at the trailhead.
      publishU(toU(ci, clamp(rt[ci].target) * WORLD_SCENES[ci].duration));

      host!.style.setProperty("--sw-p", p.toFixed(4));
      // The scrim exists to carry the copy — without copy it is just a dark
      // band over the footage, so it fades out with the text.
      host!.style.setProperty("--sw-scrim", maxCopy.toFixed(3));
    }

    function tick() {
      for (const s of rt) {
        const v = s.video;
        if (!v || !s.ready) continue;
        if (v.seeking) continue; // coalesce: never queue a seek mid-decode
        s.cur += (s.target - s.cur) * LERP;
        const t = clamp(s.cur, 0, 0.999) * (v.duration || 1);
        if (Math.abs(v.currentTime - t) > SEEK_EPS) {
          try { v.currentTime = t; } catch { /* noop */ }
        }
      }
      raf = requestAnimationFrame(tick);
    }

    const onScroll = () => {
      if (!ticking) { ticking = true; requestAnimationFrame(read); }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", read);
    read();
    raf = requestAnimationFrame(tick);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", read);
      for (const s of rt) {
        // The blob URL belongs to the shared cache — detach, never revoke.
        if (s.video) { s.video.removeAttribute("src"); s.video.load(); s.video.remove(); }
      }
    };
  }, []);

  const height = SCENES.reduce((a, s) => a + s.weight, 0) * 100;

  return (
    <div className="sw" ref={hostRef} style={{ height: `calc(${height}vh + 100vh)` }}>
      <div className="sw-stage">
        {SCENES.map((s, i) => (
          <div
            className="sw-scene"
            key={s.id}
            ref={el => { sceneRefs.current[i] = el; }}
            aria-hidden="true"
          >
            <img className="sw-scene__still" src={s.poster} alt="" decoding="async" />
          </div>
        ))}

        <div className="sw-copylayer">
          <div className="sw-copy" ref={el => { copyRefs.current[0] = el; }}>
            <div className="dateline">
              <ScrambleText text="pittsburgh, pennsylvania" speed={20} />
            </div>
            <h1 id="hero-h" className="hero-h">
              <span className="hl"><span>Build things.</span></span>
              <span className="hl"><span>Make them <em>better.</em></span></span>
              <span className="hl"><span>Help people solve <em>real problems.</em></span></span>
            </h1>
            <p className="hero-id">
              Gene Vestel — host of <em>Out of the FHIR</em>, author of{" "}
              <em>FHIR IQ Playbook</em>, building{" "}
              <a href="https://healthclaw.io" target="_blank" rel="noopener noreferrer">HealthClaw</a>.
            </p>
            <div className="hero-ctas">
              <a
                className="hero-cta magnetic"
                href="https://open.spotify.com/show/6GBZT7KA1Ug8xMZ4l5LThU"
                target="_blank"
                rel="noopener noreferrer"
                data-hud
                {...magA}
              >
                <ScrambleText text="Listen to the podcast" trigger="hover" speed={22} />
              </a>
              <a
                className="hero-cta magnetic"
                href="https://evestel.substack.com/subscribe"
                target="_blank"
                rel="noopener noreferrer"
                data-hud
                {...magB}
              >
                <ScrambleText text="Subscribe to the newsletter" trigger="hover" speed={22} />
              </a>
              <Link className="hero-cta hero-cta-quiet magnetic" to="/expertise" data-hud {...magC}>
                <ScrambleText text="Work with me →" trigger="hover" speed={22} />
              </Link>
            </div>
          </div>

          <div className="sw-copy" ref={el => { copyRefs.current[1] = el; }}>
            <span className="sw-copy__eyebrow">the work</span>
            <p className="sw-copy__line">
              Schemas, evals, and getting two systems to agree. Most of it is
              unglamorous.
            </p>
          </div>

          <div className="sw-copy" ref={el => { copyRefs.current[2] = el; }}>
            <span className="sw-copy__eyebrow">the point</span>
            <p className="sw-copy__line">
              It's for people who never see any of it.
            </p>
          </div>
        </div>

        <div className="sw-hint" aria-hidden="true"><span>scroll</span><i /></div>
      </div>
    </div>
  );
}
