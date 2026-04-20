import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import type { GabeRunSummary } from '../../types/api.types';

interface ResultRevealSequenceProps {
  gabe: GabeRunSummary;
  simulationId: string;
  onOpenAnalytics: () => void;
  onRunAnother: () => void;
}

interface RevealCardProps {
  label: string;
  value: string;
  color: string;
  delay: number;
}

function RevealCard({ label, value, color, delay }: RevealCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(cardRef.current, {
        y: 20,
        opacity: 0,
        scale: 0.94,
        duration: 0.55,
        ease: 'power3.out',
        delay,
      });
    });
    return () => ctx.revert();
  }, [delay]);

  return (
    <div
      ref={cardRef}
      className="surface-glass rounded-2xl px-3 py-3.5 space-y-1"
      style={{ border: `1px solid ${color}35` }}
    >
      <p className="text-[10px] uppercase tracking-[0.16em]" style={{ color: 'var(--text-muted)' }}>{label}</p>
      <p className="text-base font-bold" style={{ color }}>{value}</p>
    </div>
  );
}

export function ResultRevealSequence({ gabe, onOpenAnalytics, onRunAnother }: ResultRevealSequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const xpBurstRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header fade in
      gsap.from(headerRef.current, { y: 12, opacity: 0, duration: 0.5, ease: 'power3.out' });

      // XP burst animation
      if (xpBurstRef.current) {
        gsap.from(xpBurstRef.current, { scale: 0, opacity: 0, duration: 0.7, ease: 'back.out(2)', delay: 0.3 });
        gsap.to(xpBurstRef.current, {
          boxShadow: '0 0 0 24px rgba(142,243,228,0)',
          duration: 0.9,
          ease: 'power2.out',
          delay: 0.4,
        });
      }

      // Unlock cascade
      gsap.from('[data-unlock-badge]', {
        scale: 0.5,
        opacity: 0,
        duration: 0.4,
        stagger: 0.1,
        ease: 'back.out(2)',
        delay: 0.6,
      });

      // Action buttons
      gsap.from('[data-result-action]', {
        y: 10,
        opacity: 0,
        duration: 0.4,
        stagger: 0.08,
        ease: 'power3.out',
        delay: 0.9,
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const { progression, xp_intelligence, behavior, simulation_adaptation } = gabe;
  const unlocks = progression.unlocked_features ?? [];

  return (
    <div
      ref={containerRef}
      className="relative p-5 rounded-2xl space-y-4 overflow-hidden"
      style={{
        border: '1px solid rgba(142,243,228,0.4)',
        background: 'linear-gradient(155deg, rgba(18,46,54,0.8), rgba(12,27,38,0.92))',
      }}
    >
      {/* Pulse ring */}
      <span className="completion-pulse-ring" aria-hidden />

      {/* Header */}
      <div ref={headerRef} className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <p className="text-[10px] uppercase tracking-[0.16em]" style={{ color: 'var(--text-muted)' }}>
            Result Reveal · Stage 5
          </p>
          <h3 className="mt-1 text-lg font-bold">Mission Complete.</h3>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs"
            style={{ border: '1px solid rgba(142,243,228,0.4)', color: '#9cf3e7' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
            Complete
          </span>
          <span
            className="px-3 py-1 rounded-full text-xs font-semibold"
            style={{ background: 'rgba(116,214,242,0.16)', border: '1px solid rgba(116,214,242,0.35)', color: '#9de9ff' }}
          >
            {simulation_adaptation.mode_label}
          </span>
        </div>
      </div>

      {/* AI insight */}
      <div className="surface-glass rounded-xl p-3" style={{ border: '1px solid rgba(157,183,215,0.2)' }}>
        <p className="text-xs font-semibold mb-0.5" style={{ color: '#9cf3e7' }}>
          {simulation_adaptation.adaptive_ui_badge}
        </p>
        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          AI Coach: {simulation_adaptation.ai_coach_hint}
        </p>
      </div>

      {/* XP gain burst */}
      <div className="flex items-center gap-4">
        <div
          ref={xpBurstRef}
          className="w-14 h-14 rounded-full flex items-center justify-center text-center shrink-0"
          style={{
            background: 'linear-gradient(135deg, rgba(142,243,228,0.3), rgba(108,224,213,0.12))',
            border: '2px solid rgba(142,243,228,0.5)',
            boxShadow: '0 0 24px rgba(142,243,228,0.35)',
          }}
        >
          <div>
            <p className="text-[8px] uppercase tracking-wide" style={{ color: '#8ef3e4' }}>XP</p>
            <p className="text-sm font-bold" style={{ color: '#8ef3e4' }}>+{xp_intelligence.xp_gain}</p>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold">{progression.level_title}</p>
          <div className="w-36 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(157,183,215,0.18)' }}>
            <div
              className="h-1.5 rounded-full"
              style={{
                width: `${Math.max(2, progression.level_progress)}%`,
                background: 'linear-gradient(90deg, #8ef3e4, #74d6f2)',
                transition: 'width 1s cubic-bezier(0.2,0.8,0.2,1)',
              }}
            />
          </div>
          <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
            Level {progression.level} · {progression.xp} XP total
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <RevealCard label="Behavior" value={behavior.behavior_type.replace(/_/g, ' ')} color="#d0c8ff" delay={0.15} />
        <RevealCard label="Engagement" value={`${behavior.engagement_score.toFixed(0)}%`} color="#8ef3e4" delay={0.22} />
        <RevealCard label="Novelty" value={`${(xp_intelligence.novelty_score * 100).toFixed(0)}%`} color="#b4d9ff" delay={0.29} />
        <RevealCard label="Skill Level" value={gabe.skill_profile.skill_level.toFixed(1)} color="#ffd49e" delay={0.36} />
      </div>

      {/* Unlock badges */}
      {unlocks.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {unlocks.map(u => (
            <span
              key={u}
              data-unlock-badge
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs"
              style={{ background: 'rgba(255,212,158,0.15)', border: '1px solid rgba(255,212,158,0.3)', color: '#ffd49e' }}
            >
              ✦ {u}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3 pt-1">
        <button data-result-action type="button" className="primary-cta" onClick={onOpenAnalytics}>
          Open Analytics
        </button>
        <button data-result-action type="button" className="secondary-cta" onClick={onRunAnother}>
          Run Another
        </button>
      </div>
    </div>
  );
}
