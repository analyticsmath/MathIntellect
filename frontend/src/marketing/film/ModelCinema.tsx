import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MODEL_STORIES, type ModelId } from "./filmMedia";

type ModelVisualProps = {
  id: ModelId;
};

const MODEL_MEDIA: Record<
  ModelId,
  { image: string; srcSet: string; alt: string; credit: string; source: string }
> = {
  "monte-carlo": {
    image: "/media/math-intellect/cinematic/optimized/webp/mi-film-impact-origin-1920.webp",
    srcSet:
      "/media/math-intellect/cinematic/optimized/webp/mi-film-impact-origin-960.webp 960w, /media/math-intellect/cinematic/optimized/webp/mi-film-impact-origin-1920.webp 1920w",
    alt: "A white liquid splash suspended against a dark background",
    credit: "Pete Godfrey on Unsplash",
    source: "https://unsplash.com/photos/milk-splash-frozen-in-time-against-black-background-6ieRRBACAqM",
  },
  "game-theory": {
    image: "/media/math-intellect/cinematic/optimized/webp/mi-film-game-theory-1920.webp",
    srcSet:
      "/media/math-intellect/cinematic/optimized/webp/mi-film-game-theory-960.webp 960w, /media/math-intellect/cinematic/optimized/webp/mi-film-game-theory-1920.webp 1920w",
    alt: "Two people working together at a table with a laptop",
    credit: "Adam Rutkowski on Unsplash",
    source: "https://unsplash.com/photos/two-men-sitting-at-a-table-with-a-laptop-r_WVQzfgClw",
  },
  market: {
    image: "/media/math-intellect/cinematic/optimized/webp/mi-film-market-observation-1920.webp",
    srcSet:
      "/media/math-intellect/cinematic/optimized/webp/mi-film-market-observation-960.webp 960w, /media/math-intellect/cinematic/optimized/webp/mi-film-market-observation-1920.webp 1920w",
    alt: "Market data displayed across a set of trading screens",
    credit: "Jakub Żerdzicki on Unsplash",
    source: "https://unsplash.com/photos/trader-analyzing-stock-market-charts-on-multiple-screens-j_hho1mE47s",
  },
  conflict: {
    image: "/media/math-intellect/optimized/webp/mi-murmuration-01-1920.webp",
    srcSet:
      "/media/math-intellect/optimized/webp/mi-murmuration-01-768.webp 768w, /media/math-intellect/optimized/webp/mi-murmuration-01-1280.webp 1280w, /media/math-intellect/optimized/webp/mi-murmuration-01-1920.webp 1920w",
    alt: "A murmuration of starlings moving together across the sky",
    credit: "James Wainscoat on Unsplash",
    source: "https://unsplash.com/photos/b7MZ6iGIoSI",
  },
};

export function ModelVisual({ id }: ModelVisualProps) {
  const media = MODEL_MEDIA[id];

  return (
    <figure className={"mi-model-visual mi-model-visual--" + id}>
      <picture className="mi-model-picture">
        <source
          type="image/webp"
          srcSet={media.srcSet}
          sizes="(max-width: 900px) 100vw, (max-width: 1200px) 50vw, 44vw"
        />
        <img
          src={media.image}
          srcSet={media.srcSet}
          sizes="(max-width: 900px) 100vw, (max-width: 1200px) 50vw, 44vw"
          width="1920"
          height="1280"
          alt={media.alt}
          loading="lazy"
          decoding="async"
        />
      </picture>
      <figcaption>
        <span>{media.credit} · contextual photograph</span>
        <a href={media.source} target="_blank" rel="noreferrer">
          Photo source
        </a>
      </figcaption>
    </figure>
  );
}

export function ModelCinema() {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const progressRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const viewport = viewportRef.current;
    const rail = railRef.current;
    if (!section || !viewport || !rail) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();

    media.add("(min-width: 961px)", () => {
      const travel = () => Math.max(0, rail.scrollWidth - viewport.clientWidth);
      const tween = gsap.to(rail, {
        x: () => -travel(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => "+=" + Math.max(travel(), window.innerHeight * 1.35),
          pin: true,
          pinSpacing: true,
          scrub: 0.9,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => progressRef.current?.style.setProperty("transform", "scaleX(" + self.progress + ")"),
        },
      });

      triggerRef.current = tween.scrollTrigger as ScrollTrigger;
      return () => {
        triggerRef.current = null;
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });

    const refreshFrame = window.requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      window.cancelAnimationFrame(refreshFrame);
      media.revert();
    };
  }, []);

  const bringCardIntoView = (index: number) => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const fraction = index / Math.max(1, MODEL_STORIES.length - 1);
    window.scrollTo({
      top: trigger.start + (trigger.end - trigger.start) * fraction,
      behavior: "smooth",
    });
  };

  return (
    <section
      ref={sectionRef}
      className="mi-model-cinema"
      aria-labelledby="mi-model-cinema-title"
    >
      <header className="mi-model-cinema-heading" data-reveal>
        <div>
          <h2 id="mi-model-cinema-title">Different systems call for different models.</h2>
          <p>
            Keep scrolling to move across four mathematical lenses. Each makes
            another set of assumptions and outcomes available to inspect.
          </p>
        </div>
        <span className="mi-model-scroll-hint">
          Scroll to explore <span aria-hidden="true">↓</span>
        </span>
      </header>

      <div ref={viewportRef} className="mi-model-viewport">
        <div ref={railRef} className="mi-model-track">
          {MODEL_STORIES.map((model, index) => (
            <article
              key={model.id}
              className={"mi-model-rail-card mi-model-rail-card--" + model.id}
              onFocusCapture={() => bringCardIntoView(index)}
            >
              <ModelVisual id={model.id} />
              <div className="mi-model-rail-copy">
                <h3>{model.name}</h3>
                <p className="mi-rail-question">{model.question}</p>
                <p>{model.description}</p>
                <div className="mi-rail-inputs">
                  <strong>Inputs</strong>
                  <span>{model.inputs.join(" · ")}</span>
                </div>
                <Link
                  to={"/models#" + model.id}
                  viewTransition
                  className="mi-rail-link"
                >
                  See the assumptions <span aria-hidden="true">↗</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="mi-model-scroll-progress" aria-hidden="true">
        <span ref={progressRef} />
      </div>
      <p className="mi-model-gallery-note">
        The photographs set a context. They are not simulation results.
      </p>
    </section>
  );
}
