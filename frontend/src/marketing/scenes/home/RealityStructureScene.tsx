import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MediaPicture } from '../../components/MediaPicture';

gsap.registerPlugin(ScrollTrigger);

// 16 curated editorial anchor positions representing structural abstraction of the crossing
const DESKTOP_ANCHORS = [
  { id: 'a1', x: 22, y: 34, label: 'actor' },
  { id: 'a2', x: 28, y: 46 },
  { id: 'a3', x: 35, y: 28, label: 'path' },
  { id: 'a4', x: 42, y: 52 },
  { id: 'a5', x: 48, y: 38 },
  { id: 'a6', x: 55, y: 64, label: 'constraint' },
  { id: 'a7', x: 62, y: 42 },
  { id: 'a8', x: 68, y: 58 },
  { id: 'a9', x: 74, y: 30 },
  { id: 'a10', x: 80, y: 48 },
  { id: 'a11', x: 38, y: 68 },
  { id: 'a12', x: 52, y: 22 },
  { id: 'a13', x: 64, y: 72 },
  { id: 'a14', x: 78, y: 62 },
  { id: 'a15', x: 30, y: 58 },
  { id: 'a16', x: 70, y: 24 },
];

const DESKTOP_TRACES = [
  'M 22 34 L 28 46 L 42 52 L 48 38',
  'M 35 28 L 52 22 L 62 42 L 68 58',
  'M 48 38 L 55 64 L 64 72',
  'M 68 58 L 74 30 L 80 48 L 78 62',
  'M 30 58 L 38 68 L 55 64',
  'M 70 24 L 74 30',
];

export const RealityStructureScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pinStageRef = useRef<HTMLDivElement | null>(null);
  const photoLayerRef = useRef<HTMLDivElement | null>(null);
  const titlePlaneRef = useRef<HTMLDivElement | null>(null);
  const svgOverlayRef = useRef<SVGSVGElement | null>(null);
  const labelsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    if (prefersReducedMotion || isMobile) {
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=165%',
          pin: pinStageRef.current,
          scrub: true,
          anticipatePin: 1,
        },
      });

      // p = 0.00–0.16: Still photo, tiny inner crop
      tl.to(photoLayerRef.current, {
        xPercent: -2,
        scale: 1.03,
        duration: 0.16,
        ease: 'none',
      });

      // p = 0.16–0.32: Inner crop translates, title plane compresses & slides left
      tl.to(
        photoLayerRef.current,
        {
          xPercent: -4,
          scale: 1.06,
          duration: 0.16,
          ease: 'none',
        },
        0.16
      );
      tl.to(
        titlePlaneRef.current,
        {
          x: '-18vw',
          opacity: 0,
          duration: 0.16,
          ease: 'power1.inOut',
        },
        0.16
      );

      // p = 0.28–0.48: SVG stroke reveal & anchor points appear
      tl.fromTo(
        svgOverlayRef.current?.querySelectorAll('.mi-anchor-dot') ?? [],
        { opacity: 0, scale: 0 },
        { opacity: 1, scale: 1, stagger: 0.01, duration: 0.15, ease: 'none' },
        0.28
      );
      tl.fromTo(
        svgOverlayRef.current?.querySelectorAll('.mi-trace-line') ?? [],
        { strokeDashoffset: 400 },
        { strokeDashoffset: 0, duration: 0.2, ease: 'none' },
        0.28
      );

      // p = 0.44–0.64: Photo desaturates and dims, geometry gains ownership
      tl.to(
        photoLayerRef.current,
        {
          filter: 'saturate(0.3) brightness(0.65)',
          duration: 0.2,
          ease: 'none',
        },
        0.44
      );

      // p = 0.60–0.82: Photo fades to 0, SVG coordinate field persists, plain-language labels reveal
      tl.to(
        photoLayerRef.current,
        {
          opacity: 0,
          duration: 0.22,
          ease: 'power2.out',
        },
        0.6
      );
      tl.to(
        labelsRef.current,
        {
          opacity: 1,
          duration: 0.15,
          ease: 'power1.in',
        },
        0.65
      );

      // p = 0.80–1.00: Coordinates settle into analytical field
      tl.to(
        svgOverlayRef.current,
        {
          scale: 0.98,
          duration: 0.2,
          ease: 'none',
        },
        0.8
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-mi-canvas"
      aria-label="Reality to Structure"
    >
      {/* Pinned Stage for Desktop / Natural Flow for Mobile */}
      <div
        ref={pinStageRef}
        className="relative w-full h-[100svh] min-h-[720px] overflow-hidden flex items-center justify-center"
      >
        {/* Photographic Layer: Desktop MI-PH-001 / Mobile MI-PH-002 */}
        <div
          ref={photoLayerRef}
          className="absolute inset-0 w-full h-full will-change-transform"
        >
          {/* Desktop Media */}
          <div className="hidden md:block w-full h-full">
            <MediaPicture
              id="MI-PH-001"
              priority
              className="w-full h-full"
              imgClassName="w-full h-full object-cover"
              focalVariant="desktop"
              alt="Pedestrians moving across a paved crossing observed from above"
            />
          </div>
          {/* Mobile Media */}
          <div className="block md:hidden w-full h-full">
            <MediaPicture
              id="MI-PH-002"
              priority
              className="w-full h-full"
              imgClassName="w-full h-full object-cover"
              focalVariant="mobile"
              alt="High-angle vertical urban intersection traversal"
            />
          </div>
        </div>

        {/* Abstracted Analytical Geometry Layer (SVG Stroke Reveal) */}
        <svg
          ref={svgOverlayRef}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
        >
          {/* Connection Traces */}
          {DESKTOP_TRACES.map((d, i) => (
            <path
              key={`trace-${i}`}
              d={d}
              fill="none"
              stroke="#101311"
              strokeWidth="0.35"
              strokeDasharray="400"
              strokeDashoffset="0"
              className="mi-trace-line opacity-75"
            />
          ))}

          {/* Anchor Points: 3-5px solid circles, no glow, no pulsing neon */}
          {DESKTOP_ANCHORS.map((anchor) => (
            <circle
              key={anchor.id}
              cx={anchor.x}
              cy={anchor.y}
              r="0.55"
              fill="#101311"
              className="mi-anchor-dot"
            />
          ))}
        </svg>

        {/* Semantic Variable Concept Labels */}
        <div
          ref={labelsRef}
          className="absolute inset-0 pointer-events-none z-20 opacity-0 transition-opacity duration-300 hidden md:block"
        >
          {DESKTOP_ANCHORS.filter((a) => a.label).map((a) => (
            <div
              key={`label-${a.id}`}
              style={{ left: `${a.x}%`, top: `${a.y}%` }}
              className="absolute -translate-y-6 translate-x-2 font-mono text-[11px] text-mi-ink bg-mi-paper/95 px-2 py-0.5 border border-mi-rule-strong tracking-wider uppercase"
            >
              {a.label}
            </div>
          ))}
        </div>

        {/* Solid Title Plane: Cut into the photograph, no shadow, no round corners */}
        <div
          ref={titlePlaneRef}
          className="absolute left-6 sm:left-10 lg:left-16 bottom-10 lg:bottom-16 w-[calc(100%-3rem)] sm:w-[540px] lg:w-[48vw] max-w-[760px] bg-mi-paper p-7 sm:p-10 z-30 border border-mi-rule will-change-transform"
        >
          <h1 className="font-sans font-medium text-[clamp(2.5rem,4.5vw,5.5rem)] leading-[0.92] tracking-tight text-mi-ink">
            Turn assumptions into evidence.
          </h1>
          <p className="mt-5 font-sans text-base sm:text-lg text-mi-ink-2 leading-relaxed max-w-xl">
            Model explicit assumptions, run reproducible simulations, inspect evidence, and compare what changes.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4 sm:gap-6">
            <Link
              to="/workbench"
              className="bg-mi-ink text-mi-paper font-sans text-sm font-medium px-6 py-3.5 hover:bg-mi-ink-2 transition-colors min-h-[44px] flex items-center"
            >
              Explore the workbench
            </Link>
            <Link
              to="/models"
              className="text-mi-ink font-sans text-sm font-medium hover:underline underline-offset-4 min-h-[44px] flex items-center"
            >
              See the models
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
