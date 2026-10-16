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
      const reveals = gsap.utils.toArray<HTMLElement>("[data-reveal]", root);
      reveals.forEach((element) => {
        gsap.fromTo(
          element,
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
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
            duration: 1.65,
            stagger: 0.035,
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
