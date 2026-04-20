import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Simulation } from '../../types/api.types';
import { formatDate } from '../../utils/formatters';
import { StatusBadge } from '../ui/Badge';

const TYPE_META: Record<string, { icon: string; color: string; label: string; aiTip: string }> = {
  monte_carlo: { icon: 'MC', color: '#3B82F6', label: 'Monte Carlo', aiTip: 'Expand percentile range for broader tail-risk capture.' },
  game_theory: { icon: 'GT', color: '#22D3EE', label: 'Game Theory', aiTip: 'Test cooperative and aggressive branches before commit.' },
  market: { icon: 'MK', color: '#8B5CF6', label: 'Market', aiTip: 'Watch volatility cluster drift before hedge rebalancing.' },
  conflict: { icon: 'CF', color: '#F43F5E', label: 'Conflict', aiTip: 'Monitor escalation pressure per agent in round 6+.' },
  custom: { icon: 'CX', color: '#10B981', label: 'Custom', aiTip: 'Validate assumptions against baseline confidence.' },
};

function progressForStatus(status: Simulation['status']) {
  if (status === 'completed') {
    return 100;
  }
  if (status === 'running') {
    return 66;
  }
  if (status === 'pending') {
    return 26;
  }
  return 100;
}

export const SimulationCard = memo(function SimulationCard({ sim, index = 0 }: { sim: Simulation; index?: number }) {
  const navigate = useNavigate();
  const clickable = sim.status === 'completed';
  const meta = TYPE_META[sim.type] ?? TYPE_META.custom;
  const progress = progressForStatus(sim.status);

  return (
    <div
      onClick={() => clickable && navigate(`/app/analytics/${sim.id}`, { viewTransition: true })}
      className="group relative flex flex-col gap-0 rounded-3xl animate-fade-up overflow-hidden transition-all duration-300 hover:-translate-y-1"
      style={{
        border: `1px solid ${sim.status === 'running' ? 'rgba(245,158,11,0.58)' : `${meta.color}44`}`,
        background: 'linear-gradient(170deg, rgba(17,24,39,0.95), rgba(11,16,32,0.94))',
        boxShadow: sim.status === 'running' ? '0 0 0 1px rgba(245,158,11,0.32), 0 20px 38px rgba(2,6,23,0.56)' : '0 16px 34px rgba(2, 6, 23, 0.48)',
        animationDelay: `${index * 45}ms`,
        cursor: clickable ? 'pointer' : 'default',
      }}
      data-tilt
    >
      {sim.status === 'completed' && <div className="simulation-shimmer" />}
      {sim.status === 'running' && (
        <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: 'inset 0 0 0 1px rgba(245,158,11,0.28)' }} />
      )}

      <div
        className="h-1 w-full opacity-95 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg, ${meta.color} 0%, transparent 75%)` }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `radial-gradient(90% 70% at 100% 0%, ${meta.color}24, transparent 76%)` }}
      />

      <div className="p-5 flex flex-col gap-4 relative z-10">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold shrink-0"
              style={{
                background: `${meta.color}20`,
                color: meta.color,
                border: `1px solid ${meta.color}56`,
              }}
            >
              {meta.icon}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{sim.name}</p>
              <p className="text-[11px] mt-0.5 uppercase tracking-[0.14em]" style={{ color: meta.color }}>
                {meta.label}
              </p>
            </div>
          </div>
          <StatusBadge status={sim.status} />
        </div>

        <div className="rounded-xl border px-3 py-2" style={{ borderColor: 'var(--glass-stroke)', background: 'rgba(11, 16, 32, 0.78)' }}>
          <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.15em]" style={{ color: 'var(--text-muted)' }}>
            <span>Execution progress</span>
            <span>{progress}%</span>
          </div>
          <div className="mt-2 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(148,163,184,0.2)' }}>
            <div
              className="h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, background: sim.status === 'running' ? 'linear-gradient(90deg, #F59E0B, #22D3EE)' : meta.color }}
            />
          </div>
        </div>

        <div className="rounded-xl px-3 py-2.5 text-xs" style={{ background: `${meta.color}12`, border: `1px solid ${meta.color}35`, color: 'var(--text-secondary)' }}>
          <span className="font-semibold" style={{ color: meta.color }}>AI Recommendation:</span> {meta.aiTip}
        </div>

        {(sim.status === 'running' || sim.status === 'completed') && (
          <span
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] w-fit"
            style={{
              border: '1px solid rgba(34,211,238,0.36)',
              background: 'rgba(34,211,238,0.14)',
              color: 'var(--signal-cyan)',
            }}
          >
            AI Recommended
          </span>
        )}

        <div style={{ borderTop: '1px solid var(--glass-stroke)' }} />

        <div className="flex items-center justify-between">
          <span className="text-[11px] flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
            <svg viewBox="0 0 12 12" fill="currentColor" className="w-3 h-3 shrink-0">
              <path d="M4 1a.5.5 0 000 1h1V1H4zm3 0v1h1a.5.5 0 000-1H7zM1.5 3.5A.5.5 0 012 3h8a.5.5 0 01.5.5v7a.5.5 0 01-.5.5H2a.5.5 0 01-.5-.5v-7zm1 .5v6h7V4h-7z" />
            </svg>
            {formatDate(sim.createdAt)}
          </span>

          {clickable ? (
            <span className="text-[11px] font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200" style={{ color: 'var(--brand-blue)' }}>
              View insights
              <svg viewBox="0 0 12 12" fill="currentColor" className="w-3 h-3">
                <path d="M4.97 2.47a.75.75 0 000 1.06L7.44 6 4.97 8.47a.75.75 0 001.06 1.06l3-3a.75.75 0 000-1.06l-3-3a.75.75 0 00-1.06 0z" />
              </svg>
            </span>
          ) : (
            <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
              {sim.status === 'failed' ? 'Failed' : 'Processing'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
});
