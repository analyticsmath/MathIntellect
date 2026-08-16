import { useState } from 'react';
import { SectionDivider } from './FormField';

interface PayoffEntry {
  strategies: Record<string, string>;
  payoffs: Record<string, number>;
}

interface Props {
  onChange: (params: Record<string, unknown>) => void;
}

export function GameTheoryForm({ onChange }: Props) {
  const [p1Name, setP1Name] = useState('Player A');
  const [p2Name, setP2Name] = useState('Player B');
  const [p1Strats, setP1Strats] = useState(['Strategy 1', 'Strategy 2']);
  const [p2Strats, setP2Strats] = useState(['Strategy 1', 'Strategy 2']);

  const [payoffs, setPayoffs] = useState<{ p1: number; p2: number }[][]>([
    [{ p1: 4, p2: 1 }, { p1: 1, p2: 5 }],
    [{ p1: 2, p2: 3 }, { p1: 5, p2: 2 }],
  ]);

  const emit = (args?: { p1?: string; p2?: string; s1?: string[]; s2?: string[]; pw?: typeof payoffs }) => {
    const pp1 = args?.p1 ?? p1Name;
    const pp2 = args?.p2 ?? p2Name;
    const ss1 = args?.s1 ?? p1Strats;
    const ss2 = args?.s2 ?? p2Strats;
    const pw = args?.pw ?? payoffs;

    const matrix: PayoffEntry[] = [];
    for (let i = 0; i < ss1.length; i++) {
      for (let j = 0; j < ss2.length; j++) {
        const cell = pw[i]?.[j] ?? { p1: 0, p2: 0 };
        matrix.push({
          strategies: { [pp1]: ss1[i], [pp2]: ss2[j] },
          payoffs: { [pp1]: cell.p1, [pp2]: cell.p2 },
        });
      }
    }

    onChange({
      players: [pp1, pp2],
      strategies: { [pp1]: ss1, [pp2]: ss2 },
      payoffMatrix: matrix,
    });
  };

  const updateStrategy = (player: 1 | 2, idx: number, val: string) => {
    if (player === 1) {
      const next = p1Strats.map((s, i) => (i === idx ? val : s));
      setP1Strats(next);
      emit({ s1: next });
    } else {
      const next = p2Strats.map((s, i) => (i === idx ? val : s));
      setP2Strats(next);
      emit({ s2: next });
    }
  };

  const updatePayoff = (i: number, j: number, which: 'p1' | 'p2', val: number) => {
    const pw = payoffs.map((row, ri) =>
      row.map((cell, ci) => (ri === i && ci === j ? { ...cell, [which]: val } : cell))
    );
    setPayoffs(pw);
    emit({ pw });
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-mono text-mi-muted uppercase">Player 1</label>
          <input
            value={p1Name}
            onChange={(e) => {
              setP1Name(e.target.value);
              emit({ p1: e.target.value });
            }}
            className="mi-input h-9 text-xs mt-1"
          />
        </div>
        <div>
          <label className="text-xs font-mono text-mi-muted uppercase">Player 2</label>
          <input
            value={p2Name}
            onChange={(e) => {
              setP2Name(e.target.value);
              emit({ p2: e.target.value });
            }}
            className="mi-input h-9 text-xs mt-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-mono text-mi-muted uppercase block mb-1">P1 Strategies</label>
          <div className="space-y-1.5">
            {p1Strats.map((s, i) => (
              <input
                key={i}
                value={s}
                onChange={(e) => updateStrategy(1, i, e.target.value)}
                className="mi-input h-8 text-xs"
              />
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs font-mono text-mi-muted uppercase block mb-1">P2 Strategies</label>
          <div className="space-y-1.5">
            {p2Strats.map((s, i) => (
              <input
                key={i}
                value={s}
                onChange={(e) => updateStrategy(2, i, e.target.value)}
                className="mi-input h-8 text-xs"
              />
            ))}
          </div>
        </div>
      </div>

      <SectionDivider title="Payoff Matrix [Row, Col]" />

      <div className="overflow-x-auto">
        <table className="mi-table text-xs font-mono">
          <thead>
            <tr>
              <th></th>
              {p2Strats.map((s, j) => (
                <th key={j} className="text-center">{s}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {p1Strats.map((s1, i) => (
              <tr key={i}>
                <td className="font-semibold text-mi-ink">{s1}</td>
                {p2Strats.map((_, j) => {
                  const cell = payoffs[i]?.[j] ?? { p1: 0, p2: 0 };
                  return (
                    <td key={j} className="p-1">
                      <div className="flex items-center gap-1 border border-mi-rule bg-mi-paper p-1.5 justify-center">
                        <input
                          type="number"
                          value={cell.p1}
                          onChange={(e) => updatePayoff(i, j, 'p1', Number(e.target.value))}
                          className="w-10 text-center font-mono font-bold text-mi-ink focus:outline-none"
                        />
                        <span className="text-mi-muted">,</span>
                        <input
                          type="number"
                          value={cell.p2}
                          onChange={(e) => updatePayoff(i, j, 'p2', Number(e.target.value))}
                          className="w-10 text-center font-mono text-mi-text focus:outline-none"
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
    </div>
  );
}
