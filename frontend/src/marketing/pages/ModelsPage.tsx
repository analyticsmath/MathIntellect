import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { KaTeXBlock } from '../../math/KaTeXBlock';
import { MediaPicture } from '../components/MediaPicture';

interface EngineAtlas {
  id: string;
  code: string;
  name: string;
  headline: string;
  summary: string;
  equation: string;
  parameters: string[];
  outputs: string[];
  capabilities: string[];
}

const ATLAS_ENGINES: EngineAtlas[] = [
  {
    id: 'monte-carlo',
    code: 'ENG 01',
    name: 'Monte Carlo',
    headline: 'Sample uncertainty.',
    summary:
      'Numerical integration over explicit stochastic distributions. Generates path ensembles, calibrates terminal variance, and models tail-risk branching without analytical hand-waving.',
    equation: 'dx_t = \\mu x_t dt + \\sigma x_t dW_t',
    parameters: [
      'Distribution types (normal, uniform, exponential, Bernoulli)',
      'Deterministic seed integer',
      'Iteration count (1 to 1,000,000)',
      'Correlation matrix (Cholesky decomposition)',
      'Explicit output expression',
    ],
    outputs: [
      'Sample path ensemble array',
      'Terminal distribution histogram',
      'Expected value and variance',
      '5th & 95th percentiles',
      'Execution timing telemetry',
    ],
    capabilities: [
      '1 to 1,000,000 iterations',
      'Cholesky correlation',
      'Tail-risk amplification',
      'Scenario branching',
    ],
  },
  {
    id: 'game-theory',
    code: 'ENG 02',
    name: 'Game Theory',
    headline: 'Model strategic response.',
    summary:
      'Finite normal-form games and iterative strategic interaction. Detects strictly dominant strategies, identifies pure-strategy Nash equilibria, and computes expected payoffs across payoff tensors.',
    equation: 'u_i(s_i^*, s_{-i}^*) \\ge u_i(s_i, s_{-i}^*) \\quad \\forall s_i \\in S_i',
    parameters: [
      'Player action spaces (≥ 2 players)',
      'Normal-form payoff tensor',
      'Optional dynamic evolution rounds',
      'Repeated-game learning decay',
      'Coalition formation toggle',
    ],
    outputs: [
      'Dominant strategy detection',
      'Pure-strategy Nash equilibria',
      'Expected payoffs per actor',
      'Pareto-optimality classification',
      'Reputation scores & coalition cohesion',
    ],
    capabilities: [
      'Pure-strategy Nash detection',
      'Dominant strategy isolation',
      'Dynamic strategy evolution',
      'Coalition formation tracking',
    ],
  },
  {
    id: 'market',
    code: 'ENG 03',
    name: 'Market',
    headline: 'Model paths, shocks and regimes.',
    summary:
      'Geometric Brownian motion core paired with Markov regime switching and optional volatility clustering. Simulates multi-asset correlations, applied drawdown shocks, and sentiment proxies.',
    equation: 'S_{t+\\Delta t} = S_t \\exp\\left( \\left(\\mu - \\frac{1}{2}\\sigma_t^2\\right)\\Delta t + \\sigma_t \\sqrt{\\Delta t} Z_t \\right)',
    parameters: [
      'Asset basket & portfolio weights',
      'Cross-asset correlation matrix',
      'Markov regime transition matrix',
      'Exogenous shock timing & magnitude',
      'GARCH-like volatility clustering terms',
    ],
    outputs: [
      'Up to 10,000 calibrated price paths',
      'Expected final price & drawdown',
      '95% Value at Risk (VaR95)',
      'Annualized return & volatility',
      'Active regime transitions',
    ],
    capabilities: [
      'GBM core engine',
      'Regime switching',
      'Volatility clustering',
      'Explicit shock events',
    ],
  },
  {
    id: 'conflict',
    code: 'ENG 04',
    name: 'Conflict',
    headline: 'Model repeated interaction.',
    summary:
      'Iterative multi-agent strategic interaction model based on repeated Prisoner’s Dilemma mechanics. Tracks resource changes, pairwise trust scores, betrayal events, and coalition reorganization across up to 10,000 rounds.',
    equation: '\\Pi_{CC} = (3,3), \\quad \\Pi_{DD} = (-1,-1), \\quad \\Pi_{DC} = (5,-2), \\quad \\Pi_{CD} = (-2,5)',
    parameters: [
      'Agent population (strategies: TFT, coop, defector, random, aggressive)',
      'Initial resource endowments',
      'Betrayal sensitivity threshold',
      'Rounds (1 to 10,000)',
      'Coalition rules & alliances',
    ],
    outputs: [
      'Pairwise trust matrix evolution',
      'Cooperation rate timeline',
      'Resource redistribution curve',
      'Alliance cohesion index',
      'Terminal winner & survivor roster',
    ],
    capabilities: [
      'Up to 10,000 strategic rounds',
      'Pairwise trust & memory tracking',
      'Endogenous coalition formation',
      'Resource transfer dynamics',
    ],
  },
  {
    id: 'custom',
    code: 'ENG 05',
    name: 'Custom',
    headline: 'Define the variable and output.',
    summary:
      'Custom currently runs through the Monte Carlo execution pathway while allowing supplied parameters to change the default variable and output definition.',
    equation: 'Y = g(X_1, X_2, \\dots, X_n), \\quad X_i \\sim \\mathcal{D}_i',
    parameters: [
      'Custom variable declarations (distribution + domain)',
      'Output expression parser formula',
      'Monte Carlo sample batching',
      'Seed configuration',
    ],
    outputs: [
      'Custom output distribution realization',
      'Summary statistical moments',
      'Quantile quantifications',
      'Batch calculation progress',
    ],
    capabilities: [
      'Arbitrary output expressions',
      'Dynamic variable definitions',
      'Monte Carlo execution pipeline',
      'Deterministic verification',
    ],
  },
];

export const ModelsPage: React.FC = () => {
  const [activeEngineId, setActiveEngineId] = useState<string>('monte-carlo');

  return (
    <div className="w-full bg-mi-canvas text-mi-ink">
      {/* 1. Model Atlas Opening Overview */}
      <section className="border-b border-mi-rule bg-mi-paper py-20 px-6 sm:px-8 lg:px-16">
        <div className="max-w-[1600px] mx-auto">
          <div className="max-w-3xl space-y-4">
            <span className="font-mono text-xs text-mi-muted uppercase tracking-wider block">
              Model Atlas / Five Analytical Engines
            </span>
            <h1 className="font-sans font-medium text-[clamp(2.8rem,5vw,5.5rem)] leading-[0.92] tracking-tight text-mi-ink">
              Five ways to model a system.
            </h1>
            <p className="font-sans text-base sm:text-lg text-mi-ink-2 leading-relaxed">
              Choose the structure that matches the question, then make assumptions explicit before you run. Every engine computes reproducible evidence without statistical sleight-of-hand.
            </p>
          </div>

          {/* Central State Diagram / Atlas Selector */}
          <div className="mt-14 pt-8 border-t border-mi-rule grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {ATLAS_ENGINES.map((eng) => {
              const isSelected = activeEngineId === eng.id;
              return (
                <button
                  key={eng.id}
                  type="button"
                  onClick={() => setActiveEngineId(eng.id)}
                  onFocus={() => setActiveEngineId(eng.id)}
                  className={`p-5 text-left border transition-all ${
                    isSelected
                      ? 'border-mi-ink bg-mi-canvas text-mi-ink shadow-sm'
                      : 'border-mi-rule bg-mi-white text-mi-muted hover:border-mi-rule-strong hover:text-mi-ink'
                  }`}
                >
                  <div className="font-mono text-[11px] text-mi-muted">{eng.code}</div>
                  <div className="font-sans font-medium text-base text-mi-ink mt-1">
                    {eng.name}
                  </div>
                  <div className="font-mono text-[10px] text-mi-muted mt-3 line-clamp-2">
                    {eng.headline}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. Five Distinct Engine Chapters */}
      <div className="space-y-0">
        {ATLAS_ENGINES.map((eng, idx) => (
          <section
            key={eng.id}
            id={eng.id}
            className={`border-b border-mi-rule py-20 px-6 sm:px-8 lg:px-16 ${
              idx % 2 === 0 ? 'bg-mi-canvas' : 'bg-mi-paper'
            }`}
          >
            <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              {/* Left 5 Cols: Thesis, Math & Capabilities */}
              <div className="lg:col-span-5 space-y-6">
                <div className="flex items-center gap-3 font-mono text-xs text-mi-muted">
                  <span className="text-mi-ink font-medium">{eng.code}</span>
                  <span>/</span>
                  <span className="uppercase">{eng.name} Engine</span>
                </div>

                <h2 className="font-sans font-medium text-[clamp(2.2rem,3.4vw,3.8rem)] leading-[0.96] tracking-tight text-mi-ink">
                  {eng.headline}
                </h2>

                <p className="text-mi-ink-2 text-base leading-relaxed">{eng.summary}</p>

                <div className="pt-2">
                  <KaTeXBlock math={eng.equation} />
                </div>

                {/* Capabilities Capsule */}
                <div className="p-5 border border-mi-rule bg-mi-white space-y-3 font-mono text-xs">
                  <span className="text-mi-muted uppercase tracking-wider block text-[10px]">
                    Verified Engine Capabilities
                  </span>
                  <ul className="space-y-1.5 text-mi-ink">
                    {eng.capabilities.map((cap, cIdx) => (
                      <li key={cIdx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-mi-ink rounded-none inline-block"></span>
                        <span>{cap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right 7 Cols: Parameters & Outputs Spec Sheet */}
              <div className="lg:col-span-7 bg-mi-white border border-mi-rule p-8 sm:p-10 space-y-8">
                {/* Contextual interruption for Market */}
                {eng.id === 'market' && (
                  <div className="mb-6 p-2 border border-mi-rule bg-mi-canvas">
                    <div className="w-full aspect-[21/9] overflow-hidden bg-mi-paper">
                      <MediaPicture
                        id="MI-PH-015"
                        className="w-full h-full"
                        imgClassName="w-full h-full object-cover"
                        alt="Top-down orthographic container flow representing logistics market structure"
                      />
                    </div>
                    <span className="block mt-2 font-mono text-[10px] text-mi-muted text-right">
                      Figure: Contextual logistics exchange geometry
                    </span>
                  </div>
                )}

                {/* Parameters Section */}
                <div>
                  <div className="flex justify-between items-baseline mb-4 pb-2 border-b border-mi-rule">
                    <span className="font-mono text-xs text-mi-ink font-medium uppercase tracking-wider">
                      Explicit Input Parameters
                    </span>
                    <span className="font-mono text-[11px] text-mi-muted">Pre-flight verified</span>
                  </div>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-xs text-mi-ink-2">
                    {eng.parameters.map((param, pIdx) => (
                      <li key={pIdx} className="p-2.5 bg-mi-canvas border border-mi-rule">
                        {param}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Outputs Section */}
                <div>
                  <div className="flex justify-between items-baseline mb-4 pb-2 border-b border-mi-rule">
                    <span className="font-mono text-xs text-mi-ink font-medium uppercase tracking-wider">
                      Computed Output Evidence
                    </span>
                    <span className="font-mono text-[11px] text-mi-muted">Reproducible result</span>
                  </div>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-xs text-mi-ink-2">
                    {eng.outputs.map((out, oIdx) => (
                      <li key={oIdx} className="p-2.5 bg-mi-canvas border border-mi-rule">
                        {out}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* 3. Atlas Route Ending Call to Action */}
      <section className="bg-mi-paper py-16 px-6 sm:px-8 lg:px-16 text-center border-b border-mi-rule">
        <div className="max-w-2xl mx-auto space-y-6">
          <h3 className="font-sans font-medium text-3xl text-mi-ink">
            Test the models with live assumptions.
          </h3>
          <p className="text-mi-ink-2 text-base">
            Step into the interactive public demonstration or read the complete methodological dossier.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-4 pt-2">
            <Link
              to="/workbench"
              className="bg-mi-ink text-mi-paper font-sans text-sm font-medium px-6 py-3 hover:bg-mi-ink-2 transition-colors min-h-[44px] flex items-center"
            >
              Open the workbench
            </Link>
            <Link
              to="/method"
              className="text-mi-ink font-sans text-sm font-medium hover:underline underline-offset-4 min-h-[44px] flex items-center"
            >
              Read how the evidence is produced
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ModelsPage;
