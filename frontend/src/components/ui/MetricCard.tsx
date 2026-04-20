import { useEffect, useRef, useState } from 'react';
import { formatMetricValue } from '../../utils/formatters';
import type { MetricCard as MetricCardType } from '../../types/api.types';

function useCountUp(target: number, duration = 900): number {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) {
        startTime = timestamp;
      }
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setValue(target * (1 - Math.pow(1 - progress, 3)));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    };

    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return value;
}

type ValueColor = { text: string; accent: string };

function valueColor(format: string, value: number | string): ValueColor {
  if (typeof value === 'string') {
    return { text: 'var(--text-primary)', accent: 'var(--brand-blue)' };
  }
  if (format === 'percent') {
    if (value > 15) {
      return { text: 'var(--emerald-success)', accent: 'var(--emerald-success)' };
    }
    if (value > 0) {
      return { text: 'var(--brand-blue)', accent: 'var(--brand-blue)' };
    }
    return { text: 'var(--rose-alert)', accent: 'var(--rose-alert)' };
  }
  if (format === 'currency') {
    return { text: 'var(--amber-warning)', accent: 'var(--amber-warning)' };
  }
  return { text: 'var(--text-primary)', accent: 'var(--signal-cyan)' };
}

export function MetricCard({ label, value, unit, format }: MetricCardType) {
  const isNumeric = typeof value === 'number';
  const animated = useCountUp(isNumeric ? value : 0);
  const display = isNumeric ? animated : value;
  const { text: textColor, accent } = valueColor(format, value);

  return (
    <div
      className="rounded-2xl p-4 md:p-5 flex flex-col gap-2.5 relative overflow-hidden transition-all duration-300 group"
      style={{
        border: '1px solid var(--glass-stroke)',
        background: 'rgba(17, 24, 39, 0.88)',
      }}
      data-tilt
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ background: `radial-gradient(100% 80% at 100% 0%, ${accent}1f, transparent 72%)` }}
      />
      <span
        className="text-[11px] uppercase tracking-[0.18em] font-semibold leading-none relative z-10"
        style={{ color: 'var(--text-muted)' }}
      >
        {label}
      </span>
      <span
        className="text-[1.6rem] font-bold tabular-nums tracking-tight leading-none font-mono relative z-10"
        style={{ color: textColor }}
      >
        {formatMetricValue(display, format, unit)}
      </span>
    </div>
  );
}
