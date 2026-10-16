import { Link } from "react-router-dom";
import { useScenario } from "../film/scenario";
import { TrajectoryPlot } from "../film/TrajectoryPlot";

const openingVolatility = 0.35;

export function WorkbenchPage() {
  const demo = useScenario();
  const changed = demo.sigma !== openingVolatility;
  const varianceChange = demo.current.variance - demo.baseline.variance;

  const download = () => {
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
  };

  return (
    <div className="mi-workbench-page">
      <header className="mi-page-intro mi-workbench-intro">
        <h1 tabIndex={-1}>
          Change a condition.
          <br />
          Read its paths.
        </h1>
        <p>
          This open experiment calculates 24 additive diffusion paths in your
          browser. Move an input, then compare the result with its baseline.
        </p>
      </header>

      <section
        className="mi-workbench"
        aria-label="Interactive additive diffusion workbench"
      >
        <aside className="mi-workbench-controls">
          <div className="mi-controls-heading">
            <h2>Conditions</h2>
            <p>The baseline uses volatility 0.35 with the current drift and seed.</p>
          </div>

          <div className="mi-control">
            <label htmlFor="wb-sigma">
              <span>Volatility</span>
              <strong>σ {demo.sigma.toFixed(2)}</strong>
            </label>
            <input
              id="wb-sigma"
              aria-label="Volatility"
              type="range"
              min="0.05"
              max="0.9"
              step="0.01"
              value={demo.sigma}
              onChange={(event) => demo.setSigma(Number(event.target.value))}
              aria-valuetext={"Volatility " + demo.sigma.toFixed(2)}
            />
            <div className="mi-range-ends"><span>0.05</span><span>0.90</span></div>
          </div>

          <div className="mi-control">
            <label htmlFor="wb-mu">
              <span>Drift</span>
              <strong>μ {demo.mu.toFixed(2)}</strong>
            </label>
            <input
              id="wb-mu"
              aria-label="Drift"
              type="range"
              min="-0.2"
              max="0.2"
              step="0.01"
              value={demo.mu}
              onChange={(event) => demo.setMu(Number(event.target.value))}
              aria-valuetext={"Drift " + demo.mu.toFixed(2)}
            />
            <div className="mi-range-ends"><span>−0.20</span><span>0.20</span></div>
          </div>

          <div className="mi-seed-control">
            <label htmlFor="wb-seed">Random seed</label>
            <input
              id="wb-seed"
              type="number"
              min="0"
              max="1000000"
              step="1"
              value={demo.seed}
              onChange={(event) => {
                const value = event.currentTarget.valueAsNumber;
                if (Number.isFinite(value)) {
                  demo.setSeed(Math.min(1000000, Math.max(0, Math.round(value))));
                }
              }}
            />
            <button
              className="mi-quiet-button"
              type="button"
              onClick={() => demo.setSeed((demo.seed + 1) % 1000001)}
            >
              Use the next seed
            </button>
          </div>

          <div className="mi-fixed-inputs">
            <div><span>Paths</span><strong>{demo.paths}</strong></div>
            <div><span>Steps</span><strong>50</strong></div>
          </div>

          <button
            className="mi-quiet-button mi-reset-button"
            type="button"
            onClick={demo.reset}
          >
            Restore the opening conditions
          </button>

          <p className="mi-workbench-integrity">
            The exported record contains the inputs and the calculated paths.
          </p>
        </aside>

        <div className="mi-workbench-result">
          <div className="mi-result-heading">
            <div>
              <h2>{changed ? "Compare the two runs." : "One origin. 24 paths."}</h2>
              <p>Both runs use the same drift, seed, path count and horizon.</p>
            </div>
            <span className="mi-result-seed">Seed {demo.seed}</span>
          </div>

          <div className="mi-workbench-plot">
            <TrajectoryPlot
              current={demo.current}
              baseline={demo.baseline}
              compare={changed}
            />
          </div>

          <div className="mi-workbench-legend" aria-label="Plot legend">
            <span><i className="mi-legend-dot mi-legend-dot--baseline" /> Baseline at σ 0.35</span>
            {changed && (
              <span><i className="mi-legend-dot mi-legend-dot--current" /> Current at σ {demo.sigma.toFixed(2)}</span>
            )}
          </div>

          <dl className="mi-workbench-metrics">
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
              <dd>{varianceChange > 0 ? "+" : ""}{varianceChange.toFixed(4)}</dd>
            </div>
          </dl>

          <div className="mi-workbench-actions">
            <button
              className="mi-button mi-button--signal"
              type="button"
              onClick={demo.replay}
            >
              Replay the same inputs
            </button>
            <button className="mi-button mi-button--outline" type="button" onClick={download}>
              Save this result
            </button>
          </div>

          <p role="status" className="mi-workbench-status">
            {demo.replayed
              ? "Recomputed. Every path and displayed statistic matches."
              : "Change an input to recalculate the paths in this browser."}
          </p>
        </div>
      </section>

      <section className="mi-workbench-limit">
        <div>
          <h2>A calculation has a boundary.</h2>
          <p>
            These paths illustrate one seeded additive diffusion model. They
            do not estimate a real event probability or predict a market. A
            different model, distribution, seed or sample count can produce
            different evidence.
          </p>
        </div>
        <div className="mi-workbench-limit-links">
          <Link to="/method" viewTransition className="mi-text-link">Read the method</Link>
          <Link to="/models" viewTransition className="mi-text-link">Choose another model</Link>
        </div>
      </section>
    </div>
  );
}

export default WorkbenchPage;

