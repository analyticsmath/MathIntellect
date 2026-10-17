import { Link } from "react-router-dom";
import type { ReactNode } from "react";
export function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="pe-arrow">
      <path d={diagonal ? "M5 19 19 5M5 5h14v14" : "M4 12h15m-6-6 6 6-6 6"} />
    </svg>
  );
}
export function ActionLink({
  to,
  children,
  primary = false,
  carry = false,
}: {
  to: string;
  children: ReactNode;
  primary?: boolean;
  carry?: boolean;
}) {
  return (
    <Link
      to={to}
      className={"pe-action " + (primary ? "pe-action--primary" : "")}
      data-transition-kind={carry ? "trajectory" : undefined}
    >
      {children}
      <Arrow diagonal />
    </Link>
  );
}
export function OriginSymbol({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={"pe-origin-symbol " + className}
      aria-hidden="true"
    >
      <path d="M0 50h100M50 0v100" />
      <circle cx="50" cy="50" r="22" />
      <circle cx="50" cy="50" r="4" fill="currentColor" />
    </svg>
  );
}
