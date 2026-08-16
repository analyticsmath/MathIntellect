import { Link } from 'react-router-dom';
import { PHOTO_MEDIA } from '../../media/mediaRegistry';

export function ScandiHero() {
  const heroImage = PHOTO_MEDIA['hero-01'];

  return (
    <section className="relative w-full min-h-[100svh] flex flex-col justify-between overflow-hidden bg-mi-dark-0 text-mi-cream">
      {/* Real Full-Viewport Photographic Master */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage.src}
          alt={heroImage.alt}
          fetchPriority="high"
          decoding="sync"
          className="w-full h-full object-cover object-[50%_40%]"
        />
        {/* Restrained Solid Atmospheric Dark Overlay (No CSS gradient) */}
        <div className="absolute inset-0 bg-mi-dark-0/45" />
      </div>

      {/* Spacer for Top Navigation */}
      <div className="h-28 md:h-36" aria-hidden="true" />

      {/* Hero Core Content in Negative Space */}
      <div className="relative z-10 w-full max-w-[1380px] mx-auto px-6 md:px-12 lg:px-16 my-auto">
        <div className="max-w-3xl space-y-6">
          <h1 className="font-serif text-mi-cream text-[52px] sm:text-[68px] md:text-[88px] lg:text-[104px] font-normal leading-[1.02] tracking-tight">
            Model what changes.
          </h1>

          <p className="font-sans text-mi-copy text-base sm:text-lg md:text-xl font-normal leading-relaxed max-w-xl">
            Explore uncertainty, strategy, dynamics and interacting systems through mathematical simulation.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Link
              to="/app"
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-full bg-mi-cream text-mi-dark-0 font-sans text-sm md:text-base font-medium tracking-tight transition-colors duration-200 hover:bg-white focus-visible:outline-2 focus-visible:outline-mi-cream"
            >
              Enter the workbench
            </Link>

            <a
              href="#model-worlds"
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-full border border-mi-photo-line text-mi-cream font-sans text-sm md:text-base font-normal tracking-tight transition-colors duration-200 hover:border-mi-cream hover:bg-mi-dark-0/40"
            >
              Explore models
            </a>
          </div>
        </div>
      </div>

      {/* Subtle Scroll Cue */}
      <div className="relative z-10 w-full max-w-[1380px] mx-auto px-6 md:px-12 lg:px-16 pb-8 md:pb-12 flex items-center justify-between text-xs font-sans text-mi-muted">
        <span>Continuous Mathematical Simulation</span>
        <a
          href="#model-worlds"
          className="flex items-center gap-1.5 text-mi-copy hover:text-mi-cream transition-colors"
          aria-label="Scroll down to model worlds"
        >
          <span>Explore</span>
          <svg className="w-3.5 h-3.5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </a>
      </div>
    </section>
  );
}
