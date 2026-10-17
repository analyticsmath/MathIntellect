import { Link } from 'react-router-dom';

interface BrandLogoProps {
  compact?: boolean;
  href?: string;
  showTagline?: boolean;
  className?: string;
}

export function BrandLogo({ compact = false, href = '/', className = '' }: BrandLogoProps) {
  return (
    <Link
      to={href}
      className={`inline-flex items-center ${className}`}
      aria-label="Math Intellect home"
    >
      <span className={compact ? "text-sm font-semibold tracking-tight text-mi-ink" : "text-base font-semibold tracking-tight text-mi-ink"}>
        Math Intellect
      </span>
    </Link>
  );
}

export default BrandLogo;
