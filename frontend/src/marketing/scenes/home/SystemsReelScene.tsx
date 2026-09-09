import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MediaPicture } from '../../components/MediaPicture';

gsap.registerPlugin(ScrollTrigger);

interface ReelItem {
  id: string;
  concept: string;
  subhead: string;
  aspect: string;
  silhouetteClass: string;
}

const DESKTOP_REEL: ReelItem[] = [
  {
    id: 'MI-PH-003',
    concept: 'agent',
    subhead: 'Individual decision within physical bounds',
    aspect: '4/5',
    silhouetteClass: 'w-[42vw] max-w-[580px] ml-auto mr-12',
  },
  {
    id: 'MI-PH-005',
    concept: 'population',
    subhead: 'Collective behavior without centralized governance',
    aspect: '3/2',
    silhouetteClass: 'w-[54vw] max-w-[760px] mx-auto',
  },
  {
    id: 'MI-PH-008',
    concept: 'branch',
    subhead: 'Topological dispersion through natural sediment',
    aspect: '2.15/1',
    silhouetteClass: 'w-[68vw] max-w-[960px] ml-12',
  },
  {
    id: 'MI-PH-010',
    concept: 'route',
    subhead: 'Constrained parallel and converging trajectories',
    aspect: '1/1',
    silhouetteClass: 'w-[45vw] max-w-[620px] ml-auto mr-24',
  },
  {
    id: 'MI-PH-013',
    concept: 'infrastructure',
    subhead: 'Interlocking physical exchange networks',
    aspect: '16/9',
    silhouetteClass: 'w-full max-w-[1100px] mx-auto',
  },
  {
    id: 'MI-PH-016',
    concept: 'flow',
    subhead: 'Directional momentum across open coordinates',
    aspect: '2.4/1',
    silhouetteClass: 'w-[62vw] max-w-[860px] ml-16',
  },
  {
    id: 'MI-PH-017',
    concept: 'propagation',
    subhead: 'Continuous wave dynamics and state transfer',
    aspect: '5/4',
    silhouetteClass: 'w-[48vw] max-w-[680px] mx-auto',
  },
  {
    id: 'MI-PH-020',
    concept: 'release',
    subhead: 'Single calibrated path across open field',
    aspect: '2.4/1',
    silhouetteClass: 'w-[75vw] max-w-[1020px] mx-auto',
  },
  {
    id: 'MI-PH-001',
    concept: 'human',
    subhead: 'Return to shared environment',
    aspect: '3/2',
    silhouetteClass: 'w-[50vw] max-w-[700px] ml-auto mr-16',
  },
];

const MOBILE_REEL = [
  { id: 'MI-PH-003', concept: 'agent', subhead: 'Individual decision within bounds' },
  { id: 'MI-PH-005', concept: 'population', subhead: 'Collective emergent behavior' },
  { id: 'MI-PH-008', concept: 'branch', subhead: 'Topological branching dispersion' },
  { id: 'MI-PH-010', concept: 'route', subhead: 'Constrained rail network trajectories' },
  { id: 'MI-PH-016', concept: 'flow', subhead: 'Directional movement across field' },
  { id: 'MI-PH-017', concept: 'propagation', subhead: 'Continuous wave dynamics' },
  { id: 'MI-PH-020', concept: 'release', subhead: 'Calibrated path across open domain' },
];

export const SystemsReelScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pinStageRef = useRef<HTMLDivElement | null>(null);
  const framesRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    if (prefersReducedMotion || isMobile) {
      return;
    }

    const ctx = gsap.context(() => {
      const frames = framesRef.current.filter(Boolean) as HTMLDivElement[];
      if (frames.length === 0) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=240%',
          pin: pinStageRef.current,
          scrub: true,
          anticipatePin: 1,
        },
      });

      // Frame progression across scroll progress
      frames.forEach((frame, idx) => {
        const innerImg = frame.querySelector('img');
        const isFirst = idx === 0;
        const isLast = idx === frames.length - 1;

        if (!isFirst) {
          // Enter: frame enters from right
          tl.fromTo(
            frame,
            { x: '18vw', opacity: 0 },
            { x: '0vw', opacity: 1, duration: 0.8, ease: 'power1.out' },
            idx * 0.9
          );
        }

        // Inner image translation
        if (innerImg) {
          tl.fromTo(
            innerImg,
            { xPercent: -6, scale: 1.05 },
            { xPercent: 6, scale: 1.01, duration: 1.4, ease: 'none' },
            idx * 0.9
          );
        }

        // Exit: frame moves left as next enters
        if (!isLast) {
          tl.to(
            frame,
            { x: '-16vw', opacity: 0, duration: 0.7, ease: 'power1.in' },
            idx * 0.9 + 0.9
          );
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-mi-paper border-b border-mi-rule"
      aria-label="Systems Reel"
    >
      {/* Desktop Pinned Systems Journey */}
      <div className="hidden md:block">
        <div
          ref={pinStageRef}
          className="relative w-full h-[100svh] overflow-hidden flex flex-col justify-between py-12 px-8 lg:px-16"
        >
          {/* Header Title Bar */}
          <div className="flex justify-between items-baseline z-20">
            <div>
              <span className="font-mono text-xs text-mi-muted uppercase tracking-wider block">
                Movement 03: Systems Reel
              </span>
              <h2 className="font-sans font-medium text-3xl sm:text-4xl text-mi-ink mt-1 tracking-tight">
                Systems change shape.
              </h2>
            </div>
            <span className="font-mono text-xs text-mi-muted">
              AGENT → POPULATION → INFRASTRUCTURE → FLOW → MODEL
            </span>
          </div>

          {/* Stacked Frames Center Canvas */}
          <div className="relative flex-1 w-full my-6 flex items-center justify-center">
            {DESKTOP_REEL.map((item, idx) => (
              <div
                key={item.id}
                ref={(el) => {
                  framesRef.current[idx] = el;
                }}
                className={`absolute inset-x-0 ${item.silhouetteClass} border border-mi-rule bg-mi-canvas p-2.5 transition-opacity will-change-transform ${
                  idx === 0 ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <div className="overflow-hidden bg-mi-paper" style={{ aspectRatio: item.aspect }}>
                  <MediaPicture
                    id={item.id}
                    className="w-full h-full"
                    imgClassName="w-full h-full object-cover"
                    aspectRatio={item.aspect}
                    alt={`${item.concept} system state`}
                  />
                </div>
                <div className="mt-2.5 px-2 pb-1 flex justify-between items-baseline font-mono text-xs text-mi-muted">
                  <span className="text-mi-ink font-medium uppercase">{item.concept}</span>
                  <span className="text-[11px] truncate max-w-[280px]">{item.subhead}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Metrology Strip */}
          <div className="flex justify-between items-center pt-4 border-t border-mi-rule font-mono text-xs text-mi-muted z-20">
            <span>OBSERVED SCALE: MICRO → MACRO</span>
            <span>STRUCTURAL EXTRACTION CONTINUUM</span>
          </div>
        </div>
      </div>

      {/* Mobile Vertical Editorial Sequence */}
      <div className="block md:hidden py-14 px-6 space-y-16">
        <div>
          <span className="font-mono text-xs text-mi-muted uppercase tracking-wider block">
            Movement 03: Systems Reel
          </span>
          <h2 className="font-sans font-medium text-3xl text-mi-ink mt-2 tracking-tight">
            Systems change shape.
          </h2>
          <p className="text-mi-ink-2 text-sm mt-3">
            From single agents to dense logistics networks, observed structures exhibit measurable patterns under mathematical analysis.
          </p>
        </div>

        <div className="space-y-12">
          {MOBILE_REEL.map((item) => (
            <div key={item.id} className="border border-mi-rule bg-mi-canvas p-2">
              <div className="w-full aspect-[4/3] overflow-hidden bg-mi-paper">
                <MediaPicture
                  id={item.id}
                  className="w-full h-full"
                  imgClassName="w-full h-full object-cover"
                  focalVariant="mobile"
                  alt={item.subhead}
                />
              </div>
              <div className="mt-3 px-1 pb-1 flex justify-between items-baseline font-mono text-xs">
                <span className="text-mi-ink font-medium uppercase">{item.concept}</span>
                <span className="text-mi-muted text-[11px] truncate max-w-[200px]">
                  {item.subhead}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
