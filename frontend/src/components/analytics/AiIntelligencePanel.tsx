import type {
  AiDecisionResponse,
  AiExplainResponse,
  AiGamificationEvent,
  AiRiskLevel,
  AiInsightResponse,
} from '../../types/api.types';
import { Card } from '../ui/Card';
import { ErrorState } from '../ui/ErrorState';
import { Loader } from '../ui/Loader';

interface AiIntelligencePanelProps {
  loading: boolean;
  error: string | null;
  insight: AiInsightResponse | null;
  decision: AiDecisionResponse | null;
  gamificationEvent: AiGamificationEvent | null;
  onRetry: () => void;
  onExplain: () => void;
}

interface AiExplainModalProps {
  open: boolean;
  loading: boolean;
  error: string | null;
  explanation: AiExplainResponse | null;
  onRetry: () => void;
  onClose: () => void;
}

const RISK_STYLES: Record<
  AiRiskLevel,
  { text: string; border: string; background: string }
> = {
  low: {
    text: '#6EE7B7',
    border: 'rgba(22, 163, 74, 0.38)',
    background: 'rgba(22, 163, 74, 0.16)',
  },
  medium: {
    text: '#FCD34D',
    border: 'rgba(245, 158, 11, 0.38)',
    background: 'rgba(245, 158, 11, 0.18)',
  },
  high: {
    text: '#FDBA74',
    border: 'rgba(217, 119, 6, 0.38)',
    background: 'rgba(217, 119, 6, 0.2)',
  },
  critical: {
    text: '#FDA4AF',
    border: 'rgba(239, 68, 68, 0.38)',
    background: 'rgba(239, 68, 68, 0.2)',
  },
};

export function AiIntelligencePanel({
  loading,
  error,
  insight,
  decision,
  gamificationEvent,
  onRetry,
  onExplain,
}: AiIntelligencePanelProps) {
  if (loading) {
    return (
      <Card title="AI Intelligence Layer" subtitle="Generating interpretation and decision guidance" glow="cyan">
        <Loader size="md" message="Analyzing simulation intelligence..." />
      </Card>
    );
  }

  if (error) {
    return (
      <Card title="AI Intelligence Layer" subtitle="Unable to generate insights" glow="rose">
        <ErrorState message={error} onRetry={onRetry} />
      </Card>
    );
  }

  if (!insight || !decision) {
    return null;
  }

  const riskStyle = RISK_STYLES[insight.risk_analysis.level];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <Card title="AI Insight Card" subtitle="Simulation interpretation" glow="cyan">
        <div className="space-y-5">
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {insight.summary}
          </p>

          <div className="flex items-center gap-3 flex-wrap">
            <span
              className="text-[11px] uppercase tracking-[0.14em] px-3 py-1.5 rounded-full font-semibold"
              style={{
                color: riskStyle.text,
                border: `1px solid ${riskStyle.border}`,
                background: riskStyle.background,
              }}
            >
              Risk: {insight.risk_analysis.level}
            </span>
            <div
              className="text-[11px] px-3 py-1.5 rounded-full"
              style={{
                border: '1px solid var(--glass-stroke)',
                background: 'rgba(17, 24, 39, 0.8)',
                color: 'var(--text-primary)',
              }}
            >
              Confidence: {Math.round(insight.confidence_score)}%
            </div>
            {gamificationEvent && (
              <div
                className="text-[11px] px-3 py-1.5 rounded-full"
                style={{
                  border: '1px solid rgba(34,211,238,0.34)',
                  background: 'rgba(34,211,238,0.16)',
                  color: 'var(--signal-cyan)',
                }}
              >
                +{gamificationEvent.xp_gain} XP ({gamificationEvent.behavior_tag})
              </div>
            )}
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] mb-2" style={{ color: 'var(--text-muted)' }}>
              Confidence Meter
            </p>
            <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(148, 163, 184, 0.24)' }}>
              <div
                className="h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.max(2, Math.min(100, insight.confidence_score))}%`,
                  background: 'linear-gradient(90deg, var(--brand-blue), var(--signal-cyan), var(--quantum-violet))',
                }}
              />
            </div>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] mb-2" style={{ color: 'var(--text-muted)' }}>
              Key Findings
            </p>
            <ul className="space-y-2">
              {insight.key_findings.map((item, index) => (
                <li key={index} className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  • {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      <Card
        title="Decision Panel"
        subtitle="Action recommendation and trade-offs"
        glow="emerald"
        action={(
          <button
            type="button"
            onClick={onExplain}
            className="secondary-cta text-xs"
            style={{ paddingTop: 7, paddingBottom: 7 }}
          >
            Explain This Result
          </button>
        )}
      >
        <div className="space-y-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] mb-2" style={{ color: 'var(--text-muted)' }}>
              Recommended Action
            </p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {decision.decision}
            </p>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] mb-2" style={{ color: 'var(--text-muted)' }}>
              Risk Tradeoff
            </p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {decision.risk_tradeoff}
            </p>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] mb-2" style={{ color: 'var(--text-muted)' }}>
              Tradeoff Table
            </p>
            <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(148, 163, 184, 0.24)' }}>
              <table className="w-full text-xs">
                <thead style={{ background: 'rgba(17, 24, 39, 0.9)' }}>
                  <tr>
                    <th className="text-left px-3 py-2">Option</th>
                    <th className="text-left px-3 py-2">Pros</th>
                    <th className="text-left px-3 py-2">Cons</th>
                  </tr>
                </thead>
                <tbody>
                  {decision.alternatives.map((alt, index) => (
                    <tr
                      key={`${alt.option}-${index}`}
                      style={{ borderTop: '1px solid rgba(148, 163, 184, 0.16)' }}
                    >
                      <td className="px-3 py-2 align-top font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {alt.option}
                      </td>
                      <td className="px-3 py-2 align-top" style={{ color: 'var(--text-secondary)' }}>
                        {alt.pros.join(' | ')}
                      </td>
                      <td className="px-3 py-2 align-top" style={{ color: 'var(--text-secondary)' }}>
                        {alt.cons.join(' | ')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Decision confidence: {Math.round(decision.confidence)}%
          </div>
        </div>
      </Card>
    </div>
  );
}

export function AiExplainModal({
  open,
  loading,
  error,
  explanation,
  onRetry,
  onClose,
}: AiExplainModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center px-4"
      style={{ background: 'rgba(2, 6, 23, 0.52)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl p-5"
        style={{
          border: '1px solid var(--glass-stroke)',
          background: 'linear-gradient(180deg, rgba(17,24,39,0.96), rgba(11,16,32,0.94))',
          boxShadow: '0 30px 70px rgba(2, 6, 23, 0.58)',
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold">Step-by-Step Math Explanation</h3>
          <button type="button" className="secondary-cta text-xs" onClick={onClose}>
            Close
          </button>
        </div>

        {loading && <Loader size="sm" message="Building explanation..." />}

        {!loading && error && <ErrorState message={error} onRetry={onRetry} />}

        {!loading && !error && explanation && (
          <div className="space-y-4">
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {explanation.summary}
            </p>

            <div className="space-y-3">
              {explanation.steps.map((step, index) => (
                <div
                  key={`${step.step}-${index}`}
                  className="rounded-xl p-4"
                style={{
                    border: '1px solid var(--glass-stroke)',
                    background: 'rgba(17, 24, 39, 0.8)',
                  }}
                >
                  <p className="text-xs uppercase tracking-[0.16em] mb-1" style={{ color: 'var(--text-muted)' }}>
                    Step {index + 1}
                  </p>
                  <p className="text-sm font-semibold mb-1">{step.step}</p>
                  <p className="text-xs font-mono mb-2" style={{ color: 'var(--brand-blue)' }}>{step.formula}</p>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {step.interpretation}
                  </p>
                </div>
              ))}
            </div>

            <div className="rounded-xl p-4" style={{ border: '1px solid rgba(34, 211, 238, 0.34)', background: 'rgba(34, 211, 238, 0.12)' }}>
              <p className="text-xs uppercase tracking-[0.16em] mb-1" style={{ color: 'var(--text-muted)' }}>
                Final Takeaway
              </p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {explanation.final_takeaway}
              </p>
              <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                Confidence: {Math.round(explanation.confidence_score)}%
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
