import { useState, useCallback, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { PHOTO_MEDIA } from '../../media/mediaRegistry';

interface MethodCard {
  id: string;
  name: string;
  category: string;
  formula: string;
  mediaKey: string;
  summary: string;
}

const METHODS: MethodCard[] = [
  {
    id: 'monte-carlo',
    name: 'Monte Carlo',
    category: 'Stochastic Diffusion',
    formula: 'dx_t = \\mu dt + \\sigma dW_t',
    mediaKey: 'world-01',
    summary: 'Models thousands of random diffusion paths to isolate probability densities and downside tails.',
  },
  {
    id: 'game-theory',
    name: 'Game Theory',
    category: 'Equilibrium & Payoffs',
    formula: 'u_i(s_i^*, s_{-i}^*) \\ge u_i(s_i, s_{-i}^*)',
    mediaKey: 'world-06',
    summary: 'Analyzes strategic interactions between independent rational agents seeking optimal payoffs.',
  },
  {
    id: 'market-dynamics',
    name: 'Market Dynamics',
    category: 'Autoregressive Flow',
    formula: 'x_t = \\rho x_{t-1} + \\varepsilon_t',
    mediaKey: 'world-08',
    summary: 'Simulates price convergence, memory inertia, volatility clustering, and order book reactions.',
  },
  {
    id: 'agent-interaction',
    name: 'Agent Interaction',
    category: 'Collective Network Field',
    formula: '\\dot{\\mathbf{x}}_i = \\sum A_{ij}(\\mathbf{x}_j - \\mathbf{x}_i)',
    mediaKey: 'world-09',
    summary: 'Captures emergent decentralized phenomena from pairwise behavioral rules and spatial proximity.',
  },
];

export function MethodsScroller() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: 'start',
    skipSnaps: false,
    dragFree: true,
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
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

  return (
    <section className="w-full py-24 md:py-36 bg-mi-dark-1 text-mi-cream overflow-hidden">
      <div className="max-w-[1380px] mx-auto px-6 md:px-12 lg:px-16 flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
        <div className="space-y-4 max-w-2xl">
          <span className="font-sans text-xs md:text-sm text-mi-muted tracking-wider uppercase">
            Engine Taxonomy
          </span>
          <h2 className="font-serif text-mi-cream text-[36px] sm:text-[44px] md:text-[56px] lg:text-[64px] font-normal leading-[1.1] tracking-tight">
            Different models reveal different kinds of change.
          </h2>
        </div>

        {/* Carousel Arrow Controls */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            className={`w-11 h-11 rounded-full border border-mi-photo-line flex items-center justify-center text-mi-cream transition-colors duration-200 ${
              canScrollPrev ? 'hover:bg-mi-dark-2 hover:border-mi-cream' : 'opacity-40 cursor-not-allowed'
            }`}
            aria-label="Previous method"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={scrollNext}
            disabled={!canScrollNext}
            className={`w-11 h-11 rounded-full border border-mi-photo-line flex items-center justify-center text-mi-cream transition-colors duration-200 ${
              canScrollNext ? 'hover:bg-mi-dark-2 hover:border-mi-cream' : 'opacity-40 cursor-not-allowed'
            }`}
            aria-label="Next method"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Large Portrait Cards Track */}
      <div className="w-full max-w-[1560px] mx-auto px-6 md:px-12">
        <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
          <div className="flex -ml-6 py-6 touch-pan-y">
            {METHODS.map((method) => {
              const photo = PHOTO_MEDIA[method.mediaKey];

              return (
                <div
                  key={method.id}
                  className="flex-[0_0_85%] sm:flex-[0_0_55%] md:flex-[0_0_42%] lg:flex-[0_0_32%] min-w-0 pl-6 select-none"
                >
                  <div className="rounded-xl md:rounded-2xl overflow-hidden border border-mi-photo-line bg-mi-dark-0 shadow-xl transition-all duration-300 hover:border-mi-cream/40">
                    <div className="w-full aspect-[3/4] relative overflow-hidden">
                      <img
                        src={photo.src}
                        alt={method.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-mi-dark-0/20" />
                    </div>

                    <div className="p-6 md:p-8 space-y-3">
                      <div className="font-sans text-xs text-mi-muted">{method.category}</div>
                      <h3 className="font-serif text-2xl md:text-3xl text-mi-cream">
                        {method.name}
                      </h3>
                      <div className="font-serif italic text-mi-sage text-sm font-medium py-1">
                        {method.formula}
                      </div>
                      <p className="font-sans text-xs sm:text-sm text-mi-copy leading-relaxed pt-1">
                        {method.summary}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
