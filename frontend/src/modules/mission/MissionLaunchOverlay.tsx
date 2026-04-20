import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ExecutionTunnel } from './ExecutionTunnel';
import type { MissionPreview, MissionPhase } from '../../types/phase5.types';

interface MissionLaunchOverlayProps {
  phase: MissionPhase;
  simulationName: string;
  preview: MissionPreview | null;
  onConfirmLaunch: () => void;
  onTunnelComplete: () => void;
  onCancel: () => void;
}

const RISK_COLORS = { low: '#8ef3e4', medium: '#ffd49e', high: '#ff9db2' };
const RISK_LABELS = { low: 'Low Risk', medium: 'Medium Risk', high: 'High Risk' };

function PreLaunchPanel({
  simulationName, preview, onLaunch, onCancel,
}: { simulationName: string; preview: MissionPreview | null; onLaunch: () => void; onCancel: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(panelRef.current, { y: 32, opacity: 0, scale: 0.96, duration: 0.55, ease: 'power3.out' });
      gsap.from('[data-pre-item]', { y: 16, opacity: 0, stagger: 0.08, duration: 0.45, ease: 'power3.out', delay: 0.18 });
    });
    return () => ctx.revert();
  }, []);

  const risk = preview?.difficultyRisk ?? 'medium';
  const riskColor = RISK_COLORS[risk];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(3,7,16,0.85)', backdropFilter: 'blur(14px)' }}>
      <div
        ref={panelRef}
        className="w-full max-w-md premium-card p-6 space-y-5"
        style={{ border: '1px solid rgba(142,243,228,0.3)', boxShadow: '0 40px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(142,243,228,0.15)' }}
      >
        {/* Header */}
        <div>
          <p className="section-kicker">Mission Pre-Launch</p>
          <h2 className="mt-3 text-xl font-bold" style={{ fontFamily: 'Sora,sans-serif' }}>
            {simulationName}
          </h2>
          <p className="mt-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
            Initializing simulation environment…
          </p>
        </div>

        {/* AI status */}
        <div
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs"
          style={{ background: 'rgba(108,224,213,0.08)', border: '1px solid rgba(108,224,213,0.2)' }}
        >
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#6ce0d5' }} />
          <span style={{ color: '#9cf3e7' }}>AI intelligence engine is calibrating parameters</span>
        </div>

        {/* Impact preview */}
        {preview && (
          <div className="grid grid-cols-2 gap-3">
            <div data-pre-item className="surface-glass rounded-xl px-3 py-3 space-y-1">
              <p className="text-[10px] uppercase tracking-[0.14em]" style={{ color: 'var(--text-muted)' }}>XP Impact</p>
              <p className="text-lg font-bold tabular-nums" style={{ color: '#8ef3e4' }}>+{preview.xpImpact}</p>
            </div>
            <div data-pre-item className="surface-glass rounded-xl px-3 py-3 space-y-1">
              <p className="text-[10px] uppercase tracking-[0.14em]" style={{ color: 'var(--text-muted)' }}>Difficulty Risk</p>
              <p className="text-lg font-bold" style={{ color: riskColor }}>{RISK_LABELS[risk]}</p>
            </div>
            <div data-pre-item className="surface-glass rounded-xl px-3 py-3 space-y-1">
              <p className="text-[10px] uppercase tracking-[0.14em]" style={{ color: 'var(--text-muted)' }}>Predicted Gain</p>
              <p className="text-base font-bold tabular-nums" style={{ color: '#d0c8ff' }}>+{preview.predictedGain} skill pts</p>
            </div>
            <div data-pre-item className="surface-glass rounded-xl px-3 py-3 space-y-1">
              <p className="text-[10px] uppercase tracking-[0.14em]" style={{ color: 'var(--text-muted)' }}>Est. Duration</p>
              <p className="text-base font-bold" style={{ color: '#ffd49e' }}>{preview.estimatedDuration}</p>
            </div>
          </div>
        )}

        {/* Difficulty risk meter */}
        {preview && (
          <div data-pre-item className="space-y-1.5">
            <div className="flex items-center justify-between text-[10px]">
              <span style={{ color: 'var(--text-muted)' }}>Risk Meter</span>
              <span style={{ color: riskColor }}>{risk === 'low' ? '33%' : risk === 'medium' ? '66%' : '100%'}</span>
            </div>
            <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(157,183,215,0.15)' }}>
              <div
                className="h-1.5 rounded-full transition-all duration-700"
                style={{
                  width: risk === 'low' ? '33%' : risk === 'medium' ? '66%' : '100%',
                  background: `linear-gradient(90deg, #8ef3e4, ${riskColor})`,
                }}
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div data-pre-item className="flex items-center gap-3 pt-1">
          <button type="button" className="primary-cta flex-1" onClick={onLaunch}>
            Launch Mission
          </button>
          <button type="button" className="secondary-cta" onClick={onCancel} style={{ paddingLeft: 14, paddingRight: 14 }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export function MissionLaunchOverlay({
  phase, simulationName, preview, onConfirmLaunch, onTunnelComplete, onCancel,
}: MissionLaunchOverlayProps) {
  if (phase === 'pre-launch') {
    return (
      <PreLaunchPanel
        simulationName={simulationName}
        preview={preview}
        onLaunch={onConfirmLaunch}
        onCancel={onCancel}
      />
    );
  }

  if (phase === 'tunnel') {
    return <ExecutionTunnel simulationName={simulationName} onComplete={onTunnelComplete} />;
  }

  return null;
}
