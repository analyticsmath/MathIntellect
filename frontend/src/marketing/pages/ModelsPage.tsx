import { useLocation, Link } from "react-router-dom";
import { MODEL_STORIES } from "../film/filmMedia";
import { Photo } from "../film/Photo";
import { TransitionLink } from "../film/TransitionLink";
export function ModelsPage() {
  const { hash } = useLocation(),
    selected =
      MODEL_STORIES.find((model) => model.id === hash.slice(1)) ??
      MODEL_STORIES[0];
  return (
    <div className="mi-models-page">
      <section className="mi-models-intro">
        <h1 tabIndex={-1}>
          Find the mathematics
          <br />
          in your question.
        </h1>
        <nav aria-label="Choose a model" className="mi-model-selector">
          {MODEL_STORIES.map((model) => (
            <Link
              key={model.id}
              to={`/models#${model.id}`}
              aria-current={selected.id === model.id ? "true" : undefined}
            >
              {model.name}
            </Link>
          ))}
        </nav>
      </section>
      <section
        id={selected.id}
        className={`mi-model-feature mi-model-feature--${selected.id}`}
      >
        <Photo id={selected.id} priority />
        <div className="mi-model-feature-copy">
          <span className="mi-model-name">{selected.name}</span>
          <h2>{selected.title}</h2>
          <p>{selected.description}</p>
          {selected.id === "market" && (
            <p className="mi-photo-note">
              Photographic context: archival NYSE trading floor, 1980–2006.
            </p>
          )}
          <Link
            to={
              selected.id === "monte-carlo"
                ? "/workbench"
                : "/app/simulations/new"
            }
            className="mi-text-link"
          >
            {selected.id === "monte-carlo"
              ? "Try the public workbench"
              : "Create a simulation"}{" "}
            <span aria-hidden="true">↗</span>
          </Link>
          <details className="mi-model-details">
            <summary>
              Assumptions &amp; evidence <span aria-hidden="true">+</span>
            </summary>
            <div>
              <h3>Define</h3>
              <ul>
                {selected.parameters.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <h3>Inspect</h3>
              <ul>
                {selected.evidence.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p>
                Outputs depend on the selected engine and configuration. A
                simulation explores its assumptions; it does not certify
                real-world outcomes.
              </p>
            </div>
          </details>
        </div>
      </section>
      <section className="mi-other-models">
        <h2>
          Another question.
          <br />
          Another way in.
        </h2>
        <div className="mi-model-index">
          {MODEL_STORIES.filter((model) => model.id !== selected.id).map(
            (model) => (
              <TransitionLink
                key={model.id}
                to={`/models#${model.id}`}
                actor={model.id}
                className="mi-model-index-item"
              >
                <Photo id={model.id} />
                <div>
                  <h3>{model.name}</h3>
                  <p>{model.question}</p>
                </div>
                <span aria-hidden="true">↗</span>
              </TransitionLink>
            ),
          )}
        </div>
      </section>
    </div>
  );
}
export default ModelsPage;
