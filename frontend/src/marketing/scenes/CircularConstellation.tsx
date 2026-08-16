import { PHOTO_MEDIA } from '../../media/mediaRegistry';

interface StepNode {
  id: string;
  step: string;
  title: string;
  subtitle: string;
  mediaKey: string;
  sizePx: number;
}

const NODES: StepNode[] = [
  {
    id: 'assumptions',
    step: '01',
    title: 'Assumptions',
    subtitle: 'Define what can vary.',
    mediaKey: 'world-02',
    sizePx: 110,
  },
  {
    id: 'model',
    step: '02',
    title: 'Model',
    subtitle: 'Express the relationship.',
    mediaKey: 'world-04',
    sizePx: 165,
  },
  {
    id: 'run',
    step: '03',
    title: 'Run',
    subtitle: 'Explore possible outcomes.',
    mediaKey: 'world-05',
    sizePx: 190,
  },
  {
    id: 'evidence',
    step: '04',
    title: 'Evidence',
    subtitle: 'Inspect the result.',
    mediaKey: 'world-07',
    sizePx: 140,
  },
  {
    id: 'decision',
    step: '05',
    title: 'Decision',
    subtitle: 'Compare what changed.',
    mediaKey: 'world-09',
    sizePx: 125,
  },
];

export function CircularConstellation() {
  return (
    <section className="w-full py-24 md:py-36 bg-mi-dark-0 text-mi-cream overflow-hidden">
      <div className="max-w-[1380px] mx-auto px-6 md:px-12 lg:px-16 text-center space-y-4 mb-20">
        <span className="font-sans text-xs md:text-sm text-mi-muted tracking-wider uppercase">
          Continuous Analytical Arc
        </span>
        <h2 className="font-serif text-mi-cream text-[36px] sm:text-[44px] md:text-[56px] lg:text-[64px] font-normal leading-[1.1] tracking-tight max-w-2xl mx-auto">
          From assumption to decision.
        </h2>
        <p className="font-sans text-sm md:text-base text-mi-copy max-w-xl mx-auto leading-relaxed">
          Every simulation moves through five disciplined moments without speculative leaps.
        </p>
      </div>

      {/* Desktop Asymmetric Organic Constellation */}
      <div className="hidden lg:block relative max-w-[1380px] mx-auto min-h-[640px] px-12">
        {/* Node 1: Assumptions (Top-Left, 110px) */}
        <div className="absolute top-4 left-[6%] flex items-center gap-6">
          <div className="w-[110px] h-[110px] rounded-full overflow-hidden border border-mi-photo-line shadow-xl shrink-0">
            <img
              src={PHOTO_MEDIA['world-02'].src}
              alt="Assumptions boundary"
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-1">
            <div className="font-sans text-xs text-mi-muted">01 / Assumptions</div>
            <div className="font-serif text-2xl text-mi-cream">Define what can vary.</div>
          </div>
        </div>

        {/* Node 2: Model (Top-Right, 165px) */}
        <div className="absolute top-12 right-[8%] flex flex-row-reverse items-center gap-6">
          <div className="w-[165px] h-[165px] rounded-full overflow-hidden border border-mi-photo-line shadow-xl shrink-0">
            <img
              src={PHOTO_MEDIA['world-04'].src}
              alt="Mathematical model relationship"
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-1 text-right">
            <div className="font-sans text-xs text-mi-muted">02 / Model</div>
            <div className="font-serif text-2xl text-mi-cream">Express the relationship.</div>
          </div>
        </div>

        {/* Node 3: Run (Center Dominant, 190px) */}
        <div className="absolute top-[36%] left-[42%] -translate-x-1/2 flex flex-col items-center text-center gap-4">
          <div className="w-[190px] h-[190px] rounded-full overflow-hidden border-2 border-mi-photo-line shadow-2xl">
            <img
              src={PHOTO_MEDIA['world-05'].src}
              alt="Simulation run trajectories"
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-1">
            <div className="font-sans text-xs text-mi-muted">03 / Run</div>
            <div className="font-serif text-2xl text-mi-cream">Explore possible outcomes.</div>
          </div>
        </div>

        {/* Node 4: Evidence (Bottom-Left, 140px) */}
        <div className="absolute bottom-6 left-[10%] flex items-center gap-6">
          <div className="w-[140px] h-[140px] rounded-full overflow-hidden border border-mi-photo-line shadow-xl shrink-0">
            <img
              src={PHOTO_MEDIA['world-07'].src}
              alt="Evidence distributions"
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-1">
            <div className="font-sans text-xs text-mi-muted">04 / Evidence</div>
            <div className="font-serif text-2xl text-mi-cream">Inspect the result.</div>
          </div>
        </div>

        {/* Node 5: Decision (Bottom-Right, 125px) */}
        <div className="absolute bottom-10 right-[12%] flex flex-row-reverse items-center gap-6">
          <div className="w-[125px] h-[125px] rounded-full overflow-hidden border border-mi-photo-line shadow-xl shrink-0">
            <img
              src={PHOTO_MEDIA['world-09'].src}
              alt="Decision scenario comparisons"
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-1 text-right">
            <div className="font-sans text-xs text-mi-muted">05 / Decision</div>
            <div className="font-serif text-2xl text-mi-cream">Compare what changed.</div>
          </div>
        </div>
      </div>

      {/* Mobile Vertical Alternating Sequence */}
      <div className="lg:hidden max-w-md mx-auto px-6 space-y-10">
        {NODES.map((node, i) => {
          const photo = PHOTO_MEDIA[node.mediaKey];
          const isEven = i % 2 === 0;

          return (
            <div
              key={node.id}
              className={`flex items-center gap-5 ${
                isEven ? 'flex-row' : 'flex-row-reverse text-right'
              }`}
            >
              <div
                className="rounded-full overflow-hidden border border-mi-photo-line shadow-lg shrink-0"
                style={{ width: `${Math.min(node.sizePx, 110)}px`, height: `${Math.min(node.sizePx, 110)}px` }}
              >
                <img
                  src={photo.src}
                  alt={node.title}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-1">
                <div className="font-sans text-xs text-mi-muted">{node.step} / {node.title}</div>
                <div className="font-serif text-xl text-mi-cream leading-snug">
                  {node.subtitle}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
