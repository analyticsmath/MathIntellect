import { Link, useLocation } from "react-router-dom";
import { MODEL_STORIES } from "../film/filmMedia";
import { ModelVisual } from "../film/ModelCinema";
import { useScenario } from "../film/scenario";

export function ModelsPage() {
  const { hash } = useLocation();
  const demo = useScenario();

  return (
    <div className="mi-models-page">
      <header className="mi-page-intro mi-models-intro">
        <h1 tabIndex={-1}>
          Choose the model
          <br />
          that fits the question.
        </h1>
        <p>
          A useful model makes its assumptions visible. Start with the kind of
          uncertainty, decisions or interaction you need to examine.
        </p>
        <nav aria-label="Model families" className="mi-model-selector">
          {MODEL_STORIES.map((model) => (
            <Link
              key={model.id}
              to={"/models#" + model.id}
              aria-current={hash === "#" + model.id ? "location" : undefined}
            >
              {model.name}
            </Link>
          ))}
        </nav>
      </header>

      <div className="mi-model-details">
        {MODEL_STORIES.map((model, index) => (
          <section
            id={model.id}
            key={model.id}
            className={"mi-model-detail mi-model-detail--" + model.id}
            data-reveal
          >
            <div className="mi-model-detail-visual">
              <ModelVisual
                id={model.id}
                paths={demo.current}
                compact={false}
              />
            </div>

            <div className="mi-model-detail-copy">
              <h2>{model.title}</h2>
              <p className="mi-model-question">{model.question}</p>
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
                  The public workbench demonstrates additive diffusion with a
                  Gaussian step, 24 paths and 50 steps.
                </p>
              )}

              <Link
                to={model.id === "monte-carlo" ? "/workbench" : "/app/simulations/new"}
                viewTransition
                className="mi-button mi-button--ink"
              >
                {model.id === "monte-carlo" ? "Open the public experiment" : "Start a simulation"}
              </Link>
            </div>
          </section>
        ))}
      </div>

      <section className="mi-models-boundary">
        <h2>Results belong to their assumptions.</h2>
        <p>
          A simulation describes the calculation you specify. It does not certify
          what will happen outside the model.
        </p>
        <Link to="/method" viewTransition className="mi-text-link">
          Read how the public example works
        </Link>
      </section>
    </div>
  );
}

export default ModelsPage;

