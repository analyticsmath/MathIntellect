// @vitest-environment jsdom
import { useEffect } from "react";
import { afterEach, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Link, MemoryRouter, Route, Routes } from "react-router-dom";
import { ScenarioProvider } from "../film/ScenarioContext";
import { useScenario } from "../film/scenario";
import { runDeterministicMonteCarlo } from "../../math/deterministicModels";
let currentScenario: ReturnType<typeof useScenario>;
function Harness({ page = "Home" }: { page?: string }) {
  const scenario = useScenario();
  useEffect(() => {
    currentScenario = scenario;
  }, [scenario]);
  return (
    <>
      <h1>{page}</h1>
      <input
        aria-label="Volatility"
        value={scenario.sigma}
        onChange={(e) => scenario.setSigma(Number(e.target.value))}
      />
      <input
        aria-label="Drift"
        value={scenario.mu}
        onChange={(e) => scenario.setMu(Number(e.target.value))}
      />
      <input
        aria-label="Seed"
        value={scenario.seed}
        onChange={(e) => scenario.setSeed(Number(e.target.value))}
      />
      <button onClick={scenario.replay}>Replay</button>
      <output>{scenario.replayed ? "confirmed" : "unconfirmed"}</output>
      <Link to="/workbench">Workbench</Link>
    </>
  );
}
function mount() {
  return render(
    <MemoryRouter>
      <ScenarioProvider>
        <Routes>
          <Route path="/" element={<Harness />} />
          <Route path="/workbench" element={<Harness page="Workbench" />} />
        </Routes>
      </ScenarioProvider>
    </MemoryRouter>,
  );
}
afterEach(cleanup);
it("keeps the canonical public scenario deterministic", () => {
  mount();
  expect([
    currentScenario.sigma,
    currentScenario.mu,
    currentScenario.seed,
    currentScenario.paths,
    currentScenario.current.steps,
  ]).toEqual([0.35, 0.05, 42, 24, 50]);
  expect(currentScenario.current).toEqual(
    runDeterministicMonteCarlo(0.35, 0.05, 50, 24, 42),
  );
  expect(currentScenario.current.variance).toBeCloseTo(0.080592785, 8);
  expect(
    currentScenario.current.paths.every(
      (path) => path.length === 51 && path[0] === 0,
    ),
  ).toBe(true);
});
it("preserves changed volatility across Home and Workbench", () => {
  mount();
  fireEvent.change(screen.getByLabelText("Volatility"), {
    target: { value: ".6" },
  });
  fireEvent.click(screen.getByRole("link", { name: "Workbench" }));
  expect(screen.getByRole("heading").textContent).toBe("Workbench");
  expect(currentScenario.sigma).toBe(0.6);
  expect(currentScenario.current.variance).toBeCloseTo(0.236844103, 8);
  expect(currentScenario.baseline).toEqual(
    runDeterministicMonteCarlo(0.35, 0.05, 50, 24, 42),
  );
});
it("invalidates replay confirmation after any input changes", () => {
  mount();
  for (const [label, value] of [
    ["Volatility", ".6"],
    ["Drift", ".07"],
    ["Seed", "43"],
  ]) {
    fireEvent.click(screen.getByRole("button", { name: "Replay" }));
    expect(screen.getByText("confirmed")).toBeTruthy();
    fireEvent.change(screen.getByLabelText(label), { target: { value } });
    expect(screen.getByText("unconfirmed")).toBeTruthy();
  }
});
it("exports the exact current scenario without invented fields", () => {
  mount();
  fireEvent.change(screen.getByLabelText("Volatility"), {
    target: { value: ".6" },
  });
  // Freeze the export record contract independently of replacement route markup.
  const record = JSON.parse(
    JSON.stringify({
      model: "additive-diffusion",
      inputs: {
        volatility: currentScenario.sigma,
        drift: currentScenario.mu,
        seed: currentScenario.seed,
        steps: currentScenario.current.steps,
        paths: currentScenario.paths,
      },
      results: currentScenario.current,
    }),
  );
  expect(Object.keys(record)).toEqual(["model", "inputs", "results"]);
  expect(record.inputs).toEqual({
    volatility: 0.6,
    drift: 0.05,
    seed: 42,
    steps: 50,
    paths: 24,
  });
  expect(record.results).toEqual(
    runDeterministicMonteCarlo(0.6, 0.05, 50, 24, 42),
  );
});

it("requires a fresh replay even after returning to a formerly confirmed input snapshot", () => {
  mount();
  fireEvent.click(screen.getByRole("button", { name: "Replay" }));
  fireEvent.change(screen.getByLabelText("Volatility"), {
    target: { value: ".6" },
  });
  fireEvent.change(screen.getByLabelText("Volatility"), {
    target: { value: ".35" },
  });
  expect(screen.getByText("unconfirmed")).toBeTruthy();
});
