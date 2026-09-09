import { useEffect, useRef, type PropsWithChildren } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLocation } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

export function DesktopLenisBridge({ children }: PropsWithChildren) {
  const lenisRef = useRef<Lenis | null>(null);
  const location = useLocation();

  useEffect(() => {
    // Only activate on desktop (>=1024px) with a fine pointer (mouse/trackpad)
    const isDesktop = window.innerWidth >= 1024;
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!isDesktop || !isFinePointer || prefersReducedMotion) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      syncTouch: false,
      anchors: true,
      autoRaf: false,
    });

    lenisRef.current = lenis;

    const onScroll = () => {
      ScrollTrigger.update();
    };

    lenis.on('scroll', onScroll);

    const ticker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off('scroll', onScroll);
      gsap.ticker.remove(ticker);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Stop inertia on route change
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.stop();
      lenisRef.current.start();
      ScrollTrigger.refresh();
    }
  }, [location.pathname]);

  return <>{children}</>;
}
