import { useState } from 'react';
import { FieldInput, FieldSelect, FieldSlider, SectionDivider, SmallBtn, Label } from './FormField';

type Distribution = 'normal' | 'uniform' | 'exponential' | 'bernoulli';

interface Variable {
  name: string;
  distribution: Distribution;
  params: Record<string, number>;
}

const DIST_DEFAULTS: Record<Distribution, Record<string, number>> = {
  normal:      { mean: 0,    std: 1 },
  uniform:     { min: 0,     max: 1 },
  exponential: { rate: 1 },
  bernoulli:   { probability: 0.5 },
};

const DIST_PARAMS: Record<Distribution, { key: string; label: string; min: number; max: number; step: number }[]> = {
  normal:      [{ key: 'mean', label: 'Mean',        min: -100, max: 100,  step: 0.01 }, { key: 'std',   label: 'Std Dev',     min: 0,    max: 100,  step: 0.01 }],
  uniform:     [{ key: 'min',  label: 'Min',         min: -100, max: 100,  step: 0.01 }, { key: 'max',   label: 'Max',         min: -100, max: 100,  step: 0.01 }],
  exponential: [{ key: 'rate', label: 'Rate (λ)',    min: 0.01, max: 100,  step: 0.01 }],
  bernoulli:   [{ key: 'probability', label: 'p',    min: 0,    max: 1,    step: 0.01 }],
};

const DIST_DESC: Record<Distribution, string> = {
  normal:      'Bell-curve — mean & spread',
  uniform:     'Equal probability in [min, max]',
  exponential: 'Memoryless waiting-time model',
  bernoulli:   'Binary outcome with probability p',
};

interface Props {
  onChange: (params: Record<string, unknown>) => void;
}

export function MonteCarloForm({ onChange }: Props) {
  const [iterations, setIterations] = useState(5000);
  const [seed, setSeed]             = useState<number | ''>('');
  const [expression, setExpression] = useState('r * w');
  const [variables, setVariables]   = useState<Variable[]>([
    { name: 'r', distribution: 'normal',  params: { mean: 0.08, std: 0.18 } },
    { name: 'w', distribution: 'uniform', params: { min: 0.3,   max: 0.7  } },
  ]);

  const emit = (upd: { iterations?: number; seed?: number | ''; expression?: string; vars?: Variable[] }) => {
    const its  = upd.iterations  ?? iterations;
    const s    = upd.seed        ?? seed;
    const expr = upd.expression  ?? expression;
    const vars = upd.vars        ?? variables;
    const params: Record<string, unknown> = {
      iterations: its,
      outputExpression: expr,
      variables: vars.map(v => ({ name: v.name, distribution: v.distribution, params: v.params })),
    };
    if (s !== '') params.seed = s;
    onChange(params);
  };

  const addVariable = () => {
    const dist: Distribution = 'normal';
    const next = [...variables, { name: `x${variables.length + 1}`, distribution: dist, params: { ...DIST_DEFAULTS[dist] } }];
    setVariables(next);
    emit({ vars: next });
  };

  const removeVariable = (i: number) => {
    const next = variables.filter((_, idx) => idx !== i);
    setVariables(next);
    emit({ vars: next });
  };

  const updateVar = (i: number, patch: Partial<Variable>) => {
    const next = variables.map((v, idx) => {
      if (idx !== i) return v;
      const updated = { ...v, ...patch };
      // Reset params when distribution changes
      if (patch.distribution) updated.params = { ...DIST_DEFAULTS[patch.distribution] };
      return updated;
    });
    setVariables(next);
    emit({ vars: next });
  };

  const updateVarParam = (i: number, key: string, val: number) => {
    const next = variables.map((v, idx) => idx !== i ? v : { ...v, params: { ...v.params, [key]: val } });
    setVariables(next);
    emit({ vars: next });
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Iterations */}
      <FieldSlider
        label="Iterations"
        min={100} max={50000} step={100}
        value={iterations}
        onChange={(v) => { setIterations(v); emit({ iterations: v }); }}
        format={(v) => v.toLocaleString()}
        helper="More iterations → higher accuracy but slower. 5 000 is a good balance."
        accentColor="#7C3AED"
      />

      {/* Output Expression */}
      <FieldInput
        label="Output Expression"
        hint="Evaluated per iteration"
        value={expression}
        onChange={(e) => { setExpression(e.target.value); emit({ expression: e.target.value }); }}
        placeholder="e.g. r * w + c"
        mono
        helper="Arithmetic expression using your variable names below. Supports +, -, *, /, Math.* functions."
      />

      {/* Variables */}
      <SectionDivider
        title={`Variables (${variables.length})`}
        action={
          <SmallBtn variant="add" onClick={addVariable}>
            <svg viewBox="0 0 12 12" fill="currentColor" className="w-3 h-3"><path d="M6 1a.75.75 0 01.75.75V5.25h3.5a.75.75 0 010 1.5h-3.5v3.5a.75.75 0 01-1.5 0v-3.5H1.75a.75.75 0 010-1.5h3.5V1.75A.75.75 0 016 1z"/></svg>
            Add Variable
          </SmallBtn>
        }
      />

      <div className="flex flex-col gap-3">
        {variables.map((v, i) => (
          <div
            key={i}
            className="rounded-xl p-4 flex flex-col gap-3"
            style={{
              background: 'rgba(11,16,32,0.9)',
              border: '1px solid rgba(148,163,184,0.28)',
              boxShadow: '0 14px 30px rgba(15,23,42,0.06)',
            }}
          >
            {/* Variable header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold font-mono"
                  style={{ background: 'rgba(124,58,237,0.12)', color: '#6D28D9', border: '1px solid rgba(124,58,237,0.22)' }}
                >
                  {v.name || '?'}
                </span>
                <span className="text-xs text-text-secondary font-medium">{DIST_DESC[v.distribution]}</span>
              </div>
              <SmallBtn variant="remove" onClick={() => removeVariable(i)} disabled={variables.length <= 1}>
                <svg viewBox="0 0 12 12" fill="currentColor" className="w-3 h-3"><path d="M1.75 6a.75.75 0 000 1.5h8.5a.75.75 0 000-1.5h-8.5z"/></svg>
                Remove
              </SmallBtn>
            </div>

            {/* Name + Distribution row */}
            <div className="grid grid-cols-2 gap-3">
              <FieldInput
                label="Name"
                value={v.name}
                onChange={(e) => updateVar(i, { name: e.target.value })}
                placeholder="x"
                mono
              />
              <FieldSelect
                label="Distribution"
                value={v.distribution}
                onChange={(e) => updateVar(i, { distribution: e.target.value as Distribution })}
              >
                {(['normal', 'uniform', 'exponential', 'bernoulli'] as Distribution[]).map(d => (
                  <option key={d} value={d} style={{ background: 'rgba(11, 16, 32, 0.9)', color: 'var(--text-primary)' }}>
                    {d.charAt(0).toUpperCase() + d.slice(1)}
                  </option>
                ))}
              </FieldSelect>
            </div>

            {/* Distribution params */}
            <div className={`grid gap-3 ${DIST_PARAMS[v.distribution].length === 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
              {DIST_PARAMS[v.distribution].map(p => (
                <FieldInput
                  key={p.key}
                  label={p.label}
                  type="number"
                  min={p.min} max={p.max} step={p.step}
                  value={v.params[p.key] ?? 0}
                  onChange={(e) => updateVarParam(i, p.key, Number(e.target.value))}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Seed */}
      <div>
        <Label hint="optional">Random Seed</Label>
        <FieldInput
          type="number"
          value={seed}
          onChange={(e) => { const v = e.target.value === '' ? '' : Number(e.target.value); setSeed(v); emit({ seed: v }); }}
          placeholder="Leave blank for random"
          helper="Set a seed for reproducible results across runs."
        />
      </div>
    </div>
  );
}
