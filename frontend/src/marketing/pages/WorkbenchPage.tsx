import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { runDeterministicMonteCarlo, type MonteCarloResult } from '../../math/deterministicModels';

type WorkflowStep = 'assume' | 'run' | 'inspect' | 'change' | 'compare' | 'replay';

export const WorkbenchPage: React.FC = () => {
  // Baseline Parameters
  const [baselineMu, setBaselineMu] = useState<number>(0.05);
  const [baselineSigma, setBaselineSigma] = useState<number>(0.35);
  const [seed, setSeed] = useState<number>(42);
  const [numPaths, setNumPaths] = useState<number>(24);

  // Perturbed / Changed Parameters
  const [currentMu, setCurrentMu] = useState<number>(0.05);
  const [currentSigma, setCurrentSigma] = useState<number>(0.35);

  // Active Phase
  const [activeStep, setActiveStep] = useState<WorkflowStep>('assume');

  // Baseline Simulation Execution (Deterministic)
  const baselineResult: MonteCarloResult = useMemo(() => {
    return runDeterministicMonteCarlo(baselineSigma, baselineMu, 50, numPaths, seed);
  }, [baselineSigma, baselineMu, numPaths, seed]);

  // Current (Perturbed) Simulation Execution (Deterministic)
  const currentResult: MonteCarloResult = useMemo(() => {
    return runDeterministicMonteCarlo(currentSigma, currentMu, 50, numPaths, seed);
  }, [currentSigma, currentMu, numPaths, seed]);

  const hasPerturbation =
    currentMu !== baselineMu || currentSigma !== baselineSigma;

  // Convert paths to SVG path strings
  // SVG viewport: 600 width x 260 height
  const toSvgPaths = (paths: number[][]) => {
    const steps = 50;
    const dx = 440 / steps;
    return paths.map((p) => {
      return p
        .map((yVal, i) => {
          const x = 30 + i * dx;
          // Map -1.2..1.2 to 230..30
          const y = 130 - yVal * 78;
          return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
        })
        .join(' ');
    });
  };

  const baselineSvgPaths = useMemo(
    () => toSvgPaths(baselineResult.paths),
    [baselineResult]
  );
  const currentSvgPaths = useMemo(
    () => toSvgPaths(currentResult.paths),
    [currentResult]
  );

  const handleReset = () => {
    setCurrentMu(baselineMu);
    setCurrentSigma(baselineSigma);
    setActiveStep('assume');
  };

  const handleNextSeed = () => {
    setSeed((prev) => prev + 1);
  };

  return (
    <div className="w-full bg-mi-canvas text-mi-ink">
      {/* Route Thesis & Quiet Disclaimer Header */}
      <section className="border-b border-mi-rule bg-mi-paper py-14 px-6 sm:px-8 lg:px-16">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 font-mono text-xs text-mi-muted">
              <span>WORKBENCH DEMONSTRATION</span>
              <span>/</span>
              <span className="text-mi-ink font-medium">STOCHASTIC DIFFUSION</span>
            </div>
            <h1 className="font-sans font-medium text-[clamp(2.4rem,4.2vw,4.5rem)] leading-[0.94] tracking-tight text-mi-ink mt-2">
              A model is a state you can change.
            </h1>
            <p className="font-sans text-base text-mi-ink-2 max-w-2xl mt-3">
              Manipulate assumptions, execute deterministic trajectories, inspect distributions, and observe causal differences against shared axes.
            </p>
          </div>

          {/* Quiet Demonstration Badge */}
          <div className="p-3 border border-mi-rule bg-mi-canvas font-mono text-xs text-mi-muted max-w-xs">
            <span className="text-mi-ink font-medium block">Public deterministic demonstration</span>
            <span>Simplified seeded PRNG model; not the full backend engine.</span>
          </div>
        </div>
      </section>

      {/* Workflow Phase Selector Bar */}
      <section className="border-b border-mi-rule bg-mi-paper/60 px-6 sm:px-8 lg:px-16">
        <div className="max-w-[1600px] mx-auto flex flex-wrap items-center gap-1 sm:gap-2 py-3">
          {(['assume', 'run', 'inspect', 'change', 'compare', 'replay'] as WorkflowStep[]).map(
            (step, sIdx) => {
              const isActive = activeStep === step;
              return (
                <button
                  key={step}
                  type="button"
                  onClick={() => setActiveStep(step)}
                  className={`px-3.5 py-1.5 font-mono text-xs uppercase tracking-wider transition-all ${
                    isActive
                      ? 'bg-mi-ink text-mi-paper font-semibold'
                      : 'bg-mi-white border border-mi-rule text-mi-muted hover:text-mi-ink hover:border-mi-rule-strong'
                  }`}
                >
                  0{sIdx + 1} {step}
                </button>
              );
            }
          )}
        </div>
      </section>

      {/* Main Single-Model Workbench Canvas */}
      <section className="py-12 px-6 sm:px-8 lg:px-16">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Integrated Marginal Controls (Left 4 Cols) */}
          <div className="lg:col-span-4 bg-mi-paper border border-mi-rule p-6 sm:p-8 space-y-6">
            <div className="flex justify-between items-baseline pb-3 border-b border-mi-rule">
              <span className="font-mono text-xs text-mi-ink font-medium uppercase tracking-wider">
                Assumptions & State
              </span>
              <button
                type="button"
                onClick={handleReset}
                className="font-mono text-xs text-mi-muted hover:text-mi-ink underline"
              >
                Reset
              </button>
            </div>

            {/* Volatility Sigma Control */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <label htmlFor="wb-sigma" className="text-mi-ink-2 uppercase">
                  Diffusion Volatility (σ)
                </label>
                <span className="text-mi-ink font-medium">
                  {currentSigma.toFixed(2)}
                </span>
              </div>
              <input
                id="wb-sigma"
                type="range"
                min="0.10"
                max="0.80"
                step="0.05"
                value={currentSigma}
                onChange={(e) => {
                  setCurrentSigma(parseFloat(e.target.value));
                  if (activeStep === 'assume') setActiveStep('change');
                }}
                className="w-full accent-mi-ink cursor-pointer"
              />
              <span className="font-mono text-[11px] text-mi-muted block">
                Baseline: {baselineSigma.toFixed(2)}
              </span>
            </div>

            {/* Drift Mu Control */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <label htmlFor="wb-mu" className="text-mi-ink-2 uppercase">
                  Drift Rate (μ)
                </label>
                <span className="text-mi-ink font-medium">
                  {currentMu.toFixed(2)}
                </span>
              </div>
              <input
                id="wb-mu"
                type="range"
                min="-0.20"
                max="0.30"
                step="0.02"
                value={currentMu}
                onChange={(e) => {
                  setCurrentMu(parseFloat(e.target.value));
                  if (activeStep === 'assume') setActiveStep('change');
                }}
                className="w-full accent-mi-ink cursor-pointer"
              />
              <span className="font-mono text-[11px] text-mi-muted block">
                Baseline: {baselineMu.toFixed(2)}
              </span>
            </div>

            {/* Path Count Control */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <label htmlFor="wb-paths" className="text-mi-ink-2 uppercase">
                  Sample Paths (N)
                </label>
                <span className="text-mi-ink font-medium">{numPaths}</span>
              </div>
              <input
                id="wb-paths"
                type="range"
                min="12"
                max="36"
                step="4"
                value={numPaths}
                onChange={(e) => setNumPaths(parseInt(e.target.value, 10))}
                className="w-full accent-mi-ink cursor-pointer"
              />
            </div>

            {/* Deterministic Seed */}
            <div className="pt-4 border-t border-mi-rule space-y-3">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-mi-muted uppercase">PRNG Seed</span>
                <span className="text-mi-ink font-semibold">seed = {seed}</span>
              </div>
              <button
                type="button"
                onClick={handleNextSeed}
                className="w-full py-2 bg-mi-canvas border border-mi-rule text-xs font-mono text-mi-ink hover:border-mi-rule-strong transition-colors"
              >
                Use another seed (+1)
              </button>
            </div>

            {/* Computed Evidence Metrics (Only Truthful Computed Values) */}
            <div className="pt-4 border-t border-mi-rule space-y-3 font-mono text-xs">
              <span className="text-mi-muted uppercase tracking-wider block text-[10px]">
                Computed Evidence (Current State)
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-mi-canvas border border-mi-rule">
                  <span className="text-mi-muted block text-[10px] uppercase">Mean Output</span>
                  <span className="text-mi-ink font-medium text-sm">
                    {currentResult.mean.toFixed(4)}
                  </span>
                </div>
                <div className="p-3 bg-mi-canvas border border-mi-rule">
                  <span className="text-mi-muted block text-[10px] uppercase">Sample Variance</span>
                  <span className="text-mi-ink font-medium text-sm">
                    {currentResult.variance.toFixed(4)}
                  </span>
                </div>
              </div>
              <div className="p-3 bg-mi-canvas border border-mi-rule flex justify-between items-center">
                <span className="text-mi-muted text-[10px] uppercase">P(Terminal &gt; 0)</span>
                <span className="text-mi-ink font-medium">
                  {(currentResult.probAboveZero * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* Visual Model Canvas (Right 8 Cols) */}
          <div className="lg:col-span-8 bg-mi-paper border border-mi-rule p-6 sm:p-10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono text-xs text-mi-muted pb-3 border-b border-mi-rule">
              <span>SHARED AXIS ENSEMBLE GEOMETRY</span>
              <span>
                {hasPerturbation
                  ? 'COMPARING: BASELINE (BLUE) VS PERTURBED (RED)'
                  : 'ACTIVE BASELINE MODEL STATE'}
              </span>
            </div>

            {/* SVG Trajectory Canvas */}
            <div className="relative w-full aspect-[16/10] sm:aspect-[2/1] bg-mi-white border border-mi-rule">
              <svg viewBox="0 0 540 260" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                {/* Axis lines */}
                <line x1="30" y1="20" x2="30" y2="240" stroke="#CFD4D0" strokeWidth="1" />
                <line x1="30" y1="130" x2="470" y2="130" stroke="#CFD4D0" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="470" y1="20" x2="470" y2="240" stroke="#CFD4D0" strokeWidth="1" />

                {/* Baseline Paths */}
                {baselineSvgPaths.map((d, idx) => (
                  <path
                    key={`base-${idx}`}
                    d={d}
                    fill="none"
                    stroke="#315F7A"
                    strokeWidth={idx === 0 ? '1.8' : '1'}
                    strokeOpacity={hasPerturbation ? '0.4' : idx === 0 ? '0.9' : '0.45'}
                  />
                ))}

                {/* Baseline Endpoints */}
                {baselineResult.endpoints.map((val, idx) => {
                  const y = 130 - val * 78;
                  return (
                    <circle
                      key={`b-pt-${idx}`}
                      cx="470"
                      cy={y}
                      r="2"
                      fill="#315F7A"
                      fillOpacity={hasPerturbation ? '0.4' : '0.8'}
                    />
                  );
                })}

                {/* Perturbed Paths (When changed) */}
                {hasPerturbation &&
                  currentSvgPaths.map((d, idx) => (
                    <path
                      key={`curr-${idx}`}
                      d={d}
                      fill="none"
                      stroke="#983E36"
                      strokeWidth={idx === 0 ? '1.8' : '1'}
                      strokeOpacity={idx === 0 ? '0.95' : '0.55'}
                      strokeDasharray="4 2"
                    />
                  ))}

                {/* Perturbed Endpoints */}
                {hasPerturbation &&
                  currentResult.endpoints.map((val, idx) => {
                    const y = 130 - val * 78;
                    return (
                      <circle
                        key={`c-pt-${idx}`}
                        cx="470"
                        cy={y}
                        r="2.5"
                        fill="#983E36"
                      />
                    );
                  })}
              </svg>
            </div>

            {/* Shared Legend and Controls */}
            <div className="flex flex-wrap justify-between items-center gap-4 pt-2 font-mono text-xs">
              <div className="flex items-center gap-6">
                <span className="flex items-center gap-2 text-mi-data-blue font-medium">
                  <span className="w-3 h-0.5 bg-mi-data-blue inline-block"></span>
                  Baseline (σ = {baselineSigma.toFixed(2)}, μ = {baselineMu.toFixed(2)})
                </span>
                {hasPerturbation && (
                  <span className="flex items-center gap-2 text-mi-data-red font-medium">
                    <span className="w-3 h-0.5 border-b border-dashed border-mi-data-red inline-block"></span>
                    Perturbed (σ = {currentSigma.toFixed(2)}, μ = {currentMu.toFixed(2)})
                  </span>
                )}
              </div>

              <span className="text-mi-muted">
                Steps: 50 | dt: 0.02
              </span>
            </div>

            {/* Analytical Comparison Summary Bar */}
            {hasPerturbation && (
              <div className="p-4 bg-mi-canvas border border-mi-rule flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs">
                <div>
                  <span className="text-mi-ink font-semibold block">Causal Delta Detected</span>
                  <span className="text-mi-muted">
                    Variance shift: {(currentResult.variance - baselineResult.variance >= 0 ? '+' : '')}
                    {(currentResult.variance - baselineResult.variance).toFixed(4)}
                  </span>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setBaselineMu(currentMu);
                      setBaselineSigma(currentSigma);
                    }}
                    className="px-3 py-1.5 bg-mi-ink text-mi-paper text-[11px] font-sans hover:bg-mi-ink-2"
                  >
                    Commit as new baseline
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-3 py-1.5 border border-mi-rule bg-mi-white text-[11px] font-sans hover:border-mi-rule-strong"
                  >
                    Revert to baseline
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Ending Section */}
      <section className="border-t border-mi-rule bg-mi-paper py-16 px-6 text-center">
        <div className="max-w-2xl mx-auto space-y-4">
          <h3 className="font-sans font-medium text-2xl text-mi-ink">
            Ready to simulate your own system?
          </h3>
          <p className="text-mi-ink-2 text-sm">
            Sign in to create full production simulations across all five mathematical engines with up to 1,000,000 iterations.
          </p>
          <div className="pt-2">
            <Link
              to="/signup"
              className="inline-block bg-mi-ink text-mi-paper font-sans text-sm font-medium px-6 py-3 hover:bg-mi-ink-2 transition-colors"
            >
              Create an account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WorkbenchPage;
