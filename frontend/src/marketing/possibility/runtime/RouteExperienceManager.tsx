import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";
const titles: Record<string, string> = {
  "/": "Math Intellect | A model in motion",
  "/models": "Models | Math Intellect",
  "/workbench": "Workbench | Math Intellect",
  "/method": "Method | Math Intellect",
  "/login": "Sign in | Math Intellect",
  "/signup": "Create account | Math Intellect",
};
export function RouteExperienceManager() {
  const location = useLocation(),
    navigationType = useNavigationType();
  const positions = useRef<Record<string, number>>({}),
    lastKey = useRef(location.key),
    lastPath = useRef(location.pathname);
  useEffect(() => {
    if (lastKey.current !== location.key)
      positions.current[lastKey.current] = window.scrollY;
    lastKey.current = location.key;
    if (titles[location.pathname]) document.title = titles[location.pathname];
    const saved = positions.current[location.key];
    if (navigationType === "POP" && saved !== undefined) {
      window.scrollTo({ top: saved, behavior: "auto" });
      lastPath.current = location.pathname;
      return;
    }
    if (location.hash.length > 1) {
      const aliases: Record<string, string> =
        location.pathname === "/models"
          ? { market: "market-dynamics", conflict: "agent-interaction" }
          : {};
      const hash = location.hash.slice(1);
      const frame = requestAnimationFrame(() => {
        const target = document.getElementById(aliases[hash] ?? hash);
        if (target) {
          target.scrollIntoView({ behavior: "auto", block: "start" });
          if (navigationType !== "POP") {
            if (!target.hasAttribute("tabindex"))
              target.setAttribute("tabindex", "-1");
            target.focus({ preventScroll: true });
          }
        }
      });
      lastPath.current = location.pathname;
      return () => cancelAnimationFrame(frame);
    }
    const preserve =
      location.pathname.startsWith("/app/analytics/") &&
      lastPath.current.startsWith("/app/analytics/");
    window.scrollTo({ top: preserve ? window.scrollY : 0, behavior: "auto" });
    lastPath.current = location.pathname;
    if (
      navigationType === "PUSH" &&
      ["/", "/models", "/workbench", "/method", "/login", "/signup"].includes(
        location.pathname,
      )
    ) {
      const frame = requestAnimationFrame(() =>
        document
          .querySelector<HTMLElement>('h1[tabindex="-1"]')
          ?.focus({ preventScroll: true }),
      );
      return () => cancelAnimationFrame(frame);
    }
  }, [location, navigationType]);
  return null;
}
