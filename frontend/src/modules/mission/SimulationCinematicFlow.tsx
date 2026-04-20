import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface SimulationCinematicFlowProps {
  isExecuting: boolean;
  progress: number;
  simulationName?: string;
  commentary?: string;
}

const AI_COMMENTARY = [
  'Sampling probability space across outcome matrix…',
  'Evaluating equilibrium convergence thresholds…',
  'Calibrating behavioral signal weights…',
  'Rendering intelligence layer artifacts…',
  'Finalizing strategic decision vectors…',
];

export function SimulationCinematicFlow({ isExecuting, progress, simulationName }: SimulationCinematicFlowProps) {
  const coreRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const commentaryIdx = Math.floor((progress / 100) * AI_COMMENTARY.length);
  const commentary = AI_COMMENTARY[Math.min(commentaryIdx, AI_COMMENTARY.length - 1)];

  useEffect(() => {
    if (!isExecuting) return;
    const ctx = gsap.context(() => {
      gsap.to(coreRef.current, {
        boxShadow: [
          '0 0 24px rgba(142,243,228,0.3)',
          '0 0 48px rgba(142,243,228,0.6)',
          '0 0 24px rgba(142,243,228,0.3)',
        ].join(', '),
        duration: 1.8,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });
      gsap.to(coreRef.current, {
        scale: 1.05,
        duration: 1.8,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });
    });
    return () => ctx.revert();
  }, [isExecuting]);

  useEffect(() => {
    if (!progressRef.current) return;
    gsap.to(progressRef.current, { width: `${Math.max(2, progress)}%`, duration: 0.5, ease: 'power2.out' });
  }, [progress]);

  if (!isExecuting) return null;

  return (
    <div
      className="mb-6 p-5 rounded-2xl space-y-5 overflow-hidden relative"
      style={{
        border: '1px solid rgba(142,243,228,0.25)',
        background: 'linear-gradient(155deg, rgba(14,32,44,0.85), rgba(8,18,30,0.92))',
      }}
    >
      {/* Energy core */}
      <div className="flex items-center gap-4">
        <div className="relative shrink-0">
          <div
            ref={coreRef}
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{
              background: 'radial-gradient(circle, rgba(142,243,228,0.35) 0%, rgba(108,224,213,0.08) 70%)',
              border: '1.5px solid rgba(142,243,228,0.5)',
              boxShadow: '0 0 24px rgba(142,243,228,0.3)',
            }}
          >
            <div className="w-3 h-3 rounded-full animate-pulse" style={{ background: '#8ef3e4' }} />
          </div>
          {/* Orbit ring */}
          <div
            className="absolute inset-0 rounded-full border animate-spin"
            style={{ borderColor: 'transparent rgba(142,243,228,0.3) transparent transparent', animationDuration: '2s' }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1 gap-2">
            <p className="text-sm font-semibold truncate">{simulationName ?? 'Simulation Running…'}</p>
            <span
              className="text-xs font-mono tabular-nums px-2 py-0.5 rounded shrink-0 font-semibold"
              style={{ background: 'rgba(142,243,228,0.14)', color: '#8ef3e4' }}
            >
              {progress}%
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-full rounded-full h-1.5 overflow-hidden" style={{ background: 'rgba(157,183,215,0.18)' }}>
            <div
              ref={progressRef}
              className="h-1.5 rounded-full"
              style={{
                width: `${Math.max(2, progress)}%`,
                background: 'linear-gradient(90deg, #8ef3e4, #74d6f2, #ffd49e)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Real-time metrics stream */}
      <div className="grid grid-cols-3 gap-2 text-center">
        {[
          { label: 'Iterations', value: `${Math.floor(progress * 94.2).toLocaleString()}` },
          { label: 'Convergence', value: progress > 50 ? `${(65 + progress * 0.28).toFixed(1)}%` : '—' },
          { label: 'Complexity', value: progress > 25 ? 'Adaptive' : 'Init' },
        ].map(m => (
          <div key={m.label} className="surface-glass rounded-xl px-2 py-2">
            <p className="text-[9px] uppercase tracking-[0.14em]" style={{ color: 'var(--text-muted)' }}>{m.label}</p>
            <p className="text-xs font-semibold mt-0.5 tabular-nums" style={{ color: '#9cf3e7' }}>{m.value}</p>
          </div>
        ))}
      </div>

      {/* AI commentary overlay */}
      <div
        className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs"
        style={{ background: 'rgba(108,224,213,0.07)', border: '1px solid rgba(108,224,213,0.18)' }}
      >
        <span className="w-1.5 h-1.5 rounded-full animate-pulse shrink-0" style={{ background: '#6ce0d5' }} />
        <span style={{ color: 'rgba(156,243,231,0.9)' }}>AI: {commentary}</span>
      </div>
    </div>
  );
}
