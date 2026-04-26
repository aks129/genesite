import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import Reveal from "./Reveal";

function setReducedMotion(reduced: boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: query.includes("reduce") && reduced,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

describe("Reveal", () => {
  beforeEach(() => {
    setReducedMotion(false);
  });

  it("renders children", () => {
    render(<Reveal><p>hello</p></Reveal>);
    expect(screen.getByText("hello")).toBeInTheDocument();
  });

  it("renders children unwrapped when reduced motion is requested", () => {
    setReducedMotion(true);
    const { container } = render(<Reveal><p data-testid="kid">hi</p></Reveal>);
    expect(screen.getByTestId("kid")).toBeInTheDocument();
    // No motion wrapper element when reduced
    expect(container.querySelector("[style*='opacity']")).toBeNull();
  });
});
