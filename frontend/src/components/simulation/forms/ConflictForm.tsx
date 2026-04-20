import { useState } from 'react';
import { FieldSlider, SectionDivider, SmallBtn } from './FormField';

type Strategy = 'aggressive' | 'cooperative' | 'tit_for_tat' | 'random' | 'defector';

interface Agent {
  id: string;
  name: string;
  resources: number;
  strategy: Strategy;
}

const STRATEGY_META: Record<Strategy, { label: string; desc: string; color: string; icon: string }> = {
  aggressive:  { label: 'Aggressive',  desc: 'Always attacks — maximises short-term gain', color: '#EF4444', icon: '⚔️' },
  cooperative: { label: 'Cooperative', desc: 'Always cooperates — maximises collective welfare', color: '#16A34A', icon: '🤝' },
  tit_for_tat: { label: 'Tit-for-Tat', desc: 'Mirrors opponent\'s last move — classic reciprocity', color: '#2563EB', icon: '🔄' },
  random:      { label: 'Random',      desc: 'Randomly cooperates or attacks each round', color: '#F59E0B', icon: '🎲' },
  defector:    { label: 'Defector',    desc: 'Pretends cooperative, then defects strategically', color: '#7C3AED', icon: '🕵️' },
};

const DEFAULT_AGENTS: Agent[] = [
  { id: 'a1', name: 'Hawk',      resources: 100, strategy: 'aggressive'  },
  { id: 'a2', name: 'Dove',      resources: 100, strategy: 'cooperative' },
  { id: 'a3', name: 'TitForTat', resources: 100, strategy: 'tit_for_tat' },
  { id: 'a4', name: 'Wildcard',  resources: 100, strategy: 'random'      },
];

interface Props { onChange: (params: Record<string, unknown>) => void; }

export function ConflictForm({ onChange }: Props) {
  const [rounds, setRounds]   = useState(100);
  const [seed, setSeed]       = useState<number | ''>('');
  const [agents, setAgents]   = useState<Agent[]>(DEFAULT_AGENTS);

  const emit = (r?: number, s?: number | '', a?: Agent[]) => {
    const out: Record<string, unknown> = {
      rounds: r ?? rounds,
      agents: (a ?? agents).map(ag => ({ id: ag.id, name: ag.name, resources: ag.resources, strategy: ag.strategy })),
    };
    const seed_ = s ?? seed;
    if (seed_ !== '') out.seed = seed_;
    onChange(out);
  };

  const addAgent = () => {
    const id = `a${Date.now()}`;
    const next = [...agents, { id, name: `Agent ${agents.length + 1}`, resources: 100, strategy: 'random' as Strategy }];
    setAgents(next); emit(undefined, undefined, next);
  };

  const removeAgent = (idx: number) => {
    if (agents.length <= 2) return;
    const next = agents.filter((_, i) => i !== idx);
    setAgents(next); emit(undefined, undefined, next);
  };

  const updateAgent = (idx: number, patch: Partial<Agent>) => {
    const next = agents.map((a, i) => i === idx ? { ...a, ...patch } : a);
    setAgents(next); emit(undefined, undefined, next);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Rounds */}
      <FieldSlider
        label="Simulation Rounds"
        min={10} max={500} step={10}
        value={rounds}
        onChange={(v) => { setRounds(v); emit(v); }}
        format={(v) => String(v)}
        helper="Each round all agents interact pairwise. More rounds = more stable cooperation rates."
        accentColor="#EF4444"
      />

      {/* Agents */}
      <SectionDivider
        title={`Agents (${agents.length})`}
        action={
          <SmallBtn variant="add" onClick={addAgent} disabled={agents.length >= 8}>
            <svg viewBox="0 0 12 12" fill="currentColor" className="w-3 h-3"><path d="M6 1a.75.75 0 01.75.75V5.25h3.5a.75.75 0 010 1.5h-3.5v3.5a.75.75 0 01-1.5 0v-3.5H1.75a.75.75 0 010-1.5h3.5V1.75A.75.75 0 016 1z"/></svg>
            Add Agent
          </SmallBtn>
        }
      />

      <div className="flex flex-col gap-2.5 mt-1">
        {agents.map((agent, idx) => {
          const strat = STRATEGY_META[agent.strategy];
          return (
            <div
              key={agent.id}
              className="rounded-xl p-4 transition-all duration-150"
              style={{
                background: 'rgba(11,16,32,0.88)',
                border: '1px solid rgba(148,163,184,0.3)',
              }}
            >
              {/* Agent header */}
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-base shrink-0"
                  style={{ background: `${strat.color}12`, border: `1px solid ${strat.color}25` }}
                >
                  {strat.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <input
                    value={agent.name}
                    onChange={(e) => updateAgent(idx, { name: e.target.value })}
                    className="w-full bg-transparent text-sm font-semibold text-text-primary focus:outline-none border-b border-transparent hover:border-bg-border focus:border-brand-500/30 pb-0.5 transition-colors"
                    placeholder="Agent name"
                  />
                  <p className="text-2xs mt-0.5 truncate" style={{ color: `${strat.color}bb` }}>{strat.desc}</p>
                </div>
                <SmallBtn variant="remove" onClick={() => removeAgent(idx)} disabled={agents.length <= 2}>
                  <svg viewBox="0 0 12 12" fill="currentColor" className="w-3 h-3"><path d="M1.75 6a.75.75 0 000 1.5h8.5a.75.75 0 000-1.5h-8.5z"/></svg>
                </SmallBtn>
              </div>

              {/* Strategy selector */}
              <div className="mb-3">
                <p className="text-2xs text-text-dim uppercase tracking-widest font-semibold mb-2">Strategy</p>
                <div className="grid grid-cols-3 gap-1.5">
                  {(Object.entries(STRATEGY_META) as [Strategy, typeof STRATEGY_META[Strategy]][]).map(([key, m]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => updateAgent(idx, { strategy: key })}
                      className="flex flex-col items-center gap-1 p-2 rounded-lg text-center transition-all duration-100"
                      style={{
                        background: agent.strategy === key ? `${m.color}12` : 'rgba(11,16,32,0.8)',
                        border: `1px solid ${agent.strategy === key ? m.color + '35' : 'rgba(148,163,184,0.3)'}`,
                      }}
                    >
                      <span className="text-base leading-none">{m.icon}</span>
                      <span className="text-2xs font-semibold leading-tight" style={{ color: agent.strategy === key ? m.color : '#475569' }}>
                        {m.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Starting resources */}
              <FieldSlider
                label="Starting Resources"
                min={10} max={500} step={10}
                value={agent.resources}
                onChange={(v) => updateAgent(idx, { resources: v })}
                format={(v) => String(v)}
                accentColor={strat.color}
              />
            </div>
          );
        })}
      </div>

      {/* Seed */}
      <div>
        <label className="block text-xs font-semibold text-text-muted uppercase tracking-widest mb-1.5">
          Random Seed <span className="text-text-dim normal-case font-normal">optional</span>
        </label>
        <input
          type="number"
          value={seed}
          onChange={(e) => { const v = e.target.value === '' ? '' : Number(e.target.value); setSeed(v); emit(undefined, v); }}
          placeholder="Leave blank for random"
          className="w-full px-3 py-2.5 text-sm focus:outline-none rounded-[0.625rem]"
          style={{ background: 'rgba(11, 16, 32, 0.9)', border: '1px solid rgba(148,163,184,0.32)', color: 'var(--text-primary)' }}
          onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(37,99,235,0.5)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)'; }}
          onBlur={(e)  => { e.currentTarget.style.borderColor = 'rgba(148,163,184,0.32)'; e.currentTarget.style.boxShadow = 'none'; }}
        />
      </div>

      {/* Legend */}
      <div
        className="rounded-xl p-4"
        style={{ background: 'rgba(11,16,32,0.88)', border: '1px solid rgba(148,163,184,0.28)' }}
      >
        <p className="text-2xs text-text-dim uppercase tracking-widest font-semibold mb-3">Strategy Reference</p>
        <div className="flex flex-col gap-1.5">
          {(Object.entries(STRATEGY_META) as [Strategy, typeof STRATEGY_META[Strategy]][]).map(([key, m]) => (
            <div key={key} className="flex items-start gap-2">
              <span className="text-sm leading-none mt-0.5">{m.icon}</span>
              <div>
                <span className="text-xs font-semibold" style={{ color: m.color }}>{m.label}</span>
                <span className="text-2xs text-text-dim ml-2">{m.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
