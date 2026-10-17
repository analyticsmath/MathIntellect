import { useLayoutEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export function useEditorialMotion(root: RefObject<HTMLDivElement | null>) {
  useLayoutEffect(() => {
    const rootElement = root.current;
    if (!rootElement) return;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        gsap.from(".mi-hero-media", {
          clipPath: "inset(7% 5% 7% 5%)",
          scale: 1.08,
          duration: 1.5,
          ease: "power3.inOut",
          clearProps: "clipPath",
        });
        gsap.from(".mi-line > span", {
          yPercent: 110,
          duration: 1.15,
          stagger: 0.12,
          delay: 0.18,
          ease: "power4.out",
        });
        gsap.from(".mi-hero-bottom", {
          opacity: 0,
          y: 30,
          duration: 0.8,
          delay: 0.65,
        });
        gsap.to(".mi-hero-media img", {
          scale: 1.16,
          yPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: ".mi-hero",
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
        gsap.to(".mi-hero-title", {
          yPercent: -18,
          ease: "none",
          scrollTrigger: {
            trigger: ".mi-hero",
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
        gsap.utils
          .toArray<HTMLElement>("[data-reveal]", rootElement)
          .forEach((el) => {
            gsap.from(el, {
              y: 65,
              opacity: 0,
              duration: 0.95,
              ease: "power3.out",
              scrollTrigger: { trigger: el, start: "top 92%", once: true },
            });
          });
        gsap.utils
          .toArray<HTMLElement>("[data-parallax]", rootElement)
          .forEach((el) => {
            gsap.fromTo(
              el.querySelector("img"),
              { yPercent: -8, scale: 1.12 },
              {
                yPercent: 8,
                ease: "none",
                scrollTrigger: {
                  trigger: el,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                },
              },
            );
          });
      }, rootElement);
      return () => context.revert();
    });
    media.add(
      "(min-width: 801px) and (prefers-reduced-motion: no-preference)",
      () => {
        const context = gsap.context(() => {
          const crawler = rootElement.querySelector(".mi-crawler");
          if (crawler) {
            const timeline = gsap.timeline({
              scrollTrigger: {
                trigger: crawler,
                start: "top top",
                end: "bottom bottom",
                scrub: 0.65,
              },
            });
            timeline
              .fromTo(
                ".mi-crawl-a",
                { x: "-18vw", y: "-20vh" },
                { x: "85vw", y: "55vh", ease: "none" },
                0,
              )
              .fromTo(
                ".mi-crawl-b",
                { x: "40vw", y: "35vh" },
                { x: "-75vw", y: "-48vh", ease: "none" },
                0,
              )
              .fromTo(
                ".mi-crawl-c",
                { x: "-30vw", y: "45vh" },
                { x: "72vw", y: "-45vh", ease: "none" },
                0,
              )
              .fromTo(
                ".mi-crawl-d",
                { x: "45vw", y: "-45vh" },
                { x: "-70vw", y: "50vh", ease: "none" },
                0,
              )
              .fromTo(
                ".mi-crawler-copy",
                { scale: 0.92 },
                { scale: 1.08, ease: "none" },
                0,
              );
          }
          const rail = rootElement.querySelector<HTMLElement>(".mi-model-rail");
          const track = rail?.querySelector<HTMLElement>(".mi-model-track");
          if (rail && track) {
            gsap.to(track, {
              x: () => -(track.scrollWidth - window.innerWidth + 48),
              ease: "none",
              scrollTrigger: {
                id: "mi-model-rail",
                trigger: rail,
                start: "top top",
                end: "bottom bottom",
                scrub: 0.65,
                invalidateOnRefresh: true,
              },
            });
          }
        }, rootElement);
        return () => context.revert();
      },
    );
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    const images = Array.from(rootElement.querySelectorAll("img"));
    const refresh = () => ScrollTrigger.refresh();
    const focusModel = (event: FocusEvent) => {
      const link =
        event.target instanceof Element
          ? event.target.closest<HTMLAnchorElement>(".mi-model-track a")
          : null;
      const trigger = ScrollTrigger.getById("mi-model-rail");
      if (
        !link ||
        !trigger ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      )
        return;
      const track = link.parentElement;
      const index = track ? Array.from(track.children).indexOf(link) : -1;
      if (index < 0) return;
      const fraction = Math.min(
        0.95,
        (index + 0.05) / Math.max(1, track!.children.length - 1),
      );
      window.scrollTo({
        top: trigger.start + (trigger.end - trigger.start) * fraction,
        behavior: "smooth",
      });
    };
    rootElement.addEventListener("focusin", focusModel);
    images.forEach((img) =>
      img.addEventListener("load", refresh, { once: true }),
    );
    return () => {
      cancelAnimationFrame(frame);
      images.forEach((img) => img.removeEventListener("load", refresh));
      rootElement.removeEventListener("focusin", focusModel);
      media.revert();
    };
  }, [root]);
}
