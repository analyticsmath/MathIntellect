import { useEffect, useMemo, useRef } from 'react';

export type SimulationMode = 'monte_carlo' | 'game_theory' | 'market' | 'conflict';
export type DatasetMode = 'baseline' | 'stress' | 'adversarial';

interface ProductVisualizationProps {
  simulationMode: SimulationMode;
  datasetMode: DatasetMode;
}

const MODE_MULTIPLIER: Record<SimulationMode, number> = {
  monte_carlo: 1.02,
  game_theory: 0.92,
  market: 1.14,
  conflict: 1.28,
};

const DATASET_MULTIPLIER: Record<DatasetMode, number> = {
  baseline: 1,
  stress: 1.33,
  adversarial: 1.54,
};

function buildSeries(simulationMode: SimulationMode, datasetMode: DatasetMode): number[] {
  const simulationFactor = MODE_MULTIPLIER[simulationMode];
  const datasetFactor = DATASET_MULTIPLIER[datasetMode];

  return Array.from({ length: 32 }, (_, index) => {
    const seasonal = Math.sin(index * 0.34) * 0.62 + Math.cos(index * 0.16) * 0.28;
    const trend = index * 0.058;
    const base = 1.6 + seasonal + trend;
    return base * simulationFactor * datasetFactor;
  });
}

export default function ProductVisualization({ simulationMode, datasetMode }: ProductVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const series = useMemo(
    () => buildSeries(simulationMode, datasetMode),
    [datasetMode, simulationMode],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }

    const width = 760;
    const height = 360;
    canvas.width = width;
    canvas.height = height;

    let frame = 0;
    let rafId = 0;

    const render = () => {
      frame += 1;
      context.clearRect(0, 0, width, height);

      const gradient = context.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, 'rgba(37, 99, 235, 0.08)');
      gradient.addColorStop(0.45, 'rgba(6, 182, 212, 0.07)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0.95)');
      context.fillStyle = gradient;
      context.fillRect(0, 0, width, height);

      context.strokeStyle = 'rgba(148, 163, 184, 0.25)';
      context.lineWidth = 1;
      for (let row = 0; row < 10; row += 1) {
        const y = 34 + row * 30;
        context.beginPath();
        context.moveTo(28, y);
        context.lineTo(width - 28, y);
        context.stroke();
      }

      const amplitude = MODE_MULTIPLIER[simulationMode] * 16;
      const datasetAmplitude = DATASET_MULTIPLIER[datasetMode] * 4;
      for (let layer = 0; layer < 10; layer += 1) {
        context.beginPath();
        const yBase = 78 + layer * 22;

        for (let x = 28; x <= width - 28; x += 10) {
          const wave = Math.sin((x + frame * 1.4) * 0.02 + layer * 0.7) * amplitude;
          const perturbation = Math.cos((x + frame * 1.1) * 0.012 + layer * 0.5) * datasetAmplitude;
          const y = yBase + wave * 0.19 + perturbation * 0.2;
          if (x === 28) {
            context.moveTo(x, y);
          } else {
            context.lineTo(x, y);
          }
        }

        context.strokeStyle = layer % 2 === 0
          ? 'rgba(37, 99, 235, 0.38)'
          : 'rgba(6, 182, 212, 0.24)';
        context.lineWidth = layer % 2 === 0 ? 1.5 : 1;
        context.stroke();
      }

      context.beginPath();
      context.moveTo(28, height - 42);
      series.forEach((value, index) => {
        const x = 28 + (index / (series.length - 1)) * (width - 56);
        const y = height - 42 - value * 18 - Math.sin((index + frame * 0.05) * 0.8) * 2;
        if (index === 0) {
          context.moveTo(x, y);
        } else {
          context.lineTo(x, y);
        }
      });
      context.strokeStyle = 'rgba(124, 58, 237, 0.95)';
      context.lineWidth = 2.5;
      context.shadowColor = 'rgba(124, 58, 237, 0.2)';
      context.shadowBlur = 12;
      context.stroke();
      context.shadowBlur = 0;

      rafId = window.requestAnimationFrame(render);
    };

    render();
    return () => window.cancelAnimationFrame(rafId);
  }, [datasetMode, series, simulationMode]);

  const stats = useMemo(() => {
    const peak = Math.max(...series);
    const trough = Math.min(...series);
    const mean = series.reduce((sum, value) => sum + value, 0) / series.length;
    const spread = peak - trough;
    return {
      peak: peak.toFixed(2),
      mean: mean.toFixed(2),
      spread: spread.toFixed(2),
    };
  }, [series]);

  return (
    <div className="premium-card p-4 md:p-5" data-tilt>
      <canvas
        ref={canvasRef}
        className="w-full rounded-2xl"
        style={{
          border: '1px solid rgba(148, 163, 184, 0.24)',
          background: 'rgba(255, 255, 255, 0.88)',
        }}
      />
      <div className="grid grid-cols-3 gap-2 mt-4 text-center">
        <div className="rounded-xl py-2.5" style={{ border: '1px solid rgba(148, 163, 184, 0.24)', background: 'rgba(239, 246, 255, 0.74)' }}>
          <p className="text-[10px] uppercase tracking-[0.16em]" style={{ color: 'var(--text-muted)' }}>Peak</p>
          <p className="text-sm font-semibold" style={{ color: '#1d4ed8' }}>{stats.peak}</p>
        </div>
        <div className="rounded-xl py-2.5" style={{ border: '1px solid rgba(148, 163, 184, 0.24)', background: 'rgba(236, 254, 255, 0.74)' }}>
          <p className="text-[10px] uppercase tracking-[0.16em]" style={{ color: 'var(--text-muted)' }}>Mean</p>
          <p className="text-sm font-semibold" style={{ color: '#0e7490' }}>{stats.mean}</p>
        </div>
        <div className="rounded-xl py-2.5" style={{ border: '1px solid rgba(148, 163, 184, 0.24)', background: 'rgba(245, 243, 255, 0.74)' }}>
          <p className="text-[10px] uppercase tracking-[0.16em]" style={{ color: 'var(--text-muted)' }}>Spread</p>
          <p className="text-sm font-semibold" style={{ color: '#6d28d9' }}>{stats.spread}</p>
        </div>
      </div>
    </div>
  );
}
