// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import {
  MemoryRouter,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import { RouteExperienceManager } from "./RouteExperienceManager";
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});
function Back() {
  const navigate = useNavigate();
  return <button onClick={() => navigate(-1)}>Back</button>;
}
function app(initial = "/") {
  return render(
    <MemoryRouter initialEntries={[initial]}>
      <RouteExperienceManager />
      <Link to="/method#sampling">Sampling link</Link>
      <Link to="/workbench">Workbench link</Link>
      <Back />
      <main>
        <Routes>
          <Route path="/" element={<h1 tabIndex={-1}>Home destination</h1>} />
          <Route
            path="/method"
            element={
              <>
                <h1 tabIndex={-1}>Method destination</h1>
                <section id="sampling">Sampling content</section>
              </>
            }
          />
          <Route
            path="/workbench"
            element={<h1 tabIndex={-1}>Workbench destination</h1>}
          />
        </Routes>
      </main>
    </MemoryRouter>,
  );
}
function browser() {
  vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
    callback(0);
    return 1;
  });
  vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});
  vi.spyOn(window, "scrollTo").mockImplementation(() => {});
  Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
    configurable: true,
    value: vi.fn(),
  });
}
it("focuses the destination heading after ordinary public navigation", () => {
  browser();
  app();
  fireEvent.click(screen.getByText("Workbench link"));
  expect(document.activeElement).toBe(
    screen.getByText("Workbench destination"),
  );
});
it("restores a saved POP position before following a historical hash", () => {
  browser();
  app("/method#sampling");
  Object.defineProperty(window, "scrollY", { configurable: true, value: 850 });
  fireEvent.click(screen.getByText("Workbench link"));
  Object.defineProperty(window, "scrollY", { configurable: true, value: 0 });
  fireEvent.click(screen.getByText("Back"));
  expect(window.scrollTo).toHaveBeenLastCalledWith({
    top: 850,
    behavior: "auto",
  });
});
