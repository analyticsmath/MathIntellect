import { Link } from "react-router-dom";
import { useScenario } from "../film/scenario";
import { TrajectoryPlot } from "../film/TrajectoryPlot";
export function WorkbenchPage() {
  const demo = useScenario(),
    changed = demo.sigma !== 0.35;
  const download = () => {
    const contents = JSON.stringify(
      {
        model: "additive-diffusion",
        inputs: {
          sigma: demo.sigma,
          mu: demo.mu,
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
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return (
    <div className="mi-workbench-page">
      <header className="mi-workbench-intro">
        <h1 tabIndex={-1}>
          Give your question
          <br />a place to move.
        </h1>
        <p>
          A small, reproducible experiment.
          <br />
          Change an assumption. Compare the evidence.
        </p>
      </header>
      <section
        className="mi-workbench"
        aria-label="Public simulation workbench"
      >
        <div className="mi-workbench-controls">
          <h2>The starting conditions.</h2>
          <div className="mi-control">
            <label htmlFor="wb-sigma">
              Volatility <span>σ {demo.sigma.toFixed(2)}</span>
            </label>
            <input
              id="wb-sigma"
              type="range"
              min="0.05"
              max="0.9"
              step="0.01"
              value={demo.sigma}
              onChange={(event) => demo.setSigma(Number(event.target.value))}
            />
            <div className="mi-range-ends">
              <span>0.05</span>
              <span>0.90</span>
            </div>
          </div>
          <div className="mi-control">
            <label htmlFor="wb-mu">
              Drift <span>μ {demo.mu.toFixed(2)}</span>
            </label>
            <input
              id="wb-mu"
              type="range"
              min="-0.2"
              max="0.2"
              step="0.01"
              value={demo.mu}
              onChange={(event) => demo.setMu(Number(event.target.value))}
            />
            <div className="mi-range-ends">
              <span>−0.20</span>
              <span>0.20</span>
            </div>
          </div>
          <div className="mi-seed-input">
            <label htmlFor="wb-seed">Random seed</label>
            <input
              id="wb-seed"
              type="number"
              min="0"
              max="1000000"
              step="1"
              value={demo.seed}
              onChange={(event) => {
                const value = event.target.valueAsNumber;
                if (Number.isFinite(value))
                  demo.setSeed(
                    Math.min(1000000, Math.max(0, Math.round(value))),
                  );
              }}
            />
            <button
              className="mi-quiet-button"
              onClick={() => demo.setSeed((demo.seed + 1) % 1000001)}
            >
              Try another seed ↗
            </button>
          </div>
          <button className="mi-quiet-button" onClick={demo.reset}>
            Reset the experiment ↺
          </button>
          <p className="mi-photo-note">
            24 sample paths. 50 time steps. A public demonstration of additive
            diffusion, computed in your browser.
          </p>
        </div>
        <div className="mi-workbench-field">
          <div className="mi-workbench-field-heading">
            <h2>{changed ? "A changed condition." : "One starting point."}</h2>
            <span>Seed {demo.seed}</span>
          </div>
          <TrajectoryPlot
            current={demo.current}
            baseline={demo.baseline}
            compare={changed}
          />
          <div className="mi-comparison-legend">
            <span>━ Baseline · σ 0.35</span>
            {changed && (
              <span className="mi-changed-legend">
                ┄ Changed · σ {demo.sigma.toFixed(2)}
              </span>
            )}
          </div>
          <dl className="mi-workbench-metrics">
            <div>
              <dt>Sample mean</dt>
              <dd>{demo.current.mean.toFixed(4)}</dd>
            </div>
            <div>
              <dt>Sample variance</dt>
              <dd>{demo.current.variance.toFixed(4)}</dd>
            </div>
            <div>
              <dt>Variance difference</dt>
              <dd>
                {(demo.current.variance - demo.baseline.variance).toFixed(4)}
              </dd>
            </div>
          </dl>
          <div className="mi-workbench-actions">
            <button className="mi-text-link" onClick={demo.replay}>
              Replay the same inputs ↺
            </button>
            <button className="mi-text-link" onClick={download}>
              Save this result ↓
            </button>
          </div>
          <p role="status" className="mi-replay-status">
            {demo.replayed
              ? "Recomputed: all sampled paths and metrics match."
              : "The comparison holds drift and seed fixed while changing volatility."}
          </p>
        </div>
      </section>
      <section className="mi-workbench-coda">
        <h2>
          The model is a lens.
          <br />
          <span>The assumptions are yours.</span>
        </h2>
        <p>
          These 24 samples illustrate a calculation; they do not certify a
          probability or predict a real-world event. The full application lets
          you configure and save simulations across the model families.
        </p>
        <div>
          <Link to="/method" className="mi-text-link">
            Read the method ↗
          </Link>
          <Link to="/app/simulations/new" className="mi-text-link">
            Create a simulation ↗
          </Link>
        </div>
      </section>
    </div>
  );
}
export default WorkbenchPage;
