import { useState, useCallback, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { PHOTO_MEDIA } from '../../media/mediaRegistry';

interface PracticeItem {
  id: string;
  stage: string;
  headline: string;
  caption: string;
  mediaKey: string;
  yOffsetClass: string;
  rotateClass: string;
}

const PRACTICES: PracticeItem[] = [
  {
    id: 'formulate',
    stage: '01 / Formulate',
    headline: 'Parameter Bounds',
    caption: 'Assumptions are stated with explicit parameter intervals rather than point guesses.',
    mediaKey: 'world-02',
    yOffsetClass: 'md:-translate-y-4',
    rotateClass: 'md:rotate-0',
  },
  {
    id: 'verify',
    stage: '02 / Compute',
    headline: 'Governing Invariants',
    caption: 'Invariants and conservation rules are evaluated across hundreds of deterministic iterations.',
    mediaKey: 'world-08',
    yOffsetClass: 'md:translate-y-6',
    rotateClass: 'md:-rotate-1',
  },
  {
    id: 'quantify',
    stage: '03 / Observe',
    headline: 'Quantile Confidence',
    caption: 'Distributions and tail risks are measured across calibrated multi-dimensional surfaces.',
    mediaKey: 'world-07',
    yOffsetClass: 'md:-translate-y-5',
    rotateClass: 'md:rotate-1',
  },
  {
    id: 'decide',
    stage: '04 / Intervene',
    headline: 'Comparative Analysis',
    caption: 'Interventions and policy decisions are tested against worst-case empirical bounds.',
    mediaKey: 'world-03',
    yOffsetClass: 'md:translate-y-4',
    rotateClass: 'md:-rotate-1',
  },
];

export function MathPracticeScroller() {
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
            Rigorous Epistemics
          </span>
          <h2 className="font-serif text-mi-cream text-[36px] sm:text-[44px] md:text-[56px] lg:text-[64px] font-normal leading-[1.1] tracking-tight">
            Mathematics is worked, tested and revised.
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
            aria-label="Previous practice card"
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
            aria-label="Next practice card"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Staggered Vertical Offset Track */}
      <div className="w-full max-w-[1560px] mx-auto px-6 md:px-12">
        <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
          <div className="flex -ml-6 py-10 touch-pan-y">
            {PRACTICES.map((item) => {
              const photo = PHOTO_MEDIA[item.mediaKey];

              return (
                <div
                  key={item.id}
                  className="flex-[0_0_85%] sm:flex-[0_0_50%] md:flex-[0_0_36%] lg:flex-[0_0_28%] min-w-0 pl-6 select-none"
                >
                  <div
                    className={`transition-transform duration-500 ${item.yOffsetClass} ${item.rotateClass}`}
                  >
                    <div className="rounded-xl md:rounded-2xl overflow-hidden border border-mi-photo-line bg-mi-dark-0 shadow-lg">
                      <div className="w-full aspect-[4/5] relative overflow-hidden">
                        <img
                          src={photo.src}
                          alt={photo.alt}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-mi-dark-0/20" />
                      </div>

                      <div className="p-6 space-y-2">
                        <div className="font-sans text-xs text-mi-muted">{item.stage}</div>
                        <h3 className="font-serif text-xl text-mi-cream">
                          {item.headline}
                        </h3>
                        <p className="font-sans text-xs sm:text-sm text-mi-copy leading-relaxed pt-1">
                          {item.caption}
                        </p>
                      </div>
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
