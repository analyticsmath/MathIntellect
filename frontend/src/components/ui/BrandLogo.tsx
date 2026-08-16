import { Link } from 'react-router-dom';

interface BrandLogoProps {
  compact?: boolean;
  href?: string;
  showTagline?: boolean;
  className?: string;
}

export function BrandLogo({ compact = false, href = '/', showTagline = true, className = '' }: BrandLogoProps) {
  const markSize = compact ? 28 : 34;

  return (
    <Link to={href} className={`inline-flex items-center gap-2.5 ${className}`}>
      <span
        className="grid place-items-center bg-mi-ink text-mi-paper shrink-0 rounded-xs"
        style={{
          width: markSize,
          height: markSize,
        }}
        aria-hidden
      >
        <span className="font-mono text-xs font-bold">MI</span>
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold tracking-tight text-mi-ink">
          Math Intellect
        </span>
        {showTagline && (
          <span className="block text-[10px] font-mono text-mi-muted">
            Decision Workbench
          </span>
        )}
      </span>
    </Link>
  );
}
