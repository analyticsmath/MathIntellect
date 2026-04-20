import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import type { UnlockNode } from '../../types/phase5.types';

interface UnlockTreeViewerProps {
  unlocks: UnlockNode[];
}

const CATEGORY_ICONS: Record<string, string> = {
  feature: '⬡',
  mode: '◈',
  skill: '◎',
  achievement: '✦',
};

const CATEGORY_COLORS: Record<string, string> = {
  feature: '#8ef3e4',
  mode: '#b4d9ff',
  skill: '#d0c8ff',
  achievement: '#ffd49e',
};

export function UnlockTreeViewer({ unlocks }: UnlockTreeViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-unlock-node]', {
        scale: 0.88,
        opacity: 0,
        duration: 0.5,
        stagger: 0.055,
        ease: 'back.out(1.6)',
      });
    }, containerRef);
    return () => ctx.revert();
  }, [unlocks]);

  const categories = ['feature', 'mode', 'skill', 'achievement'] as const;

  return (
    <div className="premium-card p-4 md:p-5">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <p className="section-kicker">Unlock Tree</p>
        <div className="flex items-center gap-3">
          {categories.map(cat => (
            <span key={cat} className="flex items-center gap-1 text-[10px] uppercase tracking-[0.12em]" style={{ color: CATEGORY_COLORS[cat] }}>
              <span>{CATEGORY_ICONS[cat]}</span>
              <span style={{ color: 'var(--text-muted)' }}>{cat}</span>
            </span>
          ))}
        </div>
      </div>

      <div ref={containerRef} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {unlocks.map(node => {
          const color = CATEGORY_COLORS[node.category];
          return (
            <div
              key={node.id}
              data-unlock-node
              className="relative rounded-2xl p-3.5 transition-all duration-300"
              style={{
                background: node.locked
                  ? 'rgba(10,18,29,0.7)'
                  : `linear-gradient(135deg, ${color}14, rgba(10,18,29,0.85))`,
                border: `1px solid ${node.locked ? 'rgba(157,183,215,0.12)' : color + '40'}`,
                opacity: node.locked ? 0.55 : 1,
              }}
            >
              {node.locked && (
                <div className="absolute inset-0 rounded-2xl flex items-center justify-center z-10 pointer-events-none">
                  <span className="text-lg" style={{ color: 'rgba(157,183,215,0.3)' }}>🔒</span>
                </div>
              )}
              <div className={node.locked ? 'blur-[1px]' : ''}>
                <div className="flex items-center gap-2 mb-2">
                  <span style={{ color, fontSize: 16 }}>{CATEGORY_ICONS[node.category]}</span>
                  <span
                    className="text-[9px] uppercase tracking-[0.16em] font-bold px-1.5 py-0.5 rounded"
                    style={{ background: `${color}18`, color }}
                  >
                    {node.category}
                  </span>
                </div>
                <p className="text-xs font-semibold leading-tight" style={{ color: node.locked ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                  {node.name}
                </p>
                <p className="mt-1 text-[10px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {node.description}
                </p>
                {!node.locked && node.unlockedAt && (
                  <p className="mt-2 text-[9px]" style={{ color }}>
                    ✓ Unlocked
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
