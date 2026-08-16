import { useState, useCallback, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { PHOTO_MEDIA } from '../../media/mediaRegistry';

interface ModelWorldItem {
  id: string;
  title: string;
  subtitle: string;
  formula: string;
  mediaKey: string;
  description: string;
}

const WORLDS: ModelWorldItem[] = [
  {
    id: 'uncertainty',
    title: 'Uncertainty',
    subtitle: 'Stochastic Diffusion',
    formula: 'dx_t = \\mu dt + \\sigma dW_t',
    mediaKey: 'world-01',
    description: 'Quantify variance and quantile distributions when single trajectories mislead.',
  },
  {
    id: 'strategy',
    title: 'Strategy',
    subtitle: 'Equilibrium Games',
    formula: 'u_i(s_i^*, s_{-i}^*) \\ge u_i(s_i, s_{-i}^*)',
    mediaKey: 'world-03',
    description: 'Identify stable payoffs and Nash equilibria when every move triggers counter-actions.',
  },
  {
    id: 'dynamics',
    title: 'Dynamics',
    subtitle: 'Market & State Flow',
    formula: 'x_t = \\rho x_{t-1} + \\varepsilon_t',
    mediaKey: 'world-05',
    description: 'Trace state transitions, time-series inertia, and feedback mechanisms through time.',
  },
  {
    id: 'interaction',
    title: 'Interaction',
    subtitle: 'Agent Field Dynamics',
    formula: '\\dot{\\mathbf{x}}_i = \\sum A_{ij}(\\mathbf{x}_j - \\mathbf{x}_i)',
    mediaKey: 'world-06',
    description: 'Observe how microscopic rules generate macroscopic self-organized patterns.',
  },
  {
    id: 'custom',
    title: 'Custom',
    subtitle: 'Continuous PDE Models',
    formula: '\\partial u / \\partial t = D \\nabla^2 u + f(u)',
    mediaKey: 'world-04',
    description: 'Express bespoke differential relations and inspect spatial solution boundaries.',
  },
];

export function ModelWorldsScroller() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'center',
    skipSnaps: false,
    dragFree: false,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((idx: number) => emblaApi && emblaApi.scrollTo(idx), [emblaApi]);

  const selectedWorld = WORLDS[selectedIndex] || WORLDS[0];

  return (
    <section
      id="model-worlds"
      className="w-full py-24 md:py-36 bg-mi-dark-0 text-mi-cream overflow-hidden"
    >
      <div className="max-w-[1380px] mx-auto px-6 md:px-12 lg:px-16 text-center space-y-4 mb-14 md:mb-20">
        <span className="font-sans text-xs md:text-sm text-mi-muted tracking-wider uppercase">
          Mathematical Perspectives
        </span>
        <h2 className="font-serif text-mi-cream text-[36px] sm:text-[44px] md:text-[56px] lg:text-[64px] font-normal leading-[1.1] tracking-tight max-w-2xl mx-auto">
          Choose a way to think about change.
        </h2>
      </div>

      {/* Overlapping Carousel Track */}
      <div className="relative w-full max-w-[1560px] mx-auto">
        <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
          <div className="flex -ml-4 md:-ml-8 touch-pan-y">
            {WORLDS.map((world, index) => {
              const isSelected = index === selectedIndex;
              const photo = PHOTO_MEDIA[world.mediaKey];

              return (
                <div
                  key={world.id}
                  className="flex-[0_0_80%] sm:flex-[0_0_55%] md:flex-[0_0_36%] lg:flex-[0_0_28%] min-w-0 pl-4 md:pl-8 py-6 transition-all duration-300 select-none"
                  onClick={() => scrollTo(index)}
                  tabIndex={0}
                  role="button"
                  aria-label={`Select ${world.title} model world`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      scrollTo(index);
                    }
                  }}
                >
                  <div
                    className={`relative rounded-xl md:rounded-2xl overflow-hidden border border-mi-photo-line bg-mi-dark-1 transition-all duration-500 ${
                      isSelected
                        ? 'scale-100 shadow-2xl z-20 opacity-100 -translate-y-2'
                        : 'scale-[0.92] opacity-75 hover:opacity-90 z-10'
                    }`}
                  >
                    {/* Full Surface Photographic Aspect Ratio */}
                    <div className="w-full aspect-[3/4] relative overflow-hidden">
                      <img
                        src={photo.src}
                        alt={photo.alt}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-mi-dark-0/25" />

                      {/* Card Floating Title Overlay */}
                      <div className="absolute bottom-0 inset-x-0 p-5 bg-gradient-to-t from-mi-dark-0/90 via-mi-dark-0/40 to-transparent">
                        <div className="font-sans text-xs text-mi-muted">{world.subtitle}</div>
                        <h3 className="font-serif text-xl md:text-2xl text-mi-cream mt-0.5">
                          {world.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Carousel Controls */}
        <div className="mt-8 max-w-[1380px] mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Position Dot Indicators */}
          <div className="flex items-center gap-2">
            {WORLDS.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === selectedIndex ? 'w-8 bg-mi-cream' : 'w-2 bg-mi-muted/40 hover:bg-mi-muted'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          {/* Prev / Next 44px Accessible Circle Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={scrollPrev}
              className="w-11 h-11 rounded-full border border-mi-photo-line flex items-center justify-center text-mi-cream hover:bg-mi-dark-1 hover:border-mi-cream transition-colors duration-200"
              aria-label="Previous world"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={scrollNext}
              className="w-11 h-11 rounded-full border border-mi-photo-line flex items-center justify-center text-mi-cream hover:bg-mi-dark-1 hover:border-mi-cream transition-colors duration-200"
              aria-label="Next world"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Selected World Editorial Description */}
        <div className="mt-8 max-w-xl mx-auto px-6 text-center space-y-2">
          <p className="font-sans text-sm md:text-base text-mi-copy leading-relaxed">
            {selectedWorld.description}
          </p>
        </div>
      </div>
    </section>
  );
}
