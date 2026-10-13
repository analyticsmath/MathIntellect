import { Link } from "react-router-dom";
import { KaTeXBlock } from "../../math/KaTeXBlock";

export function MethodPage() {
  return (
    <div className="mi-method-page">
      <header className="mi-method-intro">
        <span className="mi-story-eyebrow">METHOD NOTES <i /> PUBLIC DEMONSTRATION</span>
        <h1 tabIndex={-1}>
          Show the inputs.
          <br />
          <span>Show the calculation.</span>
        </h1>
        <p>
          A result is easier to question when its conditions, sampling and
          limits remain in view.
        </p>
        <nav aria-label="Method contents">
          <a href="#state">01 / State</a>
          <a href="#chance">02 / Sampling</a>
          <a href="#comparison">03 / Comparison</a>
          <a href="#replay">04 / Replay</a>
        </nav>
        <div className="mi-method-at-glance">
          <span>ONE MODEL</span>
          <strong>Additive diffusion</strong>
          <span>24 PATHS <i /> 50 STEPS <i /> SEEDED</span>
        </div>
      </header>

      <div className="mi-method-body">
        <article id="state">
          <span>01 <i /> THE STATE</span>
          <div>
            <h2>Know what went in.</h2>
            <p>
              A simulation is a question with its conditions made explicit. In
              the public workbench, those conditions are drift, volatility, the
              random seed, 24 sample paths and 50 steps over a unit time
              horizon.
            </p>
            <p>
              We keep an input snapshot beside the result. Change a value and
              you have a different question. Keep the values and you can repeat
              the same computation.
            </p>
            <dl className="mi-method-ledger">
              <div><dt>Input</dt><dd>Drift and volatility</dd></div>
              <div><dt>Sampling</dt><dd>Seed, 24 paths, 50 steps</dd></div>
              <div><dt>Evidence</dt><dd>Paths and endpoint statistics</dd></div>
            </dl>
          </div>
        </article>

        <article id="chance">
          <span>02 <i /> THE SAMPLING</span>
          <div>
            <h2>Make room for possibility.</h2>
            <p>
              The public demonstration uses additive stochastic diffusion. Each
              path starts at zero. At every step, a drift term and a sampled
              Gaussian term are added to the previous value.
            </p>
            <div className="mi-method-equation">
              <KaTeXBlock math="x_{t+\Delta t}=x_t+\mu\Delta t+\sigma\sqrt{\Delta t}\,Z_t" />
              <KaTeXBlock math="Z_t\sim\mathcal{N}(0,1),\qquad\Delta t=1/50" />
            </div>
            <p>
              A seeded Mulberry32 generator supplies uniform samples; a
              Box–Muller transform produces Gaussian pairs. A path is a
              computed sample, not a prediction.
            </p>
            <p>
              The full application has separate engines for Monte Carlo, game
              theory, market dynamics, conflict and custom expressions. Their
              assumptions and outputs differ. This additive-diffusion example
              should not be read as a demonstration of every engine.
            </p>
          </div>
        </article>

        <article id="comparison">
          <span>03 <i /> THE COMPARISON</span>
          <div>
            <h2>Change one condition.<br />Keep the rest in view.</h2>
            <p>
              When volatility changes, the comparison uses the same drift,
              seed, sample count and steps. Baseline and changed paths share
              one coordinate system, including a scale that contains both sets.
            </p>
            <p>
              Sample mean and variance are calculated from the path endpoints.
              Variance in this demonstration uses the population denominator
              of 24 for the displayed sample set. It is not an unbiased
              estimate of a population variance.
            </p>
            <div className="mi-method-equation">
              <KaTeXBlock math="\bar{x}=\frac{1}{N}\sum_{i=1}^{N}x_i,\qquad v=\frac{1}{N}\sum_{i=1}^{N}(x_i-\bar{x})^2" />
            </div>
            <p>
              Holding other inputs fixed isolates the parameter change inside
              this model. It does not establish a causal effect in the outside
              world. A different model, distribution, sample count or seed can
              produce different evidence.
            </p>
          </div>
        </article>

        <article id="replay">
          <span>04 <i /> THE REPLAY</span>
          <div>
            <h2>Repeat the calculation.<br />Inspect the agreement.</h2>
            <p>
              Replay recomputes the public demonstration from its current
              input snapshot. It compares the resulting paths and metrics with
              the displayed result. Confirmation appears only when those
              values match.
            </p>
            <p>
              This is reproducibility within the same algorithm and browser
              implementation. It does not prove the assumptions are correct
              or guarantee identical floating-point behavior across every
              platform and future algorithm version.
            </p>
            <Link to="/workbench" className="mi-story-link mi-story-link--dark">
              Run the demonstration <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </article>

        <aside className="mi-method-limits">
          <span className="mi-story-eyebrow">A CLEAR BOUNDARY</span>
          <h2>A useful model<br /><em>has clear limits.</em></h2>
          <p>
            Small samples illustrate possibility. Real decisions require
            suitable assumptions, adequate sampling and domain judgment.
            Model output is evidence about a specified computation. It is not
            a guarantee about an uncertain world.
          </p>
          <Link to="/models" className="mi-story-link mi-story-link--light">
            Find the right model <span aria-hidden="true">↗</span>
          </Link>
        </aside>
      </div>
    </div>
  );
}

export default MethodPage;
