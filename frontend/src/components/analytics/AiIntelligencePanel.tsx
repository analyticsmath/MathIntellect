import type {
  AiDecisionResponse,
  AiExplainResponse,
  AiGamificationEvent,
  AiInsightResponse,
} from '../../types/api.types';
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

export function AiIntelligencePanel({
  loading,
  error,
  insight,
  decision,
  onRetry,
  onExplain,
}: AiIntelligencePanelProps) {
  if (loading) {
    return (
      <div className="border border-mi-rule bg-mi-paper p-6">
        <Loader size="md" message="Deriving mathematical interpretation..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-mi-rule bg-mi-paper p-6">
        <ErrorState message={error} onRetry={onRetry} />
      </div>
    );
  }

  if (!insight || !decision) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 border-t border-mi-rule pt-6">
      {/* AI Structural Interpretation */}
      <div className="border border-mi-rule bg-mi-paper p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-mi-rule pb-3">
          <h4 className="text-xs font-mono uppercase font-semibold text-mi-ink">
            Mathematical Interpretation
          </h4>
          <span className="text-xs font-mono text-mi-muted">
            CONFIDENCE: {Math.round(insight.confidence_score)}%
          </span>
        </div>

        <p className="text-xs text-mi-text leading-relaxed">
          {insight.summary}
        </p>

        <div className="p-3 bg-mi-surface-soft border border-mi-rule text-xs space-y-1">
          <div className="text-[10px] font-mono text-mi-muted uppercase">Risk Classification</div>
          <div className="font-semibold text-mi-ink uppercase">{insight.risk_analysis.level}</div>
        </div>

        <div>
          <button
            onClick={onExplain}
            className="mi-btn-secondary h-9 px-4 text-xs w-full"
          >
            Inspect Formal Derivation
          </button>
        </div>
      </div>

      {/* Decision Sensitivity Guidance */}
      <div className="border border-mi-rule bg-mi-paper p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-mi-rule pb-3">
          <h4 className="text-xs font-mono uppercase font-semibold text-mi-ink">
            Strategic Decision Guidance
          </h4>
          <span className="text-xs font-mono text-mi-muted">
            STATUS: EVALUATED
          </span>
        </div>

        <div className="space-y-2">
          <div className="text-xs font-mono text-mi-muted uppercase">Recommended Decision:</div>
          <div className="text-xs font-semibold text-mi-ink p-3 bg-mi-surface-soft border border-mi-rule">
            {decision.decision}
          </div>
        </div>

        {decision.reasoning && decision.reasoning.length > 0 && (
          <div className="space-y-1.5 pt-2 border-t border-mi-rule">
            <div className="text-[10px] font-mono text-mi-muted uppercase">Reasoning &amp; Rationale</div>
            <ul className="text-xs space-y-1 list-disc list-inside text-mi-text">
              {decision.reasoning.map((item: string, i: number) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {decision.risk_tradeoff && (
          <div className="pt-2 border-t border-mi-rule text-xs">
            <span className="font-mono text-mi-muted uppercase">Risk Tradeoff: </span>
            <span className="text-mi-text">{decision.risk_tradeoff}</span>
          </div>
        )}
      </div>
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
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-mi-ink/40 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-mi-paper border border-mi-rule max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-mi-rule pb-3">
          <div>
            <div className="text-[10px] font-mono text-mi-muted uppercase">METHOD EXPLANATION</div>
            <h3 className="text-base font-semibold text-mi-ink">
              Mathematical Derivation &amp; Assumptions
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-mi-muted hover:text-mi-ink text-sm font-mono"
          >
            ✕ Close
          </button>
        </div>

        {loading && <Loader message="Generating derivation breakdown..." />}
        {error && <ErrorState message={error} onRetry={onRetry} />}

        {!loading && !error && explanation && (
          <div className="space-y-4 text-xs">
            <div className="space-y-1">
              <div className="font-mono text-mi-muted uppercase">Summary</div>
              <p className="text-mi-text leading-relaxed">{explanation.summary}</p>
            </div>

            {explanation.steps && explanation.steps.length > 0 && (
              <div className="space-y-3 pt-3 border-t border-mi-rule">
                <div className="font-mono text-mi-muted uppercase">Mathematical Steps</div>
                <div className="space-y-2">
                  {explanation.steps.map((s, i) => (
                    <div key={i} className="p-3 bg-mi-surface-soft border border-mi-rule space-y-1">
                      <div className="font-semibold text-mi-ink">{s.step}</div>
                      {s.formula && (
                        <div className="font-mono text-mi-change text-[11px] py-1">
                          {s.formula}
                        </div>
                      )}
                      <div className="text-mi-text text-[11px]">{s.interpretation}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
