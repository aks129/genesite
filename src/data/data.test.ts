import { describe, it, expect } from "vitest";
import { projects } from "./projects";
import { passions } from "./passions";
import { travels } from "./travels";
import { socials } from "./socials";

describe("data integrity", () => {
  it("projects have a name and description", () => {
    expect(projects.length).toBeGreaterThan(0);
    for (const p of projects) {
      expect(p.name).toBeTruthy();
      expect(p.description).toBeTruthy();
      if (p.href) expect(p.href).toMatch(/^https?:\/\//);
    }
  });

  it("passions have kind, title, body, and a balanced mix", () => {
    expect(passions.length).toBe(6);
    const kinds = passions.map(p => p.kind);
    expect(kinds.filter(k => k === "professional")).toHaveLength(3);
    expect(kinds.filter(k => k === "personal")).toHaveLength(3);
    for (const p of passions) {
      expect(p.title).toBeTruthy();
      expect(p.body.length).toBeGreaterThan(40);
    }
  });

  it("travels reference files in /travels/ with alt text and intrinsic dimensions", () => {
    for (const t of travels) {
      expect(t.src).toMatch(/^\/travels\/.+\.(jpg|jpeg|png|webp)$/i);
      expect(t.alt).toBeTruthy();
      expect(t.width).toBeGreaterThan(0);
      expect(t.height).toBeGreaterThan(0);
    }
  });

  it("socials have label and absolute href (or mailto)", () => {
    expect(socials.length).toBeGreaterThanOrEqual(3);
    for (const s of socials) {
      expect(s.label).toBeTruthy();
      expect(s.href).toMatch(/^(https?:\/\/|mailto:)/);
    }
  });
});
