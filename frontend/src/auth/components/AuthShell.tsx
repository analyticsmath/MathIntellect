import React from 'react';
import { Link } from 'react-router-dom';

interface AuthShellProps {
  title: string;
  subtitle: string;
  footerPrompt: string;
  footerLinkLabel: string;
  footerLinkTo: string;
  children: React.ReactNode;
}

export const AuthShell: React.FC<AuthShellProps> = ({
  title,
  subtitle,
  footerPrompt,
  footerLinkLabel,
  footerLinkTo,
  children,
}) => {
  return (
    <main className="min-h-screen w-full flex flex-col justify-between bg-mi-canvas text-mi-ink p-6 md:p-12">
      {/* Auth Topbar / Logo */}
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2.5 font-medium text-lg tracking-tight text-mi-ink focus-visible:ring-2 focus-visible:ring-mi-focus"
        >
          <span className="w-3.5 h-3.5 bg-mi-ink inline-block" aria-hidden="true" />
          <span>Math Intellect</span>
        </Link>
        <Link to="/" className="text-xs font-mono text-mi-muted hover:text-mi-ink">
          ← Return to site
        </Link>
      </div>

      {/* Center Form Territory (380-420px high-luminance open composition) */}
      <div className="w-full max-w-[420px] mx-auto my-12 border border-mi-rule bg-mi-paper p-8 shadow-sm">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-medium tracking-tight text-mi-ink">
            {title}
          </h1>
          <p className="mt-2 text-sm text-mi-text leading-relaxed">
            {subtitle}
          </p>
        </div>

        {children}

        <div className="mt-6 pt-5 border-t border-mi-rule text-xs font-mono text-mi-muted text-center">
          {footerPrompt}{' '}
          <Link to={footerLinkTo} className="text-mi-ink font-semibold underline underline-offset-2 hover:text-mi-change">
            {footerLinkLabel}
          </Link>
        </div>
      </div>

      {/* Quiet Auth Footer Note */}
      <div className="w-full max-w-5xl mx-auto text-center text-xs font-mono text-mi-muted">
        Scientific simulation and decision workbench • Verified deterministic calculations
      </div>
    </main>
  );
};
