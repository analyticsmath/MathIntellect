import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Photo } from "../film/Photo";
import { useScenario } from "../film/scenario";
import { TrajectoryPlot } from "../film/TrajectoryPlot";
import { ModelCinema } from "../film/ModelCinema";
gsap.registerPlugin(ScrollTrigger);
export function HomePage() {
  const rootRef = useRef<HTMLDivElement>(null),
    demo = useScenario();
  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    media.add(
      "(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
      () => {
        const root = rootRef.current;
        if (!root) return;
        root.classList.add("mi-film-enhanced");
        const context = gsap.context(() => {
          const opening = gsap.timeline({
            scrollTrigger: {
              trigger: ".mi-opening",
              start: "top top",
              end: "bottom bottom",
              scrub: 0.5,
              invalidateOnRefresh: true,
            },
          });
          opening
            .to(
              ".mi-opening-title",
              { y: -65, opacity: 0, duration: 0.28 },
              0.05,
            )
            .to(
              ".mi-opening-image",
              {
                left: "7vw",
                top: "17svh",
                width: "34vw",
                height: "68svh",
                "--edge-mask": 0,
                duration: 0.55,
                ease: "power2.inOut",
              },
              0.13,
            )
            .fromTo(
              ".mi-condition-copy",
              { y: 45, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.26 },
              0.48,
            );
          const field = gsap.timeline({
            scrollTrigger: {
              trigger: ".mi-possibility",
              start: "top 70%",
              end: "bottom 65%",
              scrub: 0.4,
            },
          });
          field
            .fromTo(
              ".mi-drawn-field .mi-path",
              { strokeDashoffset: 1, opacity: 0.05 },
              {
                strokeDashoffset: 0,
                opacity: 0.55,
                stagger: 0.018,
                duration: 0.6,
                ease: "none",
              },
              0,
            )
            .fromTo(
              ".mi-possibility .mi-memory-image",
              { y: 80 },
              { y: -50, duration: 1, ease: "none" },
              0,
            );
          gsap.utils.toArray<HTMLElement>(".mi-reveal").forEach((element) =>
            gsap.fromTo(
              element,
              { y: 34 },
              {
                y: 0,
                scrollTrigger: {
                  trigger: element,
                  start: "top 90%",
                  end: "top 55%",
                  scrub: true,
                },
              },
            ),
          );
        }, root);
        return () => {
          context.revert();
          root.classList.remove("mi-film-enhanced");
        };
      },
    );
    return () => media.revert();
  }, []);
  const changed = demo.sigma !== 0.35;
  return (
    <div ref={rootRef} className="mi-home">
      <section className="mi-opening">
        <div className="mi-opening-stage">
          <Photo id="monte-carlo" className="mi-opening-image" priority />
          <div className="mi-opening-title">
            <h1 tabIndex={-1}>
              What if
              <span className="mi-mobile-space"> </span>
              <br className="mi-desktop-break" />
              one
              <span className="mi-mobile-break">
                <br />
              </span>
              <span className="mi-desktop-space"> </span>
              thing
              <span className="mi-mobile-space"> </span>
              <br className="mi-desktop-break" />
              <span className="mi-title-last">changed?</span>
            </h1>
            <p>A different assumption can change the whole picture.</p>
            <Link className="mi-text-link" to="/workbench">
              Explore the workbench <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <span className="mi-opening-scroll" aria-hidden="true">
            A question worth following <span>↓</span>
          </span>
          <div className="mi-condition-copy">
            <h2>
              An outcome
              <br />
              is only part
              <br />
              of the story.
            </h2>
            <p>
              Start with the conditions.
              <br />
              Then make room for possibility.
            </p>
            <dl className="mi-condition-values">
              <div>
                <dt>Volatility</dt>
                <dd>σ {demo.sigma.toFixed(2)}</dd>
              </div>
              <div>
                <dt>Seed</dt>
                <dd>{demo.seed}</dd>
              </div>
            </dl>
            <span className="mi-photo-note">
              Photography is an analogy. The model below is computed.
            </span>
          </div>
        </div>
      </section>
      <section className="mi-possibility">
        <Photo id="monte-carlo" className="mi-memory-image" actor={false} />
        <div className="mi-possibility-content">
          <h2 className="mi-reveal">
            One start.
            <br />
            <span>Many possible outcomes.</span>
          </h2>
          <TrajectoryPlot current={demo.current} draw />
          <div className="mi-plot-summary">
            <span>
              {demo.paths} calculated paths · seed {demo.seed}
            </span>
            <span>
              Sample variance{" "}
              <strong>{demo.current.variance.toFixed(4)}</strong>
            </span>
          </div>
          <p className="mi-small-explanation">
            The same starting point. Different sampled paths.
            <br />
            An uncertainty you can inspect, not a future we promise.
          </p>
        </div>
      </section>
      <section className="mi-intervention">
        <div className="mi-intervention-intro">
          <h2 className="mi-reveal">
            Change
            <br />
            the condition.
          </h2>
          <p>
            Keep the starting point.
            <br />
            Change how widely the paths can spread.
          </p>
        </div>
        <div className="mi-intervention-work">
          <div className="mi-control">
            <label htmlFor="home-sigma">
              Volatility <span>σ {demo.sigma.toFixed(2)}</span>
            </label>
            <input
              id="home-sigma"
              type="range"
              min="0.05"
              max="0.9"
              step="0.01"
              value={demo.sigma}
              onChange={(event) => demo.setSigma(Number(event.target.value))}
            />
            <div className="mi-range-ends">
              <span>Less spread</span>
              <span>More spread</span>
            </div>
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
          <div className="mi-outcome-row">
            <p>
              {changed ? "See what moved." : "One condition. Ready to change."}
            </p>
            <div>
              <span>Variance difference</span>
              <strong>
                {changed && demo.current.variance - demo.baseline.variance > 0
                  ? "+"
                  : ""}
                {(demo.current.variance - demo.baseline.variance).toFixed(4)}
              </strong>
            </div>
            <button
              className="mi-quiet-button"
              onClick={() => demo.setSigma(0.35)}
            >
              Reset volatility ↺
            </button>
          </div>
          <Link to="/workbench" className="mi-text-link">
            Take this state into the workbench <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <Photo id="aftermath" className="mi-intervention-photo" actor={false} />
      </section>
      <ModelCinema />
      <section className="mi-replay">
        <div>
          <h2 className="mi-reveal">
            A result
            <br />
            you can return to.
          </h2>
          <p>
            Keep the inputs. Keep the seed.
            <br />
            Run the calculation again.
          </p>
          <button className="mi-text-link" onClick={demo.replay}>
            Replay this state <span aria-hidden="true">↺</span>
          </button>
          <p role="status" className="mi-replay-status">
            {demo.replayed
              ? "Recomputed. All paths and results match."
              : "Your current state stays with you."}
          </p>
        </div>
        <div className="mi-replay-evidence">
          <span>Current input snapshot</span>
          <dl>
            <div>
              <dt>Volatility</dt>
              <dd>{demo.sigma.toFixed(2)}</dd>
            </div>
            <div>
              <dt>Drift</dt>
              <dd>{demo.mu.toFixed(2)}</dd>
            </div>
            <div>
              <dt>Seed</dt>
              <dd>{demo.seed}</dd>
            </div>
            <div>
              <dt>Paths</dt>
              <dd>{demo.paths}</dd>
            </div>
          </dl>
          <Link to="/method" className="mi-text-link">
            Understand the method <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
export default HomePage;
