import { Link } from "react-router-dom";
import { Photo } from "../film/Photo";
import { FILM_PHOTOS } from "../film/filmMedia";
export function SiteFooter() {
  const credits = Object.values(FILM_PHOTOS).filter(
    (photo, index, all) =>
      all.findIndex((item) => item.url === photo.url) === index,
  );
  return (
    <footer id="site-footer" className="mi-finale">
      <div className="mi-finale-scene">
        <Photo id="monte-carlo" actor={false} />
        <div className="mi-finale-copy">
          <h2>
            Make the unknown
            <br />
            something you
            <br />
            can work with.
          </h2>
          <Link to="/workbench" className="mi-text-link">
            Try the workbench ↗
          </Link>
        </div>
      </div>
      <div className="mi-finale-identity" aria-label="Math Intellect">
        <span>MATH</span>
        <span>INTELLECT</span>
      </div>
      <div className="mi-footer-utility">
        <nav aria-label="Footer navigation">
          <Link to="/models">Models</Link>
          <Link to="/workbench">Workbench</Link>
          <Link to="/method">Method</Link>
          <Link to="/signup">Start modeling ↗</Link>
        </nav>
        <span>© {new Date().getFullYear()} Math Intellect</span>
      </div>
      <details className="mi-footer-credits">
        <summary>Photography &amp; context</summary>
        <p>
          Photographs are editorial illustrations, not simulation outputs or
          Math Intellect customer portraits. The NYSE image is archival.
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
