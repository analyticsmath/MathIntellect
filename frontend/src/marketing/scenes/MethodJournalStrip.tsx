import { Link } from 'react-router-dom';
import { PHOTO_MEDIA } from '../../media/mediaRegistry';

interface JournalArticle {
  id: string;
  tag: string;
  headline: string;
  summary: string;
  mediaKey: string;
}

const ARTICLES: JournalArticle[] = [
  {
    id: 'uncertainty-is-not-error',
    tag: 'Epistemics / Article 01',
    headline: 'Uncertainty is not error.',
    summary: 'Variance is a structural feature of complex reality, not a measurement deficiency to be averaged away.',
    mediaKey: 'world-01',
  },
  {
    id: 'equilibrium-relationship',
    tag: 'Game Theory / Article 02',
    headline: 'Equilibrium is a relationship, not a prediction.',
    summary: 'Strategic stability emerges from mutual best responses, not unilateral static forecasts.',
    mediaKey: 'world-03',
  },
  {
    id: 'comparison-matters',
    tag: 'Methodology / Article 03',
    headline: 'A comparison can matter more than a single result.',
    summary: 'Evaluating state deltas between counterfactual interventions provides higher decision leverage than point estimates.',
    mediaKey: 'world-08',
  },
];

export function MethodJournalStrip() {
  return (
    <section className="w-full py-24 md:py-36 bg-mi-dark-1 text-mi-cream overflow-hidden">
      <div className="max-w-[1380px] mx-auto px-6 md:px-12 lg:px-16 mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4 max-w-2xl">
          <span className="font-sans text-xs md:text-sm text-mi-muted tracking-wider uppercase">
            Foundational Principles
          </span>
          <h2 className="font-serif text-mi-cream text-[36px] sm:text-[44px] md:text-[56px] lg:text-[64px] font-normal leading-[1.1] tracking-tight">
            The Journal of Applied Thought
          </h2>
        </div>

        <Link
          to="/method"
          className="inline-flex items-center gap-2 text-sm font-sans text-mi-copy hover:text-mi-cream transition-colors"
        >
          <span>Read all methodology notes</span>
          <span aria-hidden="true">→</span>
        </Link>
      </div>

      {/* 3 Tall Independent Editorial Objects */}
      <div className="max-w-[1380px] mx-auto px-6 md:px-12 lg:px-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        {ARTICLES.map((art) => {
          const photo = PHOTO_MEDIA[art.mediaKey];

          return (
            <Link
              key={art.id}
              to="/method"
              className="group block rounded-2xl overflow-hidden border border-mi-photo-line bg-mi-dark-0 shadow-xl transition-all duration-300 hover:border-mi-cream/40 hover:-translate-y-1.5"
            >
              <div className="w-full aspect-[4/3] relative overflow-hidden">
                <img
                  src={photo.src}
                  alt={art.headline}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-mi-dark-0/25" />
              </div>

              <div className="p-7 space-y-3">
                <div className="font-sans text-xs text-mi-muted">{art.tag}</div>
                <h3 className="font-serif text-2xl text-mi-cream leading-snug group-hover:text-white transition-colors">
                  {art.headline}
                </h3>
                <p className="font-sans text-sm text-mi-copy leading-relaxed pt-1">
                  {art.summary}
                </p>
                <div className="pt-4 font-sans text-xs text-mi-sage group-hover:text-mi-cream transition-colors flex items-center gap-1.5">
                  <span>Explore note</span>
                  <span>→</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
