import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  noPad?: boolean;
  hoverable?: boolean;
}

export function Card({
  children,
  className = '',
  title,
  subtitle,
  action,
  noPad,
  hoverable = false,
}: CardProps) {
  return (
    <div
      className={[
        'bg-mi-paper border border-mi-rule rounded-sm',
        hoverable ? 'hover:border-mi-rule-strong transition-colors' : '',
        className,
      ].join(' ')}
    >
      {(title || action) && (
        <div className="flex items-start justify-between px-5 pt-5 pb-2 border-b border-mi-rule">
          <div>
            {title && (
              <h3 className="text-sm font-semibold text-mi-ink">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-mi-muted mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}

      <div className={noPad ? '' : 'p-5'}>{children}</div>
    </div>
  );
}
