import { Link } from "react-router-dom";
import { MODEL_STORIES } from "../film/filmMedia";
import { ModelVisual } from "../film/ModelCinema";

export function ModelsPage() {
  return (
    <div className="mi-models-page">
      <header className="mi-models-intro">
        <div>
          <h1 tabIndex={-1}>Choose a model that fits the system.</h1>
          <p>
            Different questions need different assumptions. Explore the four
            model families, then open the public experiment or continue in your
            workspace.
          </p>
          <Link to="/workbench" viewTransition className="mi-button mi-button--signal">
            Open the public experiment <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <p className="mi-models-intro-note">
          Every model describes the rules you supply. Its outputs belong to
          those rules.
        </p>
      </header>

      <div className="mi-model-details">
        {MODEL_STORIES.map((model) => (
          <section
            id={model.id}
            key={model.id}
            className={"mi-model-detail mi-model-detail--" + model.id}
            data-reveal
          >
            <div className="mi-model-detail-visual">
              <ModelVisual id={model.id} />
            </div>

            <div className="mi-model-detail-copy">
              <h2>{model.name}</h2>
              <p className="mi-model-question">{model.title}</p>
              <p>{model.description}</p>

              <div className="mi-model-specs">
                <div>
                  <h3>Inputs</h3>
                  <ul>{model.inputs.map((item) => <li key={item}>{item}</li>)}</ul>
                </div>
                <div>
                  <h3>Outputs</h3>
                  <ul>{model.outputs.map((item) => <li key={item}>{item}</li>)}</ul>
                </div>
              </div>

              {model.id === "monte-carlo" && (
                <p className="mi-model-note">
                  The public example uses additive diffusion with a Gaussian
                  step, 24 paths, 50 steps, and seed 42.
                </p>
              )}

              <Link
                to={model.id === "monte-carlo" ? "/workbench" : "/app/simulations/new"}
                viewTransition
                className="mi-button mi-button--ink"
              >
                {model.id === "monte-carlo"
                  ? "Open the public experiment"
                  : "Build this model"}
                <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </section>
        ))}
      </div>

      <section className="mi-models-boundary" data-reveal>
        <h2>Keep the assumptions beside the result.</h2>
        <p>
          A simulation describes the calculation you specify. It does not
          certify what will happen outside the model.
        </p>
        <Link to="/method" viewTransition className="mi-text-link">
          Read how the public example works <span aria-hidden="true">↗</span>
        </Link>
      </section>
    </div>
  );
}

export default ModelsPage;
