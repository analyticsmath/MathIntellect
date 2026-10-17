import { useLayoutEffect, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
export function useHomeFilmMotion(root: RefObject<HTMLDivElement | null>) {
  useLayoutEffect(() => {
    if (!root.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add(
      "(min-width: 960px) and (prefers-reduced-motion: no-preference)",
      () => {
        const context = gsap.context(() => {
          gsap.fromTo(
            ".pe-hero .pe-path",
            {
              attr: { pathLength: 1 },
              strokeDasharray: 1,
              strokeDashoffset: 1,
            },
            {
              strokeDashoffset: 0,
              duration: 1.3,
              stagger: 0.018,
              ease: "power2.inOut",
              clearProps: "strokeDasharray,strokeDashoffset",
            },
          );
          gsap.to(".pe-hero-field", {
            xPercent: 5,
            yPercent: 8,
            ease: "none",
            scrollTrigger: {
              trigger: ".pe-hero",
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });
          gsap.to(".pe-hero-copy", {
            y: -48,
            ease: "none",
            scrollTrigger: {
              trigger: ".pe-hero",
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });
          gsap.fromTo(
            ".pe-reality-frame",
            { clipPath: "inset(8% 22% 8% 22%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              ease: "none",
              scrollTrigger: {
                trigger: ".pe-reality",
                start: "top 85%",
                end: "top 15%",
                scrub: true,
              },
            },
          );
          gsap.fromTo(
            ".pe-reality .pe-media",
            { yPercent: -5, scale: 1.1 },
            {
              yPercent: 5,
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: ".pe-reality",
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
          gsap.fromTo(
            ".pe-condition-system",
            { scale: 0.94 },
            {
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: ".pe-conditions",
                start: "top 70%",
                end: "center 55%",
                scrub: true,
              },
            },
          );
          gsap.fromTo(
            ".pe-monte-field",
            { xPercent: 12, scale: 0.92 },
            {
              xPercent: 0,
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: ".pe-monte",
                start: "top bottom",
                end: "center center",
                scrub: true,
              },
            },
          );
          gsap.fromTo(
            ".pe-game-matrix",
            { rotate: -7, xPercent: 16 },
            {
              rotate: 0,
              xPercent: 0,
              ease: "none",
              scrollTrigger: {
                trigger: ".pe-game",
                start: "top bottom",
                end: "center center",
                scrub: true,
              },
            },
          );
          gsap.fromTo(
            ".pe-game-foreground",
            { yPercent: 12 },
            {
              yPercent: -6,
              ease: "none",
              scrollTrigger: {
                trigger: ".pe-game",
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
          gsap.fromTo(
            ".pe-market-photo",
            { clipPath: "inset(0 0 0 28%)" },
            {
              clipPath: "inset(0 0 0 0%)",
              ease: "none",
              scrollTrigger: {
                trigger: ".pe-market",
                start: "top 80%",
                end: "center center",
                scrub: true,
              },
            },
          );
          gsap.to(".pe-agent-photo", {
            opacity: 0.16,
            ease: "none",
            scrollTrigger: {
              trigger: ".pe-agents",
              start: "center center",
              end: "bottom 20%",
              scrub: true,
            },
          });
          gsap.fromTo(
            ".pe-agent-field",
            { scale: 0.85, rotate: -8 },
            {
              scale: 1.08,
              rotate: 0,
              ease: "none",
              scrollTrigger: {
                trigger: ".pe-agents",
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
          gsap.to(".pe-resolution-field", {
            scaleX: 0.03,
            opacity: 0.05,
            transformOrigin: "5% 50%",
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: ".pe-resolution",
              start: "top 75%",
              end: "center 55%",
              scrub: true,
            },
          });
        }, root);
        return () => context.revert();
      },
    );
    return () => media.revert();
  }, [root]);
}
