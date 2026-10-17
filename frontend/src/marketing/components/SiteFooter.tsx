import { Link } from "react-router-dom";
export function SiteFooter() {
  return (
    <footer className="mi-footer" id="site-footer">
      <div className="mi-footer-top">
        <p>Explore assumptions through mathematical simulation.</p>
        <nav aria-label="Footer navigation">
          <Link to="/models">Models</Link>
          <Link to="/workbench">Try an example</Link>
          <Link to="/method">How it works</Link>
          <Link to="/login">Sign in</Link>
        </nav>
      </div>
      <Link to="/" className="mi-footer-wordmark">
        Math Intellect
      </Link>
      <div className="mi-footer-bottom">
        <span>© {new Date().getFullYear()} Math Intellect</span>
        <span>By Valtum Studio</span>
      </div>
    </footer>
  );
}
export default SiteFooter;
