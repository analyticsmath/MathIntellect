import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MODEL_STORIES } from "../film/filmMedia";
import { useScenario } from "../film/scenario";
import { TrajectoryPlot } from "../film/TrajectoryPlot";
import { ModelCinema } from "../film/ModelCinema";

gsap.registerPlugin(ScrollTrigger);

export function HomePage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const demo = useScenario();
  const changed = demo.sigma !== 0.35;

  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    media.add(
      "(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
      () => {
        const scene = rootRef.current?.querySelector<HTMLElement>(".mi-story-opening");
        if (!scene) return;
        scene.classList.add("mi-story-enhanced");

        const context = gsap.context(() => {
          const passage = gsap.timeline({
            scrollTrigger: {
              trigger: scene,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.55,
              invalidateOnRefresh: true,
            },
          });

          passage
            .to(
              ".mi-origin-entry",
              { autoAlpha: 0, y: -36, duration: 0.36, ease: "power2.inOut" },
              0.32,
            )
            .to(
              ".mi-origin-entry .mi-story-image img",
              { scale: 1.1, xPercent: 1.5, yPercent: 5, duration: 0.8, ease: "none" },
              0,
            )
            .fromTo(
              ".mi-origin-reveal",
              { autoAlpha: 0, y: 38 },
              { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" },
              0.42,
            )
            .fromTo(
              ".mi-origin-reveal .mi-path",
              { strokeDashoffset: 1, opacity: 0.06 },
              {
                strokeDashoffset: 0,
                opacity: 0.76,
                stagger: 0.014,
                duration: 0.58,
                ease: "none",
              },
              0.34,
            )
            .fromTo(
              ".mi-origin-reveal .mi-origin-caption",
              { y: 24, autoAlpha: 0 },
              { y: 0, autoAlpha: 1, duration: 0.3, ease: "power2.out" },
              0.62,
            );
        }, scene);

        return () => {
          context.revert();
          scene.classList.remove("mi-story-enhanced");
        };
      },
    );
    return () => media.revert();
  }, []);

  return (
    <div ref={rootRef} className="mi-home mi-story-home">
      <section className="mi-story-opening" aria-label="One starting point, many outcomes">
        <div className="mi-story-stage">
          <div className="mi-origin-entry">
            <figure className="mi-story-image">
              <img
                src="/media/math-intellect/cinematic/optimized/webp/mi-origin-story-hero.webp"
                width="1672"
                height="941"
                alt="A researcher marks a starting point on translucent plotting paper in a quiet studio."
                fetchPriority="high"
                decoding="async"
              />
              <div className="mi-story-image-shade" aria-hidden="true" />
              <figcaption>
                Illustrative working scene. The model paths are computed in your browser.
              </figcaption>
            </figure>
            <div className="mi-origin-copy">
              <span className="mi-story-eyebrow">MATH INTELLECT <i /> SCENARIO MODELING</span>
              <h1>
                One start.
                <br />
                <span>Many possible futures.</span>
              </h1>
              <p>
                A model does not tell you what must happen. It shows what follows
                when your assumptions are put to work.
              </p>
              <div className="mi-story-actions">
                <a
                  className="mi-story-link mi-story-link--light"
                  href="#the-origin"
                  onClick={(event) => {
                    const desktopStory = window.matchMedia(
                      "(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
                    ).matches;
                    const scene =
                      rootRef.current?.querySelector<HTMLElement>(".mi-story-opening");
                    if (!desktopStory || !scene) return;

                    event.preventDefault();
                    const scrollRange = Math.max(0, scene.offsetHeight - window.innerHeight);
                    const target =
                      scene.getBoundingClientRect().top +
                      window.scrollY +
                      scrollRange * 0.78;
                    window.history.replaceState(window.history.state, "", "#the-origin");
                    window.scrollTo({ top: target, behavior: "smooth" });
                  }}
                >
                  Follow one scenario <span aria-hidden="true">↓</span>
                </a>
                <Link className="mi-story-link" to="/workbench">
                  Open the workbench <span aria-hidden="true">↗</span>
                </Link>
              </div>
            </div>
            <div className="mi-origin-index" aria-hidden="true">
              <span>01 — THE QUESTION</span>
              <span>24 PATHS / SEED {demo.seed}</span>
            </div>
          </div>

          <div id="the-origin" className="mi-origin-reveal">
            <div className="mi-origin-copy">
              <span className="mi-story-eyebrow">01 <i /> HOLD THE CONDITIONS</span>
              <h2>
                One beginning.
                <br />
                <span>Room for every path.</span>
              </h2>
              <p>
                Drift, volatility and a fixed seed define this demonstration.
                From the same origin, the model computes 24 sample paths.
              </p>
              <dl className="mi-origin-ledger">
                <div>
                  <dt>Drift μ</dt>
                  <dd>{demo.mu.toFixed(2)}</dd>
                </div>
                <div>
                  <dt>Volatility σ</dt>
                  <dd>{demo.sigma.toFixed(2)}</dd>
                </div>
                <div>
                  <dt>Seed</dt>
                  <dd>{demo.seed}</dd>
                </div>
              </dl>
            </div>
            <div className="mi-origin-plot">
              <div className="mi-origin-caption">
                <span>COMPUTED IN THIS BROWSER</span>
                <span>50 TIME STEPS <i /> 24 SAMPLES</span>
              </div>
              <TrajectoryPlot current={demo.current} draw />
              <div className="mi-origin-result">
                <span>Sample variance</span>
                <strong>{demo.current.variance.toFixed(4)}</strong>
                <span>From the 24 path endpoints</span>
              </div>
            </div>
            <span className="mi-origin-chapter">01 / 04</span>
          </div>
        </div>
      </section>

      <section className="mi-change-scene" aria-labelledby="mi-change-title">
        <div className="mi-change-intro">
          <span className="mi-story-eyebrow">02 <i /> CHANGE ONE CONDITION</span>
          <h2 id="mi-change-title">
            Keep the origin.
            <br />
            <em>Move the field.</em>
          </h2>
          <p>
            Change volatility and watch the sampled paths respond. Drift, seed,
            sample count and time steps stay fixed for a readable comparison.
          </p>
          <div className="mi-change-annotation">
            <span className="mi-change-dot" aria-hidden="true" />
            <span>The rust line is the changed run.<br />The fine green lines are the baseline.</span>
          </div>
          <Link to="/workbench" className="mi-story-link mi-story-link--dark">
            Take the question further <span aria-hidden="true">↗</span>
          </Link>
        </div>

        <div className="mi-change-instrument">
          <div className="mi-instrument-head">
            <span>VOLATILITY <strong>σ {demo.sigma.toFixed(2)}</strong></span>
            <span>BASELINE σ 0.35</span>
          </div>
          <div className="mi-control mi-story-control">
            <label htmlFor="home-sigma">Widen or narrow the possible spread</label>
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
              <span>0.05 · LESS SPREAD</span>
              <span>MORE SPREAD · 0.90</span>
            </div>
          </div>
          <div className="mi-change-plot">
            <TrajectoryPlot
              current={demo.current}
              baseline={demo.baseline}
              compare={changed}
            />
          </div>
          <div className="mi-change-output">
            <div>
              <span>Current sample variance</span>
              <strong>{demo.current.variance.toFixed(4)}</strong>
            </div>
            <div>
              <span>Difference from baseline</span>
              <strong>
                {demo.current.variance - demo.baseline.variance > 0 ? "+" : ""}
                {(demo.current.variance - demo.baseline.variance).toFixed(4)}
              </strong>
            </div>
            <button onClick={() => demo.setSigma(0.35)}>
              Return to baseline <span aria-hidden="true">↺</span>
            </button>
          </div>
          <p className="mi-integrity-note">
            Sampled outcomes illustrate this calculation. They are not a
            forecast or a probability claim about a real-world event.
          </p>
        </div>
      </section>

      <ModelCinema />

      <section className="mi-return-scene" aria-labelledby="mi-return-title">
        <div className="mi-return-copy">
          <span className="mi-story-eyebrow">04 <i /> RETURN TO THE QUESTION</span>
          <h2 id="mi-return-title">
            Keep the inputs.
            <br />
            <span>Repeat the result.</span>
          </h2>
          <p>
            The seed preserves the same random sequence. Replay the run and
            inspect whether every path and statistic returns unchanged.
          </p>
          <button className="mi-story-link mi-story-link--light" onClick={demo.replay}>
            Replay this scenario <span aria-hidden="true">↺</span>
          </button>
          <p className="mi-story-status" role="status">
            {demo.replayed
              ? "Recomputed. Every sampled path and statistic matches."
              : "Your current inputs remain beside the result."}
          </p>
        </div>
        <div className="mi-return-record">
          <span className="mi-return-record-label">SCENARIO RECORD <i /> ADDITIVE DIFFUSION</span>
          <dl>
            <div><dt>Drift</dt><dd>μ {demo.mu.toFixed(2)}</dd></div>
            <div><dt>Volatility</dt><dd>σ {demo.sigma.toFixed(2)}</dd></div>
            <div><dt>Seed</dt><dd>{demo.seed}</dd></div>
            <div><dt>Paths × steps</dt><dd>{demo.paths} × 50</dd></div>
          </dl>
          <div className="mi-return-record-footer">
            <span>Input snapshot held with this run</span>
            <strong>{demo.current.variance.toFixed(4)} <small>sample variance</small></strong>
          </div>
          <Link to="/method" className="mi-story-link">
            Read how it is calculated <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>

      <section className="mi-next-question">
        <span className="mi-story-eyebrow">THE NEXT QUESTION</span>
        <h2>Choose the mathematics<br />that fits what you’re asking.</h2>
        <p>
          Uncertainty is one kind of problem. Strategic choices, market
          conditions and interacting agents call for different models.
        </p>
        <Link to="/models" className="mi-story-link mi-story-link--dark">
          Explore all five model families <span aria-hidden="true">↗</span>
        </Link>
        <div className="mi-next-question-index">
          {MODEL_STORIES.map((model, index) => (
            <span key={model.id}>
              <i>{String(index + 1).padStart(2, "0")}</i> {model.name}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}

export default HomePage;
