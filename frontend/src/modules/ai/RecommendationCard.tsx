import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import type { CoachRecommendation } from '../../types/phase5.types';

interface RecommendationCardProps {
  recommendation: CoachRecommendation;
  onAccept?: () => void;
}

const ADJUSTMENT_META = {
  increase: { label: 'Increase Difficulty', color: '#ff9db2', icon: '↑' },
  decrease: { label: 'Ease Difficulty', color: '#8ef3e4', icon: '↓' },
  maintain: { label: 'Maintain Level', color: '#b4d9ff', icon: '→' },
};

const TYPE_COLORS: Record<string, string> = {
  monte_carlo: '#8ef3e4',
  game_theory: '#b4d9ff',
  market: '#ffd49e',
  conflict: '#ff9db2',
  custom: '#d0c8ff',
};

export function RecommendationCard({ recommendation, onAccept }: RecommendationCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const shimmerRef = useRef<HTMLDivElement>(null);

  const adj = ADJUSTMENT_META[recommendation.difficultyAdjustment];
  const typeColor = TYPE_COLORS[recommendation.nextSimulation.type] ?? '#b4d9ff';

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(cardRef.current, { y: 12, opacity: 0, duration: 0.5, ease: 'power3.out' });
      gsap.to(shimmerRef.current, {
        backgroundPosition: '200% center',
        duration: 2.5,
        ease: 'none',
        repeat: -1,
      });
    });
    return () => ctx.revert();
  }, [recommendation]);

  return (
    <div
      ref={cardRef}
      className="relative overflow-hidden rounded-2xl p-4 space-y-3"
      style={{
        background: 'linear-gradient(135deg, rgba(18,34,52,0.9), rgba(10,18,30,0.95))',
        border: `1px solid ${typeColor}35`,
      }}
    >
      {/* Shimmer overlay */}
      <div
        ref={shimmerRef}
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background: `linear-gradient(90deg, transparent, ${typeColor}25, transparent)`,
          backgroundSize: '200% 100%',
        }}
      />

      <div className="relative z-10 space-y-3">
        {/* AI indicator */}
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#6ce0d5' }} />
          <span className="text-[10px] uppercase tracking-[0.18em] font-bold" style={{ color: 'rgba(142,243,228,0.8)' }}>
            AI Coach Recommendation
          </span>
        </div>

        {/* Simulation suggestion */}
        <div>
          <span
            className="inline-block text-[9px] uppercase tracking-[0.16em] px-2 py-0.5 rounded-full mb-1.5 font-bold"
            style={{ background: `${typeColor}18`, color: typeColor, border: `1px solid ${typeColor}35` }}
          >
            {recommendation.nextSimulation.type.replace(/_/g, ' ')}
          </span>
          <h4 className="text-sm font-bold leading-tight">{recommendation.nextSimulation.name}</h4>
          <p className="mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
            {recommendation.nextSimulation.description}
          </p>
        </div>

        {/* Reasoning */}
        <div
          className="px-3 py-2 rounded-xl text-xs leading-relaxed"
          style={{ background: 'rgba(108,224,213,0.06)', border: '1px solid rgba(108,224,213,0.15)', color: 'var(--text-secondary)' }}
        >
          {recommendation.reasoning}
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-3 flex-wrap">
          <span
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold"
            style={{ background: 'rgba(142,243,228,0.15)', color: '#8ef3e4', border: '1px solid rgba(142,243,228,0.3)' }}
          >
            +{recommendation.estimatedXpGain} XP estimated
          </span>
          <span
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold"
            style={{ background: `${adj.color}15`, color: adj.color, border: `1px solid ${adj.color}30` }}
          >
            {adj.icon} {adj.label}
          </span>
          <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
            Growth: <span style={{ color: 'var(--text-secondary)' }}>{recommendation.growthDirection}</span>
          </span>
        </div>

        {/* Accept button */}
        {onAccept && (
          <button type="button" className="primary-cta w-full text-sm" onClick={onAccept}
            style={{ paddingTop: 10, paddingBottom: 10 }}>
            Accept Mission
          </button>
        )}
      </div>
    </div>
  );
}
