import { useNavigate } from 'react-router-dom';
import { useAICoach } from '../../hooks/useAICoach';

interface NextSimulationSuggestionProps {
  lastSimulationId?: string;
}

const TYPE_COLORS: Record<string, string> = {
  monte_carlo: '#8ef3e4',
  game_theory: '#b4d9ff',
  market: '#ffd49e',
  conflict: '#ff9db2',
};

export function NextSimulationSuggestion({ lastSimulationId }: NextSimulationSuggestionProps) {
  const { recommendation, loading } = useAICoach(lastSimulationId);
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs" style={{ background: 'rgba(108,224,213,0.06)', border: '1px solid rgba(108,224,213,0.15)' }}>
        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#6ce0d5' }} />
        <span style={{ color: 'var(--text-muted)' }}>AI is analyzing your growth path…</span>
      </div>
    );
  }

  if (!recommendation) return null;

  const color = TYPE_COLORS[recommendation.nextSimulation.type] ?? '#b4d9ff';

  return (
    <div
      className="flex items-center gap-3 px-3 py-3 rounded-2xl cursor-pointer group transition-all duration-200"
      style={{ background: `${color}0d`, border: `1px solid ${color}25` }}
      onClick={() => navigate('/app/simulations/new', { viewTransition: true })}
    >
      <div className="w-2 h-2 rounded-full shrink-0 group-hover:scale-125 transition-transform" style={{ background: color }} />
      <div className="flex-1 min-w-0">
        <p className="text-[10px] uppercase tracking-[0.14em]" style={{ color: 'var(--text-muted)' }}>Next Mission</p>
        <p className="text-xs font-semibold truncate mt-0.5">{recommendation.nextSimulation.name}</p>
      </div>
      <span className="text-[10px] font-bold shrink-0" style={{ color: '#8ef3e4' }}>+{recommendation.estimatedXpGain} XP</span>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ color: 'var(--text-muted)' }}>
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    </div>
  );
}
