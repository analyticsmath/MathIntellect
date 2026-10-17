import { useRef } from "react";
import { Photo } from "./Photo";
import { TextLink } from "./Shared";
import { useEditorialMotion } from "./useEditorialMotion";
export function EditorialMethod() {
  const root = useRef<HTMLDivElement>(null);
  useEditorialMotion(root);
  return (
    <div ref={root} className="mi-method-page">
      <header className="mi-page-intro">
        <h1 tabIndex={-1}>
          <span className="mi-line">
            <span>Look beneath</span>
          </span>
          <span className="mi-line">
            <span>the result.</span>
          </span>
        </h1>
        <div>
          <p>
            A result means more when you understand how it was made. Follow the
            public example from its starting conditions to its final statistics.
          </p>
          <TextLink to="/workbench">Try the example</TextLink>
        </div>
      </header>
      <figure className="mi-method-banner" data-parallax>
        <Photo id="mechanism" priority />
      </figure>
      <div className="mi-method-body">
        <nav aria-label="Method contents">
          <a href="#starting-state">Starting conditions</a>
          <a href="#sampling">Sampling</a>
          <a href="#comparison">Comparison</a>
          <a href="#replay">Repeating a run</a>
          <a href="#limits">Limits</a>
        </nav>
        <article>
          <section id="starting-state" data-reveal>
            <h2>
              Every path
              <br />
              starts at zero.
            </h2>
            <p>
              The example calculates 24 paths over 50 equal steps. Drift and
              volatility stay constant during each run. The opening conditions
              are drift 0.05, volatility 0.35 and seed 42.
            </p>
            <p>
              Changing a control recalculates the paths in your browser. This
              method explains that public example, rather than every model
              available in an account.
            </p>
          </section>
          <section id="sampling" data-reveal>
            <h2>
              One rule.
              <br />
              Many possibilities.
            </h2>
            <p>
              At every step, the current value gains a steady drift increment
              and a scaled random increment. Each path applies this same rule
              with its own sequence of random samples.
            </p>
            <div
              className="mi-equation"
              role="math"
              aria-label="The next value equals the current value plus drift times the time step plus volatility times the square root of the time step times a standard normal sample"
            >
              xₜ₊₁ = xₜ + μΔt + σ√Δt Zₜ
            </div>
            <dl className="mi-method-definitions">
              <div>
                <dt>xₜ</dt>
                <dd>The current value, carried from the previous step.</dd>
              </div>
              <div>
                <dt>μΔt</dt>
                <dd>The steady directional increment.</dd>
              </div>
              <div>
                <dt>σ√Δt</dt>
                <dd>The scale of the random increment.</dd>
              </div>
              <div>
                <dt>Zₜ</dt>
                <dd>A seeded sample from a standard normal distribution.</dd>
              </div>
            </dl>
            <p>
              The mean endpoint is the average final value. Endpoint variance
              measures how widely the final values spread around that mean.
            </p>
          </section>
          <figure className="mi-method-interlude" data-parallax>
            <Photo id="velodrome" sizes="(max-width:800px) 100vw, 65vw" />
          </figure>
          <section id="comparison" data-reveal>
            <h2>
              Change the condition.
              <br />
              Keep the comparison.
            </h2>
            <p>
              The baseline always uses volatility 0.35. It shares your current
              drift, seed, path count and number of steps. Holding the sampling
              sequence fixed helps isolate the effect of a volatility change.
            </p>
            <p>
              The example reports both endpoint variances and their difference.
              Open the endpoint table to inspect each path’s final current and
              baseline value.
            </p>
          </section>
          <section id="replay" data-reveal>
            <h2>
              Repeat the
              <br />
              same calculation.
            </h2>
            <p>
              A deterministic random-number generator produces the sampling
              sequence. With the same inputs and seed, the public example
              produces the same paths and statistics.
            </p>
            <p>
              Use “Repeat this calculation” to recompute the result and check
              that it matches. Changing any input clears the previous
              confirmation.
            </p>
            <TextLink to="/workbench">Repeat the example</TextLink>
          </section>
          <section id="limits" data-reveal>
            <h2>
              A result belongs
              <br />
              to its assumptions.
            </h2>
            <p>
              The example assumes constant drift and volatility and independent
              normal increments. Twenty-four paths do not describe every
              possible outcome.
            </p>
            <p>
              The calculation does not use observed market data or establish
              what will happen outside the model. A different model,
              distribution, seed or sample count can produce different evidence.
            </p>
            <TextLink to="/models">Explore other models</TextLink>
          </section>
        </article>
      </div>
    </div>
  );
}
