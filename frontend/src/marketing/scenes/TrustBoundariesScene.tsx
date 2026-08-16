import { Link } from 'react-router-dom';

interface TrustPillar {
  title: string;
  body: string;
}

const PILLARS: TrustPillar[] = [
  {
    title: 'Calculated Evidence',
    body: 'Every metric is deterministically computed from defined mathematical formulations and verifiable step-by-step algorithms.',
  },
  {
    title: 'Explicit Assumptions',
    body: 'All boundary conditions, variable domains, and probability distributions are transparently inspectable prior to simulation execution.',
  },
  {
    title: 'Quantified Uncertainty',
    body: 'Variance, standard deviation, and quantile intervals (P10–P90) are presented without smoothing over tail risk.',
  },
  {
    title: 'Calibrated Interpretation',
    body: 'Analytical intelligence assists reasoning without asserting unfounded precision or hallucinated certainty.',
  },
];

export function TrustBoundariesScene() {
  return (
    <section className="w-full py-24 md:py-36 bg-mi-dark-0 text-mi-cream overflow-hidden border-t border-mi-photo-line">
      <div className="max-w-[1380px] mx-auto px-6 md:px-12 lg:px-16 text-center space-y-4 mb-16">
        <span className="font-sans text-xs md:text-sm text-mi-muted tracking-wider uppercase">
          Epistemic Integrity
        </span>
        <h2 className="font-serif text-mi-cream text-[36px] sm:text-[44px] md:text-[56px] lg:text-[64px] font-normal leading-[1.1] tracking-tight max-w-2xl mx-auto">
          Know what the model knows.
        </h2>
        <p className="font-sans text-sm md:text-base text-mi-copy max-w-xl mx-auto leading-relaxed">
          Math Intellect enforces clear epistemic boundaries so analysts never mistake computational models for absolute truth.
        </p>
      </div>

      {/* 4 Pillars Grid */}
      <div className="max-w-[1380px] mx-auto px-6 md:px-12 lg:px-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {PILLARS.map((p, i) => (
          <div
            key={i}
            className="p-8 rounded-2xl border border-mi-photo-line bg-mi-dark-1 space-y-3"
          >
            <div className="font-sans text-xs text-mi-muted">0{i + 1} / BOUNDARY</div>
            <h3 className="font-serif text-xl text-mi-cream">{p.title}</h3>
            <p className="font-sans text-xs sm:text-sm text-mi-copy leading-relaxed pt-1">
              {p.body}
            </p>
          </div>
        ))}
      </div>

      {/* Final Terminal Call to Action */}
      <div className="max-w-[1380px] mx-auto px-6 md:px-12 lg:px-16 text-center">
        <div className="p-10 md:p-14 rounded-3xl border border-mi-photo-line bg-mi-dark-1 max-w-3xl mx-auto space-y-6">
          <h3 className="font-serif text-3xl md:text-4xl text-mi-cream">
            Ready to explore complex change?
          </h3>
          <p className="font-sans text-sm md:text-base text-mi-copy max-w-lg mx-auto leading-relaxed">
            Create your first simulation run or inspect mathematical reference models in the interactive workbench.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/app"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-mi-cream text-mi-dark-0 font-sans text-sm md:text-base font-medium tracking-tight transition-colors duration-200 hover:bg-white focus-visible:outline-2 focus-visible:outline-mi-cream"
            >
              Enter the workbench
            </Link>
            <Link
              to="/models"
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-full border border-mi-photo-line text-mi-cream font-sans text-sm md:text-base font-normal tracking-tight transition-colors duration-200 hover:border-mi-cream hover:bg-mi-dark-2"
            >
              Browse Model Atlas
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
