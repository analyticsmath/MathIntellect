import { useState } from 'react';
import { FieldInput, FieldSlider } from './FormField';

interface Props { onChange: (params: Record<string, unknown>) => void; }

export function MarketForm({ onChange }: Props) {
  const [price,    setPrice]    = useState(100);
  const [vol,      setVol]      = useState(25);   // stored as %, e.g. 25 = 25%
  const [drift,    setDrift]    = useState(8);    // stored as %, e.g. 8 = 8%
  const [days,     setDays]     = useState(90);
  const [paths,    setPaths]    = useState(50);
  const [seed,     setSeed]     = useState<number | ''>('');

  const emit = (p: { price?: number; vol?: number; drift?: number; days?: number; paths?: number; seed?: number | '' }) => {
    const out: Record<string, unknown> = {
      initialPrice:    p.price  ?? price,
      volatility:     (p.vol   ?? vol)   / 100,
      drift:          (p.drift ?? drift) / 100,
      timeHorizonDays: p.days  ?? days,
      paths:           p.paths ?? paths,
    };
    const s = p.seed ?? seed;
    if (s !== '') out.seed = s;
    onChange(out);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Initial price */}
      <FieldInput
        label="Initial Asset Price"
        type="number"
        min={1}
        value={price}
        onChange={(e) => { setPrice(Number(e.target.value)); emit({ price: Number(e.target.value) }); }}
        prefix="$"
        helper="Starting price of the simulated asset (e.g. stock, commodity)."
      />

      {/* Volatility */}
      <FieldSlider
        label="Annual Volatility (σ)"
        min={1} max={200} step={1}
        value={vol}
        onChange={(v) => { setVol(v); emit({ vol: v }); }}
        format={(v) => `${v}%`}
        helper="Higher σ = wider price swings. 20–30% is typical for equities."
        accentColor="#EF4444"
      />

      {/* Drift */}
      <FieldSlider
        label="Annual Drift (μ)"
        min={-50} max={100} step={1}
        value={drift}
        onChange={(v) => { setDrift(v); emit({ drift: v }); }}
        format={(v) => `${v > 0 ? '+' : ''}${v}%`}
        helper="Expected annual return. Positive = upward trend, negative = downward."
        accentColor="#16A34A"
      />

      {/* Time horizon */}
      <FieldSlider
        label="Time Horizon"
        min={10} max={365} step={1}
        value={days}
        onChange={(v) => { setDays(v); emit({ days: v }); }}
        format={(v) => `${v} days`}
        helper={`${days} trading days ≈ ${(days / 252).toFixed(2)} years.`}
        accentColor="#06B6D4"
      />

      {/* Number of paths */}
      <FieldSlider
        label="Simulation Paths"
        min={5} max={200} step={5}
        value={paths}
        onChange={(v) => { setPaths(v); emit({ paths: v }); }}
        format={(v) => String(v)}
        helper="More paths = more accurate distribution estimate but slower render."
        accentColor="#7C3AED"
      />

      {/* Seed */}
      <FieldInput
        label="Random Seed"
        hint="optional"
        type="number"
        value={seed}
        onChange={(e) => { const v = e.target.value === '' ? '' : Number(e.target.value); setSeed(v); emit({ seed: v }); }}
        placeholder="Leave blank for random"
        helper="Set a seed for reproducible simulation paths."
      />

      {/* Live preview card */}
      <div
        className="rounded-xl p-4 grid grid-cols-2 gap-x-6 gap-y-2"
        style={{ background: 'rgba(11,16,32,0.88)', border: '1px solid rgba(148,163,184,0.3)' }}
      >
        <p className="col-span-2 text-2xs text-text-dim uppercase tracking-widest font-semibold mb-1">Preview</p>
        {[
          { label: 'Starting price',  value: `$${price.toLocaleString()}` },
          { label: 'Volatility',      value: `${vol}% p.a.` },
          { label: 'Expected drift',  value: `${drift > 0 ? '+' : ''}${drift}% p.a.` },
          { label: 'Duration',        value: `${days} days` },
          { label: 'Paths',           value: String(paths) },
          { label: 'GBM model',       value: 'Euler–Maruyama' },
        ].map(({ label, value }) => (
          <div key={label}>
            <p className="text-2xs text-text-dim">{label}</p>
            <p className="text-xs font-semibold text-text-secondary font-mono">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
