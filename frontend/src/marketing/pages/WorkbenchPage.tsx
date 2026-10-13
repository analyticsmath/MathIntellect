import { Link } from "react-router-dom";
import { useScenario } from "../film/scenario";
import { TrajectoryPlot } from "../film/TrajectoryPlot";

export function WorkbenchPage() {
  const demo = useScenario();
  const changed = demo.sigma !== 0.35;

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
        <span className="mi-story-eyebrow">PUBLIC MODEL ROOM <i /> EXPERIMENT 01</span>
        <h1 tabIndex={-1}>
          Set the conditions.
          <br />
          <span>Follow the paths.</span>
        </h1>
        <p>
          This browser-run demonstration holds one starting point and one
          reproducible seed. Change an input; see how the evidence moves.
        </p>
        <div className="mi-workbench-intro-meta">
          <span>ADDITIVE DIFFUSION</span>
          <span>24 PATHS <i /> 50 STEPS</span>
          <span>NO CUSTOMER DATA</span>
        </div>
      </header>

      <section className="mi-workbench" aria-label="Interactive additive diffusion workbench">
        <div className="mi-workbench-controls">
          <div className="mi-workbench-controls-head">
            <span className="mi-story-eyebrow">01 / INPUTS</span>
            <h2>Change the question.</h2>
            <p>One input at a time keeps the comparison readable.</p>
          </div>

          <div className="mi-control mi-workbench-control">
            <label htmlFor="wb-sigma">
              <span>Volatility</span>
              <strong>σ {demo.sigma.toFixed(2)}</strong>
            </label>
            <input
              id="wb-sigma"
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

          <div className="mi-control mi-workbench-control">
            <label htmlFor="wb-mu">
              <span>Drift</span>
              <strong>μ {demo.mu.toFixed(2)}</strong>
            </label>
            <input
              id="wb-mu"
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

          <div className="mi-seed-input mi-workbench-seed">
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
                  demo.setSeed(Math.min(1000000, Math.max(0, Math.round(value))));
              }}
            />
            <button
              className="mi-workbench-inline-action"
              onClick={() => demo.setSeed((demo.seed + 1) % 1000001)}
            >
              Advance the seed <span aria-hidden="true">↗</span>
            </button>
          </div>

          <button className="mi-workbench-reset" onClick={demo.reset}>
            Restore the opening conditions <span aria-hidden="true">↺</span>
          </button>
          <p className="mi-workbench-integrity">
            Drift, volatility, seed, path count and 50 steps are written into
            the exported scenario record.
          </p>
        </div>

        <div className="mi-workbench-field">
          <div className="mi-workbench-field-heading">
            <div>
              <span className="mi-story-eyebrow">02 / RESULT FIELD</span>
              <h2>{changed ? "A condition moved." : "One origin. 24 paths."}</h2>
            </div>
            <span className="mi-workbench-seed-badge">SEED {demo.seed}</span>
          </div>

          <div className="mi-workbench-plot">
            <TrajectoryPlot
              current={demo.current}
              baseline={demo.baseline}
              compare={changed}
            />
          </div>

          <div className="mi-workbench-legend" aria-label="Plot legend">
            <span><i className="mi-legend-baseline" /> Baseline · σ 0.35</span>
            {changed && <span><i className="mi-legend-changed" /> Current · σ {demo.sigma.toFixed(2)}</span>}
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
              <dt>Difference from baseline</dt>
              <dd>
                {demo.current.variance - demo.baseline.variance > 0 ? "+" : ""}
                {(demo.current.variance - demo.baseline.variance).toFixed(4)}
              </dd>
            </div>
          </dl>

          <div className="mi-workbench-actions">
            <button className="mi-story-link mi-story-link--light" onClick={demo.replay}>
              Replay the same inputs <span aria-hidden="true">↺</span>
            </button>
            <button className="mi-story-link" onClick={download}>
              Save this result <span aria-hidden="true">↓</span>
            </button>
          </div>
          <p role="status" className="mi-workbench-status">
            {demo.replayed
              ? "Recomputed: every path and displayed statistic matches."
              : "Only volatility changes in the baseline comparison; drift and seed stay fixed."}
          </p>
        </div>
      </section>

      <section className="mi-workbench-coda">
        <div>
          <span className="mi-story-eyebrow">03 / INTERPRETATION</span>
          <h2>
            A model is a lens.
            <br />
            <em>Its limits matter.</em>
          </h2>
        </div>
        <div className="mi-workbench-coda-copy">
          <p>
            These 24 samples demonstrate one calculation. They do not estimate
            a real-world probability or predict an event. A different
            distribution, model, seed or sample count can produce different
            evidence.
          </p>
          <p>
            Math Intellect supports separate model families for uncertainty,
            strategic choices, markets, interacting agents and custom
            expressions. This public demonstration is only additive diffusion.
          </p>
          <div>
            <Link to="/method" className="mi-story-link mi-story-link--dark">
              Read the method <span aria-hidden="true">↗</span>
            </Link>
            <Link to="/app/simulations/new" className="mi-story-link mi-story-link--dark">
              Create a simulation <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default WorkbenchPage;
