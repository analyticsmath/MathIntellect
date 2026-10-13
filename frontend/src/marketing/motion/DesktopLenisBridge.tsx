import { useEffect, useRef, type PropsWithChildren } from "react";
import { useLocation } from "react-router-dom";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
export function DesktopLenisBridge({ children }: PropsWithChildren) {
  const lenisRef = useRef<Lenis | null>(null);
  const { pathname, hash } = useLocation();
  useEffect(() => {
    const media = gsap.matchMedia();
    let disposed = false;
    media.add(
      "(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
      () => {
        const lenis = new Lenis({
          autoRaf: false,
          smoothWheel: true,
          syncTouch: false,
          lerp: 0.085,
          anchors: true,
        });
        lenisRef.current = lenis;
        lenis.on("scroll", ScrollTrigger.update);
        const tick = (time: number) => lenis.raf(time * 1000);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);
        return () => {
          gsap.ticker.remove(tick);
          lenis.off("scroll", ScrollTrigger.update);
          lenis.destroy();
          lenisRef.current = null;
          gsap.ticker.lagSmoothing(500, 33);
        };
      },
    );
    void document.fonts.ready.then(() => {
      if (!disposed) ScrollTrigger.refresh();
    });
    return () => {
      disposed = true;
      media.revert();
    };
  }, []);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      lenisRef.current?.scrollTo(window.scrollY, {
        immediate: true,
        force: true,
      });
      ScrollTrigger.refresh();
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash]);
  return <>{children}</>;
}
