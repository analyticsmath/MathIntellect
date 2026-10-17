import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { OriginSymbol } from "../possibility/Primitives";

const routes = [
  { label: "Home", to: "/" },
  { label: "Models", to: "/models" },
  { label: "Workbench", to: "/workbench" },
  { label: "Method", to: "/method" },
];

export function SiteHeader() {
  const location = useLocation();
  const [openFor, setOpenFor] = useState("");
  const [preview, setPreview] = useState(0);
  const open = openFor === location.key;
  const trigger = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const items = () =>
      Array.from(menu.current?.querySelectorAll<HTMLElement>("a,button") ?? []);
    items()[0]?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenFor("");
        trigger.current?.focus();
      }
      if (event.key === "Tab") {
        const focusable = items();
        if (event.shiftKey && document.activeElement === focusable[0]) {
          event.preventDefault();
          focusable.at(-1)?.focus();
        } else if (
          !event.shiftKey &&
          document.activeElement === focusable.at(-1)
        ) {
          event.preventDefault();
          focusable[0]?.focus();
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const closeMenu = () => setOpenFor("");
  return (
    <>
      <header className="pe-site-header">
        <Link to="/" className="pe-brand" aria-label="Math Intellect home">
          <span className="pe-brand-mark" aria-hidden="true">
            ∗
          </span>
          Math Intellect
        </Link>
        <nav aria-label="Main navigation" className="pe-header-navigation">
          {routes
            .filter(({ to }) => to === "/models" || to === "/method")
            .map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                aria-current={location.pathname === to ? "page" : undefined}
              >
                {label}
              </Link>
            ))}
        </nav>
        <div className="pe-header-actions">
          <Link to="/workbench" className="pe-header-run">
            Workbench <span aria-hidden="true">↗</span>
          </Link>
          <button
            ref={trigger}
            type="button"
            aria-expanded={open}
            aria-controls="mi-navigation"
            aria-label={open ? "Close navigation" : "Open navigation"}
            onClick={() => {
              setPreview(
                Math.max(
                  0,
                  routes.findIndex(({ to }) => to === location.pathname),
                ),
              );
              setOpenFor(open ? "" : location.key);
            }}
          >
            <span
              className={"pe-menu-icon" + (open ? " is-open" : "")}
              aria-hidden="true"
            >
              <i />
              <i />
            </span>
            <span className="pe-menu-label">{open ? "Close" : "Menu"}</span>
          </button>
        </div>
      </header>
      {open && (
        <div
          ref={menu}
          id="mi-navigation"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
          className="pe-navigation"
        >
          <button
            className="pe-menu-close"
            type="button"
            onClick={() => {
              closeMenu();
              trigger.current?.focus();
            }}
          >
            Close <span aria-hidden="true">×</span>
          </button>
          <div className="pe-menu-composition">
            <nav aria-label="Site">
              {routes.map(({ label, to }, index) => (
                <Link
                  className="pe-menu-route"
                  key={to}
                  to={to}
                  onClick={closeMenu}
                  onMouseEnter={() => setPreview(index)}
                  onFocus={() => setPreview(index)}
                  aria-current={location.pathname === to ? "page" : undefined}
                >
                  <span>{label}</span>
                  <span aria-hidden="true">↗</span>
                </Link>
              ))}
            </nav>
            <figure
              className={"pe-menu-preview pe-menu-preview--" + preview}
              aria-hidden="true"
            >
              <OriginSymbol />
              <span>
                {preview === 3
                  ? "xₜ₊₁ = xₜ + μΔt + σ√Δt Zₜ"
                  : preview === 2
                    ? "x₀ → 24 paths"
                    : preview === 1
                      ? "state → path → matrix → network"
                      : "x₀ = 0"}
              </span>
            </figure>
          </div>
          <div className="pe-menu-bottom">
            <p>Give your next question a mathematical form.</p>
            <div>
              <Link to="/login" onClick={closeMenu}>
                Sign in
              </Link>
              <Link to="/signup" onClick={closeMenu}>
                Create an account <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default SiteHeader;
