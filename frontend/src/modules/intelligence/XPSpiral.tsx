import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface XPSpiralProps {
  progress: number; // 0–100
  xp: number;
  xpToNext: number;
  tier: string;
  size?: number;
}

const TIER_COLORS: Record<string, { inner: string; outer: string; glow: string }> = {
  Novice:     { inner: '#b4d9ff', outer: '#7ab5f5', glow: 'rgba(180,217,255,0.35)' },
  Apprentice: { inner: '#d0c8ff', outer: '#a89af5', glow: 'rgba(208,200,255,0.35)' },
  Analyst:    { inner: '#8ef3e4', outer: '#5bd8cc', glow: 'rgba(142,243,228,0.4)' },
  Strategist: { inner: '#ffd49e', outer: '#f0a84a', glow: 'rgba(255,212,158,0.35)' },
  Expert:     { inner: '#ff9db2', outer: '#e96080', glow: 'rgba(255,157,178,0.4)' },
  Master:     { inner: '#f0d48a', outer: '#d4a017', glow: 'rgba(240,212,138,0.45)' },
};

export function XPSpiral({ progress, xp, xpToNext, tier, size = 160 }: XPSpiralProps) {
  const outerRef = useRef<SVGCircleElement>(null);
  const innerRef = useRef<SVGCircleElement>(null);
  const glowRef = useRef<SVGCircleElement>(null);
  const prevProgress = useRef(0);

  const colors = TIER_COLORS[tier] ?? TIER_COLORS.Novice;
  const cx = size / 2;
  const cy = size / 2;
  const outerR = size * 0.42;
  const innerR = size * 0.32;
  const outerCircumference = 2 * Math.PI * outerR;
  const innerCircumference = 2 * Math.PI * innerR;
  const outerDash = (progress / 100) * outerCircumference;
  const innerDash = (Math.min(progress, 60) / 60) * innerCircumference;

  useEffect(() => {
    const el = outerRef.current;
    const el2 = innerRef.current;
    if (!el || !el2) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(el,
        { strokeDasharray: `${(prevProgress.current / 100) * outerCircumference} ${outerCircumference}` },
        { strokeDasharray: `${outerDash} ${outerCircumference}`, duration: 1.4, ease: 'power3.out' }
      );
      gsap.fromTo(el2,
        { strokeDasharray: `${(Math.min(prevProgress.current, 60) / 60) * innerCircumference} ${innerCircumference}` },
        { strokeDasharray: `${innerDash} ${innerCircumference}`, duration: 1.2, ease: 'power3.out', delay: 0.1 }
      );
      gsap.to(glowRef.current, {
        opacity: 0.6 + (progress / 100) * 0.4,
        scale: 1 + (progress / 100) * 0.06,
        duration: 1.4,
        ease: 'power2.out',
        transformOrigin: 'center',
      });
    });

    prevProgress.current = progress;
    return () => ctx.revert();
  }, [progress, outerDash, innerDash, outerCircumference, innerCircumference]);

  useEffect(() => {
    const el = glowRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.to(el, { opacity: '+=0.12', duration: 2.2, ease: 'sine.inOut', repeat: -1, yoyo: true });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <defs>
          <filter id="xp-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {/* Track rings */}
        <circle cx={cx} cy={cy} r={outerR} fill="none" strokeWidth={size * 0.045} stroke="rgba(157,183,215,0.12)" />
        <circle cx={cx} cy={cy} r={innerR} fill="none" strokeWidth={size * 0.035} stroke="rgba(157,183,215,0.08)" />
        {/* Glow effect */}
        <circle ref={glowRef} cx={cx} cy={cy} r={outerR} fill="none" strokeWidth={size * 0.09} stroke={colors.glow} opacity={0.5} />
        {/* Progress arcs */}
        <circle
          ref={innerRef}
          cx={cx} cy={cy} r={innerR}
          fill="none"
          strokeWidth={size * 0.032}
          stroke={colors.inner}
          strokeLinecap="round"
          strokeDasharray={`${innerDash} ${innerCircumference}`}
          opacity={0.65}
          filter="url(#xp-glow)"
        />
        <circle
          ref={outerRef}
          cx={cx} cy={cy} r={outerR}
          fill="none"
          strokeWidth={size * 0.048}
          stroke={colors.outer}
          strokeLinecap="round"
          strokeDasharray={`${outerDash} ${outerCircumference}`}
          filter="url(#xp-glow)"
        />
      </svg>
      {/* Center label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5 pointer-events-none">
        <span className="text-[10px] uppercase tracking-[0.18em]" style={{ color: 'var(--text-muted)' }}>XP</span>
        <span className="text-xl font-bold tabular-nums" style={{ color: colors.inner, fontFamily: 'Sora,sans-serif' }}>
          {xp.toLocaleString()}
        </span>
        <span className="text-[9px] tabular-nums" style={{ color: 'var(--text-muted)' }}>
          / {xpToNext.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
