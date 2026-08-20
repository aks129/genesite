import { describe, it, expect } from "vitest";
import {
  SCENES, TOTAL, DRIFT, WAYPOINTS, HOME,
  toU, fromU, waypointFor, isFilmRoute,
} from "./timeline";

describe("world timeline", () => {
  it("spans every clip exactly once", () => {
    expect(TOTAL).toBeCloseTo(SCENES.reduce((a, s) => a + s.duration, 0), 6);
    expect(toU(0, 0)).toBe(0);
    expect(toU(SCENES.length - 1, SCENES[SCENES.length - 1].duration)).toBeCloseTo(1, 6);
  });

  it("round-trips (scene, seconds) through u", () => {
    for (let i = 0; i < SCENES.length; i++) {
      for (const s of [0.1, 1, 3, SCENES[i].duration - 0.1]) {
        const back = fromU(toU(i, s));
        expect(back.scene).toBe(i);
        expect(back.seconds).toBeCloseTo(s, 4);
      }
    }
  });

  it("clamps outside the flight instead of running off it", () => {
    expect(fromU(-1)).toEqual({ scene: 0, seconds: 0 });
    const end = fromU(2);
    expect(end.scene).toBe(SCENES.length - 1);
    expect(end.seconds).toBeCloseTo(SCENES[SCENES.length - 1].duration, 4);
  });
});

describe("waypoints", () => {
  const entries = Object.entries(WAYPOINTS);

  it("keeps the whole forward drift inside one clip", () => {
    // Drift runs forward from the waypoint. Landing closer than DRIFT to the
    // end of a clip would stall the camera, or cut to the next clip mid-read.
    const TAIL = 0.15; // decoder headroom — never seek to the last frame
    for (const [route, wp] of entries) {
      const dur = SCENES[wp.scene].duration;
      expect(wp.seconds, `${route} starts inside its clip`).toBeGreaterThan(0);
      expect(wp.seconds + DRIFT, `${route} drift overruns its clip`).toBeLessThanOrEqual(dur - TAIL);
    }
  });

  it("gives every route a distinct spot, a place name, and a real poster", () => {
    const seen = new Set<string>();
    for (const [route, wp] of entries) {
      expect(wp.place, route).toBeTruthy();
      expect(wp.poster, route).toMatch(/^\/world\/.+\.jpg$/);
      expect(wp.u).toBeGreaterThanOrEqual(0);
      expect(wp.u).toBeLessThanOrEqual(1);
      // /services aliases /expertise on purpose — same room, two URLs.
      const key = `${wp.scene}:${wp.seconds}`;
      if (route !== "/services") {
        expect(seen.has(key), `${route} duplicates another waypoint`).toBe(false);
      }
      seen.add(key);
    }
  });

  it("covers every navigable route, aliases included", () => {
    // Mirrors the nav in Nav.tsx plus the /services alias of /expertise.
    for (const route of ["/career", "/expertise", "/services", "/projects", "/writing", "/speaking", "/hobbies"]) {
      expect(WAYPOINTS[route], route).toBeDefined();
      expect(isFilmRoute(route)).toBe(false);
    }
  });

  it("treats home and anything unrouted as the film", () => {
    expect(isFilmRoute("/")).toBe(true);
    expect(isFilmRoute("/nope")).toBe(true);
    expect(waypointFor("/nope")).toBe(HOME);
    expect(waypointFor("/projects").place).toBe("the worktable");
  });

  it("aliases /services onto the same frame as /expertise", () => {
    expect(WAYPOINTS["/services"].u).toBe(WAYPOINTS["/expertise"].u);
    expect(WAYPOINTS["/services"].place).toBe(WAYPOINTS["/expertise"].place);
  });
});
