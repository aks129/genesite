import { render } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import WindBackground from "./WindBackground";
import { useReducedMotion } from "framer-motion";

vi.mock("framer-motion", async () => {
  const actual = await vi.importActual<typeof import("framer-motion")>("framer-motion");
  return { ...actual, useReducedMotion: vi.fn() };
});

const mockReduced = vi.mocked(useReducedMotion);

describe("WindBackground", () => {
  beforeEach(() => mockReduced.mockReturnValue(false));

  it("renders a fallback div when reduced motion is requested", () => {
    mockReduced.mockReturnValue(true);
    const { container } = render(<WindBackground />);
    const node = container.querySelector(".wind-bg.fallback");
    expect(node).not.toBeNull();
    expect(container.querySelector("canvas")).toBeNull();
  });

  it("renders a fallback div when WebGL is unavailable (jsdom)", () => {
    // jsdom does not support WebGL — getContext('webgl') returns null
    const { container } = render(<WindBackground />);
    expect(container.querySelector(".wind-bg")).not.toBeNull();
    // After mount, the WebGL probe fails, so fallback class should be applied
    const fallback = container.querySelector(".wind-bg.fallback");
    expect(fallback).not.toBeNull();
  });
});
