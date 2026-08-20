import { describe, it, expect } from "vitest";
import { coverProject, matrix3dFor, projectWith, type Quad } from "./homography";

const FRAME_W = 1280, FRAME_H = 720;

describe("coverProject", () => {
  it("matches object-fit: cover when the box is wider than the frame", () => {
    // 1440x900 box, 16:9 frame -> scale 1.25, rendered 1600x900, 160px of
    // horizontal overflow split evenly, no vertical overflow.
    const tl = coverProject(0, 0, 1440, 900, FRAME_W, FRAME_H);
    expect(tl.x).toBeCloseTo(-80, 6);
    expect(tl.y).toBeCloseTo(0, 6);
    const br = coverProject(1, 1, 1440, 900, FRAME_W, FRAME_H);
    expect(br.x).toBeCloseTo(1520, 6);
    expect(br.y).toBeCloseTo(900, 6);
  });

  it("honours object-position 45% when the frame overflows vertically", () => {
    // 1600x600 box -> scale 1.25, rendered exactly 1600x900: no horizontal
    // overflow at all, 300px vertical, 45% of it taken off the top.
    const tl = coverProject(0, 0, 1600, 600, FRAME_W, FRAME_H);
    expect(tl.y).toBeCloseTo(-135, 6);
    expect(tl.x).toBeCloseTo(0, 6);
  });

  it("splits vertical overflow above the midpoint, per object-position 45%", () => {
    // 1280x600 box -> scale 1, 120px of vertical overflow: 54 above, 66 below.
    const tl = coverProject(0, 0, 1280, 600, FRAME_W, FRAME_H);
    const bl = coverProject(0, 1, 1280, 600, FRAME_W, FRAME_H);
    expect(tl.y).toBeCloseTo(-54, 6);
    expect(bl.y - 600).toBeCloseTo(66, 6);
  });

  it("is exact when the box already matches the frame aspect", () => {
    const p = coverProject(0.25, 0.5, 2560, 1440, FRAME_W, FRAME_H);
    expect(p.x).toBeCloseTo(640, 6);
    expect(p.y).toBeCloseTo(720, 6);
  });
});

describe("matrix3dFor", () => {
  const quad: Quad = [
    { x: 100, y: 50 }, { x: 400, y: 70 }, { x: 390, y: 250 }, { x: 110, y: 260 },
  ];

  it("round-trips every corner of the source rectangle", () => {
    const w = 1000, h = 500;
    const corners = [
      { x: 0, y: 0 }, { x: w, y: 0 }, { x: w, y: h }, { x: 0, y: h },
    ];
    corners.forEach((c, i) => {
      const got = projectWith(quad, w, h, c)!;
      expect(got.x).toBeCloseTo(quad[i].x, 4);
      expect(got.y).toBeCloseTo(quad[i].y, 4);
    });
  });

  it("keeps the centre inside the quad", () => {
    const mid = projectWith(quad, 1000, 500, { x: 500, y: 250 })!;
    expect(mid.x).toBeGreaterThan(100);
    expect(mid.x).toBeLessThan(400);
    expect(mid.y).toBeGreaterThan(50);
    expect(mid.y).toBeLessThan(260);
  });

  it("emits a 16-value matrix3d", () => {
    const css = matrix3dFor(quad, 1000, 500)!;
    expect(css).toMatch(/^matrix3d\(/);
    expect(css.slice(9, -1).split(",")).toHaveLength(16);
  });

  it("returns null for a degenerate quad rather than NaN soup", () => {
    const flat: Quad = [
      { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 },
    ];
    expect(matrix3dFor(flat, 100, 100)).toBeNull();
  });
});
