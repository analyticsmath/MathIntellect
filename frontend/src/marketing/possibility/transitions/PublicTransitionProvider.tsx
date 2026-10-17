import {
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type PropsWithChildren,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
const publicRoutes = [
  "/",
  "/models",
  "/workbench",
  "/method",
  "/login",
  "/signup",
];
export function PublicTransitionProvider({ children }: PropsWithChildren) {
  const navigate = useNavigate();
  const location = useLocation();
  const [phase, setPhase] = useState<"idle" | "cover" | "reveal">("idle");
  const [revision, setRevision] = useState(0);
  const destination = useRef("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mounted = useRef(true);
  const pending = useRef(false);
  const locationKey = location.pathname + location.search + location.hash;
  const observedLocation = useRef(locationKey);
  const clearTimer = () => {
    if (timer.current !== null) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  };
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      clearTimer();
    };
  }, []);
  useEffect(() => {
    const cancelInterrupted = () => {
      observedLocation.current = locationKey;
      if (pending.current) {
        clearTimer();
        pending.current = false;
        setPhase("idle");
      }
    };
    window.addEventListener("popstate", cancelInterrupted);
    window.addEventListener("hashchange", cancelInterrupted);
    return () => {
      window.removeEventListener("popstate", cancelInterrupted);
      window.removeEventListener("hashchange", cancelInterrupted);
    };
  }, [locationKey]);
  const capture = (e: MouseEvent<HTMLDivElement>) => {
    if (
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey
    )
      return;
    const anchor =
      e.target instanceof Element
        ? e.target.closest<HTMLAnchorElement>("a[href]")
        : null;
    if (
      !anchor ||
      anchor.hasAttribute("download") ||
      (anchor.target && anchor.target !== "_self")
    )
      return;
    const url = new URL(anchor.href, window.location.href);
    if (url.origin !== window.location.origin) return;
    const cancelPending = () => {
      clearTimer();
      pending.current = false;
      setPhase("idle");
    };
    if (pending.current) cancelPending();
    if (
      url.pathname === location.pathname ||
      !publicRoutes.includes(url.pathname)
    )
      return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    e.preventDefault();
    destination.current = url.pathname + url.search + url.hash;
    pending.current = true;
    setRevision((v) => v + 1);
    setPhase("cover");
    timer.current = setTimeout(() => {
      if (!mounted.current) return;
      pending.current = false;
      timer.current = null;
      navigate(destination.current);
      setPhase("reveal");
      timer.current = setTimeout(() => {
        timer.current = null;
        if (mounted.current) setPhase("idle");
      }, 670);
    }, 450);
  };
  return (
    <div onClickCapture={capture}>
      {children}
      {phase !== "idle" && (
        <div
          key={revision + phase}
          className={"mi-curtain mi-curtain--" + phase}
          aria-hidden="true"
        >
          <span>Math Intellect</span>
        </div>
      )}
    </div>
  );
}
