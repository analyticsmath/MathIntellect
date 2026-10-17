import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PHOTO_LIBRARY } from "./photoLibrary";

export function ObservationBridge() {
  const sectionRef = useRef<HTMLElement>(null);
  const words = "One starting point. Many possible paths.".split(" ");

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(section.querySelectorAll("[data-observation-word]"), { opacity: 0.22, y: 12 }, {
        opacity: 1, y: 0, stagger: 0.15, ease: "none",
        scrollTrigger: { trigger: section, start: "top 76%", end: "top 26%", scrub: 0.6 },
      });
      gsap.fromTo(section.querySelector(".mi-observation-frame"), { scale: 0.82, y: 55 }, {
        scale: 1, y: 0, ease: "none",
        scrollTrigger: { trigger: section.querySelector(".mi-observation-frame"), start: "top 95%", end: "center 48%", scrub: 0.85 },
      });
      gsap.fromTo(section.querySelector(".mi-observation-image"), { scale: 1.16, yPercent: -5 }, {
        scale: 1.02, yPercent: 4, ease: "none",
        scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 0.85 },
      });
    }, section);
    return () => media.revert();
  }, []);

  return (
    <section className="mi-observation" ref={sectionRef} aria-labelledby="mi-observation-title">
      <h2 id="mi-observation-title">{words.map((word, index) => <span key={index} data-observation-word>{word}{" "}</span>)}</h2>
      <p>A simulation makes the spread visible. Follow one seeded calculation, inspect every path, then change a single condition.</p>
      <figure className="mi-observation-frame">
        <img className="mi-observation-image" src={PHOTO_LIBRARY.waterStudy.wideSrc}
          width={PHOTO_LIBRARY.waterStudy.wideDimensions.width} height={PHOTO_LIBRARY.waterStudy.wideDimensions.height}
          alt={PHOTO_LIBRARY.waterStudy.alt} loading="lazy" decoding="async" />
        <figcaption>Photograph by <a href={PHOTO_LIBRARY.waterStudy.sourceUrl} target="_blank" rel="noreferrer">{PHOTO_LIBRARY.waterStudy.photographer}</a> / Unsplash</figcaption>
      </figure>
    </section>
  );
}
