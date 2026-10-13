import { useLocation, Link } from "react-router-dom";
import { MODEL_STORIES } from "../film/filmMedia";
import { Photo } from "../film/Photo";
import { TransitionLink } from "../film/TransitionLink";

export function ModelsPage() {
  const { hash } = useLocation();
  const selected =
    MODEL_STORIES.find((model) => model.id === hash.slice(1)) ??
    MODEL_STORIES[0];

  return (
    <div className="mi-models-page">
      <header className="mi-models-intro">
        <span className="mi-story-eyebrow">THE MODEL INDEX <i /> FIVE WAYS TO ASK</span>
        <h1 tabIndex={-1}>
          The right model starts
          <br />
          with the right question.
        </h1>
        <p>
          Choose the mathematics that describes what changes, what responds
          and what you need to inspect.
        </p>
        <nav aria-label="Choose a model" className="mi-model-selector">
          {MODEL_STORIES.map((model, index) => (
            <Link
              key={model.id}
              to={"/models#" + model.id}
              aria-current={selected.id === model.id ? "page" : undefined}
            >
              <i>{String(index + 1).padStart(2, "0")}</i> {model.name}
            </Link>
          ))}
        </nav>
      </header>

      <section
        id={selected.id}
        className={"mi-model-feature mi-model-feature--" + selected.id}
        aria-label={selected.name + " model"}
      >
        <Photo id={selected.id} priority />
        <div className="mi-model-feature-copy">
          <span className="mi-model-name">SELECTED LENS <i /> {selected.name}</span>
          <h2>{selected.title}</h2>
          <p className="mi-model-question">{selected.question}</p>
          <p>{selected.description}</p>

          <div className="mi-model-spec">
            <div>
              <span>Define</span>
              <ul>{selected.parameters.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
            <div>
              <span>Inspect</span>
              <ul>{selected.evidence.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          </div>

          <p className="mi-model-integrity">
            Outputs depend on the selected engine and configuration. A
            simulation explores its assumptions; it does not certify
            real-world outcomes.
          </p>
          <Link
            to={selected.id === "monte-carlo" ? "/workbench" : "/app/simulations/new"}
            className="mi-story-link mi-story-link--dark"
          >
            {selected.id === "monte-carlo" ? "Try the public workbench" : "Create a simulation"}
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>

      <section className="mi-other-models" aria-labelledby="mi-other-models-title">
        <div className="mi-other-models-head">
          <span className="mi-story-eyebrow">THE OTHER QUESTIONS</span>
          <h2 id="mi-other-models-title">
            Each model opens
            <br />
            a different field.
          </h2>
        </div>
        <div className="mi-model-index">
          {MODEL_STORIES.filter((model) => model.id !== selected.id).map(
            (model, index) => (
              <TransitionLink
                key={model.id}
                to={"/models#" + model.id}
                actor={model.id}
                className="mi-model-index-item"
              >
                <span className="mi-model-index-number">{String(index + 1).padStart(2, "0")}</span>
                <div className="mi-model-index-copy">
                  <h3>{model.name}</h3>
                  <p>{model.question}</p>
                </div>
                <Photo id={model.id} />
                <span className="mi-model-index-arrow" aria-hidden="true">↗</span>
              </TransitionLink>
            ),
          )}
        </div>
      </section>
    </div>
  );
}

export default ModelsPage;
