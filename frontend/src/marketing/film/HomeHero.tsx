import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PHOTO_LIBRARY } from "./photoLibrary";

export function HomeHero() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const lines = section.querySelectorAll("[data-hero-line]");
      const entrance = gsap.timeline({ defaults: { ease: "power3.out" } });
      entrance.fromTo(".mi-hero-image", { opacity: 0, scale: 1.06 }, { opacity: 1, scale: 1, duration: 1.5 }, 0);
      entrance.fromTo(lines, { yPercent: 110 }, { yPercent: 0, duration: 1.15, stagger: 0.14 }, 0.16);
      entrance.fromTo(section.querySelectorAll("[data-hero-detail]"), { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.13 }, 0.62);
    }, section);
    media.add("(min-width: 960px) and (prefers-reduced-motion: no-preference)", () => {
      const camera = section.querySelector(".mi-hero-camera");
      const copy = section.querySelector(".mi-hero-copy");
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 78px",
          end: () => "+=" + window.innerHeight * 1.05,
          pin: true,
          scrub: 0.85,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
      timeline.to(camera, { scale: 1.32, xPercent: -4, yPercent: -2, ease: "none", duration: 1 }, 0);
      timeline.to(copy, { y: -70, opacity: 0, ease: "power2.in", duration: 0.32 }, 0.68);
      timeline.to(section.querySelector(".mi-hero-photo-credit"), { opacity: 0, duration: 0.16 }, 0.84);
    }, section);
    return () => media.revert();
  }, []);

  return (
    <section className="mi-home-hero" ref={sectionRef} aria-labelledby="mi-home-title">
      <figure className="mi-hero-art">
        <div className="mi-hero-camera">
          <picture className="mi-hero-picture">
            <source media="(max-width: 959px)" srcSet={PHOTO_LIBRARY.hero.portraitSrc} type="image/webp" />
            <img className="mi-hero-image" src={PHOTO_LIBRARY.hero.wideSrc}
              width={PHOTO_LIBRARY.hero.wideDimensions.width} height={PHOTO_LIBRARY.hero.wideDimensions.height}
              alt={PHOTO_LIBRARY.hero.alt} decoding="async" fetchPriority="high" />
          </picture>
        </div>
        <figcaption className="mi-hero-photo-credit">
          Photograph by <a href={PHOTO_LIBRARY.hero.sourceUrl} target="_blank" rel="noreferrer">{PHOTO_LIBRARY.hero.photographer}</a> / Unsplash
        </figcaption>
      </figure>
      <div className="mi-hero-copy">
        <h1 id="mi-home-title" tabIndex={-1}>
          <span className="mi-hero-line"><span data-hero-line>Make uncertainty</span></span>
          <span className="mi-hero-line"><span data-hero-line>visible.</span></span>
        </h1>
        <p data-hero-detail>Define the assumptions. Explore the possible outcomes. See how one change reshapes a mathematical model.</p>
        <div className="mi-hero-actions" data-hero-detail>
          <Link className="mi-button mi-button--light" to="/workbench" viewTransition>
            Explore the workbench <span aria-hidden="true">↗</span>
          </Link>
          <a className="mi-text-link" href="#model-story">Follow a model <span aria-hidden="true">↓</span></a>
        </div>
      </div>
    </section>
  );
}
