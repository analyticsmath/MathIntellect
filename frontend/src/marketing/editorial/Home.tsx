import { useRef } from "react";
import { Link } from "react-router-dom";
import { Photo, type PhotoId } from "./Photo";
import { Arrow, Invitation, TextLink } from "./Shared";
import { useEditorialMotion } from "./useEditorialMotion";
import { ModelRail } from "./ModelRail";

const perspectives: PhotoId[] = [
  "surfer",
  "shadows",
  "currents",
  "climbers",
  "traffic",
  "observer",
];
function Reading({ text }: { text: string }) {
  return (
    <p data-reading>
      {text.split(" ").map((word, i) => (
        <span key={i}>{word} </span>
      ))}
    </p>
  );
}
export function EditorialHome() {
  const root = useRef<HTMLDivElement>(null);
  useEditorialMotion(root);
  return (
    <div ref={root} className="mi-home">
      <section className="mi-hero" aria-labelledby="home-title">
        <div className="mi-hero-stage">
          <figure className="mi-hero-media">
            <Photo id="vanes" priority sizes="(max-width:800px) 130vh, 100vw" />
          </figure>
          <div className="mi-hero-shade" />
          <h1 id="home-title" tabIndex={-1} className="mi-hero-title">
            <span className="mi-line">
              <span>Explore the</span>
            </span>
            <span className="mi-line">
              <span>possible.</span>
            </span>
          </h1>
          <div className="mi-hero-type-plane" aria-hidden="true">
            <div className="mi-hero-title">
              <span className="mi-line">
                <span>Explore the</span>
              </span>
              <span className="mi-line">
                <span>possible.</span>
              </span>
            </div>
          </div>
          <div className="mi-hero-bottom">
            <p>
              Mathematical simulation for curious minds.
              <br />
              Change an assumption. See what follows.
            </p>
            <Link to="/workbench" className="mi-round-action">
              <span>
                Try an
                <br />
                example
              </span>
              <Arrow diagonal />
            </Link>
            <a
              className="mi-hero-scroll"
              href="#a-different-question"
              aria-label="Discover Math Intellect"
            >
              <span aria-hidden="true">↓</span>
            </a>
          </div>
          <div className="mi-hero-progress" aria-hidden="true">
            <i />
          </div>
        </div>
      </section>
      <section id="a-different-question" className="mi-introduction">
        <h2 data-reveal>
          A different question.
          <br />
          <span>A new possibility.</span>
        </h2>
        <div className="mi-introduction-bottom">
          <figure data-parallax>
            <Photo id="mechanism" sizes="(max-width:800px) 80vw, 32vw" />
          </figure>
          <div>
            <Reading text="What happens when uncertainty grows? When a player changes strategy? When individual choices meet?" />
            <p data-reveal>
              Math Intellect turns a question into a simulation. Choose a model,
              set its conditions, and explore the consequences of your
              assumptions.
            </p>
            <TextLink to="/models">Find your model</TextLink>
          </div>
        </div>
      </section>
      <section className="mi-crawler" aria-labelledby="change-title">
        <div className="mi-crawler-stage">
          <div className="mi-crawler-copy">
            <h2 id="change-title">
              <span>Change one thing.</span>
              <br />
              <em>See what follows.</em>
            </h2>
            <p>
              One assumption can open up
              <br />a different set of possibilities.
            </p>
          </div>
          <figure className="mi-crawl-photo mi-crawl-a">
            <Photo id="runner" sizes="35vw" />
          </figure>
          <figure className="mi-crawl-photo mi-crawl-b">
            <Photo id="birds" sizes="30vw" />
          </figure>
          <figure className="mi-crawl-photo mi-crawl-c">
            <Photo id="glider" sizes="50vw" />
          </figure>
          <figure className="mi-crawl-photo mi-crawl-d">
            <Photo id="observer" sizes="30vw" />
          </figure>
          <figure className="mi-crawl-photo mi-crawl-e">
            <Photo id="currents" sizes="30vw" />
          </figure>
          <figure className="mi-crawl-photo mi-crawl-f">
            <Photo id="shadows" sizes="25vw" />
          </figure>
        </div>
      </section>
      <section className="mi-perspectives" aria-labelledby="perspectives-title">
        <h2 id="perspectives-title" data-reveal>
          Look{" "}
          <span className="mi-inline-photo">
            <Photo id="surfer" decorative sizes="20vw" />
          </span>{" "}
          again.
        </h2>
        <div className="mi-contact-window">
          <div className="mi-contact-track">
            {perspectives.map((id) => (
              <figure key={id}>
                <Photo
                  id={id}
                  sizes={
                    id === "shadows" || id === "currents" || id === "traffic"
                      ? "(max-width:800px) 60vw, 28vw"
                      : "(max-width:800px) 125vw, 50vw"
                  }
                />
              </figure>
            ))}
          </div>
        </div>
        <div className="mi-perspectives-copy">
          <Reading text="A result is a starting point. Shift the conditions. Run the model again. Find the next question worth asking." />
          <TextLink to="/workbench">See what changes</TextLink>
        </div>
      </section>
      <ModelRail />
      <section
        className="mi-process"
        aria-label="From assumptions to understanding"
      >
        <article className="mi-process-panel">
          <figure>
            <Photo id="mechanism" sizes="(max-width:800px) 160vh, 120vw" />
          </figure>
          <div className="mi-process-panel-copy">
            <h2 data-reveal>
              Set the
              <br />
              <em>conditions.</em>
            </h2>
            <div data-reveal>
              <p>
                Choose a model. Enter its parameters. Name your run. Make the
                assumptions yours to examine.
              </p>
              <TextLink to="/models">Choose your model</TextLink>
            </div>
          </div>
        </article>
        <article className="mi-process-panel">
          <figure>
            <Photo id="climbers" sizes="(max-width:800px) 140vh, 100vw" />
          </figure>
          <div className="mi-process-panel-copy">
            <h2 data-reveal>
              Follow the
              <br />
              <em>consequences.</em>
            </h2>
            <div data-reveal>
              <p>
                Inspect the summary and available visualizations. Keep a run to
                revisit the conditions that shaped it.
              </p>
              <TextLink to="/signup">Build your first simulation</TextLink>
            </div>
          </div>
        </article>
      </section>
      <section className="mi-image-takeover">
        <div className="mi-takeover-stage">
          <figure className="mi-takeover-image">
            <Photo id="glider" sizes="(max-width:800px) 190vh, 120vw" />
          </figure>
          <div className="mi-takeover-copy">
            <h2>
              Let curiosity
              <br />
              take you further.
            </h2>
            <p>
              Try a small, repeatable calculation.
              <br />
              Change its conditions and inspect what changes.
            </p>
            <Link className="mi-pill mi-pill--light" to="/workbench">
              Try an example <Arrow diagonal />
            </Link>
          </div>
        </div>
      </section>
      <Invitation />
    </div>
  );
}
