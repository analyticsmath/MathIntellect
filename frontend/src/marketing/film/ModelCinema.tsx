import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Photo } from "./Photo";
import { MODEL_STORIES } from "./filmMedia";
import { TransitionLink } from "./TransitionLink";

gsap.registerPlugin(ScrollTrigger);

export function ModelCinema() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    media.add(
      "(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
      () => {
        const section = sectionRef.current;
        if (!section) return;

        const context = gsap.context(() => {
          gsap.utils.toArray<HTMLElement>(".mi-model-scene").forEach((scene) => {
            const crop = scene.querySelector<HTMLElement>(".mi-photo-crop");
            const copy = scene.querySelector<HTMLElement>(".mi-model-scene-copy");
            if (crop) {
              gsap.fromTo(
                crop,
                { yPercent: -7 },
                {
                  yPercent: 7,
                  ease: "none",
                  scrollTrigger: {
                    trigger: scene,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true,
                    invalidateOnRefresh: true,
                  },
                },
              );
            }
            if (copy) {
              gsap.fromTo(
                copy,
                { y: 30, opacity: 0.45 },
                {
                  y: 0,
                  opacity: 1,
                  ease: "none",
                  scrollTrigger: {
                    trigger: scene,
                    start: "top 82%",
                    end: "top 38%",
                    scrub: true,
                  },
                },
              );
            }
          });
        }, section);

        return () => context.revert();
      },
    );
    return () => media.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="mi-model-cinema mi-model-chapters"
      aria-labelledby="mi-model-cinema-title"
    >
      <header className="mi-model-preface">
        <div>
          <span className="mi-story-eyebrow">03 <i /> THE RIGHT LENS</span>
          <h2 id="mi-model-cinema-title">
            Different questions.
            <br />
            <span>Different mathematics.</span>
          </h2>
        </div>
        <p>
          Uncertainty, strategy and interaction are different problems. Each
          deserves a model that describes what is actually changing.
        </p>
      </header>

      <div className="mi-model-story-list">
        {MODEL_STORIES.map((model, index) => (
          <TransitionLink
            actor={model.id}
            key={model.id}
            to={"/models#" + model.id}
            className={"mi-model-scene mi-model-scene--" + (index % 2 === 0 ? "image-first" : "copy-first")}
          >
            <div className="mi-model-scene-visual">
              <Photo id={model.id} />
              <span className="mi-model-scene-index">
                {String(index + 1).padStart(2, "0")} <i /> 05
              </span>
            </div>
            <div className="mi-model-scene-copy">
              <span className="mi-model-scene-name">{model.name}</span>
              <h3>{model.title}</h3>
              <p className="mi-model-scene-question">{model.question}</p>
              <p>{model.description}</p>
              <span className="mi-model-scene-link">
                Inspect this model <i aria-hidden="true">↗</i>
              </span>
            </div>
          </TransitionLink>
        ))}
      </div>
      <p className="mi-model-context-note">
        Context photographs are editorial illustrations. The model assumptions
        and outputs are defined separately for each simulation.
      </p>
    </section>
  );
}
