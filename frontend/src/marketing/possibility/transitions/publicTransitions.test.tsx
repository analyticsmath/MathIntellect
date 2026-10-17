// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Link, MemoryRouter, Route, Routes } from "react-router-dom";
import { PublicTransitionProvider } from "./PublicTransitionProvider";
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});
it("cancels a carried actor when a second navigation chooses a new destination", () => {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: () => ({ matches: false }),
  });
  const animation = { cancel: vi.fn(), finished: new Promise<void>(() => {}) };
  Object.defineProperty(SVGElement.prototype, "animate", {
    configurable: true,
    value: vi.fn(() => animation),
  });
  vi.spyOn(SVGElement.prototype, "getBoundingClientRect").mockReturnValue({
    x: 20,
    y: 20,
    width: 400,
    height: 200,
    top: 20,
    left: 20,
    bottom: 220,
    right: 420,
    toJSON() {},
  });
  vi.spyOn(window, "requestAnimationFrame").mockImplementation(() => 1);
  vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});
  render(
    <MemoryRouter>
      <PublicTransitionProvider>
        <Link to="/method">Read method now</Link>
        <Routes>
          <Route
            path="/"
            element={
              <section>
                <svg data-transition-actor="trajectory" />
                <Link to="/workbench" data-transition-kind="trajectory">
                  Enter instrument
                </Link>
              </section>
            }
          />
          <Route path="/workbench" element={<h1>Instrument destination</h1>} />
          <Route path="/method" element={<h1>Method destination</h1>} />
        </Routes>
      </PublicTransitionProvider>
    </MemoryRouter>,
  );
  fireEvent.click(screen.getByRole("link", { name: "Enter instrument" }));
  expect(screen.getByText("Instrument destination")).toBeTruthy();
  expect(document.querySelector(".pe-transition-actor")).not.toBeNull();
  fireEvent.click(screen.getByRole("link", { name: "Read method now" }));
  expect(screen.getByText("Method destination")).toBeTruthy();
  expect(document.querySelector(".pe-transition-actor")).toBeNull();
  expect(document.body.style.overflow).not.toBe("hidden");
});
it("leaves modified clicks native without creating overlays", () => {
  render(
    <MemoryRouter>
      <PublicTransitionProvider>
        <Link to="/workbench" data-transition-kind="trajectory">
          Enter instrument
        </Link>
        <Routes>
          <Route path="/" element={<h1>Home destination</h1>} />
          <Route path="/workbench" element={<h1>Instrument destination</h1>} />
        </Routes>
      </PublicTransitionProvider>
    </MemoryRouter>,
  );
  fireEvent.click(screen.getByRole("link", { name: "Enter instrument" }), {
    ctrlKey: true,
  });
  expect(screen.getByText("Home destination")).toBeTruthy();
  expect(document.querySelector(".pe-transition-actor")).toBeNull();
});
