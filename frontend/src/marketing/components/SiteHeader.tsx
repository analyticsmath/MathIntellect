import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
export function SiteHeader() {
  const location = useLocation();
  const [openFor, setOpenFor] = useState("");
  const open = openFor === location.key;
  const trigger = useRef<HTMLButtonElement>(null),
    menu = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const elements = () =>
      Array.from(menu.current?.querySelectorAll<HTMLElement>("a,button") ?? []);
    elements()[0]?.focus();
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenFor("");
        trigger.current?.focus();
      }
      if (event.key === "Tab") {
        const items = elements();
        if (event.shiftKey && document.activeElement === items[0]) {
          event.preventDefault();
          items.at(-1)?.focus();
        } else if (!event.shiftKey && document.activeElement === items.at(-1)) {
          event.preventDefault();
          items[0]?.focus();
        }
      }
    };
    window.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", key);
    };
  }, [open]);
  const links = [
    ["Models", "/models"],
    ["Workbench", "/workbench"],
    ["Method", "/method"],
  ];
  return (
    <>
      <header className={`mi-site-header ${open ? "mi-header-open" : ""}`}>
        <Link to="/" className="mi-brand" aria-label="Math Intellect home">
          math intellect<span aria-hidden="true">·</span>
        </Link>
        <nav aria-label="Main navigation">
          {links.map(([label, to]) => (
            <Link
              key={to}
              to={to}
              aria-current={location.pathname === to ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="mi-header-actions">
          <Link to="/login">Sign in ↗</Link>
          <button
            ref={trigger}
            aria-expanded={open}
            aria-controls="mi-navigation"
            onClick={() => setOpenFor(open ? "" : location.key)}
          >
            {open ? "Close" : "Menu"}{" "}
            <span aria-hidden="true">{open ? "−" : "+"}</span>
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
          data-lenis-prevent
        >
          <button
            className="mi-menu-close"
            onClick={() => {
              setOpenFor("");
              trigger.current?.focus();
            }}
          >
            Close −
          </button>
          <nav>
            {[
              ["Home", "/"],
              ...links,
              ["Sign in", "/login"],
              ["Start modeling", "/signup"],
            ].map(([label, to]) => (
              <Link key={to} to={to} onClick={() => setOpenFor("")}>
                {label}
                <span aria-hidden="true">↗</span>
              </Link>
            ))}
          </nav>
          <p>A question worth following.</p>
        </div>
      )}
    </>
  );
}
