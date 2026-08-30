import { render, screen, fireEvent, within } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import Radio from "./Radio";
import { SCREEN_EVENT } from "./ScreenPlayer";
import { stations } from "../data/radio";
import { useReducedMotion } from "framer-motion";

vi.mock("framer-motion", async () => {
  const actual = await vi.importActual<typeof import("framer-motion")>("framer-motion");
  return { ...actual, useReducedMotion: vi.fn() };
});

const mockReduced = vi.mocked(useReducedMotion);
/* The toggle's label becomes the station name once something is playing, so it
   is addressed by role in the dock rather than by text. */
const dial = (c: HTMLElement) => c.querySelector<HTMLButtonElement>(".radio-toggle")!;
const frame = (c: HTMLElement) => c.querySelector("iframe");

describe("Radio", () => {
  beforeEach(() => {
    mockReduced.mockReset();
    mockReduced.mockReturnValue(false);
    localStorage.clear();
  });

  it("loads nothing from YouTube until a station is picked", () => {
    // The dial's own promise. Mounting the iframe up front would mean every
    // visitor pings YouTube whether or not they ever wanted music.
    const { container } = render(<Radio />);
    expect(frame(container)).toBeNull();
    fireEvent.click(dial(container));
    expect(frame(container)).toBeNull(); // opening the dial is not tuning
  });

  it("lists every station with its blurb and credited channel", () => {
    const { container } = render(<Radio />);
    fireEvent.click(dial(container));
    const list = screen.getByRole("list", { name: /stations/i });
    for (const s of stations) {
      expect(within(list).getByText(s.name)).toBeInTheDocument();
      expect(within(list).getByText(s.blurb)).toBeInTheDocument();
    }
  });

  it("mounts an autoplaying player for the chosen station and credits it", () => {
    const { container } = render(<Radio />);
    fireEvent.click(dial(container));
    fireEvent.click(screen.getByText(stations[0].name));

    const f = frame(container)!;
    expect(f).not.toBeNull();
    expect(f.getAttribute("src")).toContain(stations[0].video);
    expect(f.getAttribute("src")).toContain("autoplay=1");
    // Privacy-enhanced host, not the tracking one.
    expect(f.getAttribute("src")).toContain("youtube-nocookie.com");
    expect(screen.getByText(stations[0].channel)).toBeInTheDocument();
    // Always a way out if the embed will not play.
    expect(screen.getByRole("link", { name: /open on youtube/i })).toHaveAttribute(
      "href", `https://www.youtube.com/watch?v=${stations[0].video}`,
    );
  });

  it("stops means stops: the player is gone, not merely hidden", () => {
    const { container } = render(<Radio />);
    fireEvent.click(dial(container));
    fireEvent.click(screen.getByText(stations[1].name));
    expect(frame(container)).not.toBeNull();
    fireEvent.click(screen.getByRole("button", { name: /stop the radio/i }));
    expect(frame(container)).toBeNull();
  });

  it("keeps playing while the dial is folded away", () => {
    // Collapsing must never unmount the player, or the music stops when the
    // visitor tidies the corner.
    const { container } = render(<Radio />);
    fireEvent.click(dial(container));
    fireEvent.click(screen.getByText(stations[0].name));
    const before = frame(container);
    fireEvent.click(dial(container));   // open the dial again
    fireEvent.click(dial(container));   // and fold it away
    expect(frame(container)).toBe(before);
  });

  it("yields to the podcast rather than talking over it", () => {
    const { container } = render(<Radio />);
    fireEvent.click(dial(container));
    fireEvent.click(screen.getByText(stations[0].name));
    const post = vi.fn();
    Object.defineProperty(frame(container)!, "contentWindow", {
      value: { postMessage: post }, configurable: true,
    });

    window.dispatchEvent(new CustomEvent(SCREEN_EVENT, { detail: { open: true } }));
    expect(post).toHaveBeenCalledOnce();
    expect(JSON.parse(post.mock.calls[0][0])).toMatchObject({ func: "pauseVideo" });

    post.mockClear();
    window.dispatchEvent(new CustomEvent(SCREEN_EVENT, { detail: { open: false } }));
    expect(post).not.toHaveBeenCalled();
  });

  it("remembers the last station but never starts on its own", () => {
    localStorage.setItem("gene.radio.station", stations[2].name);
    const { container } = render(<Radio />);
    expect(frame(container)).toBeNull();
    fireEvent.click(dial(container));
    expect(screen.getByText(/last played/i)).toBeInTheDocument();
  });

  it("still works under reduced motion — it is a feature, not decoration", () => {
    mockReduced.mockReturnValue(true);
    const { container } = render(<Radio />);
    fireEvent.click(dial(container));
    fireEvent.click(screen.getByText(stations[0].name));
    expect(frame(container)).not.toBeNull();
    // only the level meter goes still
    expect(container.querySelector(".radio-eq.is-live")).toBeNull();
  });
});
