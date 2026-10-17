import type { RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(ScrollTrigger, useGSAP);

export function useEditorialMotion(root: RefObject<HTMLDivElement | null>) {
  useGSAP(
    () => {
      const element = root.current;
      if (!element) return;
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        if (element.querySelector(".mi-hero")) {
          gsap.from(".mi-hero-media img", {
            scale: 1.13,
            duration: 1.6,
            ease: "power3.out",
          });
          gsap.utils
            .toArray<HTMLElement>(".mi-hero-title", element)
            .forEach((title) => {
              gsap.from(title.querySelectorAll(".mi-line > span"), {
                yPercent: 112,
                duration: 1.2,
                stagger: 0.12,
                delay: 0.15,
                ease: "power4.out",
              });
            });
          gsap.from(".mi-hero-bottom", {
            opacity: 0,
            y: 25,
            duration: 0.9,
            delay: 0.65,
          });
        }
        gsap.utils
          .toArray<HTMLElement>("[data-reveal]", element)
          .forEach((el) => {
            gsap.from(el, {
              y: 48,
              opacity: 0,
              duration: 1,
              ease: "power3.out",
              scrollTrigger: { trigger: el, start: "top 92%", once: true },
            });
          });
        gsap.utils
          .toArray<HTMLElement>("[data-reading]", element)
          .forEach((el) => {
            gsap.fromTo(
              el.children,
              { opacity: 0.23 },
              {
                opacity: 1,
                stagger: 0.09,
                ease: "none",
                scrollTrigger: {
                  trigger: el,
                  start: "top 85%",
                  end: "bottom 55%",
                  scrub: 0.4,
                },
              },
            );
          });
        gsap.utils
          .toArray<HTMLElement>("[data-parallax]", element)
          .forEach((el) => {
            gsap.fromTo(
              el.querySelector("img"),
              { yPercent: -7, scale: 1.14 },
              {
                yPercent: 7,
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
      });
      media.add(
        "(min-width: 801px) and (prefers-reduced-motion: no-preference)",
        () => {
          const hero = element.querySelector(".mi-hero");
          if (hero) {
            gsap
              .timeline({
                scrollTrigger: {
                  trigger: hero,
                  start: "top top",
                  end: "bottom bottom",
                  scrub: 0.5,
                },
              })
              .to(
                ".mi-hero-media, .mi-hero-shade, .mi-hero-type-plane",
                { clipPath: "inset(0% 0% 0% 0%)", duration: 0.7, ease: "none" },
                0,
              )
              .to(
                ".mi-hero-title",
                { scale: 1.12, yPercent: -20, duration: 1, ease: "none" },
                0,
              )
              .to(
                ".mi-hero-bottom p",
                { color: "#ffffff", duration: 0.25 },
                0.2,
              )
              .to(
                ".mi-hero-progress i",
                { scaleX: 1, duration: 1, ease: "none" },
                0,
              )
              .to(".mi-hero-title", { opacity: 0, duration: 0.2 }, 0.8)
              .to(
                ".mi-hero-bottom",
                { yPercent: 30, opacity: 0, duration: 0.2 },
                0.8,
              );
          }
          const crawler = element.querySelector(".mi-crawler");
          if (crawler) {
            const film = gsap.timeline({
              scrollTrigger: {
                trigger: crawler,
                start: "top top",
                end: "bottom bottom",
                scrub: 0.6,
              },
            });
            const paths = [
              {
                target: ".mi-crawl-a",
                x: ["-30vw", "90vw"],
                y: ["-25vh", "65vh"],
                at: 0,
              },
              {
                target: ".mi-crawl-b",
                x: ["45vw", "-100vw"],
                y: ["40vh", "-65vh"],
                at: 0,
              },
              {
                target: ".mi-crawl-c",
                x: ["-50vw", "80vw"],
                y: ["50vh", "-65vh"],
                at: 0.08,
              },
              {
                target: ".mi-crawl-d",
                x: ["50vw", "-85vw"],
                y: ["-50vh", "65vh"],
                at: 0.08,
              },
              {
                target: ".mi-crawl-e",
                x: ["-35vw", "75vw"],
                y: ["100vh", "-90vh"],
                at: 0.32,
              },
              {
                target: ".mi-crawl-f",
                x: ["65vw", "-100vw"],
                y: ["-90vh", "80vh"],
                at: 0.32,
              },
            ];
            paths.forEach(({ target, x, y, at }) =>
              film.fromTo(
                target,
                { x: x[0], y: y[0], scale: 0.78 },
                { x: x[1], y: y[1], scale: 1.15, duration: 1.1, ease: "none" },
                at,
              ),
            );
            film
              .fromTo(
                ".mi-crawler-copy",
                { scale: 0.76, z: -120 },
                { scale: 1.04, z: 0, duration: 0.95, ease: "none" },
                0,
              )
              .to(
                ".mi-crawler-copy",
                {
                  scale: 1.33,
                  z: 80,
                  opacity: 0,
                  duration: 0.47,
                  ease: "power1.in",
                },
                0.95,
              );
          }
          const perspectives = element.querySelector(".mi-perspectives");
          if (perspectives) {
            gsap.fromTo(
              ".mi-contact-track",
              { xPercent: 3 },
              {
                xPercent: -15,
                ease: "none",
                scrollTrigger: {
                  trigger: perspectives,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 0.6,
                },
              },
            );
            gsap.utils
              .toArray<HTMLElement>(".mi-contact-track figure", element)
              .forEach((photo, index) => {
                gsap.fromTo(
                  photo,
                  { yPercent: index % 2 ? 12 : -8 },
                  {
                    yPercent: index % 2 ? -12 : 8,
                    ease: "none",
                    scrollTrigger: {
                      trigger: perspectives,
                      start: "top bottom",
                      end: "bottom top",
                      scrub: 0.6,
                    },
                  },
                );
              });
          }
          const panels = gsap.utils.toArray<HTMLElement>(
            ".mi-process-panel",
            element,
          );
          panels.forEach((panel, index) => {
            if (index === 0) return;
            gsap.fromTo(
              panel,
              { scale: 0.94 },
              {
                scale: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: panel,
                  start: "top bottom",
                  end: "top top",
                  scrub: true,
                },
              },
            );
            gsap.to(panels[index - 1].querySelector("figure"), {
              scale: 1.06,
              opacity: 0.55,
              ease: "none",
              scrollTrigger: {
                trigger: panel,
                start: "top bottom",
                end: "top top",
                scrub: true,
              },
            });
          });
          const takeover = element.querySelector(".mi-image-takeover");
          if (takeover) {
            gsap
              .timeline({
                scrollTrigger: {
                  trigger: takeover,
                  start: "top top",
                  end: "bottom bottom",
                  scrub: 0.6,
                },
              })
              .fromTo(
                ".mi-takeover-image",
                { clipPath: "inset(17% 24% 17% 24%)" },
                {
                  clipPath: "inset(0% 0% 0% 0%)",
                  duration: 1,
                  ease: "power1.inOut",
                },
                0,
              )
              .fromTo(
                ".mi-takeover-image img",
                { scale: 1.2 },
                { scale: 1, duration: 1.2, ease: "none" },
                0,
              )
              .fromTo(
                ".mi-takeover-copy",
                { y: 75, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5 },
                0.45,
              );
          }
        },
      );
      let refreshFrame = 0;
      const refresh = () => {
        cancelAnimationFrame(refreshFrame);
        refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh());
      };
      refresh();
      const images = Array.from(element.querySelectorAll("img"));
      images.forEach((img) =>
        img.addEventListener("load", refresh, { once: true }),
      );
      let disposed = false;
      const fontsReady = () => {
        if (!disposed) refresh();
      };
      document.fonts?.ready.then(fontsReady);
      document.fonts?.addEventListener("loadingdone", fontsReady);
      return () => {
        disposed = true;
        cancelAnimationFrame(refreshFrame);
        images.forEach((img) => img.removeEventListener("load", refresh));
        document.fonts?.removeEventListener("loadingdone", fontsReady);
        media.revert();
      };
    },
    { scope: root },
  );
}
