import { useRef, type PointerEvent, type ReactNode } from 'react';

interface MarketingCardProps {
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

export function MarketingCard({ title, description, children, className }: MarketingCardProps) {
  const cardRef = useRef<HTMLElement>(null);

  const handleMove = (event: PointerEvent<HTMLElement>) => {
    const card = cardRef.current;
    if (!card) {
      return;
    }

    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const rotateX = (0.5 - y) * 5;
    const rotateY = (x - 0.5) * 6;
    card.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-2px)`;
  };

  const resetTransform = () => {
    const card = cardRef.current;
    if (!card) {
      return;
    }
    card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px)';
  };

  return (
    <article
      ref={cardRef}
      className={[
        'premium-card premium-card--interactive p-6 md:p-7',
        className ?? '',
      ].join(' ')}
      onPointerMove={handleMove}
      onPointerLeave={resetTransform}
    >
      <h3 className="text-[1.45rem] leading-tight tracking-tight">{title}</h3>
      {description && (
        <p className="text-sm mt-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {description}
        </p>
      )}
      {children && <div className="mt-4 relative z-10">{children}</div>}
    </article>
  );
}
