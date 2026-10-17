import { useState } from "react";
import { KaTeXBlock } from "../../../math/KaTeXBlock";
import { useScenario } from "../../film/scenario";
import { TrajectoryField } from "../trajectory/TrajectoryField";
import { MediaPlane } from "../media/MediaPlane";
import { ActionLink, Arrow } from "../Primitives";
const terms = [
  {
    id: "state",
    label: "Current state",
    symbol: "xₜ",
    description:
      "The value carried forward from the previous step. Every path starts at x₀ = 0.",
  },
  {
    id: "drift",
    label: "Drift",
    symbol: "μΔt",
    description:
      "The same directional increment is added at each step. The opening drift is μ = 0.05.",
  },
  {
    id: "volatility",
    label: "Volatility",
    symbol: "σ√Δt",
    description:
      "Volatility scales each Gaussian increment. The baseline holds σ = 0.35.",
  },
  {
    id: "sample",
    label: "Gaussian sample",
    symbol: "Zₜ",
    description:
      "A seeded standard-normal sample supplies variation. Repeating the seed repeats the sampling sequence.",
  },
];
export function MethodPublication() {
  const [active, setActive] = useState("state");
  const demo = useScenario();
  return (
    <div className="pe-method pe-light">
      <header className="pe-method-intro">
        <p className="pe-eyebrow">The method</p>
        <h1 tabIndex={-1}>
          A result should
          <br />
          be inspectable.
        </h1>
        <div>
          <p>
            Follow the public workbench from its starting state to its endpoint
            statistics. The assumptions, sampling and limits are all here.
          </p>
          <nav aria-label="Method contents">
            <a href="#starting-state">Starting conditions</a>
            <a href="#sampling">Sampling</a>
            <a href="#comparison">Comparison</a>
            <a href="#replay">Replay</a>
            <a href="#limits">Limits</a>
          </nav>
        </div>
      </header>
      <section
        className="pe-method-formula"
        aria-label="Additive diffusion equation"
      >
        <KaTeXBlock math="x_{t+1}=x_t+\mu\Delta t+\sigma\sqrt{\Delta t}\,Z_t" />
        <div className="pe-equation-terms">
          {terms.map((term) => (
            <button
              key={term.id}
              aria-label={
                "Explain " +
                (term.id === "sample"
                  ? "Gaussian sample"
                  : term.id === "state"
                    ? "current state"
                    : term.id)
              }
              aria-pressed={active === term.id}
              onClick={() => setActive(term.id)}
              onFocus={() => setActive(term.id)}
              onMouseEnter={() => setActive(term.id)}
            >
              <strong>{term.symbol}</strong>
              <span>{term.label}</span>
            </button>
          ))}
        </div>
        <div className="pe-term-explanations">
          {terms.map((term) => (
            <p key={term.id} className={active === term.id ? "is-active" : ""}>
              <b>{term.label}.</b> {term.description}
            </p>
          ))}
        </div>
      </section>
      <div className="pe-method-publication">
        <aside className="pe-method-spine" aria-hidden="true">
          <span>x₀</span>
          <i />
          <span>xₜ</span>
          <i />
          <span>xₜ₊₁</span>
          <i />
          <span>μ, σ</span>
          <i />
          <span>x₀</span>
        </aside>
        <div>
          <article id="starting-state" className="pe-method-section">
            <p className="pe-eyebrow">State the assumptions</p>
            <h2>
              Begin at zero.
              <br />
              Keep the conditions visible.
            </h2>
            <p>
              Every one of the 24 paths begins at zero. The horizon is divided
              into 50 equal steps. Drift and volatility are constant within a
              run. The opening example uses the following conditions.
            </p>
            <dl className="pe-method-ledger">
              <div>
                <dt>Starting value</dt>
                <dd>0</dd>
              </div>
              <div>
                <dt>Drift</dt>
                <dd>0.05</dd>
              </div>
              <div>
                <dt>Baseline volatility</dt>
                <dd>0.35</dd>
              </div>
              <div>
                <dt>Seed</dt>
                <dd>42</dd>
              </div>
              <div>
                <dt>Paths</dt>
                <dd>24</dd>
              </div>
              <div>
                <dt>Steps</dt>
                <dd>50</dd>
              </div>
            </dl>
          </article>
          <article id="sampling" className="pe-method-section">
            <p className="pe-eyebrow">Build the path</p>
            <h2>
              One increment
              <br />
              at a time.
            </h2>
            <p>
              At each step the calculation adds a drift increment and a sampled
              Gaussian increment to the previous value. The time step is one
              fiftieth of the full horizon.
            </p>
            <KaTeXBlock math="Z_t\sim\mathcal{N}(0,1),\qquad\Delta t=\frac{1}{50}" />
            <p>
              A Mulberry32 pseudo-random generator supplies repeatable uniform
              values. The Box–Muller transform converts them into Gaussian
              pairs. Each path contains 50 calculated steps after its initial
              value.
            </p>
            <div className="pe-method-small-plot">
              <TrajectoryField current={demo.current} variant="field" />
            </div>
          </article>
          <figure className="pe-method-photo">
            <MediaPlane
              role="methodStructure"
              alt="A concrete facade with rectilinear seams and a diagonal shadow"
            />
            <div className="pe-measure-line" aria-hidden="true" />
            <figcaption>
              A visible structure makes a relationship easier to inspect.
            </figcaption>
          </figure>
          <article id="comparison" className="pe-method-section">
            <p className="pe-eyebrow">Compare like with like</p>
            <h2>
              Change one condition.
              <br />
              Hold the reference.
            </h2>
            <p>
              The baseline uses volatility 0.35 with the current drift and seed.
              Both sets of paths share one vertical domain containing every
              calculated value. A dashed baseline distinguishes it from the
              current solid paths.
            </p>
            <p>
              The mean and variance summarize the 24 endpoints in the current
              finite sample. The variance uses the number of paths as its
              divisor.
            </p>
            <KaTeXBlock math="\bar{x}=\frac{1}{N}\sum_{i=1}^{N}x_i,\qquad v=\frac{1}{N}\sum_{i=1}^{N}(x_i-\bar{x})^2" />
            <ActionLink to="/workbench">Compare your own conditions</ActionLink>
          </article>
          <article id="replay" className="pe-method-section">
            <p className="pe-eyebrow">Reproduce the evidence</p>
            <h2>
              Same inputs.
              <br />
              Same seeded run.
            </h2>
            <p>
              The seed fixes the pseudo-random sequence. Replay reruns the
              current inputs and compares the complete result with the existing
              result. Confirmation is invalidated whenever an input changes.
            </p>
            <button className="pe-action pe-action--dark" onClick={demo.replay}>
              Replay this run <span aria-hidden="true">↻</span>
            </button>
            <p role="status" className="pe-replay-status">
              {demo.replayed
                ? "Recomputed. The displayed paths and statistics match."
                : "The current input snapshot is ready to replay."}
            </p>
          </article>
          <article id="limits" className="pe-method-section pe-method-limits">
            <p className="pe-eyebrow">Read the boundary</p>
            <h2>
              The assumptions
              <br />
              are not the world.
            </h2>
            <p>
              This example uses additive diffusion, Gaussian increments, fixed
              drift and a finite set of seeded paths. Its output does not
              validate those assumptions or predict a real-world outcome.
            </p>
            <p>
              A different question may need a different model, parameters or
              observed data. This public experiment does not estimate real event
              probabilities, market prices or individual behaviour.
            </p>
            <ActionLink to="/models">Explore the model families</ActionLink>
          </article>
        </div>
      </div>
      <div className="pe-method-end">
        <span>Inspect. Compare. Reproduce.</span>
        <a href="#main-content">
          Return to the equation <Arrow />
        </a>
      </div>
    </div>
  );
}
