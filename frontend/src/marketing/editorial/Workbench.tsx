import { useRef, useState } from "react";
import { useScenario } from "../film/scenario";
import { Photo } from "./Photo";
import { Arrow, TextLink } from "./Shared";
import { useEditorialMotion } from "./useEditorialMotion";
export function EditorialWorkbench() {
  const root = useRef<HTMLDivElement>(null);
  useEditorialMotion(root);
  const demo = useScenario();
  const [saveStatus, setSaveStatus] = useState("");
  const [showAll, setShowAll] = useState(false);
  const save = () => {
    try {
      const blob = new Blob(
        [
          JSON.stringify(
            {
              model: "additive-diffusion",
              inputs: {
                volatility: demo.sigma,
                drift: demo.mu,
                seed: demo.seed,
                steps: 50,
                paths: demo.paths,
              },
              results: demo.current,
            },
            null,
            2,
          ),
        ],
        { type: "application/json" },
      );
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "math-intellect-scenario.json";
      anchor.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setSaveStatus(
        "Your current inputs and calculated results have been prepared for download.",
      );
    } catch {
      setSaveStatus(
        "Your browser could not save the result. Please try again.",
      );
    }
  };
  return (
    <div ref={root} className="mi-workbench-page">
      <header className="mi-page-intro">
        <h1 tabIndex={-1}>
          <span className="mi-line">
            <span>What changes</span>
          </span>
          <span className="mi-line">
            <span>when you do?</span>
          </span>
        </h1>
        <div>
          <p>
            Change an assumption. See what follows. This public example
            calculates 24 paths from the same starting value, right here in your
            browser.
          </p>
          <TextLink to="/method">Understand the calculation</TextLink>
        </div>
      </header>
      <section
        className="mi-experiment"
        aria-label="Interactive additive diffusion example"
      >
        <div className="mi-experiment-controls">
          <h2>Your conditions.</h2>
          <p>
            Every path starts at zero and takes 50 steps. The baseline uses
            volatility 0.35 with your current drift and seed.
          </p>
          <label htmlFor="example-volatility">
            Volatility <output>{demo.sigma.toFixed(2)}</output>
          </label>
          <input
            id="example-volatility"
            aria-label="Volatility"
            type="range"
            min="0.05"
            max="0.9"
            step="0.01"
            value={demo.sigma}
            onChange={(e) => demo.setSigma(Number(e.target.value))}
          />
          <p className="mi-control-help">
            The scale of the random variation at each step.
          </p>
          <label htmlFor="example-drift">
            Drift <output>{demo.mu.toFixed(2)}</output>
          </label>
          <input
            id="example-drift"
            aria-label="Drift"
            type="range"
            min="-0.2"
            max="0.2"
            step="0.01"
            value={demo.mu}
            onChange={(e) => demo.setMu(Number(e.target.value))}
          />
          <p className="mi-control-help">
            A steady directional change at each step.
          </p>
          <label htmlFor="example-seed">Random seed</label>
          <div className="mi-seed-row">
            <input
              id="example-seed"
              type="number"
              min="0"
              max="1000000"
              step="1"
              value={demo.seed}
              onChange={(e) => {
                const value = e.currentTarget.valueAsNumber;
                if (Number.isFinite(value))
                  demo.setSeed(
                    Math.max(0, Math.min(1000000, Math.round(value))),
                  );
              }}
            />
            <button
              onClick={() => demo.setSeed((demo.seed + 1) % 1000001)}
              aria-label="Use the next seed"
            >
              ↻
            </button>
          </div>
          <p className="mi-control-help">
            Keep it fixed to compare using the same random samples.
          </p>
          <button className="mi-reset-button" onClick={demo.reset}>
            Reset conditions <span aria-hidden="true">↺</span>
          </button>
        </div>
        <div className="mi-experiment-results">
          <h2>
            A new set
            <br />
            of possibilities.
          </h2>
          <dl className="mi-result-metrics">
            <div>
              <dt>Mean endpoint</dt>
              <dd>{demo.current.mean.toFixed(4)}</dd>
            </div>
            <div>
              <dt>Current endpoint variance</dt>
              <dd>{demo.current.variance.toFixed(4)}</dd>
            </div>
            <div>
              <dt>Baseline endpoint variance</dt>
              <dd>{demo.baseline.variance.toFixed(4)}</dd>
            </div>
            <div>
              <dt>Variance change</dt>
              <dd>
                {demo.current.variance - demo.baseline.variance > 0 ? "+" : ""}
                {(demo.current.variance - demo.baseline.variance).toFixed(4)}
              </dd>
            </div>
          </dl>
          <div className="mi-calculation-actions">
            <button className="mi-pill" onClick={demo.replay}>
              Repeat this calculation <span aria-hidden="true">↻</span>
            </button>
            <button className="mi-text-link" onClick={save}>
              Download this result <Arrow diagonal />
            </button>
          </div>
          <p className="mi-calculation-status" role="status">
            {demo.replayed
              ? "Recalculated. Every path and statistic matches."
              : "Change a condition to recalculate the result."}
          </p>
          {saveStatus && <p role="status">{saveStatus}</p>}
          <details
            open={showAll}
            onToggle={(e) => setShowAll(e.currentTarget.open)}
            className="mi-endpoints"
          >
            <summary>
              Inspect all 24 endpoints <span aria-hidden="true">+</span>
            </summary>
            <table>
              <caption>Final values after 50 steps</caption>
              <thead>
                <tr>
                  <th scope="col">Path</th>
                  <th scope="col">Current</th>
                  <th scope="col">Baseline</th>
                </tr>
              </thead>
              <tbody>
                {demo.current.paths.map((p, i) => (
                  <tr key={i}>
                    <th scope="row">{i + 1}</th>
                    <td>{p.at(-1)!.toFixed(4)}</td>
                    <td>{demo.baseline.paths[i].at(-1)!.toFixed(4)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </details>
        </div>
      </section>
      <section className="mi-example-context">
        <figure data-parallax>
          <Photo id="birds" sizes="(max-width:800px) 100vw, 40vw" />
        </figure>
        <div data-reveal>
          <h2>
            A calculation
            <br />
            has a boundary.
          </h2>
          <p>
            This is a seeded additive diffusion example. It assumes constant
            drift and volatility, independent normal increments and a fixed
            number of sampled paths.
          </p>
          <p>
            It does not use observed market data or predict a real event. Its
            purpose is to make the relationship between inputs and results
            easier to inspect.
          </p>
          <TextLink to="/method">Read the method</TextLink>
          <TextLink to="/models">Explore the account models</TextLink>
        </div>
      </section>
    </div>
  );
}
