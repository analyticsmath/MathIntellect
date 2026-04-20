import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface ExecutionTunnelProps {
  simulationName: string;
  onComplete: () => void;
}

export function ExecutionTunnel({ simulationName, onComplete }: ExecutionTunnelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const ringsRef = useRef<HTMLDivElement[]>([]);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete });

      // Rings zoom in from far
      ringsRef.current.forEach((ring, i) => {
        tl.fromTo(
          ring,
          { scale: 0.1, opacity: 0 },
          { scale: 8, opacity: 0, duration: 1.6, ease: 'power2.in' },
          i * 0.22
        );
        tl.fromTo(ring, { opacity: 0 }, { opacity: 0.6, duration: 0.4, ease: 'power1.in' }, i * 0.22);
        tl.to(ring, { opacity: 0, duration: 0.8, ease: 'power1.out' }, i * 0.22 + 0.8);
      });

      // Title enters center
      tl.fromTo(
        titleRef.current,
        { opacity: 0, scale: 0.7, filter: 'blur(12px)' },
        { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.7, ease: 'power3.out' },
        0.4
      );

      // Title exits
      tl.to(titleRef.current, { opacity: 0, scale: 1.15, filter: 'blur(8px)', duration: 0.5, ease: 'power2.in' }, 1.8);

      // Fade out whole tunnel
      tl.to(containerRef.current, { opacity: 0, duration: 0.4, ease: 'power2.in' }, 2.2);
    });
    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at center, #0a1622 0%, #030710 100%)' }}
    >
      {/* Tunnel rings */}
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          ref={el => { if (el) ringsRef.current[i] = el; }}
          className="absolute rounded-full border"
          style={{
            width: 160 + i * 80,
            height: 160 + i * 80,
            borderColor: i % 2 === 0 ? 'rgba(142,243,228,0.35)' : 'rgba(116,214,242,0.2)',
            borderWidth: 1,
            transform: 'scale(0.1)',
            opacity: 0,
          }}
        />
      ))}

      {/* Center radial light */}
      <div
        className="absolute w-48 h-48 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(108,224,213,0.25) 0%, transparent 70%)' }}
      />

      {/* Simulation title */}
      <div ref={titleRef} className="relative z-10 text-center px-8" style={{ opacity: 0 }}>
        <p
          className="text-[10px] uppercase tracking-[0.28em] mb-3"
          style={{ color: 'rgba(142,243,228,0.7)' }}
        >
          Initializing Mission
        </p>
        <h2
          className="text-2xl md:text-4xl font-bold"
          style={{
            fontFamily: 'Sora,sans-serif',
            background: 'linear-gradient(120deg, #f8fcff 0%, #c9f7f0 46%, #f8cd9a 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          {simulationName}
        </h2>
      </div>
    </div>
  );
}
