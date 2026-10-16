import { Link } from "react-router-dom";
import { useScenario } from "../film/scenario";
import { TrajectoryPlot } from "../film/TrajectoryPlot";
import { ModelCinema } from "../film/ModelCinema";

const openingVolatility = 0.35;

export function HomePage() {
  const demo = useScenario();
  const changed = demo.sigma !== openingVolatility;
  const varianceChange = demo.current.variance - demo.baseline.variance;

  return (
    <div className="mi-home">
      <section className="mi-home-hero" aria-labelledby="mi-home-title">
        <div className="mi-hero-data" data-path-draw>
          <TrajectoryPlot current={demo.current} draw />
        </div>
        <div className="mi-hero-copy">
          <div className="mi-hero-conditions" aria-label="Public example conditions">
            <span>Drift μ {demo.mu.toFixed(2)}</span>
            <span>Volatility σ {demo.sigma.toFixed(2)}</span>
            <span>{demo.paths} paths</span>
            <span>Seed {demo.seed}</span>
          </div>
          <h1 id="mi-home-title" tabIndex={-1}>A model turns<br />conditions into paths.</h1>
          <p>
            Change an assumption. See how the same model responds. Keep the
            inputs beside the outcomes.
          </p>
          <div className="mi-hero-actions">
            <a className="mi-button mi-button--signal" href="#experiment">
              Explore the live experiment <span aria-hidden="true">↓</span>
            </a>
            <Link className="mi-text-link" to="/workbench" viewTransition>
              Open the workbench <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </section>

      <section id="experiment" className="mi-home-experiment" aria-labelledby="mi-experiment-title">
        <header className="mi-section-heading" data-reveal>
          <h2 id="mi-experiment-title">Change one condition.</h2>
          <p>
            Move volatility while drift, seed, path count, and horizon stay
            fixed. Both runs share one scale.
          </p>
        </header>

        <div className="mi-experiment-layout">
          <aside className="mi-experiment-controls" data-reveal>
            <div className="mi-control-intro">
              <h3>Volatility</h3>
              <p>The browser recalculates the same seeded model as you move the control.</p>
            </div>
            <div className="mi-control mi-control--home">
              <label htmlFor="home-sigma">
                <span>Current value</span>
                <strong>σ {demo.sigma.toFixed(2)}</strong>
              </label>
              <input
                id="home-sigma"
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

            <dl className="mi-home-input-ledger">
              <div><dt>Starting value</dt><dd>0</dd></div>
              <div><dt>Drift</dt><dd>μ {demo.mu.toFixed(2)}</dd></div>
              <div><dt>Seed</dt><dd>{demo.seed}</dd></div>
              <div><dt>Paths</dt><dd>{demo.paths}</dd></div>
              <div><dt>Steps</dt><dd>{demo.current.steps}</dd></div>
            </dl>
            <p className="mi-experiment-status" role="status">
              {changed
                ? "The current run differs from the baseline in volatility only."
                : "Move the control to compare the current run with the baseline."}
            </p>
          </aside>

          <div className="mi-experiment-evidence" data-path-draw>
            <header className="mi-evidence-heading">
              <div>
                <h3>Twenty-four paths. Two conditions.</h3>
                <p>Each line begins at zero. Each endpoint belongs to the same seed.</p>
              </div>
              <span className="mi-evidence-seed">Seed {demo.seed}</span>
            </header>

            <div className="mi-home-plot">
              <TrajectoryPlot current={demo.current} baseline={demo.baseline} compare draw />
            </div>

            <div className="mi-home-legend" aria-label="Plot legend">
              <span><i className="mi-legend-line mi-legend-line--baseline" /> Baseline · σ 0.35</span>
              <span><i className="mi-legend-line mi-legend-line--current" /> Current · σ {demo.sigma.toFixed(2)}</span>
            </div>

            <dl className="mi-home-metrics">
              <div><dt>Current endpoint variance</dt><dd>{demo.current.variance.toFixed(4)}</dd></div>
              <div><dt>Baseline endpoint variance</dt><dd>{demo.baseline.variance.toFixed(4)}</dd></div>
              <div><dt>Variance difference</dt><dd>{varianceChange > 0 ? "+" : ""}{varianceChange.toFixed(4)}</dd></div>
            </dl>

            <p className="mi-evidence-limit">
              These statistics describe the 24 sampled endpoints in this run.
              They do not establish outcomes outside the model.
            </p>
          </div>
        </div>
      </section>

      <ModelCinema
        variant="overview"
        title="Different questions need different models."
        intro="Each family encodes a different structure. Scroll across to see what each one represents."
      />

      <section className="mi-home-repeat" aria-labelledby="mi-repeat-title">
        <div className="mi-repeat-copy" data-reveal>
          <h2 id="mi-repeat-title">Repeat the run. Keep its limits in view.</h2>
          <p>
            The seed fixes the random sequence. Replay the current inputs to
            reproduce these paths and endpoint statistics.
          </p>
          <button className="mi-button mi-button--ink" type="button" onClick={demo.replay}>
            Replay this run <span aria-hidden="true">↻</span>
          </button>
          <p className="mi-repeat-status" role="status">
            {demo.replayed
              ? "Recomputed. The displayed paths and statistics match."
              : "The current input snapshot is ready to replay."}
          </p>
          <Link to="/method" viewTransition className="mi-text-link">
            Read the calculation and its limits <span aria-hidden="true">↗</span>
          </Link>
        </div>

        <dl className="mi-repeat-ledger" data-reveal>
          <div><dt>Model</dt><dd>Additive diffusion</dd></div>
          <div><dt>Random sequence</dt><dd>Seed {demo.seed}</dd></div>
          <div><dt>Sample</dt><dd>{demo.paths} paths × {demo.current.steps} steps</dd></div>
          <div><dt>Current volatility</dt><dd>σ {demo.sigma.toFixed(2)}</dd></div>
        </dl>
      </section>
    </div>
  );
}

export default HomePage;
