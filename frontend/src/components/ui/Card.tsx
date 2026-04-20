import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  noPad?: boolean;
  hoverable?: boolean;
  staggerIndex?: number;
  glow?: 'brand' | 'cyan' | 'emerald' | 'rose' | 'none';
}

const GLOW: Record<NonNullable<CardProps['glow']>, string> = {
  brand: 'radial-gradient(100% 70% at 100% 0%, rgba(59, 130, 246, 0.16), transparent 70%)',
  cyan: 'radial-gradient(100% 70% at 100% 0%, rgba(34, 211, 238, 0.14), transparent 70%)',
  emerald: 'radial-gradient(100% 70% at 100% 0%, rgba(16, 185, 129, 0.14), transparent 70%)',
  rose: 'radial-gradient(100% 70% at 100% 0%, rgba(244, 63, 94, 0.14), transparent 70%)',
  none: 'none',
};

export function Card({
  children,
  className = '',
  title,
  subtitle,
  action,
  noPad,
  hoverable = false,
  staggerIndex,
  glow = 'none',
}: CardProps) {
  const delayClass = staggerIndex !== undefined
    ? ['', 'delay-75', 'delay-150', 'delay-200', 'delay-300', 'delay-400'][Math.min(staggerIndex, 5)]
    : '';

  return (
    <div
      className={[
        'rounded-3xl animate-fade-in relative overflow-hidden',
        'transition-transform duration-300',
        hoverable ? 'cursor-pointer hover:-translate-y-1' : '',
        delayClass,
        className,
      ].join(' ')}
      style={{
        border: '1px solid var(--glass-stroke)',
        background: 'linear-gradient(170deg, rgba(17,24,39,0.96), rgba(11,16,32,0.94))',
        boxShadow: '0 16px 38px rgba(2, 6, 23, 0.5)',
      }}
      data-tilt={hoverable ? '' : undefined}
    >
      {glow !== 'none' && (
        <div className="absolute inset-0 pointer-events-none" style={{ background: GLOW[glow] }} />
      )}

      {(title || action) && (
        <div className="flex items-start justify-between px-5 pt-5 pb-0 relative z-10">
          <div>
            {title && (
              <h3 className="text-sm font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                {subtitle}
              </p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}

      <div className={[noPad ? '' : 'p-5', 'relative z-10'].join(' ')}>{children}</div>
    </div>
  );
}
