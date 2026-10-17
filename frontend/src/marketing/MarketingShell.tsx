import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SkipLink } from "./components/SkipLink";
import { SiteHeader } from "./components/SiteHeader";
import { SiteFooter } from "./components/SiteFooter";
import { ScenarioProvider } from "./film/ScenarioContext";
import "./editorial/editorial.css";
import "@fontsource-variable/geist";
import "lenis/dist/lenis.css";
import "./editorial/cinematic.css";
export function MarketingShell() {
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lenis: Lenis | undefined;
    const tick = (time: number) => lenis?.raf(time * 1000);
    const scrollTo = (event: Event) => {
      const top = (event as CustomEvent<number>).detail;
      if (!Number.isFinite(top)) return;
      if (lenis) lenis.scrollTo(top, { duration: 0.85 });
      else
        window.scrollTo({ top, behavior: query.matches ? "auto" : "smooth" });
    };
    const update = () => {
      lenis?.destroy();
      lenis = undefined;
      if (!query.matches) {
        lenis = new Lenis({
          autoRaf: false,
          duration: 0.95,
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
    gsap.ticker.add(tick);
    window.addEventListener("mi:scroll-to", scrollTo);
    query.addEventListener("change", update);
    return () => {
      query.removeEventListener("change", update);
      gsap.ticker.remove(tick);
      window.removeEventListener("mi:scroll-to", scrollTo);
      lenis?.destroy();
    };
  }, []);
  return (
    <ScenarioProvider>
      <div className="mi-public">
        <SkipLink />
        <SiteHeader />
        <main id="main-content">
          <Outlet />
        </main>
        <SiteFooter />
      </div>
    </ScenarioProvider>
  );
}
export default MarketingShell;
