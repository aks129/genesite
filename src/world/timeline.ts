/*
 * The world timeline.
 *
 * Every route on this site is a place in one house. The three clips in
 * `public/world/vid/` are a single unbroken camera flight — down a boardwalk,
 * through open glass, along the worktable, out over the valley — so laying the
 * routes onto that flight is what makes the tabs feel connected instead of
 * merely themed. Nothing here generates anything; the whole map is cut out of
 * footage that already exists.
 *
 * `u` is position along the whole flight, 0 → 1, weighted by real clip
 * duration. `(scene, seconds)` is position inside one clip. The engine works in
 * seconds; travel between routes interpolates in `u`.
 */

export type SceneId = "approach" | "inside" | "valley";

export type Scene = {
  id: SceneId;
  clip: string;
  poster: string;
  /** measured with ffprobe — the runtime value from the decoder wins when present */
  duration: number;
  /** viewport-heights of scroll this leg occupies in the home film */
  weight: number;
};

export const SCENES: Scene[] = [
  { id: "approach", clip: "/world/vid/approach.mp4", poster: "/world/approach.jpg", duration: 8.0417, weight: 1.3 },
  { id: "inside",   clip: "/world/vid/inside.mp4",   poster: "/world/inside.jpg",   duration: 6.0417, weight: 0.9 },
  { id: "valley",   clip: "/world/vid/valley.mp4",   poster: "/world/valley.jpg",   duration: 6.0417, weight: 0.9 },
];

export const TOTAL = SCENES.reduce((a, s) => a + s.duration, 0);

/**
 * Seconds of footage the ambient camera drifts across while you read a page.
 * Forward only: a route parks exactly on its frame and reading walks you
 * further in, so the camera never reverses — the one move that breaks the
 * illusion of a single unbroken take.
 */
export const DRIFT = 0.9;

const OFFSETS = SCENES.reduce<number[]>((acc, _s, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + SCENES[i - 1].duration);
  return acc;
}, []);

export const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));

/** (scene index, seconds into that clip) → position on the whole flight */
export function toU(scene: number, seconds: number): number {
  return clamp((OFFSETS[scene] + seconds) / TOTAL);
}

/** position on the whole flight → (scene index, seconds into that clip) */
export function fromU(u: number): { scene: number; seconds: number } {
  const t = clamp(u) * TOTAL;
  let scene = SCENES.length - 1;
  for (let i = 0; i < SCENES.length; i++) if (t >= OFFSETS[i]) scene = i;
  return { scene, seconds: Math.min(t - OFFSETS[scene], SCENES[scene].duration) };
}

export type Waypoint = {
  /** index into SCENES */
  scene: number;
  /** seconds into that clip — the frame the route parks on */
  seconds: number;
  /** position on the whole flight */
  u: number;
  /** what you'd call this spot walking someone through the house */
  place: string;
  /** poster cut from this exact frame with ffmpeg */
  poster: string;
};

function wp(scene: number, seconds: number, place: string, poster: string): Waypoint {
  return { scene, seconds, u: toU(scene, seconds), place, poster };
}

/*
 * Seam rule: a waypoint plus its full forward DRIFT must stay inside its own
 * clip, or the drift runs off the end and stalls mid-read — or worse, cuts to
 * the next clip while someone is reading. Enforced in timeline.test.ts.
 */
export const WAYPOINTS: Record<string, Waypoint> = {
  "/career":    wp(0, 1.6, "the boardwalk",     "/world/wp/career.jpg"),
  "/expertise": wp(0, 6.6, "the threshold",     "/world/wp/expertise.jpg"),
  "/services":  wp(0, 6.6, "the threshold",     "/world/wp/expertise.jpg"),
  "/writing":   wp(1, 3.2, "the reading corner", "/world/wp/writing.jpg"),
  "/projects":  wp(1, 4.6, "the worktable",     "/world/wp/projects.jpg"),
  "/speaking":  wp(2, 1.4, "the screen wall",   "/world/wp/speaking.jpg"),
  "/hobbies":   wp(2, 4.6, "the overlook",      "/world/wp/hobbies.jpg"),
};

/** Home is the flight itself rather than a parking spot. */
export const HOME: Waypoint = wp(0, 0, "the ridge", "/world/approach.jpg");

export function waypointFor(pathname: string): Waypoint {
  return WAYPOINTS[pathname] ?? HOME;
}

/** Home scrubs the film; every other route parks in a room. */
export function isFilmRoute(pathname: string): boolean {
  return !(pathname in WAYPOINTS);
}
