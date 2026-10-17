import {
  useEffect,
  useRef,
  type MouseEvent,
  type PropsWithChildren,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
export function PublicTransitionProvider({ children }: PropsWithChildren) {
  const navigate = useNavigate(),
    location = useLocation();
  const active = useRef<{
    clone: Element;
    animation?: Animation;
    frame?: number;
  } | null>(null);
  const pending = useRef(false);
  const cancel = () => {
    const current = active.current;
    if (current) {
      current.animation?.cancel();
      if (current.frame) cancelAnimationFrame(current.frame);
      current.clone.remove();
      active.current = null;
    }
    pending.current = false;
  };
  useEffect(() => () => cancel(), []);
  useEffect(() => {
    if (!pending.current) {
      cancel();
      return;
    }
    if (!active.current) return;
    pending.current = false;
    const current = active.current;
    let attempts = 0;
    const handoff = () => {
      if (active.current !== current) return;
      const target = document.querySelector<SVGElement>(
        'main [data-transition-actor="trajectory"]',
      );
      if (!target && attempts++ < 8) {
        current.frame = requestAnimationFrame(handoff);
        return;
      }
      if (!target) {
        cancel();
        return;
      }
      const source = current.clone.getBoundingClientRect(),
        destination = target.getBoundingClientRect();
      current.animation = current.clone.animate(
        [
          { transform: "translate(0,0) scale(1)", opacity: 1 },
          {
            transform: `translate(${destination.x - source.x}px, ${destination.y - source.y}px) scale(${destination.width / source.width}, ${destination.height / source.height})`,
            opacity: 0,
          },
        ],
        {
          duration: 520,
          easing: "cubic-bezier(.22,.61,.36,1)",
          fill: "forwards",
        },
      );
      current.animation.finished
        .then(() => {
          if (active.current === current) {
            cancel();
          }
        })
        .catch(() => {});
    };
    current.frame = requestAnimationFrame(handoff);
  }, [location.key]);
  const capture = (event: MouseEvent<HTMLDivElement>) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    const anchor =
      event.target instanceof Element
        ? event.target.closest<HTMLAnchorElement>("a[href]")
        : null;
    if (
      !anchor ||
      anchor.hasAttribute("download") ||
      (anchor.target && anchor.target !== "_self")
    )
      return;
    const url = new URL(anchor.href, window.location.href);
    if (url.origin !== window.location.origin) return;
    cancel();
    if (url.pathname === location.pathname) return;
    if (
      anchor.dataset.transitionKind !== "trajectory" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const source = anchor
      .closest("section")
      ?.querySelector<SVGElement>('[data-transition-actor="trajectory"]');
    if (!source || typeof source.animate !== "function") return;
    const rect = source.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const clone = source.cloneNode(true) as SVGElement;
    clone.setAttribute("aria-hidden", "true");
    clone.removeAttribute("aria-labelledby");
    clone.classList.add("pe-transition-actor");
    Object.assign(clone.style, {
      position: "fixed",
      left: rect.x + "px",
      top: rect.y + "px",
      width: rect.width + "px",
      height: rect.height + "px",
      zIndex: "90",
      pointerEvents: "none",
      color: getComputedStyle(source).color,
      transformOrigin: "0 0",
    });
    document.body.appendChild(clone);
    active.current = { clone };
    pending.current = true;
    event.preventDefault();
    navigate(url.pathname + url.search + url.hash);
  };
  return <div onClickCapture={capture}>{children}</div>;
}
