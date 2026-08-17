import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useReducedMotion } from "framer-motion";
import ScrambleText from "./ScrambleText";
import RouteTransition from "./RouteTransition";

vi.mock("framer-motion", async () => {
  const actual = await vi.importActual<typeof import("framer-motion")>("framer-motion");
  return { ...actual, useReducedMotion: vi.fn() };
});

const mockReduce = useReducedMotion as unknown as ReturnType<typeof vi.fn>;

describe("ScrambleText", () => {
  beforeEach(() => mockReduce.mockReset());

  it("always exposes the real string to assistive tech", () => {
    mockReduce.mockReturnValue(false);
    const { container } = render(<ScrambleText text="Listen to the podcast" />);
    const sr = container.querySelector(".visually-hidden");
    expect(sr?.textContent).toBe("Listen to the podcast");
    // the animated copies are decorative and hidden from the a11y tree
    for (const el of container.querySelectorAll(".scramble-ghost, .scramble-live")) {
      expect(el.getAttribute("aria-hidden")).toBe("true");
    }
  });

  it("renders plain text under reduced motion", () => {
    mockReduce.mockReturnValue(true);
    const { container } = render(<ScrambleText text="Subscribe" />);
    const live = container.querySelector(".scramble-live");
    expect(live?.textContent).toBe("Subscribe");
  });
});

describe("RouteTransition", () => {
  beforeEach(() => mockReduce.mockReset());

  it("renders nothing under reduced motion", () => {
    mockReduce.mockReturnValue(true);
    const { container } = render(
      <MemoryRouter><RouteTransition /></MemoryRouter>,
    );
    expect(container.querySelector(".route-wipe")).toBeNull();
  });

  it("renders nothing before the first navigation", () => {
    mockReduce.mockReturnValue(false);
    const { container } = render(
      <MemoryRouter><RouteTransition /></MemoryRouter>,
    );
    expect(container.querySelector(".route-wipe")).toBeNull();
  });
});
