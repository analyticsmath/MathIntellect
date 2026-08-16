import React from 'react';
import { Link } from 'react-router-dom';
import MarketingLayout from '../components/MarketingLayout';
import { MathExpression } from '../../math/MathExpression';
import { ResponsiveMedia } from '../../media/ResponsiveMedia';

export const MethodPage: React.FC = () => {
  return (
    <MarketingLayout>
      <div className="w-full max-w-[1720px] mx-auto px-6 md:px-12 lg:px-16 pt-28 pb-20">
        {/* Page Header */}
        <div className="border-b border-mi-rule pb-10">
          <div className="text-xs font-mono text-mi-muted uppercase tracking-wider">
            Mathematical Doctrine &amp; Epistemic Foundations
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium text-mi-ink tracking-tight mt-2">
            The Method
          </h1>
          <p className="mt-4 text-lg text-mi-text max-w-3xl leading-relaxed">
            The principles, mathematical derivations, and strict operational boundaries that govern simulations in Math Intellect.
          </p>
        </div>

        {/* Territory Grid */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Main 8 cols: Structured Epistemic Narrative */}
          <div className="lg:col-span-8 space-y-12">
            {/* Territory 1: What the simulation calculates */}
            <section className="space-y-4">
              <div className="text-xs font-mono text-mi-muted uppercase">01 / CALCULATION SCOPE</div>
              <h2 className="text-2xl md:text-3xl font-medium text-mi-ink">
                What the simulation calculates
              </h2>
              <p className="text-sm md:text-base text-mi-text leading-relaxed">
                Math Intellect solves numerical approximations of differential, stochastic, and matrix equations. Every output point represents a computed integration step or Nash condition calculated directly on user-provided parameter vectors.
              </p>
              <div className="p-4 bg-mi-paper border border-mi-rule">
                <MathExpression tex="\mathbf{x}_{k+1} = \mathbf{x}_k + \Delta t \cdot \mathbf{f}(\mathbf{x}_k, \mathbf{u}_k) + \sqrt{\Delta t} \cdot \mathbf{G}(\mathbf{x}_k)\mathbf{w}_k" display />
              </div>
            </section>

            {/* Territory 2: Deterministic vs Stochastic */}
            <section className="space-y-4 pt-8 border-t border-mi-rule">
              <div className="text-xs font-mono text-mi-muted uppercase">02 / STOCHASTIC VS DETERMINISTIC</div>
              <h2 className="text-2xl md:text-3xl font-medium text-mi-ink">
                Deterministic vs. stochastic dynamics
              </h2>
              <p className="text-sm md:text-base text-mi-text leading-relaxed">
                While individual stochastic realizations contain diffusion noise (\(dW_t\)), the probability distributions, moments, and ensemble quantiles converge deterministically according to the Fokker-Planck equation.
              </p>
              <div className="p-4 bg-mi-paper border border-mi-rule">
                <MathExpression tex="\frac{\partial p(x,t)}{\partial t} = -\frac{\partial}{\partial x}\left[\mu(x,t)p(x,t)\right] + \frac{1}{2}\frac{\partial^2}{\partial x^2}\left[\sigma^2(x,t)p(x,t)\right]" display />
              </div>
            </section>

            {/* Territory 3: Uncertainty Representation */}
            <section className="space-y-4 pt-8 border-t border-mi-rule">
              <div className="text-xs font-mono text-mi-muted uppercase">03 / UNCERTAINTY MODELING</div>
              <h2 className="text-2xl md:text-3xl font-medium text-mi-ink">
                How uncertainty is represented
              </h2>
              <p className="text-sm md:text-base text-mi-text leading-relaxed">
                Uncertainty is never collapsed into a single speculative number. Instead, Math Intellect reports the full empirical quantile structure (5th, 25th, median, 75th, 95th percentiles) and tail probabilities explicitly.
              </p>
            </section>

            {/* Territory 4 & 5: AI Boundary & Limits */}
            <section className="space-y-4 pt-8 border-t border-mi-rule">
              <div className="text-xs font-mono text-mi-muted uppercase">04 &amp; 05 / AI INTERPRETATION &amp; LIMITS</div>
              <h2 className="text-2xl md:text-3xl font-medium text-mi-ink">
                The role and strict boundaries of AI
              </h2>
              <p className="text-sm md:text-base text-mi-text leading-relaxed">
                Artificial intelligence functions exclusively as a contextual translation layer for humans: summarization, parameter sensitivity explanation, and scenario comparison assistance.
              </p>
              <div className="p-4 bg-mi-surface-soft border border-mi-rule text-xs font-mono space-y-2">
                <div className="text-mi-ink font-semibold">AI BOUNDARY MANDATE:</div>
                <div className="text-mi-danger">✕ AI never calculates numerical simulation trajectories.</div>
                <div className="text-mi-danger">✕ AI confidence is not mathematical proof or risk certification.</div>
                <div className="text-mi-success">✓ Mathematical equations govern all numerical outputs.</div>
              </div>
            </section>

            {/* Territory 6: Model Assumptions & Limits */}
            <section className="space-y-4 pt-8 border-t border-mi-rule">
              <div className="text-xs font-mono text-mi-muted uppercase">06 / BOUNDARIES &amp; VALIDITY</div>
              <h2 className="text-2xl md:text-3xl font-medium text-mi-ink">
                Model assumptions and breakdown limits
              </h2>
              <p className="text-sm md:text-base text-mi-text leading-relaxed">
                All models simplify reality. When input assumptions breach structural stability conditions (such as explosive autoregressive persistence \(|\rho| \ge 1\) or non-convergent matrix eigenvalues), Math Intellect flags structural divergence rather than outputting misleading numbers.
              </p>
            </section>
          </div>

          {/* Right 4 cols: Sticky Blueprint Reference & Navigation */}
          <div className="lg:col-span-4 space-y-6">
            <div className="border border-mi-rule bg-mi-paper p-4">
              <ResponsiveMedia mediaKey="mi-08" aspectRatio="16/10" className="w-full" />
              <div className="mt-3 text-xs font-mono text-mi-muted">
                METHOD BLUEPRINT VALIDATION • C55
              </div>
            </div>

            <div className="p-5 border border-mi-rule bg-mi-paper space-y-3 text-xs font-mono">
              <div className="text-mi-muted uppercase">METHOD SUMMARY</div>
              <ul className="space-y-2 text-mi-ink-2">
                <li>• Pure mathematical numerical kernels</li>
                <li>• Seeded deterministic reproducibility</li>
                <li>• Strict separation of calculation vs text AI</li>
                <li>• Explicit quantile &amp; variance bounds</li>
              </ul>
            </div>

            <div className="pt-2">
              <Link
                to="/workbench"
                className="mi-btn-primary w-full h-12 text-sm text-center"
              >
                Inspect in Workbench
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
};

export default MethodPage;
