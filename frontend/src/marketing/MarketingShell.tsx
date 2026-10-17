import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SkipLink } from "./components/SkipLink";
import { SiteHeader } from "./components/SiteHeader";
import { SiteFooter } from "./components/SiteFooter";
import { ScenarioProvider } from "./film/ScenarioContext";
import { PublicTransitionProvider } from "./possibility/transitions/PublicTransitionProvider";
import "./editorial/editorial.css";
export function MarketingShell() {
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lenis: Lenis | undefined;
    const update = () => {
      lenis?.destroy();
      lenis = undefined;
      if (!query.matches) {
        lenis = new Lenis({
          autoRaf: true,
          duration: 1.1,
          smoothWheel: true,
          anchors: { offset: -80 },
          prevent: (node) =>
            node.closest('[role="dialog"]') !== null ||
            document.body.style.overflow === "hidden",
        });
        lenis.on("scroll", ScrollTrigger.update);
      }
    };
    update();
    query.addEventListener("change", update);
    return () => {
      query.removeEventListener("change", update);
      lenis?.destroy();
    };
  }, []);
  return (
    <ScenarioProvider>
      <PublicTransitionProvider>
        <div className="mi-public">
          <SkipLink />
          <SiteHeader />
          <main id="main-content">
            <Outlet />
          </main>
          <SiteFooter />
        </div>
      </PublicTransitionProvider>
    </ScenarioProvider>
  );
}
export default MarketingShell;
