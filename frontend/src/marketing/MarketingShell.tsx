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
        const artwork = hero.querySelector<HTMLElement>(".mi-hero-artwork");
        const lines = gsap.utils.toArray<HTMLElement>("[data-hero-line]", hero);
        const copy = hero.querySelector<HTMLElement>("[data-hero-copy]");
        const conditions = hero.querySelector<HTMLElement>("[data-hero-conditions]");
        const actions = hero.querySelector<HTMLElement>("[data-hero-actions]");
        const entrance = gsap.timeline({ delay: 0.08, defaults: { ease: "power3.out" } });
        if (artwork) entrance.fromTo(artwork, { autoAlpha: 0, x: 42, scale: 0.96 }, { autoAlpha: 1, x: 0, scale: 1, duration: 1.15 }, 0);
        if (lines.length) entrance.fromTo(lines, { autoAlpha: 0, yPercent: 112 }, { autoAlpha: 1, yPercent: 0, duration: 0.86, stagger: 0.14 }, 0.24);
        if (copy) entrance.fromTo(copy, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.74 }, 0.82);
        if (actions) entrance.fromTo(actions, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.68 }, 1.02);
        if (conditions) entrance.fromTo(conditions, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.7 }, 1.18);
      }

      const reveals = gsap.utils.toArray<HTMLElement>("[data-reveal]", root);
      reveals.forEach((element) => {
        gsap.fromTo(
          element,
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1.05,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 82%",
              once: true,
              fastScrollEnd: true,
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
            duration: 1.55,
            stagger: 0.018,
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
