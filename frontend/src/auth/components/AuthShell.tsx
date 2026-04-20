import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import { BrandLogo } from '../../components/ui/BrandLogo';

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
  return (
    <main className="relative min-h-screen grid place-items-center overflow-hidden px-4 py-16">
      <div className="auth-background-layer" aria-hidden />
      <div className="auth-background-orb auth-background-orb--left" aria-hidden />
      <div className="auth-background-orb auth-background-orb--right" aria-hidden />

      <section className="auth-card w-full max-w-md rounded-3xl p-8">
        <div className="mb-7">
          <BrandLogo className="mb-5" showTagline={false} compact />
          <h1 className="text-3xl tracking-tight mb-2" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-primary)' }}>{title}</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{subtitle}</p>
        </div>

        {children}

        <p className="mt-7 text-sm" style={{ color: 'var(--text-secondary)' }}>
          {footerPrompt}{' '}
          <Link to={footerLinkTo} viewTransition style={{ color: 'var(--brand-blue)', fontWeight: 600 }}>
            {footerLinkLabel}
          </Link>
        </p>
      </section>
    </main>
  );
}
