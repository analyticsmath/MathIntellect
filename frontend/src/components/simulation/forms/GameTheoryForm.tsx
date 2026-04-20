import { useState } from 'react';
import { SectionDivider, SmallBtn } from './FormField';

interface PayoffEntry {
  strategies: Record<string, string>;
  payoffs: Record<string, number>;
}

interface Props { onChange: (params: Record<string, unknown>) => void; }

export function GameTheoryForm({ onChange }: Props) {
  const [p1Name, setP1Name] = useState('Alice');
  const [p2Name, setP2Name] = useState('Bob');
  const [p1Strats, setP1Strats] = useState(['Cooperate', 'Defect']);
  const [p2Strats, setP2Strats] = useState(['Cooperate', 'Defect']);

  // payoffs[p1StratIdx][p2StratIdx] = { p1payoff, p2payoff }
  const [payoffs, setPayoffs] = useState<{ p1: number; p2: number }[][]>([
    [{ p1: 3, p2: 3 }, { p1: 0, p2: 5 }],
    [{ p1: 5, p2: 0 }, { p1: 1, p2: 1 }],
  ]);

  const emit = (args?: { p1?: string; p2?: string; s1?: string[]; s2?: string[]; pw?: typeof payoffs }) => {
    const pp1 = args?.p1 ?? p1Name;
    const pp2 = args?.p2 ?? p2Name;
    const ss1 = args?.s1 ?? p1Strats;
    const ss2 = args?.s2 ?? p2Strats;
    const pw  = args?.pw ?? payoffs;

    const matrix: PayoffEntry[] = [];
    for (let i = 0; i < ss1.length; i++) {
      for (let j = 0; j < ss2.length; j++) {
        const cell = pw[i]?.[j] ?? { p1: 0, p2: 0 };
        matrix.push({
          strategies: { [pp1]: ss1[i], [pp2]: ss2[j] },
          payoffs:    { [pp1]: cell.p1, [pp2]: cell.p2 },
        });
      }
    }

    onChange({
      players:    [pp1, pp2],
      strategies: { [pp1]: ss1, [pp2]: ss2 },
      payoffMatrix: matrix,
    });
  };

  // Add/remove strategies
  const addStrat = (player: 1 | 2) => {
    const n = player === 1 ? `S${p1Strats.length + 1}` : `S${p2Strats.length + 1}`;
    if (player === 1) {
      const s1 = [...p1Strats, n];
      const pw = [...payoffs, Array(p2Strats.length).fill({ p1: 0, p2: 0 })];
      setP1Strats(s1); setPayoffs(pw); emit({ s1, pw });
    } else {
      const s2 = [...p2Strats, n];
      const pw = payoffs.map(row => [...row, { p1: 0, p2: 0 }]);
      setP2Strats(s2); setPayoffs(pw); emit({ s2, pw });
    }
  };

  const removeStrat = (player: 1 | 2, idx: number) => {
    if (player === 1 && p1Strats.length > 2) {
      const s1 = p1Strats.filter((_, i) => i !== idx);
      const pw = payoffs.filter((_, i) => i !== idx);
      setP1Strats(s1); setPayoffs(pw); emit({ s1, pw });
    }
    if (player === 2 && p2Strats.length > 2) {
      const s2 = p2Strats.filter((_, i) => i !== idx);
      const pw = payoffs.map(row => row.filter((_, i) => i !== idx));
      setP2Strats(s2); setPayoffs(pw); emit({ s2, pw });
    }
  };

  const updateStrat = (player: 1 | 2, idx: number, val: string) => {
    if (player === 1) {
      const s1 = p1Strats.map((s, i) => i === idx ? val : s);
      setP1Strats(s1); emit({ s1 });
    } else {
      const s2 = p2Strats.map((s, i) => i === idx ? val : s);
      setP2Strats(s2); emit({ s2 });
    }
  };

  const updatePayoff = (i: number, j: number, which: 'p1' | 'p2', val: number) => {
    const pw = payoffs.map((row, ri) =>
      row.map((cell, ci) => ri === i && ci === j ? { ...cell, [which]: val } : cell)
    );
    setPayoffs(pw); emit({ pw });
  };

  const COLORS = { p1: '#2563EB', p2: '#06B6D4' };

  return (
    <div className="flex flex-col gap-5">
      {/* Players */}
      <div className="grid grid-cols-2 gap-4">
        {([
          { label: 'Player 1', name: p1Name, setName: (v: string) => { setP1Name(v); emit({ p1: v }); }, color: COLORS.p1 },
          { label: 'Player 2', name: p2Name, setName: (v: string) => { setP2Name(v); emit({ p2: v }); }, color: COLORS.p2 },
        ]).map(({ label, name, setName, color }) => (
          <div key={label}>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
              <label className="text-xs font-semibold text-text-muted uppercase tracking-widest">{label}</label>
            </div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2.5 text-sm focus:outline-none rounded-[0.625rem]"
              style={{ background: 'rgba(11, 16, 32, 0.9)', border: '1px solid rgba(148,163,184,0.32)', color: 'var(--text-primary)' }}
              onFocus={(e) => { e.currentTarget.style.borderColor = `${color}60`; e.currentTarget.style.boxShadow = `0 0 0 3px ${color}18`; }}
              onBlur={(e)  => { e.currentTarget.style.borderColor = 'rgba(148,163,184,0.32)'; e.currentTarget.style.boxShadow = 'none'; }}
            />
          </div>
        ))}
      </div>

      {/* Strategies */}
      {([
        { label: `${p1Name}'s Strategies`, strats: p1Strats, player: 1 as const, color: COLORS.p1 },
        { label: `${p2Name}'s Strategies`, strats: p2Strats, player: 2 as const, color: COLORS.p2 },
      ]).map(({ label, strats, player, color }) => (
        <div key={player}>
          <SectionDivider
            title={label}
            action={
              <SmallBtn variant="add" onClick={() => addStrat(player)}>
                <svg viewBox="0 0 12 12" fill="currentColor" className="w-3 h-3"><path d="M6 1a.75.75 0 01.75.75V5.25h3.5a.75.75 0 010 1.5h-3.5v3.5a.75.75 0 01-1.5 0v-3.5H1.75a.75.75 0 010-1.5h3.5V1.75A.75.75 0 016 1z"/></svg>
                Add
              </SmallBtn>
            }
          />
          <div className="flex flex-wrap gap-2 mt-3">
            {strats.map((s, idx) => (
              <div key={idx} className="flex items-center gap-1 rounded-lg overflow-hidden" style={{ border: `1px solid ${color}30`, background: 'rgba(11, 16, 32, 0.9)' }}>
                <input
                  value={s}
                  onChange={(e) => updateStrat(player, idx, e.target.value)}
                  className="px-2.5 py-1 text-xs font-medium bg-transparent focus:outline-none w-24"
                  style={{ color }}
                />
                {strats.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeStrat(player, idx)}
                    className="px-1.5 py-1 text-text-dim hover:text-red-400 transition-colors text-xs"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Payoff Matrix */}
      <div>
        <SectionDivider title="Payoff Matrix" />
        <p className="text-2xs text-text-dim mt-2 mb-3 leading-relaxed">
          Each cell shows (<span style={{ color: COLORS.p1 }}>{p1Name}</span>, <span style={{ color: COLORS.p2 }}>{p2Name}</span>) payoffs. Click to edit.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr>
                <th className="p-2 text-left text-text-dim text-2xs" style={{ minWidth: '80px' }}></th>
                {p2Strats.map((s, j) => (
                  <th key={j} className="p-2 text-center font-semibold" style={{ color: COLORS.p2, minWidth: '110px' }}>
                    {s || `S${j + 1}`}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {p1Strats.map((s1, i) => (
                <tr key={i}>
                  <td
                    className="p-2 font-semibold text-xs"
                    style={{ color: COLORS.p1 }}
                  >
                    {s1 || `S${i + 1}`}
                  </td>
                  {p2Strats.map((_, j) => {
                    const cell = payoffs[i]?.[j] ?? { p1: 0, p2: 0 };
                    return (
                      <td key={j} className="p-1.5">
                        <div
                          className="rounded-lg p-2 flex gap-1"
                          style={{ background: 'rgba(11,16,32,0.9)', border: '1px solid rgba(148,163,184,0.3)' }}
                        >
                          <input
                            type="number"
                            value={cell.p1}
                            onChange={(e) => updatePayoff(i, j, 'p1', Number(e.target.value))}
                            className="w-10 bg-transparent text-xs text-center font-mono focus:outline-none"
                            style={{ color: COLORS.p1 }}
                            title={`${p1Name}'s payoff`}
                          />
                          <span className="text-text-dim self-center">,</span>
                          <input
                            type="number"
                            value={cell.p2}
                            onChange={(e) => updatePayoff(i, j, 'p2', Number(e.target.value))}
                            className="w-10 bg-transparent text-xs text-center font-mono focus:outline-none"
                            style={{ color: COLORS.p2 }}
                            title={`${p2Name}'s payoff`}
                          />
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-2xs text-text-dim mt-2">
          Classic examples: Prisoner's Dilemma (3,3)/(0,5)/(5,0)/(1,1) · Battle of the Sexes · Stag Hunt
        </p>
      </div>
    </div>
  );
}
