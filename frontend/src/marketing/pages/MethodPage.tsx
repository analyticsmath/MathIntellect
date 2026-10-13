import { Link } from "react-router-dom";
import { KaTeXBlock } from "../../math/KaTeXBlock";

export function MethodPage() {
  return (
    <div className="mi-method-page">
      <header className="mi-page-intro mi-method-intro">
        <h1 tabIndex={-1}>
          Show the inputs.
          <br />
          Show the calculation.
        </h1>
        <p>
          Here is the exact model behind the public workbench, how the paths
          are sampled, and what the result can tell you.
        </p>
        <nav aria-label="Method sections" className="mi-method-nav">
          <a href="#starting-state">Starting state</a>
          <a href="#sampling">Sampling</a>
          <a href="#comparison">Comparison</a>
          <a href="#replay">Replay</a>
          <a href="#limits">Limits</a>
        </nav>
      </header>

      <div className="mi-method-body">
        <article id="starting-state" className="mi-method-section" data-reveal>
          <div><h2>Start from a stated condition.</h2></div>
          <div>
            <p>
              The public example is additive diffusion. Each path begins at
              zero. Drift and volatility are applied over fifty equal steps.
              Twenty four paths use the same seeded random sequence.
            </p>
            <dl className="mi-method-ledger">
              <div><dt>Starting value</dt><dd>0</dd></div>
              <div><dt>Drift</dt><dd>0.05</dd></div>
              <div><dt>Volatility</dt><dd>0.35</dd></div>
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
              increment to the previous value. The time step is one fiftieth
              of the full horizon.
            </p>
            <div className="mi-method-equation">
              <KaTeXBlock math="x_{t+1}=x_t+\mu\Delta t+\sigma\sqrt{\Delta t}\,Z_t" />
              <KaTeXBlock math="Z_t\sim\mathcal{N}(0,1),\qquad\Delta t=\frac{1}{50}" />
            </div>
            <p>
              A Mulberry32 generator produces repeatable uniform values. The
              Box Muller transform uses those values to create Gaussian pairs.
              Each path therefore contains fifty calculated steps after its
              starting value.
            </p>
          </div>
        </article>

        <article id="comparison" className="mi-method-section" data-reveal>
          <div><h2>Compare like with like.</h2></div>
          <div>
            <p>
              The baseline uses volatility 0.35. When you change volatility,
              the drift, seed, number of paths and time horizon remain the same.
              Both sets of paths share one vertical scale.
            </p>
            <p>
              The displayed mean and variance use the twenty four endpoints.
              The variance divides by twenty four, the population variance of
              this displayed set. It is not an unbiased estimate of a larger
              population.
            </p>
            <div className="mi-method-equation">
              <KaTeXBlock math="\bar{x}=\frac{1}{N}\sum_{i=1}^{N}x_i" />
              <KaTeXBlock math="v=\frac{1}{N}\sum_{i=1}^{N}(x_i-\bar{x})^2" />
            </div>
            <p>
              This isolates the setting inside this calculation. It does not
              establish a cause or a probability in the outside world.
            </p>
          </div>
        </article>

        <article id="replay" className="mi-method-section" data-reveal>
          <div><h2>Repeat the same calculation.</h2></div>
          <div>
            <p>
              Replay uses the current input snapshot and the same algorithm.
              The interface confirms a match only after the computed paths and
              statistics agree with the displayed run.
            </p>
            <p>
              This demonstrates repeatability for this browser implementation.
              It does not prove that the assumptions are correct or that
              different software versions will use identical arithmetic.
            </p>
            <Link to="/workbench" viewTransition className="mi-button mi-button--ink">
              Run the experiment
            </Link>
          </div>
        </article>

        <aside id="limits" className="mi-method-limits" data-reveal>
          <h2>A model has a boundary.</h2>
          <p>
            These small samples illustrate one mathematical process. They do
            not forecast events, estimate real market risk or replace domain
            judgment. A result is evidence about the inputs and rules shown here.
          </p>
          <Link to="/models" viewTransition className="mi-text-link mi-text-link--light">
            Explore the model families
          </Link>
        </aside>
      </div>
    </div>
  );
}

export default MethodPage;

