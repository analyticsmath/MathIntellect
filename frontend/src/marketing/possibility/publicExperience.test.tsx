// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ScenarioProvider } from "../film/ScenarioContext";
import HomePage from "../pages/HomePage";
import ModelsPage from "../pages/ModelsPage";
import WorkbenchPage from "../pages/WorkbenchPage";
import MethodPage from "../pages/MethodPage";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
vi.mock("../editorial/useEditorialMotion", () => ({
  useEditorialMotion: () => {},
}));
beforeEach(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn(() => ({
      matches: true,
      addEventListener() {},
      removeEventListener() {},
    })),
  });
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});
function mount(route = "/") {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <ScenarioProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/models" element={<ModelsPage />} />
          <Route path="/workbench" element={<WorkbenchPage />} />
          <Route path="/method" element={<MethodPage />} />
        </Routes>
        <SiteFooter />
      </ScenarioProvider>
    </MemoryRouter>,
  );
}
describe("editorial public experience", () => {
  it("opens with local photography and no decorative graphs or eyebrows", () => {
    const { container } = mount();
    const hero = container.querySelector(".mi-hero");
    expect(hero?.querySelector("img")?.getAttribute("src")).toMatch(
      /vanes-1600.webp/,
    );
    expect(container.querySelector("svg")).toBeNull();
    expect(container.querySelector("[class*=eyebrow]")).toBeNull();
    expect(container.querySelectorAll("img").length).toBeGreaterThan(10);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
      "Explore thepossible.",
    );
    expect(container.querySelector(".mi-footer-wordmark")?.textContent).toBe(
      "Math Intellect",
    );
  });
  it("recalculates numeric results, invalidates replay and restores conditions", () => {
    mount("/workbench");
    fireEvent.click(
      screen.getByRole("button", { name: /Repeat this calculation/ }),
    );
    expect(screen.getByText(/Every path and statistic matches/)).toBeTruthy();
    fireEvent.change(screen.getByRole("slider", { name: "Volatility" }), {
      target: { value: "0.6" },
    });
    expect(screen.getByText("0.2368")).toBeTruthy();
    expect(screen.queryByText(/Every path and statistic matches/)).toBeNull();
    fireEvent.change(screen.getByRole("spinbutton", { name: "Random seed" }), {
      target: { value: "43" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Reset conditions/ }));
    expect(
      (
        screen.getByRole("spinbutton", {
          name: "Random seed",
        }) as HTMLInputElement
      ).value,
    ).toBe("42");
  });
  it("lets a reduced-motion visitor select a model without traversing a pinned scene", () => {
    const scroll = vi.fn();
    Object.defineProperty(HTMLElement.prototype, "scrollTo", {
      configurable: true,
      value: scroll,
    });
    mount();
    const game = screen.getByRole("button", {
      name: "Game theory",
    });
    fireEvent.click(game);
    expect(game.getAttribute("aria-pressed")).toBe("true");
    expect(scroll).toHaveBeenCalledWith(
      expect.objectContaining({ behavior: "auto" }),
    );
    expect(
      screen
        .getByRole("button", { name: "Monte Carlo" })
        .getAttribute("aria-pressed"),
    ).toBe("false");
  });
  it("explains the account models without presenting unrelated illustrative engines", () => {
    const { container } = mount("/models#game-theory");
    for (const id of [
      "monte-carlo",
      "game-theory",
      "market-dynamics",
      "agent-interaction",
    ])
      expect(container.querySelector("#" + id)).not.toBeNull();
    expect(screen.getByText(/pure-strategy Nash equilibria/)).toBeTruthy();
    expect(
      screen.queryByText(/AR\(1\)|flocking|mixed-strategy solver/),
    ).toBeNull();
  });
  it("offers direct method anchors and clearly bounded calculation details", () => {
    const { container } = mount("/method");
    for (const id of [
      "starting-state",
      "sampling",
      "comparison",
      "replay",
      "limits",
    ])
      expect(container.querySelector("#" + id)).not.toBeNull();
    expect(screen.getByRole("math")).toBeTruthy();
    expect(
      screen.getByText(
        /Twenty-four paths do not describe every possible outcome/,
      ),
    ).toBeTruthy();
  });
  it("keeps navigation keyboard-contained and restores focus and scrolling", () => {
    const prior = document.body.style.overflow;
    render(
      <MemoryRouter>
        <SiteHeader />
      </MemoryRouter>,
    );
    const trigger = screen.getByRole("button", { name: "Open navigation" });
    fireEvent.click(trigger);
    const menu = screen.getByRole("dialog", { name: "Navigation" });
    expect(document.body.style.overflow).toBe("hidden");
    expect(document.activeElement).toBe(
      within(menu).getByRole("button", { name: /Close/ }),
    );
    fireEvent.keyDown(window, { key: "Tab", shiftKey: true });
    expect(document.activeElement).toBe(
      within(menu).getByRole("link", { name: /Create an account/ }),
    );
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement).toBe(trigger);
    expect(document.body.style.overflow).toBe(prior);
  });
  it("downloads exact current inputs and computed results", async () => {
    let exported: Blob | undefined;
    Object.defineProperty(URL, "createObjectURL", {
      configurable: true,
      value: vi.fn((blob: Blob) => {
        exported = blob;
        return "blob:result";
      }),
    });
    Object.defineProperty(URL, "revokeObjectURL", {
      configurable: true,
      value: vi.fn(),
    });
    const click = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => {});
    mount("/workbench");
    fireEvent.change(screen.getByRole("slider", { name: "Volatility" }), {
      target: { value: "0.6" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: "Download this result" }),
    );
    expect(click).toHaveBeenCalledOnce();
    const content = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsText(exported!);
    });
    const record = JSON.parse(content);
    expect(record.inputs).toEqual({
      volatility: 0.6,
      drift: 0.05,
      seed: 42,
      steps: 50,
      paths: 24,
    });
    expect(record.results.paths).toHaveLength(24);
    expect(record.results.variance).toBeCloseTo(0.236844103, 8);
  });
});
