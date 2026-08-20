import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import * as world from "../world/engine";
import { prefetchClip } from "../world/clips";
import { SCENES, DRIFT, TOTAL, waypointFor, isFilmRoute, clamp } from "../world/timeline";
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

/** Scroll distance over which the arrival state closes, in viewport heights. */
const OPEN_SPAN = 0.45;

export default function WorldStage() {
  const enabled = useWorldEnabled();
  const { pathname } = useLocation();
  const film = isFilmRoute(pathname);

  if (!enabled || film) return null;
  return <Stage pathname={pathname} />;
}

function Stage({ pathname }: { pathname: string }) {
  const hostRef = useRef<HTMLDivElement>(null);

  // Mount once for the lifetime of the world, not once per route: the camera
  // has to survive the page swap it is flying through.
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    world.mount(host, world.currentU());
    document.body.classList.add("world-on");
    return () => {
      world.unmount();
      document.body.classList.remove("world-on");
    };
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const wp = waypointFor(pathname);
    world.setPoster(wp.scene, wp.poster);

    // Landing straight on a tab means the camera was never anywhere else, so
    // there is nothing to fly from. Everything after that is a real move.
    if (world.hasPosition()) world.travelTo(wp.u, TRAVEL_MS);
    else world.jumpTo(wp.u);

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

      // Arrival state: open at the top, closed once the head has scrolled off.
      const open = 1 - clamp(y / (vh * OPEN_SPAN));
      host.style.setProperty("--w-open", open.toFixed(3));

      // Drift: the route parks on its frame and reading walks the camera
      // DRIFT seconds further in. Forward only — never back past the waypoint.
      const range = Math.max(1, document.documentElement.scrollHeight - vh);
      world.setU(wp.u + (clamp(y / range) * DRIFT) / TOTAL);
    };
    const onScroll = () => {
      if (!ticking) { ticking = true; requestAnimationFrame(read); }
    };

    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", read);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", read);
    };
  }, [pathname]);

  return (
    <div className="world" ref={hostRef} aria-hidden="true">
      {/* Scene layers are appended here by the engine, beneath both veils. */}
      <div className="world-dim" />
      <div className="world-settle" />
      <div className="world-column" />
      <div className="world-edge" />
    </div>
  );
}
