import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Simulation } from '../../types/api.types';
import { formatDate } from '../../utils/formatters';
import { StatusBadge } from '../ui/Badge';

const ENGINE_LABELS: Record<string, string> = {
  monte_carlo: 'Monte Carlo',
  game_theory: 'Game Theory',
  market: 'Market Dynamics',
  conflict: 'Agent Interaction',
  custom: 'Custom Model',
};

export const SimulationCard = memo(function SimulationCard({
  sim,
}: {
  sim: Simulation;
  index?: number;
}) {
  const navigate = useNavigate();
  const clickable = sim.status === 'completed';
  const label = ENGINE_LABELS[sim.type] ?? 'Simulation';

  return (
    <div
      onClick={() => clickable && navigate(`/app/analytics/${sim.id}`)}
      className={`border border-mi-rule bg-mi-paper p-4 flex flex-col justify-between transition-colors ${
        clickable ? 'cursor-pointer hover:border-mi-rule-strong hover:bg-mi-surface-soft/40' : ''
      }`}
    >
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <span className="text-[10px] font-mono text-mi-muted uppercase">
              {label}
            </span>
            <h4 className="text-sm font-semibold text-mi-ink truncate mt-0.5">
              {sim.name}
            </h4>
          </div>
          <StatusBadge status={sim.status} />
        </div>

        <div className="mt-3 text-xs font-mono text-mi-text flex items-center justify-between border-t border-mi-rule pt-2">
          <span>ID: {sim.id.slice(0, 8)}</span>
          <span className="text-mi-muted">{formatDate(sim.createdAt)}</span>
        </div>
      </div>

      <div className="mt-4 pt-2 border-t border-mi-rule flex items-center justify-between text-xs">
        {sim.status === 'completed' && (
          <span className="text-mi-ink font-medium hover:text-mi-change flex items-center gap-1">
            Inspect results →
          </span>
        )}
        {sim.status === 'running' && (
          <span className="text-mi-warning font-mono">
            Running simulation...
          </span>
        )}
        {sim.status === 'failed' && (
          <span className="text-mi-danger font-mono">
            Execution halted
          </span>
        )}
        {sim.status === 'pending' && (
          <span className="text-mi-muted font-mono">
            Pending queue
          </span>
        )}
      </div>
    </div>
  );
});
