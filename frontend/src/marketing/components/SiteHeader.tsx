import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { PHOTO_LIBRARY } from "../film/photoLibrary";

const routes = [
  { label: "Home", to: "/", photo: PHOTO_LIBRARY.hero },
  { label: "Models", to: "/models", photo: PHOTO_LIBRARY.collectiveFlight },
  { label: "Workbench", to: "/workbench", photo: PHOTO_LIBRARY.waterStudy },
  { label: "Method", to: "/method", photo: PHOTO_LIBRARY.strategy },
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
    const items = () => Array.from(menu.current?.querySelectorAll<HTMLElement>("a,button") ?? []);
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
        <Link to="/" viewTransition className="mi-brand" aria-label="Math Intellect home">Math Intellect</Link>
        <nav aria-label="Main navigation" className="mi-header-navigation">
          {routes.filter(({ to }) => to === "/models" || to === "/method").map(({ label, to }) => (
            <Link key={to} to={to} viewTransition aria-current={location.pathname === to ? "page" : undefined}>{label}</Link>
          ))}
        </nav>
        <div className="mi-header-actions">
          <Link to="/workbench" viewTransition className="mi-header-run">Workbench <span aria-hidden="true">↗</span></Link>
          <button ref={trigger} type="button" aria-expanded={open} aria-controls="mi-navigation"
            aria-label={open ? "Close navigation" : "Open navigation"}
            onClick={() => { setPreview(Math.max(0, routes.findIndex(({ to }) => to === location.pathname))); setOpenFor(open ? "" : location.key); }}>
            <span className={"mi-menu-icon" + (open ? " is-open" : "")} aria-hidden="true"><i /><i /></span>
            <span className="mi-menu-label">{open ? "Close" : "Menu"}</span>
          </button>
        </div>
      </header>
      {open && (
        <div ref={menu} id="mi-navigation" role="dialog" aria-modal="true" aria-label="Navigation" className="mi-navigation">
          <button className="mi-menu-close" type="button" onClick={() => { closeMenu(); trigger.current?.focus(); }}>Close <span aria-hidden="true">×</span></button>
          <div className="mi-menu-composition">
            <nav aria-label="Site">
              {routes.map(({ label, to }, index) => (
                <Link className="mi-menu-route" key={to} to={to} viewTransition onClick={closeMenu}
                  onMouseEnter={() => setPreview(index)} onFocus={() => setPreview(index)}
                  aria-current={location.pathname === to ? "page" : undefined}><span>{label}</span><span aria-hidden="true">↗</span></Link>
              ))}
            </nav>
            <figure className="mi-menu-preview" aria-hidden="true">
              <img key={preview} src={routes[preview].photo.wideSrc} alt="" width="1000" height="700" />
            </figure>
          </div>
          <div className="mi-menu-bottom">
            <p>Give your next question a mathematical form.</p>
            <div><Link to="/login" viewTransition onClick={closeMenu}>Sign in</Link><Link to="/signup" viewTransition onClick={closeMenu}>Create an account <span aria-hidden="true">↗</span></Link></div>
          </div>
        </div>
      )}
    </>
  );
}
export default SiteHeader;
