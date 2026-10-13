import { Link } from "react-router-dom";

const photoUrl =
  "https://unsplash.com/photos/financial-stock-market-data-displayed-on-a-screen-EuIqk6LpUU0";

export function SiteFooter() {
  return (
    <footer id="site-footer" className="mi-finale">
      <div className="mi-finale-statement">
        <h2>Keep the question clear.</h2>
        <p>Keep every condition beside the result.</p>
        <Link to="/workbench" viewTransition className="mi-button mi-button--light">
          Open the workbench
        </Link>
      </div>

      <div className="mi-footer-main">
        <Link to="/" viewTransition className="mi-footer-brand">
          Math Intellect
        </Link>
        <nav aria-label="Footer navigation">
          <Link to="/models" viewTransition>Models</Link>
          <Link to="/workbench" viewTransition>Workbench</Link>
          <Link to="/method" viewTransition>Method</Link>
          <Link to="/signup" viewTransition>Start modeling</Link>
        </nav>
        <span>© {new Date().getFullYear()} Math Intellect</span>
      </div>

      <details className="mi-footer-credits">
        <summary>Photo credit</summary>
        <p>
          Market context photograph by{" "}
          <a href={photoUrl} target="_blank" rel="noreferrer">
            Daniel Brzdęk on Unsplash
          </a>
          . It illustrates a market data setting and is not a model result.
        </p>
      </details>
    </footer>
  );
}

export default SiteFooter;

