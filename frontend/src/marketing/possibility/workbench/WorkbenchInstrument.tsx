import { Link } from "react-router-dom";
import { useState } from "react";
import { useScenario } from "../../film/scenario";
import { TrajectoryField } from "../trajectory/TrajectoryField";
import { Arrow } from "../Primitives";
export function WorkbenchInstrument() {
  const demo = useScenario();
  const [compare, setCompare] = useState(true);
  const [saveError, setSaveError] = useState("");
  const download = () => {
    try {
      const contents = JSON.stringify(
        {
          model: "additive-diffusion",
          inputs: {
            volatility: demo.sigma,
            drift: demo.mu,
            seed: demo.seed,
            steps: 50,
            paths: demo.paths,
          },
          results: demo.current,
        },
        null,
        2,
      );
      const url = URL.createObjectURL(
        new Blob([contents], { type: "application/json" }),
      );
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "math-intellect-scenario.json";
      anchor.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setSaveError("");
    } catch {
      setSaveError("Your browser could not save the result. Please try again.");
    }
  };
  return (
    <div className="pe-workbench pe-light">
      <header className="pe-instrument-intro">
        <div>
          <p className="pe-eyebrow">The open workbench</p>
          <h1 tabIndex={-1}>
            A condition.
            <br />A field of possibilities.
          </h1>
        </div>
        <p>
          24 seeded additive diffusion paths.
          <br />
          Calculated here, in your browser.
          <br />
          Change a condition and inspect the difference.
        </p>
      </header>
      <section
        className="pe-instrument"
        aria-label="Interactive additive diffusion workbench"
      >
        <div className="pe-instrument-top">
          <span className="pe-eyebrow">
            <span className="pe-live-dot" />
            Additive diffusion
          </span>
          <label className="pe-compare-toggle">
            <input
              type="checkbox"
              checked={compare}
              onChange={(e) => setCompare(e.target.checked)}
            />
            Show baseline
          </label>
          <span className="pe-mono">24 paths · 50 steps</span>
        </div>
        <div className="pe-instrument-plot">
          <TrajectoryField
            current={demo.current}
            baseline={demo.baseline}
            compare={compare && demo.sigma !== 0.35}
            variant="instrument"
          />
          <div className="pe-chart-axis">
            <span>x₀ = 0</span>
            <span>Time horizon = 1</span>
          </div>
        </div>
        <div className="pe-instrument-legend">
          <span>
            <i className="pe-legend" />
            Current σ {demo.sigma.toFixed(2)}
          </span>
          {compare && (
            <span>
              <i className="pe-legend pe-legend--baseline" />
              Baseline σ 0.35
            </span>
          )}
          <span>Both runs use the current drift and seed.</span>
        </div>
        <div className="pe-instrument-controls">
          <div className="pe-control">
            <label htmlFor="wb-sigma">
              Volatility <strong>σ {demo.sigma.toFixed(2)}</strong>
            </label>
            <input
              id="wb-sigma"
              aria-label="Volatility"
              type="range"
              min="0.05"
              max="0.9"
              step="0.01"
              value={demo.sigma}
              onChange={(e) => demo.setSigma(Number(e.target.value))}
            />
            <div className="pe-range-labels">
              <span>0.05</span>
              <span>0.90</span>
            </div>
          </div>
          <div className="pe-control">
            <label htmlFor="wb-mu">
              Drift <strong>μ {demo.mu.toFixed(2)}</strong>
            </label>
            <input
              id="wb-mu"
              aria-label="Drift"
              type="range"
              min="-0.2"
              max="0.2"
              step="0.01"
              value={demo.mu}
              onChange={(e) => demo.setMu(Number(e.target.value))}
            />
            <div className="pe-range-labels">
              <span>−0.20</span>
              <span>0.20</span>
            </div>
          </div>
          <div className="pe-control pe-seed-control">
            <label htmlFor="wb-seed">Random seed</label>
            <div>
              <input
                id="wb-seed"
                type="number"
                min="0"
                max="1000000"
                step="1"
                value={demo.seed}
                onChange={(e) => {
                  const n = e.currentTarget.valueAsNumber;
                  if (Number.isFinite(n))
                    demo.setSeed(Math.min(1000000, Math.max(0, Math.round(n))));
                }}
              />
              <button
                aria-label="Use the next seed"
                onClick={() => demo.setSeed((demo.seed + 1) % 1000001)}
              >
                ↻
              </button>
            </div>
          </div>
        </div>
        <dl className="pe-instrument-ledger">
          <div>
            <dt>Mean endpoint</dt>
            <dd>{demo.current.mean.toFixed(4)}</dd>
          </div>
          <div>
            <dt>Current endpoint variance</dt>
            <dd>{demo.current.variance.toFixed(4)}</dd>
          </div>
          <div>
            <dt>Baseline endpoint variance</dt>
            <dd>{demo.baseline.variance.toFixed(4)}</dd>
          </div>
          <div>
            <dt>Variance change</dt>
            <dd>
              {demo.current.variance - demo.baseline.variance > 0 ? "+" : ""}
              {(demo.current.variance - demo.baseline.variance).toFixed(4)}
            </dd>
          </div>
        </dl>
        <div className="pe-instrument-actions">
          <button className="pe-action pe-action--dark" onClick={demo.replay}>
            Replay the same inputs <span aria-hidden="true">↻</span>
          </button>
          <button className="pe-action" onClick={download}>
            Save this result <Arrow diagonal />
          </button>
          <button className="pe-reset" onClick={demo.reset}>
            Restore the opening conditions
          </button>
        </div>
        <p role="status" className="pe-instrument-status">
          {demo.replayed
            ? "Recomputed. Every path and displayed statistic matches."
            : "Change an input to recalculate the paths in this browser."}
        </p>
        {saveError && <p role="alert">{saveError}</p>}
      </section>
      <section className="pe-instrument-limits">
        <h2>
          A calculation
          <br />
          has a boundary.
        </h2>
        <div>
          <p>
            These paths illustrate one seeded additive diffusion model. They do
            not estimate a real event probability or predict a market. A
            different model, distribution, seed or sample count can produce
            different evidence.
          </p>
          <div>
            <Link to="/method">
              Read the method <Arrow diagonal />
            </Link>
            <Link to="/models">
              Choose another model <Arrow diagonal />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
