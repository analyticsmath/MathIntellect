import React, { useState } from 'react';
import { MathExpression } from '../../math/MathExpression';

type ViewMode = 'paths' | 'density' | 'distribution' | 'tail' | 'explain';

export const EvidenceSequence: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('distribution');

  const views: { id: ViewMode; label: string; desc: string }[] = [
    { id: 'paths', label: '1. Raw Ensemble', desc: 'Simulated realization trajectories' },
    { id: 'density', label: '2. Density Field', desc: 'Continuous state-space probability density' },
    { id: 'distribution', label: '3. Terminal Distribution', desc: 'Empirical quantile distribution' },
    { id: 'tail', label: '4. Tail Risk Isolation', desc: 'Specific probability threshold region' },
    { id: 'explain', label: '5. Analytical Derivation', desc: 'Closed-form mathematical explanation' },
  ];

  return (
    <section className="w-full py-20 md:py-28 px-6 md:px-12 lg:px-16 max-w-[1720px] mx-auto border-t border-mi-rule">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="text-[12px] font-mono text-mi-muted uppercase tracking-wider">
            Chapter 04 — Evidence
          </div>
          <h2 className="text-[36px] sm:text-[44px] md:text-[52px] font-medium text-mi-ink tracking-tight mt-2 leading-[1.08]">
            From run to evidence.
          </h2>
          <p className="mt-3 text-[16px] md:text-[17px] text-mi-text max-w-2xl">
            A single simulation run unfolds into linked, inspectable mathematical representations without synthesizing false certainty.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex flex-wrap gap-1 p-1 bg-mi-surface-soft border border-mi-rule">
          {views.map((v) => (
            <button
              key={v.id}
              onClick={() => setViewMode(v.id)}
              className={`px-3 py-1.5 text-xs font-mono transition-all ${
                viewMode === v.id
                  ? 'bg-mi-ink text-mi-paper font-medium'
                  : 'text-mi-text hover:text-mi-ink'
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* Unified Multi-Representation Evidence Canvas */}
      <div className="mt-10 border border-mi-rule bg-mi-paper p-6 md:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Visual Representation */}
          <div className="lg:col-span-8 border border-mi-rule bg-mi-surface-soft p-6 min-h-[380px] flex items-center justify-center relative">
            <svg className="w-full h-full max-h-[340px]" viewBox="0 0 700 340">
              {/* Coordinate axis */}
              <line x1="60" y1="280" x2="640" y2="280" stroke="#78807C" strokeWidth="1.5" />
              <line x1="60" y1="40" x2="60" y2="280" stroke="#78807C" strokeWidth="1.5" />

              {/* Grid lines */}
              <line x1="60" y1="200" x2="640" y2="200" stroke="#D8DDDA" strokeWidth="0.8" strokeDasharray="3 3" />
              <line x1="60" y1="120" x2="640" y2="120" stroke="#D8DDDA" strokeWidth="0.8" strokeDasharray="3 3" />

              {/* VIEW: Paths */}
              {viewMode === 'paths' && (
                <g>
                  {[
                    'M 60 160 Q 200 120 350 140 T 640 100',
                    'M 60 160 Q 200 200 350 180 T 640 220',
                    'M 60 160 Q 200 150 350 110 T 640 70',
                    'M 60 160 Q 200 170 350 210 T 640 250',
                    'M 60 160 Q 200 140 350 160 T 640 160',
                    'M 60 160 Q 200 180 350 150 T 640 130',
                  ].map((d, i) => (
                    <path
                      key={i}
                      d={d}
                      fill="none"
                      stroke={i === 2 ? '#E35A35' : i === 0 ? '#2457E6' : '#505753'}
                      strokeWidth={i < 2 ? 2.5 : 1.2}
                      opacity={i < 2 ? 1 : 0.4}
                    />
                  ))}
                </g>
              )}

              {/* VIEW: Density / Distribution */}
              {(viewMode === 'density' || viewMode === 'distribution') && (
                <g>
                  <path
                    d="M 60 280 C 200 280 280 260 350 80 C 420 260 500 280 640 280 Z"
                    fill="#111412"
                    fillOpacity="0.08"
                    stroke="#111412"
                    strokeWidth="2"
                  />
                  <line x1="350" y1="40" x2="350" y2="280" stroke="#E35A35" strokeWidth="1.5" strokeDasharray="4 4" />
                  <circle cx="350" cy="80" r="5" fill="#E35A35" />
                  <text x="360" y="75" font-family="'ABC Diatype Semi Mono', monospace" fontSize="12" fill="#E35A35">μ = 0.00 (Mode)</text>
                </g>
              )}

              {/* VIEW: Tail Risk */}
              {viewMode === 'tail' && (
                <g>
                  <path
                    d="M 60 280 C 200 280 280 260 350 80 C 420 260 500 280 640 280 Z"
                    fill="none"
                    stroke="#78807C"
                    strokeWidth="1.5"
                  />
                  {/* Highlighted Left Tail */}
                  <path
                    d="M 60 280 C 150 280 220 270 260 230 L 260 280 Z"
                    fill="#B64049"
                    fillOpacity="0.3"
                    stroke="#B64049"
                    strokeWidth="2"
                  />
                  <line x1="260" y1="180" x2="260" y2="280" stroke="#B64049" strokeWidth="1.5" strokeDasharray="3 3" />
                  <text x="140" y="250" font-family="'ABC Diatype Semi Mono', monospace" fontSize="12" fill="#B64049" fontWeight="bold">
                    Tail Risk: 5.0%
                  </text>
                </g>
              )}

              {/* VIEW: Mathematical Explanation */}
              {viewMode === 'explain' && (
                <g>
                  <path
                    d="M 60 280 C 200 280 280 260 350 80 C 420 260 500 280 640 280 Z"
                    fill="none"
                    stroke="#111412"
                    strokeWidth="2"
                  />
                  <line x1="220" y1="40" x2="220" y2="280" stroke="#2457E6" strokeWidth="1" strokeDasharray="2 2" />
                  <line x1="480" y1="40" x2="480" y2="280" stroke="#2457E6" strokeWidth="1" strokeDasharray="2 2" />
                  <text x="230" y="60" font-family="'ABC Diatype Semi Mono', monospace" fontSize="11" fill="#2457E6">[-1σ]</text>
                  <text x="490" y="60" font-family="'ABC Diatype Semi Mono', monospace" fontSize="11" fill="#2457E6">[+1σ]</text>
                  <text x="320" y="160" font-family="'STIX Two Math', serif" fontSize="15" fill="#111412" fontStyle="italic">68.27% of Mass</text>
                </g>
              )}

              {/* Axis labels */}
              <text x="60" y="305" font-family="'ABC Diatype Semi Mono', monospace" fontSize="11" fill="#78807C">-3σ</text>
              <text x="345" y="305" font-family="'ABC Diatype Semi Mono', monospace" fontSize="11" fill="#111412">0 (Mean)</text>
              <text x="625" y="305" font-family="'ABC Diatype Semi Mono', monospace" fontSize="11" fill="#78807C">+3σ</text>
            </svg>
          </div>

          {/* Right Column: Evidence Data Points & Formula Explanation */}
          <div className="lg:col-span-4 space-y-5">
            <div>
              <div className="text-xs font-mono text-mi-muted uppercase">Evidence Metadata</div>
              <div className="text-xl font-medium text-mi-ink mt-1">
                {views.find((v) => v.id === viewMode)?.label}
              </div>
              <p className="text-xs text-mi-text mt-1">
                {views.find((v) => v.id === viewMode)?.desc}
              </p>
            </div>

            <div className="p-4 border border-mi-rule bg-mi-surface-soft space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-mi-muted">TOTAL SAMPLES:</span>
                <span className="font-semibold text-mi-ink">10,000 runs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-mi-muted">STANDARD DEV (σ):</span>
                <span className="font-semibold text-mi-ink">0.350</span>
              </div>
              <div className="flex justify-between">
                <span className="text-mi-muted">CONFIDENCE INTERVAL:</span>
                <span className="font-semibold text-mi-change">[-0.686, +0.686]</span>
              </div>
            </div>

            <div className="pt-2 border-t border-mi-rule">
              <div className="text-xs font-mono text-mi-muted uppercase">Formula Derivation</div>
              <div className="mt-2 bg-mi-paper p-3 border border-mi-rule">
                <MathExpression tex="f(x) = \frac{1}{\sigma\sqrt{2\pi}} \exp\left(-\frac{(x - \mu)^2}{2\sigma^2}\right)" display={false} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
