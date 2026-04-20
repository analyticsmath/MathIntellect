import { Link } from 'react-router-dom';

interface BrandLogoProps {
  compact?: boolean;
  href?: string;
  showTagline?: boolean;
  className?: string;
}

export function BrandLogo({ compact = false, href = '/', showTagline = true, className = '' }: BrandLogoProps) {
  const markSize = compact ? 34 : 40;

  return (
    <Link to={href} viewTransition className={`inline-flex items-center gap-3 ${className}`}>
      <span
        className="relative grid place-items-center rounded-xl shrink-0"
        style={{
          width: markSize,
          height: markSize,
          background: 'var(--brand-gradient)',
          boxShadow: '0 0 0 1px rgba(248,250,252,0.12), 0 10px 26px rgba(110,231,255,0.3)',
          viewTransitionName: 'brand-mark',
        }}
      >
        <svg width={compact ? 18 : 20} height={compact ? 18 : 20} viewBox="0 0 20 20" fill="none" aria-hidden>
          <path d="M3.5 12.4 10 3.2l6.5 9.2-2.1 1.4L10 7.7l-4.4 6.1-2.1-1.4Z" fill="#F8FAFC" />
          <circle cx="10" cy="15.7" r="1.6" fill="#F8FAFC" />
        </svg>
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          Math Intellect
        </span>
        {showTagline && (
          <span className="block text-[10px] uppercase tracking-[0.2em]" style={{ color: 'var(--text-muted)' }}>
            Where Math Meets Intelligence
          </span>
        )}
      </span>
    </Link>
  );
}
