import React from 'react';
import { Link } from 'react-router-dom';
import { KaTeXBlock } from '../../math/KaTeXBlock';
import { MediaPicture } from '../components/MediaPicture';

interface Chapter {
  id: string;
  num: string;
  title: string;
}

const CHAPTERS: Chapter[] = [
  { id: 'ch-01', num: '01', title: 'Deterministic State' },
  { id: 'ch-02', num: '02', title: 'Monte Carlo Integration' },
  { id: 'ch-03', num: '03', title: 'Strategic Equilibrium' },
  { id: 'ch-04', num: '04', title: 'Market Processes' },
  { id: 'ch-05', num: '05', title: 'Repeated Interaction' },
  { id: 'ch-06', num: '06', title: 'AI Interpretation' },
  { id: 'ch-07', num: '07', title: 'Adaptive Progression' },
  { id: 'ch-08', num: '08', title: 'Limits and Boundaries' },
];

export const MethodPage: React.FC = () => {
  return (
    <div className="w-full bg-mi-canvas text-mi-ink">
      {/* Dossier Header */}
      <section className="border-b border-mi-rule bg-mi-paper py-16 px-6 sm:px-8 lg:px-16">
        <div className="max-w-[1400px] mx-auto">
          <div className="max-w-3xl space-y-4">
            <span className="font-mono text-xs text-mi-muted uppercase tracking-wider block">
              Methodology & Epistemic Framework
            </span>
            <h1 className="font-sans font-medium text-[clamp(2.5rem,4.5vw,5rem)] leading-[0.92] tracking-tight text-mi-ink">
              How the evidence is produced.
            </h1>
            <p className="font-sans text-base sm:text-lg text-mi-ink-2 leading-relaxed">
              Mathematical formulations, algorithmic boundaries, and computational invariants governing reproducible simulation in Math Intellect.
            </p>
          </div>
        </div>
      </section>

      {/* Main Dossier Content with Sticky Desktop Navigation */}
      <div className="max-w-[1400px] mx-auto py-16 px-6 sm:px-8 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Sticky Table of Contents (Left 3 Cols) */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-24 space-y-4">
            <span className="font-mono text-xs text-mi-muted uppercase tracking-wider block">
              Table of Contents
            </span>
            <nav className="space-y-1 font-mono text-xs" aria-label="Method dossier chapters">
              {CHAPTERS.map((ch) => (
                <a
                  key={ch.id}
                  href={`#${ch.id}`}
                  className="flex items-baseline gap-2 py-2 px-2.5 text-mi-muted hover:text-mi-ink hover:bg-mi-paper border border-transparent hover:border-mi-rule transition-colors"
                >
                  <span className="text-mi-ink-2 font-medium">{ch.num}</span>
                  <span className="truncate">{ch.title}</span>
                </a>
              ))}
            </nav>

            {/* Contextual Figure in Sidebar */}
            <div className="pt-6 border-t border-mi-rule space-y-2">
              <div className="aspect-[4/3] bg-mi-paper border border-mi-rule overflow-hidden">
                <MediaPicture
                  id="MI-PH-004"
                  className="w-full h-full"
                  imgClassName="w-full h-full object-cover"
                  alt="Overhead geometric intersection showing constrained traffic pathways"
                />
              </div>
              <span className="font-mono text-[10px] text-mi-muted block">
                Figure: Overhead geometric constraints
              </span>
            </div>
          </aside>

          {/* Chapters Reading Flow (Right 9 Cols) */}
          <main className="lg:col-span-9 space-y-20">
            {/* Chapter 01: Deterministic State */}
            <article id="ch-01" className="scroll-mt-24 space-y-6 pb-12 border-b border-mi-rule">
              <div className="font-mono text-xs text-mi-muted uppercase">Chapter 01</div>
              <h2 className="font-sans font-medium text-3xl sm:text-4xl text-mi-ink tracking-tight">
                Deterministic State &amp; Invariants
              </h2>
              <p className="text-mi-ink-2 text-base leading-relaxed">
                Reproducibility requires that simulation runs are not accidental one-offs. Every numerical execution in Math Intellect binds to an explicit deterministic seed, an immutable input parameter snapshot, and a verified pseudorandom number generator (PRNG).
              </p>
              <p className="text-mi-ink-2 text-base leading-relaxed">
                When an analyst perturbs an assumption, all other environmental constants remain pinned. The state can be replayed repeatedly, reproducing the exact floating-point trajectory and enabling rigorous counterfactual comparison without statistical drift.
              </p>
            </article>

            {/* Chapter 02: Monte Carlo Integration */}
            <article id="ch-02" className="scroll-mt-24 space-y-6 pb-12 border-b border-mi-rule">
              <div className="font-mono text-xs text-mi-muted uppercase">Chapter 02</div>
              <h2 className="font-sans font-medium text-3xl sm:text-4xl text-mi-ink tracking-tight">
                Monte Carlo Integration &amp; Covariance
              </h2>
              <p className="text-mi-ink-2 text-base leading-relaxed">
                Stochastic outcomes are sampled across continuous time using Euler-Maruyama discretization. Multiple continuous and discrete distribution forms are supported, including Gaussian, uniform, exponential, and Bernoulli distributions.
              </p>
              <KaTeXBlock math="x_{t+\Delta t} = x_t + \mu(x_t, t)\Delta t + \sigma(x_t, t)\sqrt{\Delta t} Z_t, \quad Z_t \sim \mathcal{N}(0, \mathbf{I})" />
              <p className="text-mi-ink-2 text-base leading-relaxed">
                For correlated multidimensional variables, the system executes Cholesky decomposition on the user-supplied correlation matrix <KaTeXBlock math="\mathbf{\Sigma} = \mathbf{L}\mathbf{L}^T" display={false} />, generating correlated random vectors <KaTeXBlock math="\mathbf{Z}^* = \mathbf{L}\mathbf{Z}" display={false} /> that preserve empirical cross-variable dependencies across up to 1,000,000 iterations.
              </p>

              {/* Large Contextual Figure */}
              <div className="my-8 border border-mi-rule bg-mi-paper p-3">
                <div className="w-full aspect-[21/9] overflow-hidden bg-mi-canvas">
                  <MediaPicture
                    id="MI-PH-008"
                    className="w-full h-full"
                    imgClassName="w-full h-full object-cover"
                    alt="Aerial view of natural branching river delta channels"
                  />
                </div>
                <span className="font-mono text-xs text-mi-muted block mt-2 text-right">
                  Figure: Natural branching dispersion patterns in physical systems
                </span>
              </div>
            </article>

            {/* Chapter 03: Strategic Equilibrium */}
            <article id="ch-03" className="scroll-mt-24 space-y-6 pb-12 border-b border-mi-rule">
              <div className="font-mono text-xs text-mi-muted uppercase">Chapter 03</div>
              <h2 className="font-sans font-medium text-3xl sm:text-4xl text-mi-ink tracking-tight">
                Strategic Equilibrium in Normal-Form Games
              </h2>
              <p className="text-mi-ink-2 text-base leading-relaxed">
                Game theoretic analysis evaluates finite normal-form games across two or more strategic actors. The backend engine exhaustively computes best-response correspondences to detect strictly dominant strategies and identify pure-strategy Nash equilibria.
              </p>
              <KaTeXBlock math="s_i^* \in \arg\max_{s_i \in S_i} u_i(s_i, s_{-i}^*)" />
              <p className="text-mi-ink-2 text-base leading-relaxed">
                In multi-stage scenarios, optional repeated-game learning and dynamic strategy evolution trace trajectory convergence across rounds. Reputation decay models how historical actions influence future strategic counter-moves without inventing unverified mixed-strategy probabilities.
              </p>
            </article>

            {/* Chapter 04: Market Processes */}
            <article id="ch-04" className="scroll-mt-24 space-y-6 pb-12 border-b border-mi-rule">
              <div className="font-mono text-xs text-mi-muted uppercase">Chapter 04</div>
              <h2 className="font-sans font-medium text-3xl sm:text-4xl text-mi-ink tracking-tight">
                Market Processes, Shocks &amp; Regimes
              </h2>
              <p className="text-mi-ink-2 text-base leading-relaxed">
                The market engine is grounded in Geometric Brownian Motion (GBM) with discrete Markov regime switching. Rather than assuming perpetual stationarity, the engine supports exogenous shock injections and optional GARCH-like volatility clustering:
              </p>
              <KaTeXBlock math="\sigma_t^2 = \omega + \alpha \epsilon_{t-1}^2 + \beta \sigma_{t-1}^2" />
              <p className="text-mi-ink-2 text-base leading-relaxed">
                Path ensembles simulate asset baskets, cross-asset correlations, and portfolio drawdowns across up to 10,000 paths, yielding Value-at-Risk (VaR95) and maximum drawdown metrics.
              </p>

              {/* Contextual Figure */}
              <div className="my-8 border border-mi-rule bg-mi-paper p-3">
                <div className="w-full aspect-[21/9] overflow-hidden bg-mi-canvas">
                  <MediaPicture
                    id="MI-PH-013"
                    className="w-full h-full"
                    imgClassName="w-full h-full object-cover"
                    alt="Industrial shipping port and cargo flow infrastructure"
                  />
                </div>
                <span className="font-mono text-xs text-mi-muted block mt-2 text-right">
                  Figure: Constrained exchange and logistical flow topology
                </span>
              </div>
            </article>

            {/* Chapter 05: Repeated Interaction */}
            <article id="ch-05" className="scroll-mt-24 space-y-6 pb-12 border-b border-mi-rule">
              <div className="font-mono text-xs text-mi-muted uppercase">Chapter 05</div>
              <h2 className="font-sans font-medium text-3xl sm:text-4xl text-mi-ink tracking-tight">
                Repeated Strategic Interaction &amp; Trust
              </h2>
              <p className="text-mi-ink-2 text-base leading-relaxed">
                The Conflict simulation engine is an iterative multi-agent strategic system. Agents with heterogenous strategies (Cooperative, Tit-for-Tat, Defector, Aggressive, Random) interact in pairwise rounds modeled after the Prisoner’s Dilemma.
              </p>
              <p className="text-mi-ink-2 text-base leading-relaxed">
                Each interaction updates resources and modifies pairwise trust scores. When defection occurs, betrayal sensitivity triggers coalition realignment and alliance cohesion degradation across up to 10,000 simulated rounds.
              </p>
            </article>

            {/* Chapter 06: AI Interpretation */}
            <article id="ch-06" className="scroll-mt-24 space-y-6 pb-12 border-b border-mi-rule">
              <div className="font-mono text-xs text-mi-muted uppercase">Chapter 06</div>
              <h2 className="font-sans font-medium text-3xl sm:text-4xl text-mi-ink tracking-tight">
                AI Interpretation &amp; Computational Boundaries
              </h2>
              <p className="text-mi-ink-2 text-base leading-relaxed">
                A rigorous separation exists between computation and interpretation:
              </p>
              <div className="p-6 bg-mi-paper border border-mi-rule font-sans text-base text-mi-ink space-y-2">
                <strong className="block font-medium">Core Principle:</strong>
                <p>
                  Simulation engines calculate numerical evidence. AI interprets, explains, compares, and can produce decision-oriented outputs around that evidence.
                </p>
              </div>
              <p className="text-mi-ink-2 text-base leading-relaxed">
                The language model does not compute the Monte Carlo paths or solve Nash equilibria; mathematical kernels perform the arithmetic. The AI interprets parameter sensitivity, contextualizes tail risks, and summarizes comparative differentials between runs.
              </p>
            </article>

            {/* Chapter 07: Adaptive Progression */}
            <article id="ch-07" className="scroll-mt-24 space-y-6 pb-12 border-b border-mi-rule">
              <div className="font-mono text-xs text-mi-muted uppercase">Chapter 07</div>
              <h2 className="font-sans font-medium text-3xl sm:text-4xl text-mi-ink tracking-tight">
                Adaptive Difficulty &amp; Progression
              </h2>
              <p className="text-mi-ink-2 text-base leading-relaxed">
                Math Intellect supports Beginner, Adaptive, and Expert user tiers. The system dynamically scales parameter complexity, provides contextual hints during constraint setup, and logs progression metrics as analysts master multidimensional simulation spaces.
              </p>
            </article>

            {/* Chapter 08: Limits and Boundaries */}
            <article id="ch-08" className="scroll-mt-24 space-y-6 pb-12">
              <div className="font-mono text-xs text-mi-muted uppercase">Chapter 08</div>
              <h2 className="font-sans font-medium text-3xl sm:text-4xl text-mi-ink tracking-tight">
                Limits, Epistemic Boundaries &amp; Constraints
              </h2>
              <p className="text-mi-ink-2 text-base leading-relaxed">
                Honest systems declare their boundaries explicitly:
              </p>
              <ul className="space-y-3 font-mono text-xs text-mi-ink-2 list-disc list-inside bg-mi-paper p-6 border border-mi-rule">
                <li>
                  <strong className="text-mi-ink">Custom Engine Scope:</strong> Custom simulations currently run through the Monte Carlo execution pathway with user-defined variables and output expressions.
                </li>
                <li>
                  <strong className="text-mi-ink">Public Demonstrations:</strong> Public interactive models use simplified seeded PRNGs for client-side responsiveness.
                </li>
                <li>
                  <strong className="text-mi-ink">Assumption Sensitivity:</strong> All simulation outputs are functions of their initial assumptions. Reproducibility confirms that computation is deterministic, not that a model perfectly captures physical reality.
                </li>
                <li>
                  <strong className="text-mi-ink">Strategic Solvers:</strong> The production Game Theory engine detects pure-strategy Nash equilibria; general mixed-strategy solvers are not exposed.
                </li>
              </ul>
            </article>

            {/* Restrained Contact Sheet (Contextual Photography) */}
            <div className="pt-10 border-t border-mi-rule space-y-4">
              <span className="font-mono text-xs text-mi-muted uppercase tracking-wider block">
                Contextual System Figures
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {['MI-PH-006', 'MI-PH-007', 'MI-PH-011', 'MI-PH-018'].map((id) => (
                  <div key={id} className="border border-mi-rule bg-mi-paper p-1.5">
                    <div className="aspect-[4/3] overflow-hidden bg-mi-canvas">
                      <MediaPicture
                        id={id}
                        className="w-full h-full"
                        imgClassName="w-full h-full object-cover"
                        alt={`Contextual figure ${id}`}
                      />
                    </div>
                    <span className="font-mono text-[9px] text-mi-muted block mt-1 truncate">
                      Fig: {id}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Method Route Call to Action */}
      <section className="bg-mi-paper py-16 px-6 sm:px-8 border-t border-mi-rule text-center">
        <div className="max-w-xl mx-auto space-y-4">
          <h3 className="font-sans font-medium text-2xl text-mi-ink">
            Put theory into computational practice.
          </h3>
          <p className="text-mi-ink-2 text-sm">
            Launch the interactive workbench or sign in to configure production simulations.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <Link
              to="/workbench"
              className="bg-mi-ink text-mi-paper font-sans text-sm font-medium px-6 py-3 hover:bg-mi-ink-2 transition-colors"
            >
              Explore the workbench
            </Link>
            <Link
              to="/signup"
              className="border border-mi-rule bg-mi-white text-mi-ink font-sans text-sm font-medium px-6 py-3 hover:border-mi-rule-strong transition-colors"
            >
              Create an account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MethodPage;
