import { describe, it, expect } from "vitest";
import { projects } from "./projects";
import { passions } from "./passions";
import { travels } from "./travels";
import { socials } from "./socials";
import { writings } from "./writings";
import { talks } from "./speaking";
import { career, cityCoords } from "./career";
import { expertise, tenureYears } from "./expertise";
import { events } from "./events";
import { services } from "./services";

describe("data integrity", () => {
  it("projects have a name and description", () => {
    expect(projects.length).toBeGreaterThan(0);
    for (const p of projects) {
      expect(p.name).toBeTruthy();
      expect(p.description).toBeTruthy();
      if (p.href) expect(p.href).toMatch(/^https?:\/\//);
      if (p.repo) expect(p.repo).toMatch(/^https?:\/\//);
    }
  });

  it("writings have name, kind, tagline, description, and absolute href", () => {
    expect(writings.length).toBeGreaterThan(0);
    for (const w of writings) {
      expect(w.name).toBeTruthy();
      expect(["newsletter", "podcast"]).toContain(w.kind);
      expect(w.tagline).toBeTruthy();
      expect(w.description).toBeTruthy();
      expect(w.href).toMatch(/^https?:\/\//);
      for (const p of w.platforms ?? []) {
        expect(p.label).toBeTruthy();
        expect(p.href).toMatch(/^https?:\/\//);
      }
    }
  });

  it("talks have year, title, venue, description; upcoming talks flagged", () => {
    expect(talks.length).toBeGreaterThan(0);
    for (const t of talks) {
      expect(t.year).toBeTruthy();
      expect(t.title).toBeTruthy();
      expect(t.venue).toBeTruthy();
      expect(t.description).toBeTruthy();
      if (t.href) expect(t.href).toMatch(/^https?:\/\//);
    }
    const upcoming = talks.filter(t => t.upcoming);
    expect(upcoming.length).toBeGreaterThanOrEqual(1);
  });

  it("career roles reference a known city and have role+org", () => {
    expect(career.length).toBeGreaterThan(0);
    for (const r of career) {
      expect(r.start).toBeTruthy();
      expect(r.end).toBeTruthy();
      expect(r.role).toBeTruthy();
      expect(r.org).toBeTruthy();
      expect(cityCoords[r.city]).toBeDefined();
    }
  });

  it("expertise groups have a heading and at least 3 items", () => {
    expect(expertise.length).toBeGreaterThanOrEqual(3);
    expect(tenureYears).toBeGreaterThanOrEqual(10);
    for (const g of expertise) {
      expect(g.heading).toBeTruthy();
      expect(g.items.length).toBeGreaterThanOrEqual(3);
      for (const i of g.items) expect(i).toBeTruthy();
    }
  });

  it("events have when, org, title, description", () => {
    expect(events.length).toBeGreaterThan(0);
    for (const e of events) {
      expect(e.when).toBeTruthy();
      expect(e.org).toBeTruthy();
      expect(e.title).toBeTruthy();
      expect(e.description).toBeTruthy();
      if (e.href) expect(e.href).toMatch(/^https?:\/\//);
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

  it("services have name, category, tagline, description; outcomes are non-empty when present", () => {
    expect(services.length).toBeGreaterThanOrEqual(6);
    const cats = new Set([
      "Strategy & Governance",
      "Implementation",
      "Data & Analytics",
      "Enablement",
    ]);
    for (const s of services) {
      expect(s.name).toBeTruthy();
      expect(cats.has(s.category)).toBe(true);
      expect(s.tagline).toBeTruthy();
      expect(s.description.length).toBeGreaterThan(40);
      for (const o of s.outcomes ?? []) expect(o).toBeTruthy();
      if (s.proof !== undefined) expect(s.proof.length).toBeGreaterThan(40);
    }
    const withProof = services.filter(s => s.proof);
    expect(withProof.length).toBeGreaterThanOrEqual(4);
  });

  it("socials have label and absolute href (or mailto)", () => {
    expect(socials.length).toBeGreaterThanOrEqual(3);
    for (const s of socials) {
      expect(s.label).toBeTruthy();
      expect(s.href).toMatch(/^(https?:\/\/|mailto:)/);
    }
  });
});
