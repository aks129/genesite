/*
 * Mapping flat DOM onto a surface inside the footage.
 *
 * The world renders a 16:9 frame with `object-fit: cover`, so a point fixed to
 * something in the room (the screen on the wall) sits at a constant *fraction*
 * of the frame but a viewport position that depends entirely on the window
 * size. Two steps, both here:
 *
 *   1. `coverProject` — frame fraction to viewport pixels, replicating what
 *      `object-fit: cover` + `object-position: center 45%` actually does.
 *   2. `matrix3dFor` — the projective transform that lays a flat rectangle onto
 *      the resulting quad, as a CSS `matrix3d`.
 *
 * This only holds while the camera is parked. A drifting camera moves the
 * surface, so anything using it is gated on the arrival state.
 */

export type Point = { x: number; y: number };
/** Clockwise from top-left. */
export type Quad = [Point, Point, Point, Point];

/** Where a frame-fraction point lands, given a cover-fitted frame in a box. */
export function coverProject(
  fx: number, fy: number,
  boxW: number, boxH: number,
  frameW: number, frameH: number,
  posX = 0.5, posY = 0.45,
): Point {
  const scale = Math.max(boxW / frameW, boxH / frameH);
  const w = frameW * scale;
  const h = frameH * scale;
  // Overflow is negative here, which is what shifts the frame off-box.
  return { x: (boxW - w) * posX + fx * w, y: (boxH - h) * posY + fy * h };
}

/** Solve `A x = b` by Gaussian elimination with partial pivoting. */
function solve(A: number[][], b: number[]): number[] | null {
  const n = b.length;
  const m = A.map((row, i) => [...row, b[i]]);
  for (let col = 0; col < n; col++) {
    let piv = col;
    for (let r = col + 1; r < n; r++) {
      if (Math.abs(m[r][col]) > Math.abs(m[piv][col])) piv = r;
    }
    if (Math.abs(m[piv][col]) < 1e-12) return null; // degenerate quad
    [m[col], m[piv]] = [m[piv], m[col]];
    for (let r = 0; r < n; r++) {
      if (r === col) continue;
      const f = m[r][col] / m[col][col];
      for (let c = col; c <= n; c++) m[r][c] -= f * m[col][c];
    }
  }
  return m.map((row, i) => row[n] / row[i]);
}

/**
 * The projective transform taking the rectangle `0,0 → w,h` onto `quad`.
 *
 * The element MUST carry `transform-origin: 0 0`. With the default centre
 * origin the matrix is applied about the middle of the box and the result
 * lands nowhere near the target, which is the classic silent failure of this
 * technique.
 */
export function matrix3dFor(quad: Quad, w: number, h: number): string | null {
  const src: Point[] = [{ x: 0, y: 0 }, { x: w, y: 0 }, { x: w, y: h }, { x: 0, y: h }];
  const A: number[][] = [];
  const b: number[] = [];
  for (let i = 0; i < 4; i++) {
    const { x, y } = src[i];
    const { x: u, y: v } = quad[i];
    A.push([x, y, 1, 0, 0, 0, -x * u, -y * u]); b.push(u);
    A.push([0, 0, 0, x, y, 1, -x * v, -y * v]); b.push(v);
  }
  const s = solve(A, b);
  if (!s) return null;
  const [a, bb, c, d, e, f, g, hh] = s;
  // CSS matrix3d is column-major; this is the 2D homography lifted into 4x4.
  const m = [a, d, 0, g, bb, e, 0, hh, 0, 0, 1, 0, c, f, 0, 1];
  if (m.some(v => !Number.isFinite(v))) return null;
  return `matrix3d(${m.map(v => Number(v.toFixed(6))).join(",")})`;
}

/** Apply a homography string's underlying transform to a point (for tests). */
export function projectWith(quad: Quad, w: number, h: number, p: Point): Point | null {
  const src: Point[] = [{ x: 0, y: 0 }, { x: w, y: 0 }, { x: w, y: h }, { x: 0, y: h }];
  const A: number[][] = [];
  const b: number[] = [];
  for (let i = 0; i < 4; i++) {
    const { x, y } = src[i];
    const { x: u, y: v } = quad[i];
    A.push([x, y, 1, 0, 0, 0, -x * u, -y * u]); b.push(u);
    A.push([0, 0, 0, x, y, 1, -x * v, -y * v]); b.push(v);
  }
  const s = solve(A, b);
  if (!s) return null;
  const [a, bb, c, d, e, f, g, hh] = s;
  const den = g * p.x + hh * p.y + 1;
  return { x: (a * p.x + bb * p.y + c) / den, y: (d * p.x + e * p.y + f) / den };
}
