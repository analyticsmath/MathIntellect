import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import type { BehaviorTrendPoint } from '../../types/phase5.types';

interface BehaviorTrendGraphProps {
  data?: BehaviorTrendPoint[];
}

const MOCK_TREND: BehaviorTrendPoint[] = [
  { label: 'S1', decisionConsistency: 42, riskAppetite: 68, strategyDepth: 35 },
  { label: 'S2', decisionConsistency: 55, riskAppetite: 72, strategyDepth: 48 },
  { label: 'S3', decisionConsistency: 51, riskAppetite: 65, strategyDepth: 53 },
  { label: 'S4', decisionConsistency: 63, riskAppetite: 58, strategyDepth: 61 },
  { label: 'S5', decisionConsistency: 70, riskAppetite: 74, strategyDepth: 68 },
  { label: 'S6', decisionConsistency: 67, riskAppetite: 80, strategyDepth: 72 },
  { label: 'S7', decisionConsistency: 78, riskAppetite: 76, strategyDepth: 79 },
];

const SERIES = [
  { key: 'decisionConsistency' as const, color: '#8ef3e4', label: 'Consistency' },
  { key: 'riskAppetite' as const, color: '#ffd49e', label: 'Risk Appetite' },
  { key: 'strategyDepth' as const, color: '#d0c8ff', label: 'Strategy Depth' },
];

function buildPath(points: BehaviorTrendPoint[], key: keyof Omit<BehaviorTrendPoint, 'label'>, w: number, h: number, pad: number): string {
  if (points.length < 2) return '';
  const xs = points.map((_, i) => pad + (i / (points.length - 1)) * (w - pad * 2));
  const ys = points.map(p => pad + (1 - p[key] / 100) * (h - pad * 2));
  let d = `M ${xs[0]} ${ys[0]}`;
  for (let i = 1; i < xs.length; i++) {
    const cpx = (xs[i - 1] + xs[i]) / 2;
    d += ` C ${cpx} ${ys[i - 1]}, ${cpx} ${ys[i]}, ${xs[i]} ${ys[i]}`;
  }
  return d;
}

interface TooltipState { x: number; y: number; point: BehaviorTrendPoint; visible: boolean }

export function BehaviorTrendGraph({ data }: BehaviorTrendGraphProps) {
  const points = (data && data.length > 0) ? data : MOCK_TREND;
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltip, setTooltip] = useState<TooltipState>({ x: 0, y: 0, point: points[0], visible: false });

  const W = 480;
  const H = 160;
  const PAD = 14;

  useEffect(() => {
    const ctx = gsap.context(() => {
      pathRefs.current.forEach((path, i) => {
        if (!path) return;
        const len = path.getTotalLength();
        gsap.fromTo(path,
          { strokeDasharray: `${len} ${len}`, strokeDashoffset: len },
          { strokeDashoffset: 0, duration: 1.4, ease: 'power3.out', delay: i * 0.18 }
        );
      });
    });
    return () => ctx.revert();
  }, [points]);

  const xs = points.map((_, i) => PAD + (i / (points.length - 1)) * (W - PAD * 2));

  return (
    <div className="premium-card p-4 md:p-5">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div>
          <p className="section-kicker">Behavior Trends</p>
          <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>Evolution across last {points.length} simulations</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {SERIES.map(s => (
            <span key={s.key} className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em]" style={{ color: 'var(--text-muted)' }}>
              <span className="w-3 h-0.5 rounded-full inline-block" style={{ background: s.color }} />
              {s.label}
            </span>
          ))}
        </div>
      </div>

      <div className="relative">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          style={{ height: 140 }}
          onMouseLeave={() => setTooltip(t => ({ ...t, visible: false }))}
        >
          {/* Grid lines */}
          {[25, 50, 75].map(v => {
            const y = PAD + (1 - v / 100) * (H - PAD * 2);
            return (
              <line key={v} x1={PAD} x2={W - PAD} y1={y} y2={y}
                stroke="rgba(157,183,215,0.1)" strokeWidth={1} strokeDasharray="3 4" />
            );
          })}

          {/* Series paths */}
          {SERIES.map((s, si) => {
            const d = buildPath(points, s.key, W, H, PAD);
            return (
              <path
                key={s.key}
                ref={el => { pathRefs.current[si] = el; }}
                d={d}
                fill="none"
                stroke={s.color}
                strokeWidth={1.8}
                strokeLinecap="round"
                opacity={0.9}
              />
            );
          })}

          {/* Hover dots */}
          {points.map((pt, i) => (
            <circle
              key={i}
              cx={xs[i]}
              cy={PAD + (1 - pt.decisionConsistency / 100) * (H - PAD * 2)}
              r={5}
              fill="transparent"
              className="cursor-pointer"
              onMouseEnter={e => {
                const svgRect = svgRef.current?.getBoundingClientRect();
                if (!svgRect) return;
                setTooltip({ x: e.clientX - svgRect.left, y: e.clientY - svgRect.top - 60, point: pt, visible: true });
              }}
            />
          ))}
        </svg>

        {/* Tooltip */}
        {tooltip.visible && (
          <div
            className="absolute pointer-events-none z-10 rounded-xl px-3 py-2 text-xs space-y-1"
            style={{
              left: tooltip.x,
              top: tooltip.y,
              background: 'rgba(13,22,36,0.95)',
              border: '1px solid rgba(142,243,228,0.3)',
              transform: 'translateX(-50%)',
              minWidth: 140,
            }}
          >
            <p className="font-semibold" style={{ color: '#8ef3e4' }}>{tooltip.point.label}</p>
            {SERIES.map(s => (
              <p key={s.key} className="flex justify-between gap-3">
                <span style={{ color: 'var(--text-muted)' }}>{s.label}</span>
                <span style={{ color: s.color }} className="font-semibold tabular-nums">{tooltip.point[s.key]}</span>
              </p>
            ))}
          </div>
        )}
      </div>

      {/* X-axis labels */}
      <div className="flex justify-between mt-1 px-[14px]">
        {points.map((p, i) => (
          <span key={i} className="text-[9px] tabular-nums" style={{ color: 'var(--text-muted)' }}>{p.label}</span>
        ))}
      </div>
    </div>
  );
}
