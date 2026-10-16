import { Link } from "react-router-dom";
import { KaTeXBlock } from "../../math/KaTeXBlock";
import { useScenario } from "../film/scenario";

export function MethodPage() {
  const demo = useScenario();

  return (
    <div className="mi-method-page">
      <header className="mi-method-intro">
        <div className="mi-method-intro-copy">
          <h1 tabIndex={-1}>What the calculation assumes.</h1>
          <p>
            The public workbench runs a seeded additive-diffusion example. This
            page shows its starting conditions, sampling rule, comparison, and
            limits.
          </p>
          <nav aria-label="Method contents" className="mi-method-nav">
            <a href="#starting-state">Starting conditions</a>
            <a href="#sampling">Sampling rule</a>
            <a href="#comparison">Comparison</a>
            <a href="#replay">Replay</a>
            <a href="#limits">Limits</a>
          </nav>
        </div>
        <div className="mi-method-equation-stage" data-reveal>
          <p>At each step</p>
          <KaTeXBlock math="x_{t+1}=x_t+\mu\Delta t+\sigma\sqrt{\Delta t}\,Z_t" />
          <KaTeXBlock math="Z_t\sim\mathcal{N}(0,1),\qquad\Delta t=\frac{1}{50}" />
        </div>
      </header>

      <div className="mi-method-body">
        <article id="starting-state" className="mi-method-section" data-reveal>
          <div><h2>Start from stated conditions.</h2></div>
          <div>
            <p>
              Each of the 24 paths begins at zero. Drift and volatility are
              applied over fifty equal steps. The baseline volatility is 0.35;
              the public control changes volatility only.
            </p>
            <dl className="mi-method-ledger">
              <div><dt>Starting value</dt><dd>0</dd></div>
              <div><dt>Drift</dt><dd>0.05</dd></div>
              <div><dt>Baseline volatility</dt><dd>0.35</dd></div>
              <div><dt>Seed</dt><dd>42</dd></div>
              <div><dt>Paths</dt><dd>24</dd></div>
              <div><dt>Steps</dt><dd>50</dd></div>
            </dl>
          </div>
        </article>

        <article id="sampling" className="mi-method-section" data-reveal>
          <div><h2>Build each path one step at a time.</h2></div>
          <div>
            <p>
              At each step, the model adds a drift increment and a Gaussian
              increment to the previous value. The time step is one fiftieth of
              the full horizon.
            </p>
            <div className="mi-method-equation">
              <KaTeXBlock math="x_{t+1}=x_t+\mu\Delta t+\sigma\sqrt{\Delta t}\,Z_t" />
              <KaTeXBlock math="Z_t\sim\mathcal{N}(0,1),\qquad\Delta t=\frac{1}{50}" />
            </div>
            <p>
              A Mulberry32 generator supplies repeatable uniform values. The
              Box–Muller transform converts them to Gaussian pairs. Each path
              contains fifty calculated steps after its starting value.
            </p>
          </div>
        </article>

        <article id="comparison" className="mi-method-section" data-reveal>
          <div><h2>Compare like with like.</h2></div>
          <div>
            <p>
              The baseline uses volatility 0.35. When volatility changes, drift,
              seed, path count, and horizon remain fixed. Both sets of paths
              share one vertical scale.
            </p>
            <p>
              The displayed mean and variance are calculated from the 24
              endpoints in each run. They summarize this finite sample.
            </p>
            <Link to="/workbench" viewTransition className="mi-text-link">
              Change a condition in the workbench <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </article>

        <article id="replay" className="mi-method-section mi-method-replay" data-reveal>
          <div><h2>Repeat the exact inputs.</h2></div>
          <div>
            <p>
              The seed fixes the random sequence. Replay the current inputs to
              verify that the same paths and endpoint statistics return.
            </p>
            <button className="mi-button mi-button--ink" type="button" onClick={demo.replay}>
              Replay this run <span aria-hidden="true">↻</span>
            </button>
            <p className="mi-repeat-status" role="status">
              {demo.replayed
                ? "Recomputed. The displayed paths and statistics match."
                : "The current input snapshot is ready to replay."}
            </p>
          </div>
        </article>

        <article id="limits" className="mi-method-section mi-method-limit" data-reveal>
          <div><h2>A simulation describes its assumptions.</h2></div>
          <div>
            <p>
              This example uses an additive-diffusion model, a Gaussian
              increment, fixed drift, and a finite set of seeded paths. Its
              outputs do not validate those assumptions or predict a real-world
              outcome.
            </p>
            <p>
              A different question may require a different model family,
              parameters, or observed data. The result should be read with its
              inputs in view.
            </p>
            <Link to="/models" viewTransition className="mi-text-link">
              Explore the model families <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}

export default MethodPage;
