import { Link } from "react-router-dom";
import { useScenario } from "../film/scenario";
import { TrajectoryPlot } from "../film/TrajectoryPlot";
import { ModelJourney } from "../film/ModelJourney";
import { ModelCinema } from "../film/ModelCinema";
import { PHOTO_LIBRARY } from "../film/photoLibrary";

const openingVolatility = 0.35;

export function HomePage() {
  const demo = useScenario();
  const changed = demo.sigma !== openingVolatility;
  const varianceChange = demo.current.variance - demo.baseline.variance;

  return (
    <div className="mi-home">
      <section className="mi-home-hero" data-home-hero aria-labelledby="mi-home-title">
        <figure className="mi-hero-art">
          <picture className="mi-hero-picture">
            <source
              media="(max-width: 959px)"
              srcSet={PHOTO_LIBRARY.hero.portraitSrc + " 900w"}
              sizes="100vw"
              type="image/webp"
            />
            <img
              className="mi-hero-image"
              src={PHOTO_LIBRARY.hero.wideSrc}
              srcSet={PHOTO_LIBRARY.hero.wideSrc + " 1800w"}
              sizes="(min-width: 960px) 48vw, 100vw"
              width={PHOTO_LIBRARY.hero.wideDimensions.width}
              height={PHOTO_LIBRARY.hero.wideDimensions.height}
              alt={PHOTO_LIBRARY.hero.alt}
              decoding="async"
              fetchPriority="high"
            />
          </picture>
          <figcaption className="mi-hero-photo-credit">
            Photograph by <a href={PHOTO_LIBRARY.hero.sourceUrl} target="_blank" rel="noreferrer">{PHOTO_LIBRARY.hero.photographer}</a> on <a href="https://unsplash.com" target="_blank" rel="noreferrer">Unsplash</a>
          </figcaption>
        </figure>
        <div className="mi-hero-copy">
          <h1 id="mi-home-title" tabIndex={-1}>
            <span className="mi-hero-line"><span data-hero-line>Change an assumption.</span></span>
            <span className="mi-hero-line"><span data-hero-line>See every path.</span></span>
          </h1>
          <p data-hero-copy>
            Explore a seeded simulation from the assumptions that define it to the paths they produce. Adjust volatility, hold everything else fixed, and compare the result.
          </p>
          <div className="mi-hero-actions" data-hero-actions>
            <a className="mi-button mi-button--signal" href="#model-story">
              Follow the calculation <span aria-hidden="true">↓</span>
            </a>
            <Link className="mi-text-link" to="/workbench" viewTransition>
              Open the workbench <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <div className="mi-hero-conditions" aria-label="Public example conditions" data-hero-conditions>
            <span>Drift μ {demo.mu.toFixed(2)}</span>
            <span>Volatility σ {demo.sigma.toFixed(2)}</span>
            <span>{demo.paths} paths</span>
            <span>{demo.current.steps} steps</span>
            <span>Seed {demo.seed}</span>
          </div>
        </div>
      </section>

      <ModelJourney
        mu={demo.mu}
        sigma={demo.sigma}
        seed={demo.seed}
        paths={demo.paths}
        current={demo.current}
      />

      <section id="experiment" className="mi-home-experiment" aria-labelledby="mi-experiment-title">
        <header className="mi-section-heading" data-reveal>
          <h2 id="mi-experiment-title">Change volatility. Hold the rest fixed.</h2>
          <p>
            The baseline stays at σ 0.35. Adjust one value and compare both runs on the same scale.
          </p>
        </header>

        <div className="mi-experiment-layout">
          <aside className="mi-experiment-controls" data-reveal>
            <div className="mi-control-intro">
              <h3>Volatility</h3>
              <p>The browser recalculates this seeded model as you move the control.</p>
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
                ? "Only volatility differs from the baseline."
                : "Move the control to compare the current run with the baseline."}
            </p>
          </aside>

          <div className="mi-experiment-evidence">
            <header className="mi-evidence-heading">
              <div>
                <h3>Two runs. One shared scale.</h3>
                <p>Each line begins at zero. The seed remains fixed.</p>
              </div>
              <span className="mi-evidence-seed">Seed {demo.seed}</span>
            </header>

            <div className="mi-home-plot" data-path-draw>
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
              These values summarize the 24 sampled endpoints in each run. They do not establish outcomes outside the model.
            </p>
          </div>
        </div>
      </section>

      <ModelCinema
        variant="overview"
        title="Choose a structure that fits the question."
        intro="Each photograph sets a real-world context; each diagram explains a model structure. Keep scrolling through four different questions. Only the seeded diffusion run is calculated here."
      />

      <section className="mi-home-repeat" aria-labelledby="mi-repeat-title">
        <div className="mi-repeat-copy" data-reveal>
          <h2 id="mi-repeat-title">A result should be repeatable.</h2>
          <p>
            The seed fixes the random sequence. Replay the current inputs to reproduce these paths and endpoint statistics.
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
