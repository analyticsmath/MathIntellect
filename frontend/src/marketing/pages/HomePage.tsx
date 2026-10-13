import { Link } from "react-router-dom";
import { MODEL_STORIES } from "../film/filmMedia";
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
        <div className="mi-hero-layout">
          <div className="mi-hero-copy">
            <h1 id="mi-home-title" tabIndex={-1}>
              Before the average,
              <br />
              <span>see every path.</span>
            </h1>
            <p>
              One seeded run begins at zero. Change volatility and watch 24
              sampled paths separate while drift, seed and horizon stay fixed.
            </p>

            <div className="mi-hero-actions">
              <a className="mi-button mi-button--signal" href="#experiment">
                Watch the paths respond
              </a>
              <Link className="mi-text-link mi-text-link--light" to="/workbench" viewTransition>
                Open the workbench
              </Link>
            </div>

            <div className="mi-hero-control">
              <label htmlFor="home-sigma">
                <span>Volatility</span>
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
              <p>Change the spread. The other inputs hold steady.</p>
            </div>
          </div>

          <figure className="mi-hero-field">
            <div className="mi-hero-field-heading">
              <div>
                <h2>One starting point</h2>
                <p>Every path starts at zero.</p>
              </div>
              <strong>24 paths</strong>
            </div>
            <div className="mi-hero-plot">
              <TrajectoryPlot current={demo.current} draw />
            </div>
            <figcaption>
              <span>50 steps</span>
              <span>Seed {demo.seed}</span>
              <span>Endpoint variance {demo.current.variance.toFixed(4)}</span>
            </figcaption>
          </figure>
        </div>

        <p className="mi-hero-integrity">
          A repeatable model example, not a forecast about a real event.
        </p>
      </section>

      <section
        id="experiment"
        className="mi-home-comparison"
        aria-labelledby="mi-comparison-title"
      >
        <div className="mi-comparison-copy" data-reveal>
          <h2 id="mi-comparison-title">One change. Everything else held.</h2>
          <p>
            Both runs use drift {demo.mu.toFixed(2)}, seed {demo.seed}, 24 paths
            and 50 steps. Volatility is the only condition that changes.
          </p>
          <p className="mi-comparison-state" role="status">
            {changed
              ? `The blue paths use volatility ${demo.sigma.toFixed(2)}. The pale paths use 0.35.`
              : "Move the control above to place a changed run beside the baseline."}
          </p>
          <Link
            to="/workbench"
            viewTransition
            className="mi-button mi-button--ink"
          >
            Open the same experiment
          </Link>
        </div>

        <div className="mi-comparison-evidence" data-reveal>
          <div className="mi-comparison-heading">
            <div>
              <h3>{changed ? "The changed run beside its baseline" : "The opening run"}</h3>
              <p>One scale. One starting value. One changed condition.</p>
            </div>
            {changed && (
              <div className="mi-run-legend" aria-label="Plot legend">
                <span><i className="mi-legend-dot mi-legend-dot--baseline" /> Baseline</span>
                <span><i className="mi-legend-dot mi-legend-dot--current" /> Current</span>
              </div>
            )}
          </div>

          <div className="mi-comparison-plot">
            <TrajectoryPlot
              current={demo.current}
              baseline={demo.baseline}
              compare={changed}
            />
          </div>

          <dl className="mi-comparison-metrics">
            <div>
              <dt>Current endpoint variance</dt>
              <dd>{demo.current.variance.toFixed(4)}</dd>
            </div>
            <div>
              <dt>Baseline endpoint variance</dt>
              <dd>{demo.baseline.variance.toFixed(4)}</dd>
            </div>
            <div>
              <dt>Change within this model</dt>
              <dd>
                {varianceChange > 0 ? "+" : ""}
                {varianceChange.toFixed(4)}
              </dd>
            </div>
          </dl>
          <p className="mi-comparison-limit">
            This comparison isolates an input inside the model. It does not show
            a cause or probability outside the calculation.
          </p>
        </div>
      </section>

      <ModelCinema />

      <section className="mi-home-repeat" aria-labelledby="mi-repeat-title">
        <div className="mi-repeat-copy" data-reveal>
            <h2 id="mi-repeat-title">Return to the same question.</h2>
          <p>
            Keep the seed and inputs beside the paths. Replay the run and check
            that the calculation returns the same evidence.
          </p>
          <button className="mi-button mi-button--signal" onClick={demo.replay}>
            Replay the same run
          </button>
          <p className="mi-repeat-status" role="status">
            {demo.replayed
              ? "Recomputed. Every path and displayed statistic matches."
              : "The current inputs remain attached to this run."}
          </p>
        </div>

        <div className="mi-run-record" data-reveal>
          <h3>Current run</h3>
          <dl>
            <div><dt>Model</dt><dd>Additive diffusion</dd></div>
            <div><dt>Drift</dt><dd>{demo.mu.toFixed(2)}</dd></div>
            <div><dt>Volatility</dt><dd>{demo.sigma.toFixed(2)}</dd></div>
            <div><dt>Seed</dt><dd>{demo.seed}</dd></div>
            <div><dt>Paths</dt><dd>{demo.paths}</dd></div>
            <div><dt>Steps</dt><dd>50</dd></div>
          </dl>
          <Link to="/method" viewTransition className="mi-text-link">
            Read how the calculation works
          </Link>
        </div>
      </section>

      <section className="mi-home-next" aria-label="Explore the model families">
        <div>
          <h2>Where the next question leads.</h2>
          <p>
            {MODEL_STORIES.map((model) => model.name).join(", ")} each make a
            different part of the problem visible.
          </p>
        </div>
        <Link to="/models" viewTransition className="mi-button mi-button--ink">
          Explore the models
        </Link>
      </section>
    </div>
  );
}

export default HomePage;

