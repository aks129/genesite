import { describe, it, expect } from "vitest";
import { projects } from "./projects";
import { passions } from "./passions";
import { socials } from "./socials";
import { writings, recentItems } from "./writings";
import { talks } from "./speaking";
import { career, cityCoords } from "./career";
import { expertise, tenureYears } from "./expertise";
import { events } from "./events";
import { practices } from "./practices";
import { bio } from "./bio";
import { stations, embedUrl, watchUrl } from "./radio";

describe("data integrity", () => {
  it("radio stations have a name, blurb, credited channel, and a video id", () => {
    expect(stations.length).toBeGreaterThan(0);
    const seen = new Set<string>();
    for (const s of stations) {
      expect(s.name).toBeTruthy();
      expect(s.blurb).toBeTruthy();
      // The channel is somebody else's work and gets credited on the dial.
      expect(s.channel).toBeTruthy();
      expect(s.source).toBeTruthy();
      // YouTube ids are 11 chars of [A-Za-z0-9_-].
      expect(s.video, s.name).toMatch(/^[A-Za-z0-9_-]{11}$/);
      expect(seen.has(s.video), `${s.name} duplicates a station`).toBe(false);
      seen.add(s.video);
    }
  });

  it("every station has a way out when the embed will not play", () => {
    // A channel can disable embedding, geo-block, or take a stream down, and
    // the parent page cannot detect any of it cross-origin. The link is the
    // only thing standing between that and a dead panel.
    for (const s of stations) {
      expect(watchUrl(s)).toBe(`https://www.youtube.com/watch?v=${s.video}`);
    }
  });

  it("builds an embed that autoplays, and loops only finite mixes", () => {
    for (const s of stations) {
      const url = embedUrl(s);
      expect(url).toContain("youtube-nocookie.com/embed/" + s.video);
      expect(url).toContain("autoplay=1");
      expect(url).toContain("playsinline=1");
      if (s.loop) {
        // `loop` is ignored on a single video unless `playlist` names it too.
        expect(url).toContain("loop=1");
        expect(url).toContain("playlist=" + s.video);
      } else {
        expect(url).not.toContain("loop=1");
      }
    }
  });

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

  it("recent items have date, title, and absolute href", () => {
    expect(recentItems.length).toBeGreaterThanOrEqual(3);
    for (const r of recentItems) {
      expect(r.date).toBeTruthy();
      expect(r.title).toBeTruthy();
      expect(r.href).toMatch(/^https?:\/\//);
    }
  });

  it("talks have year, title, venue, description", () => {
    expect(talks.length).toBeGreaterThan(0);
    for (const t of talks) {
      expect(t.year).toBeTruthy();
      expect(t.title).toBeTruthy();
      expect(t.venue).toBeTruthy();
      expect(t.description).toBeTruthy();
      if (t.href) expect(t.href).toMatch(/^https?:\/\//);
    }
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

  it("keeps AI and healthcare as two separate, complete practices", () => {
    expect(practices.map(p => p.slug).sort()).toEqual(["ai", "healthcare"]);
    for (const p of practices) {
      for (const f of [p.name, p.dateline, p.headline, p.lede, p.door]) expect(f).toBeTruthy();
      expect(p.offerings.length, p.slug).toBeGreaterThanOrEqual(4);
      expect(p.forWho.length, p.slug).toBeGreaterThanOrEqual(2);
      expect(p.notFor.length, p.slug).toBeGreaterThanOrEqual(2);
      expect(p.ladder, p.slug).toHaveLength(3);
      expect(p.stats.length, p.slug).toBeGreaterThanOrEqual(2);
      // Each practice points at the other one, and only there.
      expect(p.bridge.to).not.toBe(p.slug);
      expect(practices.some(o => o.slug === p.bridge.to)).toBe(true);
      for (const o of p.offerings) {
        expect(o.name && o.plain && o.description, o.name).toBeTruthy();
        expect(o.deliverables.length, o.name).toBeGreaterThanOrEqual(2);
        if (o.proof !== undefined) expect(o.proof.length, o.name).toBeGreaterThan(40);
      }
      for (const r of p.resources) expect(r.href, r.label).toMatch(/^https?:\/\//);
      for (const rule of p.regulatory?.rules ?? []) {
        expect(rule.href).toMatch(/^https:\/\//);
        expect(rule.milestones.length).toBeGreaterThanOrEqual(1);
      }
    }
  });

  it("writes practice copy without em dashes", () => {
    // Gene's style rule. Everything a visitor reads on the practice pages.
    const text = JSON.stringify(practices);
    expect(text).not.toContain("\u2014");
  });

  it("covers all eight AI areas Gene named", () => {
    const ai = practices.find(p => p.slug === "ai")!;
    const text = JSON.stringify(ai.offerings).toLowerCase();
    for (const term of ["agents", "workflows", "brain", "contextual reasoning", "enterprise", "governance", "training", "built"]) {
      expect(text, term).toContain(term);
    }
  });

  it("bio has a short and a full version, third person, no em dashes", () => {
    const words = (t: string) => t.trim().split(/\s+/).length;
    expect(words(bio.short)).toBeLessThanOrEqual(70);
    expect(words(bio.long)).toBeGreaterThan(words(bio.short));
    for (const t of [bio.short, bio.long]) {
      expect(t.startsWith("Gene Vestel is")).toBe(true);
      expect(t).not.toContain("\u2014");
      expect(t).not.toMatch(/\bI\b|\bmy\b/);
    }
  });

  it("healthcare market breadth names only employers on the career page", async () => {
    const { career } = await import("./career");
    const orgs = career.map(r => r.org).join(" | ");
    const hc = practices.find(p => p.slug === "healthcare")!;
    for (const m of hc.markets ?? []) {
      for (const org of m.label.split(", ")) {
        expect(orgs.includes(org), org).toBe(true);
      }
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
