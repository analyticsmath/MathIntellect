import React, { useLayoutEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SkipLink } from "./components/SkipLink";
import { SiteHeader } from "./components/SiteHeader";
import { SiteFooter } from "./components/SiteFooter";
import { ScenarioProvider } from "./film/ScenarioContext";
import "./film/film.css";

export const MarketingShell: React.FC = () => {
  const location = useLocation();

  useLayoutEffect(() => {
    const root = document.querySelector<HTMLElement>(".mi-cinema");
    if (!root) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches) {
      root.removeAttribute("data-motion");
      return;
    }

    root.setAttribute("data-motion", "ready");
    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      const hero = root.querySelector<HTMLElement>("[data-home-hero]");
      if (hero) {
        const heroImage = hero.querySelector<HTMLElement>(".mi-hero-image");
        const lines = gsap.utils.toArray<HTMLElement>("[data-hero-line]", hero);
        const copy = hero.querySelector<HTMLElement>("[data-hero-copy]");
        const conditions = hero.querySelector<HTMLElement>("[data-hero-conditions]");
        const actions = hero.querySelector<HTMLElement>("[data-hero-actions]");
        const entrance = gsap.timeline({ delay: 0.08, defaults: { ease: "power2.out" } });
        if (heroImage) entrance.fromTo(heroImage, { autoAlpha: 0, scale: 1.045 }, { autoAlpha: 1, scale: 1, duration: 1.35 }, 0);
        if (lines.length) entrance.fromTo(lines, { autoAlpha: 0, yPercent: 108 }, { autoAlpha: 1, yPercent: 0, duration: 1.02, stagger: 0.18, ease: "power3.out" }, 0.22);
        if (copy) entrance.fromTo(copy, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.78 }, 1.56);
        if (actions) entrance.fromTo(actions, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.72 }, 1.94);
        if (conditions) entrance.fromTo(conditions, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.72 }, 2.28);
      }

      const reveals = gsap.utils.toArray<HTMLElement>("[data-reveal]", root);
      reveals.forEach((element) => {
        gsap.fromTo(
          element,
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1.18,
            ease: "power2.out",
            scrollTrigger: {
              trigger: element,
              start: "top 82%",
              once: true,
              fastScrollEnd: false,
            },
          },
        );
      });

      const plottedSections = gsap.utils.toArray<HTMLElement>("[data-path-draw]", root);
      plottedSections.forEach((section) => {
        const paths = section.querySelectorAll<SVGPathElement>(".mi-path");
        gsap.fromTo(
          paths,
          { strokeDasharray: 1, strokeDashoffset: 1 },
          {
            strokeDashoffset: 0,
            duration: 2.05,
            stagger: 0.024,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 88%",
              once: true,
              fastScrollEnd: true,
            },
          },
        );
      });
    }, root);

    const refreshFrame = window.requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      window.cancelAnimationFrame(refreshFrame);
      context.revert();
    };
  }, [location.pathname]);

  return (
    <ScenarioProvider>
      <div className="mi-cinema">
        <SkipLink />
        <SiteHeader />
        <main id="main-content" className="mi-page">
          <Outlet />
        </main>
        <SiteFooter />
      </div>
    </ScenarioProvider>
  );
};

export default MarketingShell;
