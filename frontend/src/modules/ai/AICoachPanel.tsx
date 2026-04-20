import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useAICoach } from '../../hooks/useAICoach';
import { RecommendationCard } from './RecommendationCard';
import { useNavigate } from 'react-router-dom';

interface AICoachPanelProps {
  lastSimulationId?: string;
  pinnable?: boolean;
}

export function AICoachPanel({ lastSimulationId, pinnable = true }: AICoachPanelProps) {
  const { recommendation, loading, refresh } = useAICoach(lastSimulationId);
  const [pinned, setPinned] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const pulseRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(panelRef.current, { y: 16, opacity: 0, duration: 0.6, ease: 'power3.out' });
      gsap.to(pulseRef.current, {
        opacity: 0.4,
        scale: 1.12,
        duration: 2,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });
    });
    return () => ctx.revert();
  }, []);

  const handleAccept = () => {
    if (recommendation) {
      navigate('/app/simulations/new', { viewTransition: true });
    }
  };

  return (
    <div
      ref={panelRef}
      className="premium-card"
      style={{ border: '1px solid rgba(108,224,213,0.28)', borderRadius: 24, overflow: 'clip' }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer"
        style={{ borderBottom: collapsed ? 'none' : '1px solid rgba(108,224,213,0.15)', background: 'rgba(108,224,213,0.05)' }}
        onClick={() => setCollapsed(c => !c)}
      >
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div
              ref={pulseRef}
              className="absolute inset-0 rounded-full"
              style={{ background: 'rgba(108,224,213,0.25)' }}
            />
            <div className="relative w-5 h-5 rounded-full flex items-center justify-center" style={{ background: 'rgba(108,224,213,0.2)', border: '1px solid rgba(108,224,213,0.4)' }}>
              <span className="text-[8px]">✦</span>
            </div>
          </div>
          <div>
            <p className="text-xs font-bold" style={{ color: '#9cf3e7' }}>AI Coach</p>
            <p className="text-[9px]" style={{ color: 'var(--text-muted)' }}>Adaptive growth guidance</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {pinnable && (
            <button
              type="button"
              onClick={e => { e.stopPropagation(); setPinned(p => !p); }}
              className="text-[10px] px-2 py-0.5 rounded-md transition-colors"
              style={{
                background: pinned ? 'rgba(108,224,213,0.18)' : 'rgba(157,183,215,0.1)',
                color: pinned ? '#8ef3e4' : 'var(--text-muted)',
                border: `1px solid ${pinned ? 'rgba(108,224,213,0.3)' : 'rgba(157,183,215,0.2)'}`,
              }}
            >
              {pinned ? 'Pinned' : 'Pin'}
            </button>
          )}
          <svg
            width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
            style={{ color: 'var(--text-muted)', transform: collapsed ? 'rotate(-90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </div>

      {/* Body */}
      {!collapsed && (
        <div className="p-4 space-y-3">
          {loading && !recommendation && (
            <div className="space-y-2">
              {[80, 60, 90].map((w, i) => (
                <div key={i} className="h-3 rounded-full animate-pulse" style={{ width: `${w}%`, background: 'rgba(157,183,215,0.15)' }} />
              ))}
            </div>
          )}

          {recommendation && (
            <div style={{ opacity: loading ? 0.6 : 1, transition: 'opacity 0.2s' }}>
              <RecommendationCard recommendation={recommendation} onAccept={handleAccept} />
            </div>
          )}

          <button
            type="button"
            className="secondary-cta w-full text-xs"
            style={{ paddingTop: 8, paddingBottom: 8 }}
            onClick={() => refresh(lastSimulationId)}
          >
            Refresh Recommendation
          </button>
        </div>
      )}
    </div>
  );
}
