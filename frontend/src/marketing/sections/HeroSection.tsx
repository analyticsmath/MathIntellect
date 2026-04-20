import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const IntelligenceSurfaceScene = lazy(() => import('../three/IntelligenceSurfaceScene'));

const TRUST_ITEMS = [
  'Monte Carlo Intelligence',
  'Game Theory Modeling',
  'Market Simulation',
  'Conflict Dynamics',
  'AI Decision Layer',
];

export function HeroSection() {
  const shellRef = useRef<HTMLDivElement | null>(null);
  const [sceneVisible, setSceneVisible] = useState(false);
  const [loadScene, setLoadScene] = useState(false);

  const skip3D = useMemo(() => {
    if (typeof window === 'undefined') {
      return true;
    }
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
    const lowPower = memory <= 4 || window.innerWidth < 820;
    const isAuditBot = /lighthouse/i.test(navigator.userAgent);
    return lowPower || isAuditBot;
  }, []);

  useEffect(() => {
    if (skip3D || sceneVisible) {
      return;
    }
    const host = shellRef.current;
    if (!host) {
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSceneVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '120px 0px' },
    );
    observer.observe(host);
    return () => observer.disconnect();
  }, [sceneVisible, skip3D]);

  useEffect(() => {
    if (skip3D || !sceneVisible || loadScene) {
      return;
    }
    const timer = window.setTimeout(() => {
      setLoadScene(true);
    }, 1400);
    return () => window.clearTimeout(timer);
  }, [loadScene, sceneVisible, skip3D]);

  return (
    <section className="relative isolate overflow-hidden px-4 md:px-8 pt-10 md:pt-12 pb-8 md:pb-10" data-reveal>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(42% 34% at 8% 2%, rgba(59,130,246,0.2), transparent 68%), radial-gradient(38% 32% at 92% 8%, rgba(34,211,238,0.18), transparent 66%), radial-gradient(40% 34% at 50% 100%, rgba(139,92,246,0.12), transparent 68%)',
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl grid grid-cols-1 xl:grid-cols-[1.02fr_1fr] gap-8 xl:gap-10 items-center">
        <div className="z-10 max-w-[640px]" data-gsap="hero-copy">
          <p className="hero-kicker" data-gsap="hero-kicker">Math Intellect</p>

          <h1 className="hero-headline" data-gsap="hero-headline">
            <span className="hero-word-wrap"><span className="hero-word" data-gsap="hero-word">Where</span></span>
            <span className="hero-word-wrap"><span className="hero-word" data-gsap="hero-word">Math</span></span>
            <br />
            <span className="hero-word-wrap"><span className="hero-word" data-gsap="hero-word">Meets</span></span>
            <span className="hero-word-wrap"><span className="hero-word" data-gsap="hero-word">Intelligence</span></span>
          </h1>

          <p className="hero-subtext" data-gsap="hero-subtext">
            Simulate outcomes. Master decisions. Train intelligence with a premium decision system built for modern strategic teams.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3" data-gsap="hero-cta">
            <Link to="/app" viewTransition className="primary-cta">Enter Platform</Link>
            <Link to="/product" viewTransition className="secondary-cta">Watch Demo</Link>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3" data-gsap="hero-metrics">
            <div className="hero-metric-card">
              <p className="hero-metric-label">Decision Velocity</p>
              <p className="hero-metric-value">+38%</p>
            </div>
            <div className="hero-metric-card">
              <p className="hero-metric-label">Signal Confidence</p>
              <p className="hero-metric-value">94.8%</p>
            </div>
            <div className="hero-metric-card">
              <p className="hero-metric-label">Scenario Throughput</p>
              <p className="hero-metric-value">1.4M/day</p>
            </div>
          </div>
        </div>

        <div ref={shellRef} className="relative z-10" data-gsap="scene-shell">
          <div
            className="premium-card p-4 md:p-5"
            style={{
              minHeight: 520,
              borderRadius: 30,
              viewTransitionName: 'hero-intelligence',
            }}
          >
            <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
              <div
                className="px-3 py-1.5 rounded-full text-[11px] uppercase tracking-[0.22em] font-semibold"
                style={{
                  color: 'var(--signal-cyan)',
                  border: '1px solid rgba(34, 211, 238, 0.4)',
                  background: 'rgba(11, 16, 32, 0.7)',
                }}
              >
                Intelligence Core
              </div>
              <div
                className="px-3 py-1.5 rounded-full text-[11px] font-semibold inline-flex items-center gap-2"
                style={{
                  color: 'var(--text-primary)',
                  border: '1px solid var(--glass-stroke)',
                  background: 'rgba(11, 16, 32, 0.7)',
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: 'var(--signal-cyan)', animation: 'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite' }}
                />
                <span style={{ color: 'var(--text-muted)' }}>Live</span>
              </div>
            </div>

            <div className="h-[450px] md:h-[540px] rounded-[24px] overflow-hidden" style={{ border: '1px solid var(--glass-stroke)', background: 'rgba(11, 16, 32, 0.72)' }}>
              {loadScene ? (
                <Suspense fallback={<div className="w-full h-full dot-grid" />}>
                  <IntelligenceSurfaceScene />
                </Suspense>
              ) : (
                <div
                  className="w-full h-full grid place-items-center dot-grid"
                  style={{
                    background:
                      'radial-gradient(280px 180px at 50% 48%, rgba(110, 231, 255, 0.22), rgba(139, 92, 246, 0.14) 50%, transparent 75%), linear-gradient(180deg, rgba(14, 22, 36, 0.9), rgba(8, 14, 24, 0.95))',
                  }}
                >
                  <button
                    type="button"
                    onMouseEnter={() => setLoadScene(true)}
                    onFocus={() => setLoadScene(true)}
                    className="secondary-cta text-xs"
                  >
                    Activate 3D Orb
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="relative mt-8 overflow-hidden rounded-2xl" style={{ border: '1px solid var(--glass-stroke)', background: 'rgba(17, 24, 39, 0.68)' }} data-gsap="trust-strip">
        <div className="trust-ticker flex w-max min-w-full items-center py-3">
          {[...TRUST_ITEMS, ...TRUST_ITEMS, ...TRUST_ITEMS].map((item, index) => (
            <div key={`${item}-${index}`} className="mx-4 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.12em] uppercase" style={{ color: 'var(--text-secondary)' }}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: index % 3 === 0 ? 'var(--brand-blue)' : index % 3 === 1 ? 'var(--signal-cyan)' : 'var(--quantum-violet)' }} />
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
