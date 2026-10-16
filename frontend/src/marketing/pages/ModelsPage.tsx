import { Link } from "react-router-dom";
import { ModelCinema } from "../film/ModelCinema";

export function ModelsPage() {
  return (
    <div className="mi-models-page">
      <header className="mi-models-intro" data-reveal>
        <h1 tabIndex={-1}>Start with the structure of your question.</h1>
        <p>
          Monte Carlo, Game Theory, Market Dynamics, and Agent Interaction each
          model a different kind of system. Their outputs are only as useful as
          the conditions supplied.
        </p>
      </header>

      <ModelCinema
        variant="detail"
        title="Four model families. Four different questions."
        intro="Scroll through each structure, its inputs, and the outputs it makes available."
      />

      <section className="mi-models-boundary" data-reveal>
        <div>
          <h2>Every result belongs to its model.</h2>
          <p>
            The public experiment demonstrates seeded additive diffusion. The
            other families describe separate model structures and are configured
            in the workspace.
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
