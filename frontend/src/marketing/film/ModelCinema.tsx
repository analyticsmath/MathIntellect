import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Photo } from "./Photo";
import { MODEL_STORIES } from "./filmMedia";
import { TransitionLink } from "./TransitionLink";
gsap.registerPlugin(ScrollTrigger);
export function ModelCinema() {
  const sectionRef = useRef<HTMLElement>(null),
    trackRef = useRef<HTMLDivElement>(null),
    triggerRef = useRef<ScrollTrigger | null>(null),
    timelineRef = useRef<gsap.core.Timeline | null>(null);
  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    media.add(
      "(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
      () => {
        const section = sectionRef.current,
          track = trackRef.current;
        if (!section || !track) return;
        const distance = () =>
          Math.max(0, track.scrollWidth - window.innerWidth);
        section.classList.add("mi-cinema-enhanced");
        const animation = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${distance() + window.innerHeight * 0.8}`,
            pin: true,
            scrub: 0.3,
            invalidateOnRefresh: true,
          },
        });
        const panels = Array.from(
          track.querySelectorAll<HTMLElement>(".mi-model-panel"),
        );
        panels.forEach((panel, index) => {
          if (index > 0) {
            animation.to(track, {
              x: () =>
                -Math.min(
                  Math.max(0, panel.offsetLeft - window.innerWidth * 0.05),
                  distance(),
                ),
              duration: 0.8,
              ease: "power1.inOut",
            });
            animation.fromTo(
              panel.querySelector(".mi-photo-crop"),
              { xPercent: 2 },
              { xPercent: -2, duration: 0.8, ease: "none" },
              "<",
            );
          }
          animation
            .addLabel(MODEL_STORIES[index].id)
            .to({}, { duration: 0.14 });
        });
        timelineRef.current = animation;
        triggerRef.current = animation.scrollTrigger ?? null;
        const resize = new ResizeObserver(() => ScrollTrigger.refresh());
        resize.observe(track);
        return () => {
          resize.disconnect();
          animation.scrollTrigger?.kill();
          animation.kill();
          triggerRef.current = null;
          timelineRef.current = null;
          section.classList.remove("mi-cinema-enhanced");
          gsap.set(track, { clearProps: "transform" });
        };
      },
    );
    return () => media.revert();
  }, []);
  return (
    <section
      ref={sectionRef}
      className="mi-model-cinema"
      aria-label="Explore the mathematical models"
    >
      <div className="mi-cinema-heading">
        <h2>
          Different questions.
          <br />
          Different mathematics.
        </h2>
        <span className="mi-cinema-hint">Scroll to explore ↘</span>
      </div>
      <div className="mi-cinema-window">
        <div ref={trackRef} className="mi-cinema-track">
          {MODEL_STORIES.map((model) => (
            <TransitionLink
              actor={model.id}
              key={model.id}
              to={`/models#${model.id}`}
              className={`mi-model-panel mi-model-panel--${model.id}`}
              onFocus={(event) => {
                if (!event.currentTarget.matches(":focus-visible")) return;
                const trigger = triggerRef.current;
                if (!trigger) return;
                const timeline = timelineRef.current;
                if (!timeline) return;
                const progress =
                  timeline.labels[model.id] / timeline.duration();
                window.scrollTo({
                  top: trigger.start + (trigger.end - trigger.start) * progress,
                  behavior: "auto",
                });
                timeline.progress(progress);
              }}
            >
              <Photo id={model.id} />
              <div className="mi-panel-caption">
                <span>{model.name}</span>
                <span aria-hidden="true">↗</span>
              </div>
              <p>{model.question}</p>
              {model.id === "market" && (
                <span className="mi-photo-note">
                  Historical NYSE photograph · 1980–2006
                </span>
              )}
            </TransitionLink>
          ))}
        </div>
      </div>
    </section>
  );
}
