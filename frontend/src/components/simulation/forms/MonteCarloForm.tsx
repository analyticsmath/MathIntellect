import { useState } from 'react';
import { FieldInput, FieldSelect, FieldSlider, SectionDivider, SmallBtn, Label } from './FormField';

type Distribution = 'normal' | 'uniform' | 'exponential' | 'bernoulli';

interface Variable {
  name: string;
  distribution: Distribution;
  params: Record<string, number>;
}

const DIST_DEFAULTS: Record<Distribution, Record<string, number>> = {
  normal: { mean: 0, std: 1 },
  uniform: { min: 0, max: 1 },
  exponential: { rate: 1 },
  bernoulli: { probability: 0.5 },
};

const DIST_PARAMS: Record<Distribution, { key: string; label: string; min: number; max: number; step: number }[]> = {
  normal: [
    { key: 'mean', label: 'Mean', min: -100, max: 100, step: 0.01 },
    { key: 'std', label: 'Std Dev', min: 0.001, max: 100, step: 0.01 },
  ],
  uniform: [
    { key: 'min', label: 'Min', min: -100, max: 100, step: 0.01 },
    { key: 'max', label: 'Max', min: -100, max: 100, step: 0.01 },
  ],
  exponential: [{ key: 'rate', label: 'Rate (λ)', min: 0.01, max: 100, step: 0.01 }],
  bernoulli: [{ key: 'probability', label: 'p', min: 0, max: 1, step: 0.01 }],
};

interface Props {
  onChange: (params: Record<string, unknown>) => void;
}

export function MonteCarloForm({ onChange }: Props) {
  const [iterations, setIterations] = useState(5000);
  const [seed, setSeed] = useState<number | ''>('');
  const [expression, setExpression] = useState('r * w');
  const [variables, setVariables] = useState<Variable[]>([
    { name: 'r', distribution: 'normal', params: { mean: 0.08, std: 0.18 } },
    { name: 'w', distribution: 'uniform', params: { min: 0.3, max: 0.7 } },
  ]);

  const emit = (upd: { iterations?: number; seed?: number | ''; expression?: string; vars?: Variable[] }) => {
    const its = upd.iterations ?? iterations;
    const s = upd.seed ?? seed;
    const expr = upd.expression ?? expression;
    const vars = upd.vars ?? variables;
    const params: Record<string, unknown> = {
      iterations: its,
      outputExpression: expr,
      variables: vars.map((v) => ({ name: v.name, distribution: v.distribution, params: v.params })),
    };
    if (s !== '') params.seed = s;
    onChange(params);
  };

  const addVariable = () => {
    const dist: Distribution = 'normal';
    const next = [
      ...variables,
      { name: `x${variables.length + 1}`, distribution: dist, params: { ...DIST_DEFAULTS[dist] } },
    ];
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
      if (patch.distribution) updated.params = { ...DIST_DEFAULTS[patch.distribution] };
      return updated;
    });
    setVariables(next);
    emit({ vars: next });
  };

  const updateVarParam = (i: number, key: string, val: number) => {
    const next = variables.map((v, idx) => (idx !== i ? v : { ...v, params: { ...v.params, [key]: val } }));
    setVariables(next);
    emit({ vars: next });
  };

  return (
    <div className="space-y-5">
      {/* Iterations */}
      <FieldSlider
        label="Iterations (Samples)"
        min={100}
        max={20000}
        step={100}
        value={iterations}
        onChange={(v) => {
          setIterations(v);
          emit({ iterations: v });
        }}
        format={(v) => v.toLocaleString()}
        helper="Calculates deterministic sample convergence over continuous probability field."
      />

      {/* Output Expression */}
      <FieldInput
        label="Output Mathematical Expression"
        value={expression}
        onChange={(e) => {
          setExpression(e.target.value);
          emit({ expression: e.target.value });
        }}
        placeholder="e.g. r * w + 10"
        mono
        helper="Evaluated pointwise across stochastic draws. Supports basic arithmetic and standard operators."
      />

      {/* Variables */}
      <SectionDivider
        title={`Variables (${variables.length})`}
        action={
          <SmallBtn variant="add" onClick={addVariable}>
            + Add Variable
          </SmallBtn>
        }
      />

      <div className="space-y-3">
        {variables.map((v, i) => (
          <div key={i} className="p-3 bg-mi-paper border border-mi-rule space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-mi-ink">
                Variable: {v.name || '?'}
              </span>
              <SmallBtn variant="remove" onClick={() => removeVariable(i)} disabled={variables.length <= 1}>
                Remove
              </SmallBtn>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <FieldInput
                label="Symbol"
                value={v.name}
                onChange={(e) => updateVar(i, { name: e.target.value })}
                mono
              />
              <FieldSelect
                label="Distribution"
                value={v.distribution}
                onChange={(e) => updateVar(i, { distribution: e.target.value as Distribution })}
              >
                <option value="normal">Normal (Gaussian)</option>
                <option value="uniform">Uniform</option>
                <option value="exponential">Exponential</option>
                <option value="bernoulli">Bernoulli</option>
              </FieldSelect>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {DIST_PARAMS[v.distribution].map((p) => (
                <FieldInput
                  key={p.key}
                  label={p.label}
                  type="number"
                  min={p.min}
                  max={p.max}
                  step={p.step}
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
        <Label hint="optional">Deterministic Seed</Label>
        <FieldInput
          type="number"
          value={seed}
          onChange={(e) => {
            const v = e.target.value === '' ? '' : Number(e.target.value);
            setSeed(v);
            emit({ seed: v });
          }}
          placeholder="Fixed integer (e.g. 42)"
          helper="Explicit seed guarantees exact reproducible results across recalculations."
        />
      </div>
    </div>
  );
}
