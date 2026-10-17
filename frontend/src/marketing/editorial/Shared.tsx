import { Link } from "react-router-dom";
import { Photo } from "./Photo";
export function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <span aria-hidden="true">{diagonal ? "↗" : "→"}</span>;
}
export function TextLink({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) {
  return (
    <Link className="mi-text-link" to={to}>
      {children}
      <Arrow diagonal />
    </Link>
  );
}
export function Invitation() {
  return (
    <section className="mi-invitation">
      <div data-reveal>
        <h2>
          Start with
          <br />a question.
        </h2>
        <p>
          Build a simulation. Explore an assumption.
          <br />
          Find the next thing worth asking.
        </p>
        <Link to="/signup" className="mi-pill">
          Create an account <Arrow diagonal />
        </Link>
      </div>
      <figure data-parallax>
        <Photo id="dunes" sizes="(max-width:800px) 100vw, 55vw" />
      </figure>
    </section>
  );
}
