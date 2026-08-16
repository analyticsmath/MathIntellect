import { useState } from 'react';
import { FieldInput, FieldSlider } from './FormField';

interface Props {
  onChange: (params: Record<string, unknown>) => void;
}

export function MarketForm({ onChange }: Props) {
  const [price, setPrice] = useState(100);
  const [vol, setVol] = useState(25);
  const [drift, setDrift] = useState(8);
  const [days, setDays] = useState(90);
  const [paths, setPaths] = useState(50);
  const [seed, setSeed] = useState<number | ''>('');

  const emit = (p: { price?: number; vol?: number; drift?: number; days?: number; paths?: number; seed?: number | '' }) => {
    const out: Record<string, unknown> = {
      initialPrice: p.price ?? price,
      volatility: (p.vol ?? vol) / 100,
      drift: (p.drift ?? drift) / 100,
      timeHorizonDays: p.days ?? days,
      paths: p.paths ?? paths,
    };
    const s = p.seed ?? seed;
    if (s !== '') out.seed = s;
    onChange(out);
  };

  return (
    <div className="space-y-5">
      <FieldInput
        label="Initial Asset State (x₀)"
        type="number"
        min={1}
        value={price}
        onChange={(e) => {
          setPrice(Number(e.target.value));
          emit({ price: Number(e.target.value) });
        }}
        prefix="$"
        helper="Starting level of the simulated state."
      />

      <FieldSlider
        label="Volatility Parameter (σ)"
        min={1}
        max={200}
        step={1}
        value={vol}
        onChange={(v) => {
          setVol(v);
          emit({ vol: v });
        }}
        format={(v) => `${v}%`}
        helper="Diffusion variance scale per unit time."
      />

      <FieldSlider
        label="Drift Parameter (μ)"
        min={-50}
        max={100}
        step={1}
        value={drift}
        onChange={(v) => {
          setDrift(v);
          emit({ drift: v });
        }}
        format={(v) => `${v > 0 ? '+' : ''}${v}%`}
        helper="Deterministic trend rate."
      />

      <FieldSlider
        label="Horizon (Time Steps)"
        min={10}
        max={365}
        step={1}
        value={days}
        onChange={(v) => {
          setDays(v);
          emit({ days: v });
        }}
        format={(v) => `${v} steps`}
      />

      <FieldSlider
        label="Sample Pathways"
        min={5}
        max={100}
        step={5}
        value={paths}
        onChange={(v) => {
          setPaths(v);
          emit({ paths: v });
        }}
        format={(v) => String(v)}
      />

      <FieldInput
        label="Deterministic Seed"
        hint="optional"
        type="number"
        value={seed}
        onChange={(e) => {
          const v = e.target.value === '' ? '' : Number(e.target.value);
          setSeed(v);
          emit({ seed: v });
        }}
        placeholder="Fixed integer (e.g. 101)"
      />
    </div>
  );
}
