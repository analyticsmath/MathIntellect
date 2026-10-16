import { Link } from "react-router-dom";
import { KaTeXBlock } from "../../math/KaTeXBlock";

export function MethodPage() {
  return (
    <div className="mi-method-page">
      <header className="mi-method-intro">
        <div className="mi-method-intro-copy">
          <h1 tabIndex={-1}>Every result has a method.</h1>
          <p>
            This is the calculation behind the public workbench: its starting
            conditions, sampling rule, comparison, and limits.
          </p>
          <nav aria-label="Method contents" className="mi-method-nav">
            <a href="#starting-state">Starting conditions</a>
            <a href="#sampling">Sampling</a>
            <a href="#comparison">Comparison</a>
            <a href="#replay">Replay</a>
            <a href="#limits">Limits</a>
          </nav>
        </div>

        <figure className="mi-method-hero-art" data-reveal>
          <picture>
            <source
              type="image/webp"
              srcSet="/media/math-intellect/cinematic/optimized/webp/mi-film-method-measurement-960.webp 960w, /media/math-intellect/cinematic/optimized/webp/mi-film-method-measurement-1920.webp 1920w"
              sizes="(max-width: 900px) 100vw, 48vw"
            />
            <img
              src="/media/math-intellect/cinematic/optimized/webp/mi-film-method-measurement-1920.webp"
              width="1920"
              height="1280"
              alt="A close view of an old-fashioned radio"
              loading="lazy"
              decoding="async"
            />
          </picture>
          <figcaption>
            <a href="https://unsplash.com/photos/a-close-up-of-an-old-fashioned-radio-US1ndpdptUI" target="_blank" rel="noreferrer">
              Photograph by Eric Prouzet
            </a>
            <span>Editorial context, not a data display.</span>
          </figcaption>
        </figure>
      </header>

      <div className="mi-method-body">
        <article id="starting-state" className="mi-method-section" data-reveal>
          <div><h2>Start from stated conditions.</h2></div>
          <div>
            <p>
              The public example is additive diffusion. Each path begins at
              zero. Drift and volatility are applied over fifty equal steps.
              Twenty-four paths use the same seeded random sequence.
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
          <div><h2>Build every path one step at a time.</h2></div>
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
              Box–Muller transform uses those values to create Gaussian pairs.
              Each path contains fifty calculated steps after its starting value.
            </p>
          </div>
        </article>

        <article id="comparison" className="mi-method-section" data-reveal>
          <div><h2>Compare like with like.</h2></div>
          <div>
            <p>
              The baseline uses volatility 0.35. When volatility changes, drift,
              seed, path count, and time horizon remain the same. Both sets of
              paths share one vertical scale.
            </p>
            <p>
              The displayed mean and variance use the twenty-four endpoints.
              Variance divides by 24: the population variance of this displayed
              set, not an unbiased estimate of a larger population.
            </p>
            <div className="mi-method-equation">
              <KaTeXBlock math="\bar{x}=\frac{1}{N}\sum_{i=1}^{N}x_i" />
              <KaTeXBlock math="v=\frac{1}{N}\sum_{i=1}^{N}(x_i-\bar{x})^2" />
            </div>
            <p>
              This isolates a setting inside the calculation. It does not
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
              Run the experiment <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </article>

        <aside id="limits" className="mi-method-limits" data-reveal>
          <h2>A model has a boundary.</h2>
          <p>
            These small samples illustrate one mathematical process. They do not
            forecast events, estimate real market risk, or replace domain
            judgment. A result is evidence about the inputs and rules shown here.
          </p>
          <Link to="/models" viewTransition className="mi-text-link mi-text-link--light">
            Explore the model families <span aria-hidden="true">↗</span>
          </Link>
        </aside>
      </div>
    </div>
  );
}

export default MethodPage;
