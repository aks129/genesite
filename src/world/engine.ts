/*
 * The world engine.
 *
 * Holds one position on the flight (`u`) and keeps three stacked scene layers
 * showing the right frame for it. Everything above this file — the home film,
 * route travel, ambient drift — is just something that moves `u`.
 *
 * A module singleton rather than a hook because the camera has to outlive any
 * one component: navigating from /projects to /speaking unmounts a page and
 * mounts another, and the camera has to keep going through that, not restart.
 */

import { SCENES, fromU, clamp } from "./timeline";
import { loadClip, prefetchClip, videoAllowed } from "./clips";

const SEEK_EPS = 0.01;
const CROSSFADE_MS = 340;
/** How hard `cur` chases `target` when no travel is running. Ambient drift only. */
const LERP = 0.09;

type Layer = {
  el: HTMLDivElement;
  img: HTMLImageElement;
  video: HTMLVideoElement | null;
  status: "idle" | "loading" | "ready";
};

type Tween = { from: number; to: number; start: number; ms: number };

let host: HTMLElement | null = null;
let layers: Layer[] = [];
let raf = 0;
let fadeTimer = 0;
let cur = 0;
let target = 0;
let tween: Tween | null = null;
let active = -1;
/** Whether the camera has ever been aimed this session — see `hasPosition`. */
let placed = false;

const easeInOut = (x: number) =>
  x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

/** Where the camera is right now — read when a stage hands off to another. */
export function currentU(): number { return cur; }
export function isMounted(): boolean { return host !== null; }

export function mount(el: HTMLElement, startU: number): void {
  if (host) unmount();
  host = el;
  cur = clamp(startU);
  target = cur;
  tween = null;
  active = -1;

  layers = SCENES.map(s => {
    const div = document.createElement("div");
    div.className = "world-scene";
    div.setAttribute("aria-hidden", "true");
    const img = document.createElement("img");
    img.className = "world-scene__still";
    img.src = s.poster;
    img.alt = "";
    img.decoding = "async";
    div.appendChild(img);
    el.appendChild(div);
    return { el: div, img, video: null, status: "idle" as const };
  });

  raf = requestAnimationFrame(frame);
}

export function unmount(): void {
  cancelAnimationFrame(raf);
  window.clearTimeout(fadeTimer);
  raf = 0;
  for (const l of layers) {
    if (l.video) { l.video.removeAttribute("src"); l.video.load(); l.video.remove(); }
    l.el.remove();
  }
  layers = [];
  host = null;
  active = -1;
}

/** Ambient move: `cur` eases toward `u` every frame. Used for scroll drift. */
export function setU(u: number): void {
  target = clamp(u);
  placed = true;
}

/** Snap with no motion. Used when a stage takes over mid-flight. */
export function jumpTo(u: number): void {
  cur = target = clamp(u);
  tween = null;
  placed = true;
}

/**
 * False only on the very first route of a session. A stage uses it to decide
 * between arriving (the camera was never anywhere else, so snap) and travelling
 * (the visitor was somewhere in this house a moment ago, so fly there).
 */
export function hasPosition(): boolean { return placed; }

/**
 * Fly from wherever the camera is to `u` over a fixed duration, regardless of
 * distance — /career to /hobbies crosses the whole house, and pacing it by
 * distance would make that one navigation feel broken-slow.
 */
export function travelTo(u: number, ms: number): void {
  const to = clamp(u);
  target = to;
  placed = true;
  if (Math.abs(to - cur) < 0.002) { cur = to; tween = null; return; }
  tween = { from: cur, to, start: performance.now(), ms };
  // Warm the far end now so the arrival frame is real footage, not the poster.
  prefetchClip(SCENES[fromU(to).scene].clip);
}

/**
 * Swap a layer's still for the frame a route parks on. The waypoint posters are
 * cut from these very clips, so before the video lands the page is already
 * showing the correct frame rather than the clip's opening one.
 */
export function setPoster(scene: number, src: string): void {
  const l = layers[scene];
  if (l && l.img.getAttribute("src") !== src) l.img.src = src;
}

function ensureClip(i: number): void {
  const l = layers[i];
  if (!l || l.status !== "idle" || !videoAllowed()) return;
  l.status = "loading";
  loadClip(SCENES[i].clip)
    .then(url => {
      if (!host || layers[i] !== l) return;
      const v = document.createElement("video");
      v.className = "world-scene__video";
      v.muted = true;
      v.playsInline = true;
      v.preload = "auto";
      v.setAttribute("muted", "");
      v.setAttribute("playsinline", "");
      v.src = url;
      v.addEventListener("loadedmetadata", () => { l.status = "ready"; });
      // Hold the still until a real frame has actually painted.
      v.addEventListener("seeked", () => { l.el.classList.add("has-clip"); }, { once: true });
      v.addEventListener("loadeddata", () => { try { v.pause(); } catch { /* noop */ } });
      l.el.appendChild(v);
      l.video = v;
    })
    .catch(() => { l.status = "idle"; });
}

/*
 * Layer swap. The outgoing layer is left at full opacity underneath while the
 * incoming one fades in on top — fading both at once would show the page
 * background through the middle of the dissolve.
 */
function setActive(i: number): void {
  if (i === active || !layers[i]) return;
  const prev = active;
  active = i;
  if (prev >= 0) layers[prev].el.style.zIndex = "2";
  const next = layers[i];
  next.el.style.zIndex = "3";
  if (prev < 0) {
    next.el.style.opacity = "1";
  } else {
    next.el.style.opacity = "0";
    void next.el.offsetWidth; // commit the 0 before transitioning to 1
    next.el.style.opacity = "1";
  }
  window.clearTimeout(fadeTimer);
  fadeTimer = window.setTimeout(() => {
    layers.forEach((l, k) => {
      if (k === active) return;
      l.el.style.opacity = "0";
      l.el.style.zIndex = "1";
    });
  }, CROSSFADE_MS + 60);
}

function frame(now: number): void {
  if (tween) {
    const k = clamp((now - tween.start) / tween.ms);
    cur = tween.from + (tween.to - tween.from) * easeInOut(k);
    if (k >= 1) { cur = tween.to; tween = null; }
  } else {
    cur += (target - cur) * LERP;
  }

  const { scene, seconds } = fromU(cur);
  setActive(scene);
  ensureClip(scene);

  const l = layers[scene];
  const v = l?.video;
  if (v && l.status === "ready" && !v.seeking) {
    const dur = v.duration || SCENES[scene].duration;
    const t = Math.min(seconds, dur - 0.02);
    if (Math.abs(v.currentTime - t) > SEEK_EPS) {
      try { v.currentTime = t; } catch { /* noop */ }
    }
  }

  raf = requestAnimationFrame(frame);
}

/**
 * Let the home film keep the module's idea of the camera current while no stage
 * is mounted, so navigating away from `/` travels from where the visitor
 * actually was in the flight rather than from the trailhead.
 */
export function publishU(u: number): void {
  if (!host) { cur = target = clamp(u); placed = true; }
}
