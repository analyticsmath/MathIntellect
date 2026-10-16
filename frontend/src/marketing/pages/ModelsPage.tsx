import { Link } from "react-router-dom";
import { ModelCinema } from "../film/ModelCinema";

export function ModelsPage() {
  return (
    <div className="mi-models-page">
      <header className="mi-models-intro" data-reveal>
        <h1 tabIndex={-1}>Choose a structure that fits the question.</h1>
        <p>
          Monte Carlo, Game Theory, Market Dynamics, and Agent Interaction model
          different systems. Each structure needs different inputs and produces
          different kinds of evidence.
        </p>
      </header>

      <ModelCinema
        variant="detail"
        title="Different models. Different evidence."
        intro="Scroll through each structure, the inputs it uses, and the outputs it can provide. The diagrams describe model structure, not live calculations."
      />

      <section className="mi-models-boundary" data-reveal>
        <div>
          <h2>Every result belongs to its model.</h2>
          <p>
            The public experiment demonstrates seeded additive diffusion. The
            other families describe separate structures and are configured in
            the workspace.
          </p>
        </div>
        <Link to="/method" viewTransition className="mi-text-link">
          Read the public example’s method <span aria-hidden="true">↗</span>
        </Link>
      </section>
    </div>
  );
}

export default ModelsPage;
