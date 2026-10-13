import { Link } from "react-router-dom";
import { MODEL_STORIES, type ModelId } from "./filmMedia";
import { useScenario } from "./scenario";
import { TrajectoryPlot } from "./TrajectoryPlot";

const marketPhoto = "/media/math-intellect/unsplash/finance-screen.webp";
const marketPhotoPage =
  "https://unsplash.com/photos/financial-stock-market-data-displayed-on-a-screen-EuIqk6LpUU0";

function ModelVisual({
  id,
  paths,
  compact = false,
}: {
  id: ModelId;
  paths: ReturnType<typeof useScenario>["current"];
  compact?: boolean;
}) {
  if (id === "monte-carlo") {
    return (
      <div className="mi-model-visual mi-model-visual--paths">
        <TrajectoryPlot current={paths} />
        <span className="mi-visual-caption">The public workbench calculates these paths</span>
      </div>
    );
  }

  if (id === "game-theory") {
    return (
      <div
        className="mi-model-visual mi-model-visual--matrix"
        role="img"
        aria-label="Example opening payoffs. The first number belongs to Player 1 and the second to Player 2. The rows and columns each show Strategy 1 and Strategy 2."
      >
        <div className="mi-matrix-title">
          <span>Player 2</span>
          <span>Example opening payoffs</span>
        </div>
        <div className="mi-payoff-grid">
          <span aria-hidden="true" />
          <span>Strategy 1</span>
          <span>Strategy 2</span>
          <span className="mi-strategy-label">Player 1<br />Strategy 1</span>
          <strong>4, 1</strong>
          <strong>1, 5</strong>
          <span className="mi-strategy-label">Player 1<br />Strategy 2</span>
          <strong>2, 3</strong>
          <strong>5, 2</strong>
        </div>
        <span className="mi-visual-caption">Player 1 payoff, then Player 2 payoff</span>
      </div>
    );
  }

  if (id === "market") {
    return (
      <figure className={"mi-model-visual mi-model-visual--market" + (compact ? " is-compact" : "")}>
        <img
          src={marketPhoto}
          width="1470"
          height="980"
          alt="A financial market information screen with asset prices and market data"
          loading={compact ? "lazy" : "eager"}
          decoding="async"
        />
        <figcaption>
          <a href={marketPhotoPage} target="_blank" rel="noreferrer">
            Market context photograph by Daniel Brzdęk on Unsplash
          </a>
          <span>The photograph is context, not a model result.</span>
        </figcaption>
      </figure>
    );
  }

  return (
    <div
      className="mi-model-visual mi-model-visual--agents"
      role="img"
      aria-label="Example agent setup with four named agents and their strategies, matching the model builder defaults"
    >
      <div className="mi-agent-setup-heading">
        <span>Example setup</span>
        <strong>100 rounds</strong>
      </div>
      <div className="mi-agent-grid">
        <div><span>Alpha</span><strong>Aggressive</strong></div>
        <div><span>Beta</span><strong>Cooperative</strong></div>
        <div><span>Gamma</span><strong>Tit for Tat</strong></div>
        <div><span>Delta</span><strong>Stochastic</strong></div>
      </div>
      <span className="mi-visual-caption">Four strategies from the model builder</span>
    </div>
  );
}

export { ModelVisual };

export function ModelCinema() {
  const demo = useScenario();

  return (
    <section className="mi-model-cinema" aria-labelledby="mi-model-cinema-title">
      <header className="mi-model-preface" data-reveal>
        <h2 id="mi-model-cinema-title">A different question needs a different model.</h2>
        <p>
          These are the four engines in the model builder. Each begins with a
          different set of assumptions and leaves a different result to inspect.
        </p>
      </header>

      <div className="mi-home-model-grid">
        {MODEL_STORIES.map((model, index) => (
          <article
            key={model.id}
            className={"mi-home-model-card mi-home-model-card--" + model.id}
            data-reveal
            style={{ transitionDelay: Math.min(index * 45, 135) + "ms" }}
          >
            <ModelVisual
              id={model.id}
              paths={demo.current}
              compact={model.id === "market"}
            />
            <div className="mi-home-model-copy">
              <h3>{model.name}</h3>
              <h4>{model.question}</h4>
              <p>{model.description}</p>
              <Link to={"/models#" + model.id} viewTransition>
                Explore {model.name}
              </Link>
            </div>
          </article>
        ))}
      </div>

      <p className="mi-model-context-note">
        The market photograph sets a scene. Every figure in the public experiment
        is calculated from the inputs shown beside it.
      </p>
    </section>
  );
}
