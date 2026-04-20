import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import type { SkillTimelineEntry } from '../../types/phase5.types';

interface SkillEvolutionTimelineProps {
  entries: SkillTimelineEntry[];
}

const TYPE_COLORS: Record<string, string> = {
  monte_carlo: '#8ef3e4',
  game_theory: '#b4d9ff',
  market: '#ffd49e',
  conflict: '#ff9db2',
  custom: '#d0c8ff',
};

function relativeTime(iso: string) {
  const ms = Date.now() - new Date(iso).getTime();
  const m = Math.floor(ms / 60_000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const MOCK_ENTRIES: SkillTimelineEntry[] = [
  { simulationId: '1', simulationName: 'Portfolio Stress Test', simulationType: 'monte_carlo', timestamp: new Date(Date.now() - 3600000).toISOString(), xpGained: 145, levelTitle: 'Analyst', behaviorTag: 'Explorer', unlocks: ['Advanced Risk View'], skillDelta: 3.2 },
  { simulationId: '2', simulationName: 'Nash Equilibrium Run', simulationType: 'game_theory', timestamp: new Date(Date.now() - 86400000).toISOString(), xpGained: 112, levelTitle: 'Analyst', behaviorTag: 'Optimizer', unlocks: [], skillDelta: 2.1 },
  { simulationId: '3', simulationName: 'Liquidity Shock Model', simulationType: 'market', timestamp: new Date(Date.now() - 172800000).toISOString(), xpGained: 89, levelTitle: 'Apprentice', behaviorTag: 'Balanced', unlocks: ['Market Engine'], skillDelta: 1.8 },
  { simulationId: '4', simulationName: 'Resource Conflict Alpha', simulationType: 'conflict', timestamp: new Date(Date.now() - 259200000).toISOString(), xpGained: 76, levelTitle: 'Apprentice', behaviorTag: 'Risk Taker', unlocks: [], skillDelta: 1.4 },
];

export function SkillEvolutionTimeline({ entries }: SkillEvolutionTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const items = entries.length > 0 ? entries : MOCK_ENTRIES;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-timeline-card]', {
        x: (i) => (i % 2 === 0 ? -24 : 24),
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
      });
    }, containerRef);
    return () => ctx.revert();
  }, [items]);

  return (
    <div className="premium-card p-4 md:p-5">
      <p className="section-kicker mb-4">Skill Evolution</p>

      <div ref={containerRef} className="relative">
        {/* Center spine */}
        <div
          className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 hidden sm:block"
          style={{ background: 'linear-gradient(180deg, rgba(142,243,228,0.3), rgba(142,243,228,0.05))' }}
        />

        <div className="space-y-4">
          {items.map((entry, i) => {
            const color = TYPE_COLORS[entry.simulationType] ?? '#b4d9ff';
            const isLeft = i % 2 === 0;

            return (
              <div key={entry.simulationId} data-timeline-card className="flex items-start gap-3 sm:gap-0">
                {/* Left card */}
                <div className={`flex-1 ${isLeft ? 'sm:pr-6' : 'sm:hidden'}`}>
                  {isLeft && <TimelineCard entry={entry} color={color} />}
                </div>

                {/* Center dot */}
                <div className="hidden sm:flex shrink-0 w-6 justify-center z-10">
                  <div className="w-2.5 h-2.5 rounded-full mt-3 shadow-[0_0_8px_currentColor]" style={{ background: color, color }} />
                </div>

                {/* Right card */}
                <div className={`flex-1 ${!isLeft ? 'sm:pl-6' : 'sm:hidden sm:pl-0'}`}>
                  {!isLeft && <TimelineCard entry={entry} color={color} />}
                </div>

                {/* Mobile (stacked) */}
                <div className="flex-1 sm:hidden">
                  <TimelineCard entry={entry} color={color} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function TimelineCard({ entry, color }: { entry: SkillTimelineEntry; color: string }) {
  return (
    <div
      className="rounded-2xl p-3.5 space-y-2"
      style={{ background: 'rgba(14,24,38,0.7)', border: `1px solid ${color}30` }}
    >
      <div className="flex items-start justify-between gap-2 flex-wrap">
        <div>
          <p className="text-xs font-semibold leading-tight" style={{ color: 'var(--text-primary)' }}>
            {entry.simulationName}
          </p>
          <p className="text-[10px] mt-0.5 capitalize" style={{ color: 'var(--text-muted)' }}>
            {entry.simulationType.replace(/_/g, ' ')} · {entry.behaviorTag}
          </p>
        </div>
        <span className="text-[9px] shrink-0" style={{ color: 'var(--text-muted)' }}>
          {relativeTime(entry.timestamp)}
        </span>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
          style={{ background: `${color}20`, color }}
        >
          +{entry.xpGained} XP
        </span>
        {entry.skillDelta > 0 && (
          <span className="text-[10px]" style={{ color: '#8ef3e4' }}>
            ▲ {entry.skillDelta.toFixed(1)} skill
          </span>
        )}
        {entry.levelTitle && (
          <span className="text-[10px] font-semibold" style={{ color: 'var(--text-secondary)' }}>
            {entry.levelTitle}
          </span>
        )}
      </div>
      {entry.unlocks.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {entry.unlocks.map(u => (
            <span
              key={u}
              className="text-[9px] px-1.5 py-0.5 rounded"
              style={{ background: 'rgba(255,212,158,0.15)', color: '#ffd49e', border: '1px solid rgba(255,212,158,0.25)' }}
            >
              Unlocked: {u}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
