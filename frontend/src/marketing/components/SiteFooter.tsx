import { Link } from "react-router-dom";
import { FILM_PHOTOS } from "../film/filmMedia";

export function SiteFooter() {
  const credits = [
    FILM_PHOTOS["monte-carlo"],
    FILM_PHOTOS["game-theory"],
    FILM_PHOTOS.market,
    FILM_PHOTOS.conflict,
    FILM_PHOTOS.custom,
    FILM_PHOTOS.method,
  ];

  return (
    <footer id="site-footer" className="mi-finale">
      <section className="mi-finale-statement" aria-labelledby="mi-finale-title">
        <div className="mi-finale-thread" aria-hidden="true">
          <svg viewBox="0 0 760 132" focusable="false">
            <path d="M2 66H151C211 66 208 17 267 17S324 115 388 115s67-49 128-49h241" />
            <path d="M2 66H151C211 66 208 41 267 41S324 91 388 91s67-25 128-25h241" />
            <path d="M2 66H151C211 66 208 66 267 66S324 66 388 66s67 0 128 0h241" />
            <path d="M2 66H151C211 66 208 91 267 91S324 41 388 41s67 25 128 25h241" />
            <path d="M2 66H151C211 66 208 115 267 115S324 17 388 17s67 49 128 49h241" />
            <circle cx="151" cy="66" r="5" />
          </svg>
        </div>
        <span className="mi-story-eyebrow">THE QUESTION STAYS WITH YOU</span>
        <h2 id="mi-finale-title">
          Make uncertainty
          <br />
          <em>something you can work with.</em>
        </h2>
        <Link to="/workbench" className="mi-story-link mi-story-link--light">
          Enter the workbench <span aria-hidden="true">↗</span>
        </Link>
      </section>

      <div className="mi-finale-identity" aria-label="Math Intellect">
        <span>MATH</span><span>INTELLECT</span>
      </div>

      <div className="mi-footer-utility">
        <nav aria-label="Footer navigation">
          <Link to="/models">Models</Link>
          <Link to="/workbench">Workbench</Link>
          <Link to="/method">Method</Link>
          <Link to="/signup">Start modeling <span aria-hidden="true">↗</span></Link>
        </nav>
        <span>© {new Date().getFullYear()} Math Intellect</span>
      </div>

      <details className="mi-footer-credits">
        <summary>Photography &amp; visual context</summary>
        <p>
          The opening work scene is illustrative artwork, not a customer
          portrait. The plotted paths are computed from the displayed inputs.
          Context photographs are editorial illustrations; the NYSE image is
          archival.
        </p>
        <ul>
          {credits.map((photo) => (
            <li key={photo.url}>
              <a href={photo.url} target="_blank" rel="noreferrer">
                {photo.credit} ↗
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      </details>
    </footer>
  );
}

export default SiteFooter;
