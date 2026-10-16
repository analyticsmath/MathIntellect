import { Link } from "react-router-dom";
import { useScenario } from "../film/scenario";
import { TrajectoryPlot } from "../film/TrajectoryPlot";
import { ModelCinema } from "../film/ModelCinema";

const openingVolatility = 0.35;
const originPhoto =
  "/media/math-intellect/cinematic/optimized/webp/mi-film-impact-origin-1920.webp";
const originPhotoSrcSet =
  "/media/math-intellect/cinematic/optimized/webp/mi-film-impact-origin-960.webp 960w, " +
  "/media/math-intellect/cinematic/optimized/webp/mi-film-impact-origin-1280.webp 1280w, " +
  "/media/math-intellect/cinematic/optimized/webp/mi-film-impact-origin-1920.webp 1920w, " +
  "/media/math-intellect/cinematic/optimized/webp/mi-film-impact-origin-2560.webp 2560w";
const originPhotoSource =
  "https://unsplash.com/photos/milk-splash-frozen-in-time-against-black-background-6ieRRBACAqM";

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
              See the paths
              <br />
              <span>behind a result.</span>
            </h1>
            <p>
              Define a model, change an assumption, and inspect the outcomes.
              Math Intellect keeps the conditions beside the evidence.
            </p>

            <div className="mi-hero-actions">
              <a className="mi-button mi-button--signal" href="#experiment">
                Explore the experiment <span aria-hidden="true">↓</span>
              </a>
              <Link
                className="mi-text-link"
                to="/workbench"
                viewTransition
              >
                Open the workbench <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>

          <figure className="mi-hero-art" data-reveal>
            <picture>
              <source
                type="image/webp"
                srcSet={originPhotoSrcSet}
                sizes="(max-width: 900px) 100vw, 52vw"
              />
              <img
                src={originPhoto}
                srcSet={originPhotoSrcSet}
                sizes="(max-width: 900px) 100vw, 52vw"
                width="1920"
                height="1280"
                alt="A white liquid splash suspended against a dark background"
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
            </picture>
            <figcaption>
              <a href={originPhotoSource} target="_blank" rel="noreferrer">
                Photograph by Pete Godfrey
              </a>
              <span>Editorial context, separate from calculated results.</span>
            </figcaption>
          </figure>
        </div>

        <p className="mi-hero-integrity">
          A reproducible example follows below. Its outcomes are calculated from
          the inputs shown on screen.
        </p>
      </section>

      <section
        id="experiment"
        className="mi-home-experiment"
        aria-labelledby="mi-experiment-title"
      >
        <div className="mi-experiment-heading" data-reveal>
          <h2 id="mi-experiment-title">
            One starting point.
            <br />
            Many possible paths.
          </h2>
          <p>
            Change volatility in a seeded additive diffusion model. Drift, seed,
            path count, and horizon stay fixed so you can see what this one
            condition changes.
          </p>
        </div>

        <div className="mi-experiment-layout">
          <aside className="mi-experiment-controls" data-reveal>
            <div>
              <h3>Change a condition</h3>
              <p>The model recalculates in your browser as you move the control.</p>
            </div>

            <div className="mi-control mi-control--home">
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
              <div className="mi-range-ends">
                <span>0.05</span>
                <span>0.90</span>
              </div>
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
                ? "The current run now differs from the baseline in volatility only."
                : "Move the control to compare a changed run with the baseline."}
            </p>
          </aside>

          <div className="mi-experiment-evidence" data-reveal data-path-draw>
            <header className="mi-evidence-heading">
              <div>
                <h3>Compare the outcomes</h3>
                <p>Both runs share one origin and one vertical scale.</p>
              </div>
              <span className="mi-evidence-seed">Seed {demo.seed}</span>
            </header>

            <div className="mi-home-plot">
              <TrajectoryPlot
                current={demo.current}
                baseline={demo.baseline}
                compare
              />
            </div>

            <div className="mi-home-legend" aria-label="Plot legend">
              <span><i className="mi-legend-dot mi-legend-dot--baseline" /> Baseline · σ 0.35</span>
              <span><i className="mi-legend-dot mi-legend-dot--current" /> Current · σ {demo.sigma.toFixed(2)}</span>
            </div>

            <dl className="mi-home-metrics">
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
                <dd>{varianceChange > 0 ? "+" : ""}{varianceChange.toFixed(4)}</dd>
              </div>
            </dl>

            <p className="mi-evidence-limit">
              This isolates an input in this calculation. It does not establish a
              cause or probability outside the model.
            </p>
          </div>
        </div>
      </section>

      <ModelCinema />

      <section className="mi-home-repeat" aria-labelledby="mi-repeat-title">
        <figure className="mi-repeat-art" data-reveal>
          <picture>
            <source
              type="image/webp"
              srcSet="/media/math-intellect/cinematic/optimized/webp/mi-film-impact-aftermath-960.webp 960w, /media/math-intellect/cinematic/optimized/webp/mi-film-impact-aftermath-1920.webp 1920w"
              sizes="(max-width: 900px) 100vw, 48vw"
            />
            <img
              src="/media/math-intellect/cinematic/optimized/webp/mi-film-impact-aftermath-1920.webp"
              width="1920"
              height="1280"
              alt="A second liquid splash with droplets suspended in motion"
              loading="lazy"
              decoding="async"
            />
          </picture>
          <figcaption>
            <a
              href="https://unsplash.com/photos/milk-splash-with-droplets-against-black-background-UAjcZ1qBzE0"
              target="_blank"
              rel="noreferrer"
            >
              Photograph by Pete Godfrey
            </a>
            <span>Illustration only; the run remains defined by its inputs.</span>
          </figcaption>
        </figure>

        <div className="mi-repeat-copy" data-reveal>
          <h2 id="mi-repeat-title">Repeat the calculation exactly.</h2>
          <p>
            The seed fixes the random sequence. Replay the current inputs and
            check that the same paths and endpoint statistics return.
          </p>
          <button
            className="mi-button mi-button--ink"
            type="button"
            onClick={demo.replay}
          >
            Replay this run <span aria-hidden="true">↻</span>
          </button>
          <p className="mi-repeat-status" role="status">
            {demo.replayed
              ? "Recomputed. The displayed paths and statistics match."
              : "The current input snapshot is ready to replay."}
          </p>
          <Link to="/method" viewTransition className="mi-text-link">
            Read how the calculation works <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
