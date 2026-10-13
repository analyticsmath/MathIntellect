// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { existsSync } from "node:fs";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ScenarioProvider } from "./ScenarioContext";
import HomePage from "../pages/HomePage";
import WorkbenchPage from "../pages/WorkbenchPage";
import { SiteHeader } from "../components/SiteHeader";
import { runDeterministicMonteCarlo } from "../../math/deterministicModels";

vi.hoisted(() =>
  Object.defineProperty(window, "matchMedia", {
    value: () => ({
      matches: false,
      addListener() {},
      removeListener() {},
      addEventListener() {},
      removeEventListener() {},
    }),
  }),
);
afterEach(cleanup);
describe("the public scenario", () => {
  it("ships its relevant market photograph locally and labels it as context", () => {
    expect(
      existsSync(
        new URL("../../../public/media/math-intellect/unsplash/finance-screen.webp", import.meta.url),
      ),
    ).toBe(true);
    render(
      <MemoryRouter>
        <ScenarioProvider>
          <HomePage />
        </ScenarioProvider>
      </MemoryRouter>,
    );
    const image = screen.getByRole("img", {
      name: /financial market information screen/,
    });
    expect(image.getAttribute("src")).toBe(
      "/media/math-intellect/unsplash/finance-screen.webp",
    );
    expect(screen.getByText(/photograph is context, not a model result/i)).toBeTruthy();
  });

  it("carries a changed input and its actual evidence from Home into Workbench", () => {
    render(
      <MemoryRouter>
        <ScenarioProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/workbench" element={<WorkbenchPage />} />
          </Routes>
        </ScenarioProvider>
      </MemoryRouter>,
    );
    fireEvent.change(screen.getByRole("slider", { name: /Volatility/ }), {
      target: { value: "0.6" },
    });
    expect(screen.getByText("+0.1563")).toBeTruthy();
    fireEvent.click(
      screen.getByRole("link", { name: /Open the workbench/ }),
    );
    expect(
      (screen.getByRole("slider", { name: /Volatility/ }) as HTMLInputElement)
        .value,
    ).toBe("0.6");
    expect(screen.getByText("0.2368")).toBeTruthy();
  });
  it("confirms an actual replay and invalidates that confirmation after inputs change", () => {
    render(
      <MemoryRouter>
        <ScenarioProvider>
          <WorkbenchPage />
        </ScenarioProvider>
      </MemoryRouter>,
    );
    fireEvent.click(
      screen.getByRole("button", { name: /Replay the same inputs/ }),
    );
    expect(screen.getByRole("status").textContent).toMatch(
      /every path and displayed statistic matches/i,
    );
    fireEvent.change(screen.getByRole("slider", { name: /Drift/ }), {
      target: { value: "0.07" },
    });
    expect(screen.getByRole("status").textContent).not.toContain(
      "all sampled paths and metrics match",
    );
    fireEvent.click(
      screen.getByRole("button", { name: /Restore the opening conditions/ }),
    );
    expect(
      (screen.getByRole("slider", { name: /Drift/ }) as HTMLInputElement).value,
    ).toBe("0.05");
  });
  it("traps menu focus and restores navigation focus and body scrolling on Escape", () => {
    const overflow = document.body.style.overflow;
    render(
      <MemoryRouter>
        <SiteHeader />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByRole("button", { name: /Menu/ }));
    const dialog = screen.getByRole("dialog", { name: "Navigation" });
    expect(document.body.style.overflow).toBe("hidden");
    expect(document.activeElement).toBe(
      within(dialog).getByRole("button", { name: /Close/ }),
    );
    fireEvent.keyDown(window, { key: "Tab", shiftKey: true });
    expect(document.activeElement).toBe(
      within(dialog).getByRole("link", { name: /Start modeling/ }),
    );
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.body.style.overflow).toBe(overflow);
    expect(document.activeElement).toBe(
      screen.getByRole("button", { name: /Menu/ }),
    );
  });
  it("reproduces the seed exactly while a changed condition changes numerical evidence", () => {
    const a = runDeterministicMonteCarlo(0.35, 0.05, 50, 24, 42),
      b = runDeterministicMonteCarlo(0.6, 0.05, 50, 24, 42);
    expect(runDeterministicMonteCarlo(0.35, 0.05, 50, 24, 42)).toEqual(a);
    expect(a.paths).toHaveLength(24);
    expect(a.paths.every((path) => path.length === 51 && path[0] === 0)).toBe(
      true,
    );
    expect(a.variance).toBeCloseTo(0.080592785, 8);
    expect(b.variance).toBeCloseTo(0.236844103, 8);
    expect(b.variance / a.variance).toBeCloseTo((0.6 / 0.35) ** 2, 10);
    expect(runDeterministicMonteCarlo(0.35, 0.05, 50, 24, 43)).not.toEqual(a);
  });
});

