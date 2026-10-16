import { Link } from "react-router-dom";

export function SiteFooter() {
  return (
    <footer id="site-footer" className="mi-finale">
      <div className="mi-finale-statement">
        <div className="mi-finale-copy">
          <h2>Make the assumptions visible.</h2>
          <p>Build a model. Follow its outcomes. Inspect what shaped them.</p>
        </div>
        <Link to="/workbench" viewTransition className="mi-button mi-button--light">
          Open the workbench <span aria-hidden="true">↗</span>
        </Link>
      </div>

      <div className="mi-footer-wordmark-line">
        <Link to="/" viewTransition aria-label="Math Intellect home">Math Intellect</Link>
      </div>

      <div className="mi-footer-main">
        <span className="mi-footer-credit">© {new Date().getFullYear()} Math Intellect · By Valtum Studio</span>
        <nav aria-label="Footer navigation">
          <Link to="/models" viewTransition>Models</Link>
          <Link to="/workbench" viewTransition>Workbench</Link>
          <Link to="/method" viewTransition>Method</Link>
          <Link to="/signup" viewTransition>Create an account</Link>
        </nav>
      </div>
    </footer>
  );
}

export default SiteFooter;
