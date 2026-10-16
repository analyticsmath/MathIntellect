import { Link } from "react-router-dom";

const credits = [
  {
    name: "Pete Godfrey · impact-origin and impact-aftermath images",
    href: "https://unsplash.com/photos/milk-splash-frozen-in-time-against-black-background-6ieRRBACAqM",
  },
  {
    name: "Pete Godfrey · impact-aftermath image",
    href: "https://unsplash.com/photos/milk-splash-with-droplets-against-black-background-UAjcZ1qBzE0",
  },
  {
    name: "Adam Rutkowski · game-theory image",
    href: "https://unsplash.com/photos/two-men-sitting-at-a-table-with-a-laptop-r_WVQzfgClw",
  },
  {
    name: "Jakub Żerdzicki · market image",
    href: "https://unsplash.com/photos/trader-analyzing-stock-market-charts-on-multiple-screens-j_hho1mE47s",
  },
  {
    name: "James Wainscoat · murmuration image",
    href: "https://unsplash.com/photos/b7MZ6iGIoSI",
  },
  {
    name: "Eric Prouzet · measurement image",
    href: "https://unsplash.com/photos/a-close-up-of-an-old-fashioned-radio-US1ndpdptUI",
  },
];

export function SiteFooter() {
  return (
    <footer id="site-footer" className="mi-finale">
      <div className="mi-finale-statement">
        <h2>Keep the assumptions in view.</h2>
        <p>Build a model. Inspect the paths. Understand what the result can say.</p>
        <Link to="/workbench" viewTransition className="mi-button mi-button--light">
          Open the workbench <span aria-hidden="true">↗</span>
        </Link>
      </div>

      <Link to="/" viewTransition className="mi-footer-wordmark" aria-label="Math Intellect home">
        Math Intellect
      </Link>

      <div className="mi-footer-main">
        <nav aria-label="Footer navigation">
          <Link to="/models" viewTransition>Models</Link>
          <Link to="/workbench" viewTransition>Workbench</Link>
          <Link to="/method" viewTransition>Method</Link>
          <Link to="/signup" viewTransition>Create an account</Link>
        </nav>
        <span>© {new Date().getFullYear()} Math Intellect</span>
      </div>

      <details className="mi-footer-credits">
        <summary>Photograph credits</summary>
        <ul>
          {credits.map((credit) => (
            <li key={credit.href}>
              <a href={credit.href} target="_blank" rel="noreferrer">
                {credit.name}
              </a>
            </li>
          ))}
        </ul>
        <p>All photographs provide editorial context and are not simulation output.</p>
      </details>
    </footer>
  );
}

export default SiteFooter;
