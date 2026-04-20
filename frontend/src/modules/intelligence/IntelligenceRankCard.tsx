import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { XPSpiral } from './XPSpiral';
import type { IntelligenceRank } from '../../types/phase5.types';

interface IntelligenceRankCardProps {
  rank: IntelligenceRank;
}

const TIER_META: Record<string, { label: string; color: string; nextTier: string }> = {
  Novice:     { label: 'Novice', color: '#b4d9ff', nextTier: 'Apprentice' },
  Apprentice: { label: 'Apprentice', color: '#d0c8ff', nextTier: 'Analyst' },
  Analyst:    { label: 'Analyst', color: '#8ef3e4', nextTier: 'Strategist' },
  Strategist: { label: 'Strategist', color: '#ffd49e', nextTier: 'Expert' },
  Expert:     { label: 'Expert', color: '#ff9db2', nextTier: 'Master' },
  Master:     { label: 'Master', color: '#f0d48a', nextTier: '—' },
};

const SKILL_LABELS: Record<string, string> = {
  skill_level: 'Skill',
  risk_tolerance: 'Risk Tolerance',
  decision_speed: 'Decision Speed',
  strategy_depth: 'Strategy Depth',
  consistency_score: 'Consistency',
};

export function IntelligenceRankCard({ rank }: IntelligenceRankCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const meta = TIER_META[rank.tier] ?? TIER_META.Novice;

  useEffect(() => {
    const el = cardRef.current;
    const glow = glowRef.current;
    if (!el || !glow) return;

    const ctx = gsap.context(() => {
      gsap.from(el, { y: 18, opacity: 0, duration: 0.72, ease: 'power3.out' });
      gsap.to(glow, {
        opacity: 0.55,
        scale: 1.08,
        duration: 3.5,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });
    });
    return () => ctx.revert();
  }, []);

  const skills = Object.entries(rank.skillDrift) as [string, number][];

  return (
    <div ref={cardRef} className="premium-card p-5 md:p-6 relative overflow-hidden">
      {/* Breathing radial glow */}
      <div
        ref={glowRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(60% 60% at 50% 50%, ${meta.color}22, transparent 70%)`,
          opacity: 0.35,
        }}
      />

      <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
        {/* XP Spiral */}
        <div className="shrink-0">
          <XPSpiral
            progress={rank.xpProgress}
            xp={rank.xp}
            xpToNext={rank.xpToNextLevel}
            tier={rank.tier}
            size={148}
          />
        </div>

        {/* Rank info */}
        <div className="flex-1 space-y-4 min-w-0">
          <div>
            <p className="section-kicker">Intelligence Rank</p>
            <div className="mt-2 flex items-baseline gap-3 flex-wrap">
              <h2
                className="text-3xl font-bold"
                style={{ color: meta.color, fontFamily: 'Sora,sans-serif' }}
              >
                {meta.label}
              </h2>
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.16em]"
                style={{ background: `${meta.color}20`, border: `1px solid ${meta.color}50`, color: meta.color }}
              >
                Lv. {rank.level}
              </span>
            </div>
            {meta.nextTier !== '—' && (
              <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                Next rank: <span style={{ color: 'var(--text-secondary)' }}>{meta.nextTier}</span>
              </p>
            )}
          </div>

          {/* Skill drift bars */}
          <div className="space-y-2">
            {skills.map(([key, val]) => (
              <div key={key}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase tracking-[0.14em]" style={{ color: 'var(--text-muted)' }}>
                    {SKILL_LABELS[key] ?? key}
                  </span>
                  <span className="text-[10px] tabular-nums font-semibold" style={{ color: meta.color }}>
                    {val.toFixed(1)}
                  </span>
                </div>
                <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: 'rgba(157,183,215,0.15)' }}>
                  <div
                    className="h-1 rounded-full transition-all duration-700"
                    style={{
                      width: `${Math.max(2, Math.min(100, val))}%`,
                      background: `linear-gradient(90deg, ${meta.color}bb, ${meta.color})`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
