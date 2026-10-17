import { useRef } from "react";
import { Photo } from "./Photo";
import { TextLink, Invitation } from "./Shared";
import { useEditorialMotion } from "./useEditorialMotion";
import { models } from "./ModelData";
export function EditorialModels() {
  const root = useRef<HTMLDivElement>(null);
  useEditorialMotion(root);
  return (
    <div ref={root} className="mi-models-page">
      <header className="mi-page-intro">
        <h1 tabIndex={-1}>
          <span className="mi-line">
            <span>Follow the</span>
          </span>
          <span className="mi-line">
            <span>question.</span>
          </span>
        </h1>
        <div>
          <p>
            Different questions need different models. Choose the structure that
            fits what you want to examine.
          </p>
          <nav aria-label="Choose a model">
            {models.map((m) => (
              <a key={m.id} href={"#" + m.id}>
                {m.name} <span aria-hidden="true">↓</span>
              </a>
            ))}
          </nav>
        </div>
      </header>
      <figure className="mi-models-banner" data-parallax>
        <Photo id="dunes" priority />
      </figure>
      {models.map((m, i) => (
        <section
          key={m.id}
          id={m.id}
          className={
            "mi-model-detail " + (i % 2 ? "mi-model-detail--reverse" : "")
          }
        >
          <figure data-parallax>
            <Photo
              id={m.photo}
              sizes={
                m.photo === "glider"
                  ? "(max-width:800px) 170vw, 140vh"
                  : "(max-width:800px) 100vw, 75vw"
              }
            />
          </figure>
          <div>
            <h2>{m.name}</h2>
            <h3>{m.question}</h3>
            <p>{m.detail}</p>
            <dl>
              <div>
                <dt>You choose</dt>
                <dd>{m.inputs}</dd>
              </div>
              <div>
                <dt>You inspect</dt>
                <dd>{m.outputs}</dd>
              </div>
            </dl>
            <TextLink to="/signup">Build a simulation</TextLink>
          </div>
        </section>
      ))}
      <div className="mi-model-boundary">
        <p>
          Every result belongs to its assumptions. A simulation explores what
          could follow from a model; it does not establish what will happen in
          the real world.
        </p>
        <TextLink to="/workbench">Try the public example</TextLink>
      </div>
      <Invitation />
    </div>
  );
}
