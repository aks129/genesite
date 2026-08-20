import { useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import * as world from "../world/engine";
import { prefetchClip } from "../world/clips";
import { SCENES, DRIFT, TOTAL, waypointFor, isFilmRoute, clamp } from "../world/timeline";
import { coverProject, matrix3dFor, type Quad } from "../world/homography";
import { useWorldEnabled } from "../world/useWorldEnabled";

/**
 * The house, behind every page.
 *
 * The home route is the flight itself (`ScrollWorld`), so this stands in for
 * the rest of the site: each tab parks the camera at a different spot along the
 * same unbroken take, and navigating between tabs flies the camera there rather
 * than cutting. Scrolling a page drifts it a little further in, so the room is
 * never quite a photograph.
 *
 * Readability is the whole constraint here. Two veils sit over the footage:
 *
 *   - a flat dim that ramps from 0.52 on arrival to 0.93 once you have scrolled
 *     past the head, so long-form copy always sits on near-solid `--bg`
 *   - a lower-screen gradient and a centred column mask, both present only
 *     while the arrival state is open, which hold down everything below and
 *     behind the page head while leaving the outer thirds of the room bright
 *
 * Combined worst-case figures are in DESIGN.md. Nothing below the arrival band
 * is ever lighter than the equivalent of a 0.93 veil.
 */

export const TRAVEL_MS = 1100;

/** The footage is 16:9; surface fractions are relative to this. */
const FRAME_W = 1280;
const FRAME_H = 720;

/** Scroll distance over which the arrival state closes, in viewport heights. */
const OPEN_SPAN = 0.45;

/**
 * Viewport-space bottom edge of an element, ignoring ancestor transforms.
 *
 * `getBoundingClientRect` would be simpler, but PageShell slides new content in
 * from 14px down, so measuring during the entry animation reads a position the
 * page will not keep — and the reading is latched. Walking offsetParents sees
 * the settled layout on the first frame instead.
 */
function layoutBottom(el: HTMLElement): number {
  let y = 0;
  let n: HTMLElement | null = el;
  while (n) { y += n.offsetTop; n = n.offsetParent as HTMLElement | null; }
  return y + el.offsetHeight - window.scrollY;
}

export default function WorldStage() {
  const enabled = useWorldEnabled();
  const { pathname } = useLocation();
  const film = isFilmRoute(pathname);

  if (!enabled || film) return null;
  return <Stage pathname={pathname} />;
}

function Stage({ pathname }: { pathname: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const plateRef = useRef<HTMLDivElement>(null);

  /*
   * Layout effects, not plain effects, and in this order.
   *
   * A newly mounted plate inherits whatever `--w-still` the previous route left
   * on the host, so running after paint showed one frame of a fully lit screen
   * before travel suppressed it. Writing these before paint removes that, and
   * keeping mount first means the engine's layers exist by the time the route
   * effect sets a poster on one.
   */
  useLayoutEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    world.mount(host, world.currentU());
    document.body.classList.add("world-on");
    return () => {
      world.unmount();
      document.body.classList.remove("world-on");
    };
  }, []);

  useLayoutEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const wp = waypointFor(pathname);
    world.setPoster(wp.scene, wp.poster);
    // Suppress anything projected onto the room before the first paint of the
    // new route; `read()` below decides what it should actually be.
    host.style.setProperty("--w-still", "0");

    // Landing straight on a tab means the camera was never anywhere else, so
    // there is nothing to fly from. Everything after that is a real move.
    let travelling = false;
    let settle = 0;
    if (world.hasPosition()) {
      world.travelTo(wp.u, TRAVEL_MS);
      travelling = true;
      settle = window.setTimeout(() => { travelling = false; read(); }, TRAVEL_MS);
    } else {
      world.jumpTo(wp.u);
    }

    // Warm the neighbouring clips while idle. Travel degrades gracefully
    // without them — an uncached leg shows its still instead of flying — but a
    // visitor who reads one page has usually paid for the next flight by the
    // time they click. Only the two adjacent legs, never the whole house.
    for (const i of [wp.scene - 1, wp.scene + 1]) {
      if (SCENES[i]) prefetchClip(SCENES[i].clip);
    }

    let ticking = false;
    const read = () => {
      ticking = false;
      const vh = window.innerHeight;
      const y = window.scrollY;

      // Lay the plate onto the surface in the frame. Recomputed on resize
      // because cover-fit moves the surface whenever the window changes.
      const plate = plateRef.current;
      if (plate && wp.surface) {
        const vw = window.innerWidth;
        const quad = wp.surface.corners.map(([fx, fy]) =>
          coverProject(fx, fy, vw, vh, FRAME_W, FRAME_H),
        ) as Quad;
        const m = matrix3dFor(quad, wp.surface.refW, wp.surface.refH);
        if (m) plate.style.transform = m;

        /*
         * A lit screen is the one bright thing on the page, so no copy may sit
         * on it. Where the surface lands is decided by the footage and the
         * window between them, not by the layout, so rather than hoping the
         * two never meet, measure it: if the panel reaches up into the page
         * head, the screen stays off. Self-correcting at any viewport size.
         */
        const head = document.querySelector<HTMLElement>(".page-head");
        const headBottom = head ? layoutBottom(head) : 0;
        const ys = quad.map(q => q.y);
        const top = Math.min(...ys);
        // The test is against the panel's content area, not its outer edge: the
        // top strip is deliberately dark (see .world-plate__inner) so a last
        // line of the lede may graze it, but nothing may sit on the lit part.
        const contentTop = top + (Math.max(...ys) - top) * 0.3;
        plate.style.setProperty("--w-fit", contentTop > headBottom ? "1" : "0");
      }

      // Arrival state: open at the top, closed once the head has scrolled off.
      const open = 1 - clamp(y / (vh * OPEN_SPAN));
      host.style.setProperty("--w-open", open.toFixed(3));
      // The sharp still covers the clip while parked and open; never in flight.
      host.style.setProperty("--w-still", travelling ? "0" : open.toFixed(3));

      // Drift: the route parks on its frame and reading walks the camera
      // DRIFT seconds further in. Forward only — never back past the waypoint.
      const range = Math.max(1, document.documentElement.scrollHeight - vh);
      world.setU(wp.u + (clamp(y / range) * DRIFT) / TOTAL);
    };
    const onScroll = () => {
      if (!ticking) { ticking = true; requestAnimationFrame(read); }
    };

    read();
    // Fraunces changes the height of the head once it loads, which moves the
    // collision test's answer.
    document.fonts?.ready.then(() => { if (plateRef.current) read(); });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", read);
    return () => {
      window.clearTimeout(settle);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", read);
    };
  }, [pathname]);

  const wp = waypointFor(pathname);

  return (
    <div className="world" ref={hostRef} aria-hidden="true">
      {/* Scene layers are appended here by the engine, beneath both veils. */}
      <div className="world-dim" />
      <div className="world-settle" />
      <div className="world-column" />
      <div className="world-edge" />
      {wp.surface && (
        <div className="world-plate" ref={plateRef}>
          <div className="world-plate__inner">
            <span className="world-plate__eyebrow">out of the FHIR</span>
            <span className="world-plate__title">Stories behind the standards.</span>
            <span className="world-plate__cue">▸ press play</span>
          </div>
        </div>
      )}
    </div>
  );
}
