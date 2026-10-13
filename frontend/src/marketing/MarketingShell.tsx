import React, { useLayoutEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
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

    const supportsMotion =
      window.matchMedia("(prefers-reduced-motion: no-preference)").matches &&
      "IntersectionObserver" in window;
    if (!supportsMotion) {
      root.removeAttribute("data-motion");
      return;
    }

    root.setAttribute("data-motion", "ready");
    const reveals = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 },
    );

    reveals.forEach((element) => {
      if (element.getBoundingClientRect().top < window.innerHeight * 0.88) {
        element.classList.add("is-visible");
      } else {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
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
