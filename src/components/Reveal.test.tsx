import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import Reveal from "./Reveal";
import { useReducedMotion } from "framer-motion";

vi.mock("framer-motion", async () => {
  const actual = await vi.importActual<typeof import("framer-motion")>("framer-motion");
  return { ...actual, useReducedMotion: vi.fn() };
});

const mockReduced = vi.mocked(useReducedMotion);

describe("Reveal", () => {
  beforeEach(() => {
    mockReduced.mockReturnValue(false);
  });

  it("renders children", () => {
    render(<Reveal><p>hello</p></Reveal>);
    expect(screen.getByText("hello")).toBeInTheDocument();
  });

  it("renders children unwrapped when reduced motion is requested", () => {
    mockReduced.mockReturnValue(true);
    const { container } = render(<Reveal><p data-testid="kid">hi</p></Reveal>);
    expect(screen.getByTestId("kid")).toBeInTheDocument();
    expect(container.querySelector("[style*='opacity']")).toBeNull();
  });
});
