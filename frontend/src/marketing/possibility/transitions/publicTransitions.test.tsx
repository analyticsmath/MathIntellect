// @vitest-environment jsdom
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { Link, MemoryRouter, Route, Routes } from "react-router-dom";
import { PublicTransitionProvider } from "./PublicTransitionProvider";
beforeEach(() => {
  vi.useFakeTimers();
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: () => ({ matches: false }),
  });
});
afterEach(() => {
  cleanup();
  vi.clearAllTimers();
  vi.useRealTimers();
});
function mount() {
  return render(
    <MemoryRouter>
      <PublicTransitionProvider>
        <Link to="/models">Models</Link>
        <Link to="/method">Method</Link>
        <Routes>
          <Route path="/" element={<h1>Home destination</h1>} />
          <Route path="/models" element={<h1>Models destination</h1>} />
          <Route path="/method" element={<h1>Method destination</h1>} />
        </Routes>
      </PublicTransitionProvider>
    </MemoryRouter>,
  );
}
it("covers before navigation then clears its curtain", () => {
  mount();
  fireEvent.click(screen.getByRole("link", { name: "Models" }));
  expect(screen.getByText("Home destination")).toBeTruthy();
  expect(document.querySelector(".mi-curtain--cover")).not.toBeNull();
  act(() => vi.advanceTimersByTime(600));
  expect(screen.getByText("Models destination")).toBeTruthy();
  expect(document.querySelector(".mi-curtain--reveal")).not.toBeNull();
  act(() => vi.advanceTimersByTime(1050));
  expect(document.querySelector(".mi-curtain")).toBeNull();
});
it("replaces a pending destination without navigating to the stale route", () => {
  mount();
  fireEvent.click(screen.getByRole("link", { name: "Models" }));
  act(() => vi.advanceTimersByTime(200));
  fireEvent.click(screen.getByRole("link", { name: "Method" }));
  act(() => vi.advanceTimersByTime(600));
  expect(screen.getByText("Method destination")).toBeTruthy();
  expect(screen.queryByText("Models destination")).toBeNull();
});
it("cancels a pending destination when browser history moves", () => {
  mount();
  fireEvent.click(screen.getByRole("link", { name: "Models" }));
  act(() => window.dispatchEvent(new PopStateEvent("popstate")));
  act(() => vi.advanceTimersByTime(500));
  expect(screen.getByText("Home destination")).toBeTruthy();
  expect(document.querySelector(".mi-curtain")).toBeNull();
});
it("keeps a new transition intact when navigation starts during a reveal", () => {
  mount();
  fireEvent.click(screen.getByRole("link", { name: "Models" }));
  act(() => vi.advanceTimersByTime(800));
  expect(screen.getByText("Models destination")).toBeTruthy();
  fireEvent.click(screen.getByRole("link", { name: "Method" }));
  act(() => vi.advanceTimersByTime(600));
  expect(screen.getByText("Method destination")).toBeTruthy();
  expect(document.querySelector(".mi-curtain--reveal")).not.toBeNull();
  act(() => vi.advanceTimersByTime(1050));
  expect(document.querySelector(".mi-curtain")).toBeNull();
  expect(vi.getTimerCount()).toBe(0);
});
it("bypasses delayed navigation for reduced motion and leaves modified clicks native", () => {
  mount();
  fireEvent.click(screen.getByRole("link", { name: "Models" }), {
    ctrlKey: true,
  });
  expect(screen.getByText("Home destination")).toBeTruthy();
  expect(document.querySelector(".mi-curtain")).toBeNull();
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: () => ({ matches: true }),
  });
  fireEvent.click(screen.getByRole("link", { name: "Method" }));
  expect(screen.getByText("Method destination")).toBeTruthy();
  expect(document.querySelector(".mi-curtain")).toBeNull();
});
it("cancels pending navigation when unmounted", () => {
  const view = mount();
  fireEvent.click(screen.getByRole("link", { name: "Models" }));
  view.unmount();
  expect(vi.getTimerCount()).toBe(0);
});
it("keeps the photographic layer mounted when moving between marketing and account shells", () => {
  render(
    <MemoryRouter>
      <PublicTransitionProvider>
        <Routes>
          <Route
            path="/"
            element={
              <main>
                <h1>Marketing shell</h1>
                <Link to="/login">Enter account</Link>
              </main>
            }
          />
          <Route
            path="/login"
            element={
              <main>
                <h1>Account shell</h1>
                <Link to="/signup">Create account</Link>
              </main>
            }
          />
          <Route path="/signup" element={<h1>Registration shell</h1>} />
        </Routes>
      </PublicTransitionProvider>
    </MemoryRouter>,
  );
  fireEvent.click(screen.getByText("Enter account"));
  const curtain = document.querySelector(".mi-curtain");
  act(() => vi.advanceTimersByTime(600));
  expect(screen.getByText("Account shell")).toBeTruthy();
  expect(document.querySelector(".mi-curtain")).toBe(curtain);
  act(() => vi.advanceTimersByTime(1000));
  fireEvent.click(screen.getByText("Create account"));
  act(() => vi.advanceTimersByTime(600));
  expect(screen.getByText("Registration shell")).toBeTruthy();
  expect(document.querySelector(".mi-curtain--reveal")).not.toBeNull();
  act(() => vi.advanceTimersByTime(1000));
  expect(document.querySelector(".mi-curtain")).toBeNull();
});
it("clears a revealing layer immediately when browser history interrupts", () => {
  mount();
  fireEvent.click(screen.getByRole("link", { name: "Models" }));
  act(() => vi.advanceTimersByTime(600));
  act(() => window.dispatchEvent(new PopStateEvent("popstate")));
  expect(document.querySelector(".mi-curtain")).toBeNull();
  expect(vi.getTimerCount()).toBe(0);
});
