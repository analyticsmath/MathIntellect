import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MODEL_STORIES, type ModelId } from "./filmMedia";

type ModelCinemaProps = {
  variant?: "overview" | "detail";
  title: string;
  intro: string;
};

function ModelVisual({ id }: { id: ModelId }) {
  if (id === "monte-carlo") {
    return (
      <svg className="mi-model-schema" viewBox="0 0 1000 620" role="img" aria-label="Illustrative schema of a starting value branching into sampled paths">
        <g className="mi-schema-grid" aria-hidden="true">
          <path d="M80 105H930M80 205H930M80 305H930M80 405H930M80 505H930" />
          <path d="M80 70V535M292 70V535M504 70V535M716 70V535M930 70V535" />
        </g>
        <g className="mi-schema-lines" aria-hidden="true">
          <path d="M80 308C230 303 264 146 430 192S650 418 930 250" />
          <path d="M80 308C230 303 288 391 440 351S702 143 930 204" />
          <path d="M80 308C218 311 328 235 466 276S716 435 930 391" />
          <path d="M80 308C218 311 317 455 484 411S700 190 930 334" />
          <path d="M80 308C228 310 362 291 518 318S736 242 930 115" />
          <path d="M80 308C244 304 354 117 506 151S710 316 930 462" />
          <path d="M80 308C248 310 373 352 528 266S740 112 930 287" />
          <path d="M80 308C255 305 382 423 544 378S734 338 930 424" />
          <path d="M80 308C234 311 354 210 496 224S735 470 930 360" />
        </g>
        <circle className="mi-schema-origin" cx="80" cy="308" r="9" />
        <g className="mi-schema-nodes" aria-hidden="true">
          <circle cx="930" cy="250" r="7" /><circle cx="930" cy="204" r="7" />
          <circle cx="930" cy="391" r="7" /><circle cx="930" cy="334" r="7" />
        </g>
      </svg>
    );
  }

  if (id === "game-theory") {
    return (
      <svg className="mi-model-schema" viewBox="0 0 1000 620" role="img" aria-label="Conceptual payoff matrix: each strategy pair maps to both players' payoffs">
        <g className="mi-schema-grid" aria-hidden="true">
          <path d="M260 145H900M260 365H900M260 585H900M260 145V585M580 145V585M900 145V585" />
        </g>
        <g className="mi-schema-axis" aria-hidden="true">
          <path d="M260 112H900M225 145V585" />
          <path d="M370 112l-18-10m18 10l-18 10M225 280l-10-18m10 18l10-18" />
        </g>
        <g className="mi-schema-label" aria-hidden="true">
          <text x="420" y="92">Player B · strategy</text>
          <text x="150" y="386" transform="rotate(-90 150 386)">Player A · strategy</text>
        </g>
        <g className="mi-schema-cell-label" aria-hidden="true">
          <text x="420" y="136">B₁</text><text x="740" y="136">B₂</text>
          <text x="244" y="262">A₁</text><text x="244" y="482">A₂</text>
        </g>
        <g className="mi-schema-payoffs" aria-hidden="true">
          <text x="420" y="262">(u₁, v₁)</text><text x="740" y="262">(u₂, v₂)</text>
          <text x="420" y="482">(u₃, v₃)</text><text x="740" y="482">(u₄, v₄)</text>
        </g>
      </svg>
    );
  }

  if (id === "market") {
    return (
      <svg className="mi-model-schema" viewBox="0 0 1000 620" role="img" aria-label="Illustrative market paths begin at a shared initial state and diverge over time">
        <g className="mi-schema-grid" aria-hidden="true">
          <path d="M80 105H930M80 205H930M80 305H930M80 405H930M80 505H930" />
          <path d="M80 70V535M292 70V535M504 70V535M716 70V535M930 70V535" />
        </g>
        <path className="mi-schema-band" d="M80 308C258 308 297 248 450 256S707 139 930 95L930 498C738 431 640 474 474 366S238 308 80 308Z" />
        <g className="mi-schema-lines" aria-hidden="true">
          <path d="M80 308C230 307 280 218 432 255S704 386 930 163" />
          <path d="M80 308C230 308 285 379 451 342S702 190 930 288" />
          <path d="M80 308C229 307 335 288 490 310S731 442 930 376" />
          <path d="M80 308C233 307 310 424 468 401S738 163 930 221" />
          <path d="M80 308C240 308 378 200 522 225S736 337 930 119" />
          <path d="M80 308C233 308 360 347 520 322S720 206 930 453" />
        </g>
        <circle className="mi-schema-origin" cx="80" cy="308" r="9" />
      </svg>
    );
  }

  return (
    <svg className="mi-model-schema" viewBox="0 0 1000 620" role="img" aria-label="Illustrative agent interaction network with directed choices between agents">
      <g className="mi-schema-links" aria-hidden="true">
        <path d="M190 324C290 230 333 180 438 160" />
        <path d="M190 324C286 406 354 455 454 468" />
        <path d="M438 160C538 228 599 271 692 311" />
        <path d="M454 468C554 396 613 355 692 311" />
        <path d="M692 311C778 228 817 190 894 142" />
        <path d="M692 311C777 376 824 427 894 484" />
        <path d="M438 160C625 97 730 92 894 142" />
        <path d="M454 468C618 524 748 529 894 484" />
      </g>
      <g className="mi-schema-agents" aria-hidden="true">
        <circle cx="190" cy="324" r="34" /><circle cx="438" cy="160" r="27" />
        <circle cx="454" cy="468" r="27" /><circle cx="692" cy="311" r="42" />
        <circle cx="894" cy="142" r="27" /><circle cx="894" cy="484" r="27" />
      </g>
      <g className="mi-schema-arrows" aria-hidden="true">
        <path d="M396 168l28-8-14 26M409 447l27 18-27 4M656 294l28 17-29 9M861 157l28-15-9 28M864 467l29 17-28 8" />
      </g>
    </svg>
  );
}

export function ModelCinema({ variant = "overview", title, intro }: ModelCinemaProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!section || !viewport || !track) return;

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia(section);

    media.add("(min-width: 960px) and (prefers-reduced-motion: no-preference)", () => {
      const travel = () => Math.max(0, track.scrollWidth - window.innerWidth);
      const panels = Array.from(track.children) as HTMLElement[];
      const panelCount = panels.length;
      const snapStep = 1 / Math.max(1, panelCount - 1);
      let activePanel = -1;
      const activatePanel = (index: number) => {
        if (index === activePanel || !panels[index]) return;
        activePanel = index;
        panels.forEach((panel, panelIndex) => panel.classList.toggle("is-active", panelIndex === index));
        const panel = panels[index];
        const photo = panel.querySelector<HTMLElement>(".mi-model-panel-photo img");
        const drawn = Array.from(panel.querySelectorAll<SVGPathElement>(".mi-schema-lines path, .mi-schema-links path, .mi-schema-arrows path"));
        const sequence = gsap.timeline({ defaults: { ease: "power2.out" } });

        drawn.forEach((path) => {
          const length = path.getTotalLength();
          gsap.killTweensOf(path);
          gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
        });

        if (photo) {
          gsap.killTweensOf(photo);
          sequence.fromTo(photo, { autoAlpha: 0.72, scale: 1.035 }, { autoAlpha: 1, scale: 1, duration: 1.12 }, 0);
        }
        if (drawn.length) {
          sequence.to(drawn, { strokeDashoffset: 0, duration: 1.25, stagger: 0.045, ease: "power2.out" }, 0.18);
        }
        const copy = panel.querySelector<HTMLElement>(".mi-model-panel-copy");
        if (copy) {
          gsap.killTweensOf(copy);
          sequence.fromTo(copy, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.76, ease: "power3.out" }, 0.82);
        }
      };
      gsap.to(track, {
        x: () => -travel(),
        ease: "none",
        scrollTrigger: {
          trigger: viewport,
          start: "top 84px",
          end: () => "+=" + Math.max((window.innerHeight - 84) * 4.2, travel() * 1.35),
          scrub: 1,
          snap: {
            snapTo: snapStep,
            delay: 0.18,
            duration: { min: 0.55, max: 1.05 },
            ease: "power2.inOut",
          },
          pin: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progressFillRef.current) {
              progressFillRef.current.style.transform = "scaleX(" + self.progress + ")";
            }
            if (progressRef.current) {
              progressRef.current.setAttribute("aria-valuenow", String(Math.round(self.progress * 100)));
            }
            activatePanel(Math.min(panelCount - 1, Math.round(self.progress * (panelCount - 1))));
          },
        },
      });
      requestAnimationFrame(() => ScrollTrigger.refresh());
    });

    return () => media.revert();
  }, [variant]);

  return (
    <section
      ref={sectionRef}
      className={"mi-model-cinema mi-model-cinema--" + variant}
      aria-labelledby={"mi-model-cinema-title-" + variant}
    >
      <header className="mi-model-cinema-intro">
        <div>
          <h2 id={"mi-model-cinema-title-" + variant}>{title}</h2>
          <p>{intro}</p>
        </div>
        <div className="mi-model-rail-status">
          <span>Keep scrolling to move between model questions</span>
        </div>
      </header>

      <div className="mi-model-viewport" ref={viewportRef}>
        <div className="mi-model-track" ref={trackRef}>
          {MODEL_STORIES.map((model) => {
            const headingId = "mi-model-" + model.id + "-" + variant;
            const target = variant === "overview" ? "/models" : model.id === "monte-carlo" ? "/workbench" : "/app/simulations/new";
            return (
              <article
                className={"mi-model-panel mi-model-panel--" + model.id + (model.id === "monte-carlo" ? " is-active" : "")}
                key={model.id}
                id={variant === "detail" ? model.id : undefined}
                aria-labelledby={headingId}
              >
                <figure className="mi-model-panel-art">
                  <picture className="mi-model-panel-photo">
                    <source
                      media="(max-width: 959px)"
                      srcSet={model.photo.portraitSrc + " 800w"}
                      sizes="100vw"
                      type="image/webp"
                    />
                    <img
                      src={model.photo.wideSrc}
                      srcSet={model.photo.wideSrc + " 1400w"}
                      sizes="(min-width: 960px) 46vw, 100vw"
                      width={model.photo.wideDimensions.width}
                      height={model.photo.wideDimensions.height}
                      alt={model.photo.alt}
                      loading="lazy"
                      decoding="async"
                    />
                  </picture>
                  <div className="mi-model-panel-diagram">
                    <ModelVisual id={model.id} />
                  </div>
                  <figcaption className="mi-model-photo-credit">
                    Photograph by <a href={model.photo.sourceUrl} target="_blank" rel="noreferrer">{model.photo.photographer}</a> on <a href="https://unsplash.com" target="_blank" rel="noreferrer">Unsplash</a>
                  </figcaption>
                </figure>
                <div className="mi-model-panel-copy">
                  <h3 id={headingId}>{model.name}</h3>
                  <p className="mi-model-question">{variant === "detail" ? model.question : model.title}</p>
                  <p className="mi-model-description">{model.description}</p>
                  {variant === "detail" && (
                    <div className="mi-model-specs">
                      <div>
                        <h4>Inputs</h4>
                        <ul>{model.inputs.map((item) => <li key={item}>{item}</li>)}</ul>
                      </div>
                      <div>
                        <h4>Outputs</h4>
                        <ul>{model.outputs.map((item) => <li key={item}>{item}</li>)}</ul>
                      </div>
                    </div>
                  )}
                  <Link to={target} viewTransition className="mi-model-cta">
                    {variant === "overview" ? "Explore this model" : model.id === "monte-carlo" ? "Open the public experiment" : "Build this model"}
                    <span aria-hidden="true">↗</span>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
        <div className="mi-model-scroll-progress" role="progressbar" aria-label="Model exploration progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={0} ref={progressRef}>
          <span ref={progressFillRef} />
        </div>
      </div>
    </section>
  );
}
