import { useState } from 'react';
import { FieldSlider, SectionDivider, SmallBtn } from './FormField';

type Strategy = 'aggressive' | 'cooperative' | 'tit_for_tat' | 'random' | 'defector';

interface Agent {
  id: string;
  name: string;
  resources: number;
  strategy: Strategy;
}

const STRATEGY_META: Record<Strategy, { label: string; desc: string }> = {
  aggressive: { label: 'Aggressive', desc: 'Maximizes unilateral payoff' },
  cooperative: { label: 'Cooperative', desc: 'Seeks mutual welfare optimization' },
  tit_for_tat: { label: 'Tit-for-Tat', desc: 'Mirrors opponent prior action' },
  random: { label: 'Stochastic', desc: 'Random action distribution' },
  defector: { label: 'Defector', desc: 'Exploits cooperative states' },
};

const DEFAULT_AGENTS: Agent[] = [
  { id: 'a1', name: 'Agent Alpha', resources: 100, strategy: 'aggressive' },
  { id: 'a2', name: 'Agent Beta', resources: 100, strategy: 'cooperative' },
  { id: 'a3', name: 'Agent Gamma', resources: 100, strategy: 'tit_for_tat' },
  { id: 'a4', name: 'Agent Delta', resources: 100, strategy: 'random' },
];

interface Props {
  onChange: (params: Record<string, unknown>) => void;
}

export function ConflictForm({ onChange }: Props) {
  const [rounds, setRounds] = useState(100);
  const [seed, setSeed] = useState<number | ''>('');
  const [agents, setAgents] = useState<Agent[]>(DEFAULT_AGENTS);

  const emit = (r?: number, s?: number | '', a?: Agent[]) => {
    const out: Record<string, unknown> = {
      rounds: r ?? rounds,
      agents: (a ?? agents).map((ag) => ({
        id: ag.id,
        name: ag.name,
        resources: ag.resources,
        strategy: ag.strategy,
      })),
    };
    const seed_ = s ?? seed;
    if (seed_ !== '') out.seed = seed_;
    onChange(out);
  };

  const addAgent = () => {
    const id = `a${Date.now()}`;
    const next = [
      ...agents,
      { id, name: `Agent ${agents.length + 1}`, resources: 100, strategy: 'random' as Strategy },
    ];
    setAgents(next);
    emit(undefined, undefined, next);
  };

  const removeAgent = (idx: number) => {
    if (agents.length <= 2) return;
    const next = agents.filter((_, i) => i !== idx);
    setAgents(next);
    emit(undefined, undefined, next);
  };

  const updateAgent = (idx: number, patch: Partial<Agent>) => {
    const next = agents.map((a, i) => (i === idx ? { ...a, ...patch } : a));
    setAgents(next);
    emit(undefined, undefined, next);
  };

  return (
    <div className="space-y-5">
      <FieldSlider
        label="Interaction Rounds"
        min={10}
        max={500}
        step={10}
        value={rounds}
        onChange={(v) => {
          setRounds(v);
          emit(v);
        }}
        format={(v) => String(v)}
      />

      <SectionDivider
        title={`Agents (${agents.length})`}
        action={
          <SmallBtn variant="add" onClick={addAgent} disabled={agents.length >= 8}>
            + Add Agent
          </SmallBtn>
        }
      />

      <div className="space-y-3">
        {agents.map((agent, idx) => (
          <div key={agent.id} className="p-3 bg-mi-paper border border-mi-rule space-y-2">
            <div className="flex items-center justify-between">
              <input
                value={agent.name}
                onChange={(e) => updateAgent(idx, { name: e.target.value })}
                className="font-medium text-xs text-mi-ink bg-transparent focus:outline-none border-b border-transparent focus:border-mi-focus"
              />
              <SmallBtn variant="remove" onClick={() => removeAgent(idx)} disabled={agents.length <= 2}>
                Remove
              </SmallBtn>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-[10px] font-mono text-mi-muted uppercase">Strategy</label>
                <select
                  value={agent.strategy}
                  onChange={(e) => updateAgent(idx, { strategy: e.target.value as Strategy })}
                  className="mi-input h-8 text-xs mt-0.5"
                >
                  {(Object.entries(STRATEGY_META) as [Strategy, typeof STRATEGY_META[Strategy]][]).map(([key, m]) => (
                    <option key={key} value={key}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-mono text-mi-muted uppercase">Resources</label>
                <input
                  type="number"
                  value={agent.resources}
                  onChange={(e) => updateAgent(idx, { resources: Number(e.target.value) })}
                  className="mi-input h-8 text-xs mt-0.5"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div>
        <label className="text-xs font-mono text-mi-muted uppercase block mb-1">
          Deterministic Seed <span className="text-mi-muted/70 lowercase font-normal">(optional)</span>
        </label>
        <input
          type="number"
          value={seed}
          onChange={(e) => {
            const v = e.target.value === '' ? '' : Number(e.target.value);
            setSeed(v);
            emit(undefined, v);
          }}
          placeholder="Fixed integer (e.g. 7)"
          className="mi-input h-9 text-xs"
        />
      </div>
    </div>
  );
}
