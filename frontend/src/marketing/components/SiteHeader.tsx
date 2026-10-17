import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Photo, type PhotoId } from "../editorial/Photo";
const routes = [
  { label: "Home", to: "/", photo: "vanes" },
  { label: "Models", to: "/models", photo: "chess" },
  { label: "Try an example", to: "/workbench", photo: "birds" },
  { label: "How it works", to: "/method", photo: "mechanism" },
] as const;
export function SiteHeader() {
  const location = useLocation();
  const [openFor, setOpenFor] = useState("");
  const [preview, setPreview] = useState<PhotoId>("vanes");
  const open = openFor === location.key;
  const trigger = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const prior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const elements = () =>
      Array.from(menu.current?.querySelectorAll<HTMLElement>("a,button") ?? []);
    elements()[0]?.focus();
    const keydown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenFor("");
        trigger.current?.focus();
      }
      if (e.key === "Tab") {
        const list = elements();
        if (e.shiftKey && document.activeElement === list[0]) {
          e.preventDefault();
          list.at(-1)?.focus();
        } else if (!e.shiftKey && document.activeElement === list.at(-1)) {
          e.preventDefault();
          list[0]?.focus();
        }
      }
    };
    window.addEventListener("keydown", keydown);
    return () => {
      document.body.style.overflow = prior;
      window.removeEventListener("keydown", keydown);
    };
  }, [open]);
  const close = () => setOpenFor("");
  return (
    <>
      <header
        className={
          "mi-site-header" +
          (location.pathname !== "/" ? " mi-site-header--light" : "")
        }
      >
        <Link to="/" className="mi-brand" aria-label="Math Intellect home">
          <span className="mi-brand-mark" aria-hidden="true">
            ∗
          </span>
          Math Intellect
        </Link>
        <nav aria-label="Main navigation" className="mi-header-links">
          {routes.slice(1).map((r) => (
            <Link
              key={r.to}
              to={r.to}
              aria-current={location.pathname === r.to ? "page" : undefined}
            >
              {r.label}
            </Link>
          ))}
        </nav>
        <div className="mi-header-actions">
          <Link className="mi-header-signin" to="/login">
            Sign in
          </Link>
          <button
            type="button"
            ref={trigger}
            className="mi-menu-button"
            aria-expanded={open}
            aria-controls="mi-navigation"
            aria-label={open ? "Close navigation" : "Open navigation"}
            onClick={() => setOpenFor(open ? "" : location.key)}
          >
            <span className="mi-menu-symbol" aria-hidden="true">
              <i />
              <i />
            </span>
            Menu
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
          className="mi-navigation"
        >
          <div className="mi-menu-top">
            <span className="mi-brand">Math Intellect</span>
            <button
              className="mi-menu-close"
              onClick={() => {
                close();
                trigger.current?.focus();
              }}
            >
              Close <span aria-hidden="true">×</span>
            </button>
          </div>
          <div className="mi-menu-composition">
            <nav aria-label="Site">
              {routes.map((r) => (
                <Link
                  key={r.to}
                  to={r.to}
                  className="mi-menu-route"
                  onClick={close}
                  onFocus={() => setPreview(r.photo)}
                  onMouseEnter={() => setPreview(r.photo)}
                  aria-current={location.pathname === r.to ? "page" : undefined}
                >
                  <span>{r.label}</span>
                  <span aria-hidden="true">↗</span>
                </Link>
              ))}
            </nav>
            <figure className="mi-menu-preview" aria-hidden="true">
              <Photo key={preview} id={preview} decorative sizes="50vw" />
            </figure>
          </div>
          <div className="mi-menu-bottom">
            <p>Give your next question a mathematical form.</p>
            <div>
              <Link to="/login" onClick={close}>
                Sign in
              </Link>
              <Link to="/signup" onClick={close}>
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
