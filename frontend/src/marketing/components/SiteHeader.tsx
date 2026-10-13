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
          math intellect
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
          <Link to="/login" viewTransition>Sign in</Link>
          <button
            ref={trigger}
            type="button"
            aria-expanded={open}
            aria-controls="mi-navigation"
            aria-label={open ? "Close menu" : "Menu"}
            onClick={() => setOpenFor(open ? "" : location.key)}
          >
            {open ? "Close menu" : "Menu"}
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
            Close
          </button>

          <nav aria-label="Site">
            {[
              ["Home", "/"],
              ...links,
              ["Sign in", "/login"],
              ["Start modeling", "/signup"],
            ].map(([label, to]) => (
              <Link key={to} to={to} viewTransition onClick={closeMenu}>
                {label}
              </Link>
            ))}
          </nav>

          <p>Start with a question. Keep the conditions in view.</p>
        </div>
      )}
    </>
  );
}

