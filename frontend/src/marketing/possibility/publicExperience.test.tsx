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
function mount(
  route = "/",
  children = (
    <>
      <Route path="/" element={<HomePage />} />
      <Route path="/workbench" element={<WorkbenchPage />} />
      <Route path="/models" element={<ModelsPage />} />
      <Route path="/method" element={<MethodPage />} />
    </>
  ),
) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <ScenarioProvider>
        <Routes>{children}</Routes>
      </ScenarioProvider>
    </MemoryRouter>,
  );
}
describe("Possibility Engine public experience", () => {
  it("opens on product-native trajectories and carries an edited condition into the instrument", () => {
    const { container } = mount();
    const hero = container.querySelector(".pe-hero");
    expect(hero).not.toBeNull();
    expect(hero?.querySelector("img")).toBeNull();
    expect(hero?.querySelectorAll(".pe-path").length).toBe(24);
    fireEvent.change(screen.getByRole("slider", { name: "Volatility" }), {
      target: { value: "0.6" },
    });
    fireEvent.click(screen.getByRole("link", { name: /Open the workbench/ }));
    expect(
      (screen.getByRole("slider", { name: "Volatility" }) as HTMLInputElement)
        .value,
    ).toBe("0.6");
    expect(screen.getByText("0.2368")).toBeTruthy();
  });
  it("invalidates replay after a seed edit and restores canonical conditions", () => {
    mount("/workbench");
    fireEvent.click(
      screen.getByRole("button", { name: /Replay the same inputs/ }),
    );
    expect(screen.getByRole("status").textContent).toMatch(/Every path/);
    fireEvent.change(screen.getByRole("spinbutton", { name: "Random seed" }), {
      target: { value: "43" },
    });
    expect(screen.getByRole("status").textContent).not.toMatch(/Every path/);
    fireEvent.click(
      screen.getByRole("button", { name: /Restore the opening conditions/ }),
    );
    expect(
      (
        screen.getByRole("spinbutton", {
          name: "Random seed",
        }) as HTMLInputElement
      ).value,
    ).toBe("42");
  });
  it("opens the requested atlas model from a direct hash", () => {
    mount("/models#game-theory");
    expect(
      screen.getByRole("heading", { name: "Map the payoff." }),
    ).toBeTruthy();
    expect(
      screen
        .getByRole("link", { name: "Game Theory" })
        .getAttribute("aria-current"),
    ).toBe("true");
  });
  it("exposes the method anchors and a focusable equation explanation", () => {
    const { container } = mount("/method#comparison");
    for (const id of [
      "starting-state",
      "sampling",
      "comparison",
      "replay",
      "limits",
    ])
      expect(container.querySelector("#" + id)).not.toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Explain volatility" }));
    expect(
      screen
        .getByRole("button", { name: "Explain volatility" })
        .getAttribute("aria-pressed"),
    ).toBe("true");
  });
  it("keeps the menu keyboard-contained and restores focus and scrolling", () => {
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
    const close = within(menu).getByRole("button", { name: /Close/ });
    expect(document.activeElement).toBe(close);
    fireEvent.keyDown(window, { key: "Tab", shiftKey: true });
    expect(document.activeElement).toBe(
      within(menu).getByRole("link", { name: /Create an account/ }),
    );
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement).toBe(trigger);
    expect(document.body.style.overflow).toBe(prior);
  });
});

it("downloads the exact current model inputs and computed result", async () => {
  let exported: Blob | undefined;
  Object.defineProperty(URL, "createObjectURL", {
    configurable: true,
    writable: true,
    value: vi.fn((blob: Blob) => {
      exported = blob;
      return "blob:result";
    }),
  });
  Object.defineProperty(URL, "revokeObjectURL", {
    configurable: true,
    writable: true,
    value: vi.fn(),
  });
  const click = vi
    .spyOn(HTMLAnchorElement.prototype, "click")
    .mockImplementation(() => {});
  mount("/workbench");
  fireEvent.change(screen.getByRole("slider", { name: "Volatility" }), {
    target: { value: "0.6" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Save this result" }));
  expect(click).toHaveBeenCalledOnce();
  const content = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(exported!);
  });
  const record = JSON.parse(content);
  expect(Object.keys(record)).toEqual(["model", "inputs", "results"]);
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

it.each([
  ["market", "Systems respond to systems."],
  ["conflict", "Local rules. Collective behaviour."],
])("preserves legacy atlas hash %s", (hash, title) => {
  mount("/models#" + hash);
  expect(screen.getByRole("heading", { name: title })).toBeTruthy();
});
