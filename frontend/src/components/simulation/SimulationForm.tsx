import { useEffect, useMemo, useRef, useState } from 'react';
import type { SimulationType, RunSimulationRequest } from '../../types/api.types';
import { humanizeType } from '../../utils/formatters';
import { useSavedModels } from '../../hooks/useSavedModels';
import { ConflictForm } from './forms/ConflictForm';
import { GameTheoryForm } from './forms/GameTheoryForm';
import { MarketForm } from './forms/MarketForm';
import { MonteCarloForm } from './forms/MonteCarloForm';

const TYPES: SimulationType[] = ['monte_carlo', 'game_theory', 'market', 'conflict'];

type WizardStep = 1 | 2 | 3 | 4;

const STEP_TITLES: Record<WizardStep, string> = {
  1: 'Configuration Phase',
  2: 'Validation Phase',
  3: 'Preview Impact Phase',
  4: 'Execution Phase',
};
const STEP_ORDER: WizardStep[] = [1, 2, 3, 4];

const STAGE_TONE: Record<WizardStep, { border: string; surface: string; accent: string }> = {
  1: {
    border: 'rgba(110, 231, 255, 0.3)',
    surface: 'linear-gradient(155deg, rgba(22, 32, 51, 0.96), rgba(14, 22, 36, 0.94))',
    accent: 'var(--brand-blue)',
  },
  2: {
    border: 'rgba(245, 158, 11, 0.3)',
    surface: 'linear-gradient(155deg, rgba(22, 32, 51, 0.96), rgba(14, 22, 36, 0.94))',
    accent: 'var(--amber-warning)',
  },
  3: {
    border: 'rgba(6, 182, 212, 0.35)',
    surface: 'linear-gradient(155deg, rgba(22, 32, 51, 0.96), rgba(14, 22, 36, 0.94))',
    accent: 'var(--signal-cyan)',
  },
  4: {
    border: 'rgba(124, 58, 237, 0.34)',
    surface: 'linear-gradient(155deg, rgba(22, 32, 51, 0.96), rgba(14, 22, 36, 0.94))',
    accent: 'var(--quantum-violet)',
  },
};

const TYPE_META: Record<SimulationType, { code: string; color: string; desc: string; useCase: string }> = {
  monte_carlo: {
    code: 'MC',
    color: '#2563EB',
    desc: 'Sample uncertainty and estimate confidence ranges.',
    useCase: 'Use for probabilistic risk modeling and distribution forecasting.',
  },
  game_theory: {
    code: 'GT',
    color: '#06B6D4',
    desc: 'Model strategic interaction and equilibrium stability.',
    useCase: 'Use for competitive strategy and payoff optimization scenarios.',
  },
  market: {
    code: 'MK',
    color: '#7C3AED',
    desc: 'Project stochastic market behavior under volatility shifts.',
    useCase: 'Use for pricing path analysis and portfolio stress testing.',
  },
  conflict: {
    code: 'CF',
    color: '#EF4444',
    desc: 'Simulate multi-agent pressure and resource competition.',
    useCase: 'Use for coalition, negotiation, and adversarial behavior modeling.',
  },
  custom: {
    code: 'CX',
    color: '#0284C7',
    desc: '',
    useCase: '',
  },
};

const DEFAULTS: Record<SimulationType, Record<string, unknown>> = {
  monte_carlo: {
    iterations: 5000,
    seed: 42,
    variables: [
      { name: 'r', distribution: 'normal', params: { mean: 0.08, std: 0.18 } },
      { name: 'w', distribution: 'uniform', params: { min: 0.3, max: 0.7 } },
    ],
    outputExpression: 'r * w',
  },
  market: {
    initialPrice: 100,
    volatility: 0.25,
    drift: 0.08,
    timeHorizonDays: 90,
    paths: 50,
    seed: 42,
  },
  game_theory: {
    players: ['Alice', 'Bob'],
    strategies: { Alice: ['Cooperate', 'Defect'], Bob: ['Cooperate', 'Defect'] },
    payoffMatrix: [
      { strategies: { Alice: 'Cooperate', Bob: 'Cooperate' }, payoffs: { Alice: 3, Bob: 3 } },
      { strategies: { Alice: 'Cooperate', Bob: 'Defect' }, payoffs: { Alice: 0, Bob: 5 } },
      { strategies: { Alice: 'Defect', Bob: 'Cooperate' }, payoffs: { Alice: 5, Bob: 0 } },
      { strategies: { Alice: 'Defect', Bob: 'Defect' }, payoffs: { Alice: 1, Bob: 1 } },
    ],
  },
  conflict: {
    rounds: 100,
    seed: 7,
    agents: [
      { id: 'a1', name: 'Hawk', resources: 100, strategy: 'aggressive' },
      { id: 'a2', name: 'Dove', resources: 100, strategy: 'cooperative' },
      { id: 'a3', name: 'TitForTat', resources: 100, strategy: 'tit_for_tat' },
      { id: 'a4', name: 'Wildcard', resources: 100, strategy: 'random' },
    ],
  },
  custom: {
    iterations: 1000,
    variables: [{ name: 'x', distribution: 'uniform', params: { min: 0, max: 1 } }],
    outputExpression: 'x',
  },
};

interface SimulationFormProps {
  onSubmit: (payload: RunSimulationRequest) => Promise<void>;
  submitting: boolean;
  error?: string | null;
  onStageChange?: (stage: WizardStep) => void;
}

function estimateComplexity(type: SimulationType, parameters: Record<string, unknown>) {
  if (type === 'monte_carlo') {
    const iterations = Number(parameters.iterations ?? 0);
    const variables = Array.isArray(parameters.variables) ? parameters.variables.length : 1;
    const score = iterations * Math.max(variables, 1);
    return {
      estimatedRuntime: `${Math.max(1, Math.round(score / 6000))}s`,
      iterations: `${iterations.toLocaleString()} samples`,
      outputType: 'Distribution + confidence bands',
      heavy: score > 80_000,
    };
  }

  if (type === 'market') {
    const paths = Number(parameters.paths ?? 0);
    const days = Number(parameters.timeHorizonDays ?? 0);
    const score = paths * days;
    return {
      estimatedRuntime: `${Math.max(1, Math.round(score / 3800))}s`,
      iterations: `${paths.toLocaleString()} paths x ${days} days`,
      outputType: 'Price trajectories + VaR',
      heavy: score > 25_000,
    };
  }

  if (type === 'game_theory') {
    const matrix = Array.isArray(parameters.payoffMatrix) ? parameters.payoffMatrix.length : 0;
    const players = Array.isArray(parameters.players) ? parameters.players.length : 2;
    const score = matrix * players;
    return {
      estimatedRuntime: `${Math.max(1, Math.round(score / 25))}s`,
      iterations: `${matrix} payoff states`,
      outputType: 'Equilibria + strategic insights',
      heavy: score > 120,
    };
  }

  const rounds = Number(parameters.rounds ?? 0);
  const agents = Array.isArray(parameters.agents) ? parameters.agents.length : 0;
  const score = rounds * Math.max(agents, 1) * Math.max(agents - 1, 1);
  return {
    estimatedRuntime: `${Math.max(1, Math.round(score / 4200))}s`,
    iterations: `${rounds.toLocaleString()} rounds / ${agents} agents`,
    outputType: 'Agent outcomes + behavior history',
    heavy: score > 45_000,
  };
}

function stableSerialize(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map((entry) => stableSerialize(entry)).join(',')}]`;
  }

  if (value && typeof value === 'object') {
    const objectValue = value as Record<string, unknown>;
    const keys = Object.keys(objectValue).sort();
    return `{${keys
      .map((key) => `${key}:${stableSerialize(objectValue[key])}`)
      .join(',')}}`;
  }

  return JSON.stringify(value);
}

function parameterHash(value: Record<string, unknown>): string {
  const stable = stableSerialize(value);
  let hash = 2166136261;
  for (let i = 0; i < stable.length; i++) {
    hash ^= stable.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return `p_${(hash >>> 0).toString(16)}`;
}

export function SimulationForm({ onSubmit, submitting, error, onStageChange }: SimulationFormProps) {
  const [step, setStep] = useState<WizardStep>(1);
  const [type, setType] = useState<SimulationType>('monte_carlo');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [parameters, setParameters] = useState<Record<string, unknown>>(DEFAULTS.monte_carlo);
  const [templateTitle, setTemplateTitle] = useState('');
  const [templateSaving, setTemplateSaving] = useState(false);
  const sessionStartedAt = useRef(Date.now());
  const step4EnteredAt = useRef<number | null>(null);
  const parameterAdjustments = useRef(0);
  const strategyChanges = useRef(0);
  const parameterHashes = useRef<Set<string>>(new Set([parameterHash(DEFAULTS.monte_carlo)]));
  const lastParameterHash = useRef(parameterHash(DEFAULTS.monte_carlo));

  const { models, loading: templatesLoading, error: templatesError, create: createTemplate, remove: removeTemplate } = useSavedModels();

  const handleTypeChange = (nextType: SimulationType) => {
    setType(nextType);
    setParameters(DEFAULTS[nextType]);
    const nextHash = parameterHash(DEFAULTS[nextType]);
    parameterAdjustments.current = 0;
    strategyChanges.current = 0;
    parameterHashes.current = new Set([nextHash]);
    lastParameterHash.current = nextHash;
    sessionStartedAt.current = Date.now();
    step4EnteredAt.current = null;
  };

  const handleParamsChange = (value: Record<string, unknown>) => {
    setParameters(value);
    const nextHash = parameterHash(value);

    if (nextHash !== lastParameterHash.current) {
      parameterAdjustments.current += 1;
      parameterHashes.current.add(nextHash);
      lastParameterHash.current = nextHash;

      if (type === 'game_theory' || type === 'conflict') {
        strategyChanges.current += 1;
      }
    }
  };

  useEffect(() => {
    onStageChange?.(step);
    if (step === 4 && !step4EnteredAt.current) {
      step4EnteredAt.current = Date.now();
    }
  }, [onStageChange, step]);

  const complexity = useMemo(() => estimateComplexity(type, parameters), [type, parameters]);

  const canGoNext =
    (step === 1) ||
    (step === 2 && name.trim().length > 0) ||
    (step === 3);

  const templatesForType = useMemo(
    () => models.filter((item) => item.engineType === type),
    [models, type],
  );

  const handleSaveTemplate = async () => {
    if (!templateTitle.trim()) {
      return;
    }

    setTemplateSaving(true);
    try {
      await createTemplate({
        engineType: type,
        title: templateTitle.trim(),
        configJson: {
          name: name.trim(),
          description: description.trim() || undefined,
          type,
          parameters,
        },
      });
      setTemplateTitle('');
    } finally {
      setTemplateSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      setStep(2);
      return;
    }

    const now = Date.now();
    const sessionDurationMs = Math.max(0, now - sessionStartedAt.current);
    const decisionHesitationMs = Math.max(
      0,
      now - (step4EnteredAt.current ?? sessionStartedAt.current),
    );
    const explorationRatio =
      parameterHashes.current.size / Math.max(1, parameterAdjustments.current);

    const rerunKey = `math-intellect:rerun-count:${type}`;
    const previousRuns = Number(window.localStorage.getItem(rerunKey) ?? '0');
    const rerunCount = Number.isFinite(previousRuns) ? Math.max(0, previousRuns) : 0;

    await onSubmit({
      name: name.trim(),
      description: description.trim() || undefined,
      type,
      parameters,
      behaviorSignals: {
        parameterAdjustmentCount: parameterAdjustments.current,
        parameterAdjustmentMs: sessionDurationMs,
        rerunCount,
        explorationRatio: Number(Math.min(1, explorationRatio).toFixed(3)),
        decisionHesitationMs,
        strategyChanges: strategyChanges.current,
        interactionLagMs: Math.max(0, decisionHesitationMs - 1_400),
        sessionDurationMs,
      },
    });

    window.localStorage.setItem(rerunKey, String(rerunCount + 1));
  };

  return (
    <div className="space-y-6">
      <section className="premium-card p-4 md:p-5">
        <div className="flex flex-wrap gap-2">
          {STEP_ORDER.map((item) => {
            const active = step === item;
            const done = step > item;
            const tone = STAGE_TONE[item];
            return (
              <button
                key={item}
                type="button"
                onClick={() => {
                  if (item < step || (item === step + 1 && canGoNext)) {
                    setStep(item);
                  }
                }}
                className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs transition-all duration-300"
                style={{
                  border: active
                    ? `1px solid ${tone.border}`
                    : '1px solid rgba(148, 163, 184, 0.24)',
                  background: active ? tone.surface : 'rgba(11, 16, 32, 0.86)',
                  color: done ? 'var(--emerald-success)' : 'var(--text-muted)',
                  transitionDuration: '260ms',
                  transitionTimingFunction: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
                }}
              >
                <span
                  className="w-5 h-5 rounded-full grid place-items-center font-semibold"
                  style={{
                    background: active ? `${tone.accent}1f` : 'rgba(148, 163, 184, 0.12)',
                    color: active ? tone.accent : 'var(--text-muted)',
                  }}
                >
                  {item}
                </span>
                {STEP_TITLES[item]}
              </button>
            );
          })}
        </div>
      </section>

      {step === 1 && (
        <section className="premium-card p-5 md:p-6" style={{ borderColor: STAGE_TONE[1].border, background: STAGE_TONE[1].surface }}>
          <p className="text-[10px] uppercase tracking-[0.2em] font-semibold" style={{ color: STAGE_TONE[1].accent }}>
            Step 1 / Configuration Phase
          </p>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TYPES.map((item) => {
              const itemMeta = TYPE_META[item];
              const active = item === type;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleTypeChange(item)}
                  className="text-left rounded-2xl p-4 transition-all duration-300"
                  style={{
                    border: active ? `1px solid ${itemMeta.color}66` : '1px solid rgba(148, 163, 184, 0.24)',
                    background: active ? `${itemMeta.color}15` : 'rgba(11, 16, 32, 0.84)',
                    transform: active ? 'translateY(-1px)' : 'translateY(0px)',
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-8 h-8 rounded-xl inline-flex items-center justify-center text-xs font-bold"
                      style={{
                        color: 'var(--text-main)',
                        background: `linear-gradient(140deg, ${itemMeta.color}, ${itemMeta.color}cc)`,
                      }}
                    >
                      {itemMeta.code}
                    </span>
                    <div>
                      <p className="text-sm font-semibold">{humanizeType(item)}</p>
                      <p className="text-[11px]" style={{ color: itemMeta.color }}>{itemMeta.desc}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-xs" style={{ color: 'var(--text-secondary)' }}>{itemMeta.useCase}</p>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="space-y-5">
          <article className="premium-card p-5 md:p-6" style={{ borderColor: STAGE_TONE[2].border, background: STAGE_TONE[2].surface }}>
            <p className="text-[10px] uppercase tracking-[0.2em] font-semibold" style={{ color: STAGE_TONE[2].accent }}>
              Step 2 / Validation Phase
            </p>
            <div className="mt-4 grid grid-cols-1 gap-4">
              <label className="block">
                <span className="text-xs uppercase tracking-[0.16em]" style={{ color: 'var(--text-secondary)' }}>
                  Simulation Name
                </span>
                <input
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="e.g. Portfolio Risk Q2"
                  className="w-full mt-2 px-3 py-2.5 rounded-xl"
                  style={{
                    border: '1px solid rgba(148, 163, 184, 0.3)',
                    background: 'rgba(11, 16, 32, 0.9)',
                    color: 'var(--text-primary)',
                  }}
                />
              </label>
              <label className="block">
                <span className="text-xs uppercase tracking-[0.16em]" style={{ color: 'var(--text-secondary)' }}>
                  Description
                </span>
                <input
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="What strategic question are you evaluating?"
                  className="w-full mt-2 px-3 py-2.5 rounded-xl"
                  style={{
                    border: '1px solid rgba(148, 163, 184, 0.3)',
                    background: 'rgba(11, 16, 32, 0.9)',
                    color: 'var(--text-primary)',
                  }}
                />
              </label>
            </div>
          </article>

          <article className="premium-card p-5 md:p-6" style={{ borderColor: STAGE_TONE[2].border, background: STAGE_TONE[2].surface }}>
            <div className="flex items-center justify-between gap-3">
              <p className="text-[10px] uppercase tracking-[0.2em] font-semibold" style={{ color: 'var(--text-muted)' }}>
                Engine Parameters
              </p>
              <span
                className="text-[11px] uppercase tracking-[0.14em] px-2.5 py-1 rounded-full"
                style={{
                  border: `1px solid ${TYPE_META[type].color}66`,
                  background: `${TYPE_META[type].color}22`,
                  color: TYPE_META[type].color,
                }}
              >
                {humanizeType(type)}
              </span>
            </div>
            <div className="mt-5">
              {type === 'monte_carlo' && <MonteCarloForm onChange={handleParamsChange} />}
              {type === 'market' && <MarketForm onChange={handleParamsChange} />}
              {type === 'game_theory' && <GameTheoryForm onChange={handleParamsChange} />}
              {type === 'conflict' && <ConflictForm onChange={handleParamsChange} />}
            </div>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { label: 'Input Metadata', pass: name.trim().length > 0, detail: name.trim().length > 0 ? 'Simulation name provided' : 'Simulation name required' },
                { label: 'Parameter Matrix', pass: Object.keys(parameters).length > 0, detail: Object.keys(parameters).length > 0 ? 'Engine parameters validated' : 'Parameters missing' },
                { label: 'Execution Guard', pass: !submitting, detail: submitting ? 'Execution in progress' : 'Ready for preview phase' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl p-3"
                  style={{
                    border: item.pass ? '1px solid rgba(22, 163, 74, 0.35)' : '1px solid rgba(245, 158, 11, 0.36)',
                    background: item.pass ? 'rgba(16, 185, 129, 0.14)' : 'rgba(245, 158, 11, 0.14)',
                  }}
                >
                  <p className="text-[10px] uppercase tracking-[0.16em]" style={{ color: 'var(--text-muted)' }}>
                    {item.label}
                  </p>
                  <p className="mt-1 text-xs" style={{ color: item.pass ? '#86efac' : '#fcd34d' }}>{item.detail}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="premium-card p-5 md:p-6" style={{ borderColor: STAGE_TONE[2].border, background: STAGE_TONE[2].surface }}>
            <p className="text-[10px] uppercase tracking-[0.2em] font-semibold" style={{ color: 'var(--text-muted)' }}>
              Saved Templates (Foundation)
            </p>
            <div className="mt-4 flex flex-col md:flex-row gap-3">
              <input
                value={templateTitle}
                onChange={(event) => setTemplateTitle(event.target.value)}
                placeholder="Template title"
                className="flex-1 min-w-0 px-3 py-2.5 rounded-xl"
                style={{
                  border: '1px solid rgba(148, 163, 184, 0.3)',
                  background: 'rgba(11, 16, 32, 0.9)',
                  color: 'var(--text-primary)',
                }}
              />
              <button
                type="button"
                onClick={() => {
                  void handleSaveTemplate();
                }}
                className="secondary-cta"
                disabled={templateSaving || !templateTitle.trim()}
              >
                {templateSaving ? 'Saving...' : 'Save Current Config'}
              </button>
            </div>
            <p className="mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
              Basic CRUD is enabled for Phase 1. Template execution workflows are reserved for later phases.
            </p>

            <div className="mt-4 space-y-2">
              {templatesLoading && <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Loading templates...</p>}
              {templatesError && <p className="text-xs" style={{ color: '#ffc4d0' }}>{templatesError}</p>}
              {!templatesLoading && templatesForType.length === 0 && (
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>No saved templates for {humanizeType(type)}.</p>
              )}
              {templatesForType.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl px-3 py-2 flex items-center justify-between gap-3"
                  style={{ border: '1px solid rgba(148, 163, 184, 0.2)', background: 'rgba(11, 16, 32, 0.82)' }}
                >
                  <div>
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                      Updated {new Date(item.updatedAt).toLocaleString()}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="text-xs px-2.5 py-1.5 rounded-lg"
                    style={{ border: '1px solid rgba(239, 68, 68, 0.35)', color: '#fecaca' }}
                    onClick={() => {
                      void removeTemplate(item.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </article>
        </section>
      )}

      {step === 3 && (
        <section className="premium-card p-5 md:p-6 relative overflow-hidden" style={{ borderColor: STAGE_TONE[3].border, background: STAGE_TONE[3].surface }}>
          <div
            className="pointer-events-none absolute -right-20 top-0 h-44 w-44 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(6, 182, 212, 0.16), transparent 70%)' }}
            aria-hidden
          />
          <p className="text-[10px] uppercase tracking-[0.2em] font-semibold relative z-10" style={{ color: STAGE_TONE[3].accent }}>
            Step 3 / Preview Impact Phase
          </p>
          <p className="mt-2 text-sm relative z-10" style={{ color: 'var(--text-secondary)' }}>
            Preview expected runtime behavior and output impact before dispatching execution.
          </p>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="surface-glass rounded-xl p-4">
              <p className="text-xs uppercase tracking-[0.16em]" style={{ color: 'var(--text-muted)' }}>Estimated Runtime</p>
              <p className="mt-2 text-xl font-semibold">{complexity.estimatedRuntime}</p>
            </div>
            <div className="surface-glass rounded-xl p-4">
              <p className="text-xs uppercase tracking-[0.16em]" style={{ color: 'var(--text-muted)' }}>Iterations</p>
              <p className="mt-2 text-sm font-semibold">{complexity.iterations}</p>
            </div>
            <div className="surface-glass rounded-xl p-4">
              <p className="text-xs uppercase tracking-[0.16em]" style={{ color: 'var(--text-muted)' }}>Output Type</p>
              <p className="mt-2 text-sm font-semibold">{complexity.outputType}</p>
            </div>
          </div>
          {complexity.heavy && (
            <div
              className="mt-4 px-4 py-3 rounded-xl text-sm"
              style={{
                border: '1px solid rgba(245, 158, 11, 0.35)',
                background: 'rgba(245, 158, 11, 0.14)',
                color: '#fcd34d',
              }}
            >
              Heavy configuration detected. Runtime can increase under full data load.
            </div>
          )}
        </section>
      )}

      {step === 4 && (
        <section className="premium-card p-5 md:p-6 journey-energy-shell" style={{ borderColor: STAGE_TONE[4].border, background: STAGE_TONE[4].surface }}>
          <p className="text-[10px] uppercase tracking-[0.2em] font-semibold" style={{ color: STAGE_TONE[4].accent }}>
            Step 4 / Execution Phase
          </p>
          <h3 className="mt-3 text-xl">Ready to run {humanizeType(type)} simulation</h3>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            Execution uses the existing real-time engine pipeline. Progress and milestones will stream after launch.
          </p>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              'Initializing model...',
              'Sampling probability space...',
              'Computing equilibrium states...',
              'Rendering analytics layer...',
            ].map((item, index) => (
              <div
                key={item}
                className="rounded-xl p-3"
                style={{ border: '1px solid rgba(148, 163, 184, 0.24)', background: 'rgba(11, 16, 32, 0.86)' }}
              >
                <p className="text-[10px] uppercase tracking-[0.16em]" style={{ color: 'var(--text-muted)' }}>
                  Milestone {index + 1}
                </p>
                <p className="mt-1 text-sm">{item}</p>
              </div>
            ))}
          </div>

          <button
            type="button"
            disabled={submitting || !name.trim()}
            className="w-full mt-5 py-4 rounded-2xl text-sm font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              border: '1px solid rgba(37, 99, 235, 0.22)',
              color: 'var(--text-main)',
              background: submitting || !name.trim()
                ? 'rgba(148, 163, 184, 0.3)'
                : 'var(--brand-gradient)',
              boxShadow: submitting || !name.trim() ? 'none' : '0 14px 28px rgba(110, 231, 255, 0.28)',
            }}
            onClick={() => {
              void handleSubmit();
            }}
            data-ripple
          >
            {submitting ? `Running ${humanizeType(type)} simulation...` : `Run ${humanizeType(type)} Simulation`}
          </button>
        </section>
      )}

      {error && (
        <div
          className="px-4 py-3 rounded-xl text-sm"
          style={{
            border: '1px solid rgba(239, 68, 68, 0.35)',
            background: 'rgba(239, 68, 68, 0.12)',
            color: '#fecaca',
          }}
        >
          {error}
        </div>
      )}

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setStep((prev) => Math.max(1, prev - 1) as WizardStep)}
          className="secondary-cta"
          disabled={step === 1 || submitting}
          data-ripple
        >
          Back
        </button>

        {step < 4 && (
          <button
            type="button"
            onClick={() => setStep((prev) => Math.min(4, prev + 1) as WizardStep)}
            className="primary-cta"
            disabled={!canGoNext || submitting}
            data-ripple
          >
            Continue
          </button>
        )}
      </div>
    </div>
  );
}
