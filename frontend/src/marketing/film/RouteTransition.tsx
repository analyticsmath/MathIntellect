import { useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import gsap from "gsap";
import { takeCarry } from "./navigationCarry";

export function RouteTransition() {
  const location = useLocation();
  const overlayRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const snapshot = takeCarry();
    const overlay = overlayRef.current;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const frame = requestAnimationFrame(() => {
      const heading = document.querySelector<HTMLElement>("#main-content h1");
      heading?.focus({ preventScroll: true });
    });
    if (
      !snapshot ||
      !overlay ||
      reduced ||
      performance.now() - snapshot.time > 1500
    )
      return () => cancelAnimationFrame(frame);
    const plane = document.createElement("div");
    plane.style.overflow = "hidden";
    const image = document.createElement("img");
    image.src = snapshot.src;
    image.alt = "";
    image.style.objectFit = "cover";
    image.style.objectPosition = snapshot.position;
    image.style.filter = snapshot.filter;
    Object.assign(plane.style, {
      position: "fixed",
      left: `${snapshot.rect.left}px`,
      top: `${snapshot.rect.top}px`,
      width: `${snapshot.rect.width}px`,
      height: `${snapshot.rect.height}px`,
    });
    Object.assign(image.style, {
      position: "absolute",
      left: `${snapshot.imageRect.left - snapshot.rect.left}px`,
      top: `${snapshot.imageRect.top - snapshot.rect.top}px`,
      width: `${snapshot.imageRect.width}px`,
      height: `${snapshot.imageRect.height}px`,
      maxWidth: "none",
    });
    plane.append(image);
    overlay.replaceChildren(plane);
    let tween: gsap.core.Tween | null = null;
    let cancelled = false;
    const finish = () => {
      if (!cancelled) overlay.replaceChildren();
    };
    const timeout = window.setTimeout(finish, 750);
    let destinationFrame = requestAnimationFrame(() => {
      destinationFrame = requestAnimationFrame(() => {
        const target = document.querySelector<HTMLImageElement>(
          `#main-content [data-mi-actor="${snapshot.id}"] img`,
        );
        if (!target) {
          finish();
          return;
        }
        if (!target.complete) {
          finish();
          return;
        }
        const inner = target.getBoundingClientRect();
        const rect = (
          target.closest(".mi-photo") ?? target
        ).getBoundingClientRect();
        if (
          rect.width < 1 ||
          rect.top > window.innerHeight ||
          rect.bottom < 0
        ) {
          finish();
          return;
        }
        tween = gsap.to(plane, {
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
          duration: 0.48,
          ease: "power3.inOut",
          onComplete: finish,
        });
        gsap.to(image, {
          left: inner.left - rect.left,
          top: inner.top - rect.top,
          width: inner.width,
          height: inner.height,
          duration: 0.48,
          ease: "power3.inOut",
        });
      });
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      cancelAnimationFrame(destinationFrame);
      clearTimeout(timeout);
      tween?.kill();
      gsap.killTweensOf(image);
      overlay.replaceChildren();
    };
  }, [location.key]);
  return <div ref={overlayRef} className="mi-route-carry" aria-hidden="true" />;
}
