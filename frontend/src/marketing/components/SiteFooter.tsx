import { Link } from "react-router-dom";
export function SiteFooter() {
  return (
    <footer className="pe-footer" id="site-footer">
      <Link to="/" className="pe-footer-brand">
        Math Intellect
      </Link>
      <span>© {new Date().getFullYear()} · By Valtum Studio</span>
      <nav aria-label="Footer navigation">
        <Link to="/models">Models</Link>
        <Link to="/workbench">Workbench</Link>
        <Link to="/method">Method</Link>
        <Link to="/login">Sign in</Link>
      </nav>
    </footer>
  );
}
export default SiteFooter;
