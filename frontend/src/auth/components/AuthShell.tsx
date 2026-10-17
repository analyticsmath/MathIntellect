import { useRef, type ReactNode } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Photo } from "../../marketing/editorial/Photo";
import "./auth.css";

interface AuthShellProps {
  title: string;
  subtitle: string;
  footerPrompt: string;
  footerLinkLabel: string;
  footerLinkTo: string;
  children: ReactNode;
}

export function AuthShell({
  title,
  subtitle,
  footerPrompt,
  footerLinkLabel,
  footerLinkTo,
  children,
}: AuthShellProps) {
  const root = useRef<HTMLElement>(null);
  const signup = footerLinkTo === "/login";
  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".mi-auth-photo img", {
          scale: 1.15,
          duration: 1.9,
          ease: "power3.out",
        });
        gsap.from(".mi-auth-image-copy > *", {
          y: 50,
          opacity: 0,
          stagger: 0.12,
          duration: 1.2,
          delay: 0.25,
          ease: "power3.out",
        });
        gsap.from(
          ".mi-auth-form-heading, .mi-auth-form form > *, .mi-auth-switch",
          {
            y: 28,
            opacity: 0,
            stagger: 0.065,
            duration: 0.9,
            delay: 0.3,
            ease: "power3.out",
            clearProps: "transform,opacity",
          },
        );
      });
      return () => media.revert();
    },
    { scope: root },
  );
  return (
    <main
      ref={root}
      id="main-content"
      className={"mi-auth " + (signup ? "mi-auth--signup" : "")}
    >
      <section className="mi-auth-visual" aria-label="Explore the possible">
        <figure className="mi-auth-photo">
          <Photo
            id={signup ? "climbers" : "glider"}
            priority
            sizes="(max-width:800px) 100vw, 110vh"
          />
        </figure>
        <Link to="/" className="mi-auth-brand">
          Math Intellect
        </Link>
        <div className="mi-auth-image-copy">
          <p>
            {signup ? (
              <>
                A question.
                <br />A whole new view.
              </>
            ) : (
              <>
                A little curiosity.
                <br />A different horizon.
              </>
            )}
          </p>
          <span>
            {signup
              ? "Set the conditions. Explore what follows."
              : "Your next possibility starts here."}
          </span>
        </div>
        <Link to="/" className="mi-auth-back">
          Explore the site <span aria-hidden="true">↗</span>
        </Link>
      </section>
      <section className="mi-auth-form">
        <Link to="/" className="mi-auth-mobile-brand">
          Math Intellect
        </Link>
        <div className="mi-auth-form-inner">
          <div className="mi-auth-form-heading">
            <h1 tabIndex={-1}>{title}</h1>
            <p>{subtitle}</p>
          </div>
          {children}
          <p className="mi-auth-switch">
            {footerPrompt}{" "}
            <Link to={footerLinkTo}>
              {footerLinkLabel}
              <span aria-hidden="true"> ↗</span>
            </Link>
          </p>
        </div>
        <p className="mi-auth-note">
          A place to turn assumptions into understanding.
        </p>
      </section>
    </main>
  );
}
