import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const links = [
  ["Models", "/models"],
  ["Workbench", "/workbench"],
  ["Method", "/method"],
];

export function SiteHeader() {
  const location = useLocation();
  const [openFor, setOpenFor] = useState("");
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
        } else if (!event.shiftKey && document.activeElement === focusable.at(-1)) {
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
      <header className="mi-site-header">
        <Link to="/" viewTransition className="mi-brand" aria-label="Math Intellect home">
          <svg className="mi-brand-mark" viewBox="0 0 40 40" aria-hidden="true">
            <path d="M5 31C11 31 11 9 18 9S25 31 35 31" />
            <path d="M5 31C13 29 16 21 20 17S28 8 35 9" />
            <path d="M5 31C13 32 17 33 20 28S27 20 35 19" />
            <circle cx="5" cy="31" r="2.5" />
          </svg>
          <span>Math Intellect</span>
        </Link>

        <nav aria-label="Main navigation" className="mi-header-navigation">
          {links.map(([label, to]) => (
            <Link
              key={to}
              to={to}
              viewTransition
              aria-current={location.pathname === to ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="mi-header-actions">
          <Link to="/workbench" viewTransition className="mi-header-run">
            Open workbench <span aria-hidden="true">↗</span>
          </Link>
          <Link to="/login" viewTransition className="mi-header-signin">Sign in</Link>
          <button
            ref={trigger}
            type="button"
            aria-expanded={open}
            aria-controls="mi-navigation"
            aria-label={open ? "Close navigation" : "Open navigation"}
            onClick={() => setOpenFor(open ? "" : location.key)}
          >
            <span className={"mi-menu-icon" + (open ? " is-open" : "")} aria-hidden="true">
              <i /><i />
            </span>
            <span className="mi-menu-label">{open ? "Close" : "Menu"}</span>
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
          <button
            className="mi-menu-close"
            type="button"
            onClick={() => {
              closeMenu();
              trigger.current?.focus();
            }}
          >
            Close menu
          </button>

          <nav aria-label="Site">
            {[
              ["Home", "/"],
              ...links,
              ["Sign in", "/login"],
              ["Create an account", "/signup"],
            ].map(([label, to], index) => (
              <Link
                key={to}
                to={to}
                viewTransition
                onClick={closeMenu}
                style={{ animationDelay: (index * 75) + "ms" }}
              >
                {label}
              </Link>
            ))}
          </nav>

          <p>Start with a question. Keep the conditions beside the result.</p>
        </div>
      )}
    </>
  );
}

export default SiteHeader;
