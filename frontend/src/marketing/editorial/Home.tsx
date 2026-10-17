import { useRef } from "react";
import { Link } from "react-router-dom";
import { Photo } from "./Photo";
import { Arrow, Invitation, TextLink } from "./Shared";
import { useEditorialMotion } from "./useEditorialMotion";
import { models } from "./ModelData";
export function EditorialHome() {
  const root = useRef<HTMLDivElement>(null);
  useEditorialMotion(root);
  return (
    <div ref={root} className="mi-home">
      <section className="mi-hero" aria-labelledby="home-title">
        <figure className="mi-hero-media">
          <Photo id="vanes" priority />
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
            ↓
          </a>
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
          <div data-reveal>
            <p>
              What happens when uncertainty grows? When a player changes
              strategy? When individual choices meet?
            </p>
            <p>
              Math Intellect gives those questions a mathematical form. Build a
              simulation, choose the conditions, and take a closer look at the
              result.
            </p>
            <TextLink to="/models">Find your model</TextLink>
          </div>
        </div>
      </section>
      <section className="mi-crawler" aria-labelledby="change-title">
        <div className="mi-crawler-stage">
          <div className="mi-crawler-copy">
            <h2 id="change-title">
              Change one thing.
              <br />
              <em>See what follows.</em>
            </h2>
            <p>
              Small changes in assumptions can
              <br />
              open up very different possibilities.
            </p>
          </div>
          <figure className="mi-crawl-photo mi-crawl-a">
            <Photo id="runner" sizes="35vw" />
          </figure>
          <figure className="mi-crawl-photo mi-crawl-b">
            <Photo id="birds" sizes="30vw" />
          </figure>
          <figure className="mi-crawl-photo mi-crawl-c">
            <Photo id="glider" sizes="35vw" />
          </figure>
          <figure className="mi-crawl-photo mi-crawl-d">
            <Photo id="observer" sizes="30vw" />
          </figure>
        </div>
      </section>
      <section className="mi-model-rail" aria-labelledby="models-title">
        <div className="mi-model-stage">
          <div className="mi-model-heading">
            <h2 id="models-title">
              A model for
              <br />
              your next “what if”.
            </h2>
            <TextLink to="/models">Explore the models</TextLink>
          </div>
          <div className="mi-model-track">
            {models.map((model) => (
              <Link
                key={model.id}
                className={`mi-model-card mi-model-card--${model.id}`}
                to={"/models#" + model.id}
              >
                <figure>
                  <Photo
                    id={model.photo}
                    sizes="(max-width:800px) 84vw, 50vw"
                  />
                  <span className="mi-photo-arrow">
                    <Arrow diagonal />
                  </span>
                </figure>
                <div>
                  <h3>{model.name}</h3>
                  <p>{model.summary}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="mi-process">
        <div className="mi-process-image" data-parallax>
          <Photo id="vanes" sizes="(max-width:800px) 100vw, 48vw" />
        </div>
        <div className="mi-process-copy">
          <div data-reveal>
            <h2>
              Make the
              <br />
              assumptions
              <br />
              <em>explicit.</em>
            </h2>
            <p>
              Choose a model. Enter its parameters. Name your run. You decide
              what the calculation starts with.
            </p>
          </div>
          <div data-reveal>
            <h2>
              Then look
              <br />a little closer.
            </h2>
            <p>
              Inspect the summary and available visualizations. Return to
              previous runs when you want to examine them again.
            </p>
            <TextLink to="/signup">Build your first simulation</TextLink>
          </div>
        </div>
      </section>
      <section className="mi-image-takeover" data-parallax>
        <Photo id="glider" />
        <div>
          <h2 data-reveal>
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
      </section>
      <Invitation />
    </div>
  );
}
