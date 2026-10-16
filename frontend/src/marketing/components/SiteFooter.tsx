import { Link } from "react-router-dom";

export function SiteFooter() {
  return (
    <footer id="site-footer" className="mi-finale">
      <div className="mi-finale-statement">
        <h2>Keep the conditions beside the result.</h2>
        <p>Build a model. Follow its paths. Know what the output can say.</p>
        <Link to="/workbench" viewTransition className="mi-button mi-button--light">
          Open the workbench <span aria-hidden="true">↗</span>
        </Link>
      </div>

      <div className="mi-footer-main">
        <Link to="/" viewTransition className="mi-footer-wordmark" aria-label="Math Intellect home">
          Math Intellect
        </Link>
        <nav aria-label="Footer navigation">
          <Link to="/models" viewTransition>Models</Link>
          <Link to="/workbench" viewTransition>Workbench</Link>
          <Link to="/method" viewTransition>Method</Link>
          <Link to="/signup" viewTransition>Create an account</Link>
        </nav>
        <span className="mi-footer-credit">© {new Date().getFullYear()} Math Intellect · By Valtum Studio</span>
      </div>
    </footer>
  );
}

export default SiteFooter;
