import React, { useState } from 'react';

export const ScenarioCompare: React.FC = () => {
  const [intervention, setIntervention] = useState<number>(0.25);

  // Baseline values (fixed)
  const baselineCost = 100;
  const baselineRisk = 0.32;
  const baselineThroughput = 450;

  // Intervened values based on slider
  const deltaCost = Math.round(intervention * 40);
  const changedCost = baselineCost + deltaCost;
  const deltaRisk = -(intervention * 0.18);
  const changedRisk = Math.max(0.05, baselineRisk + deltaRisk);
  const deltaThroughput = Math.round(intervention * 120);
  const changedThroughput = baselineThroughput + deltaThroughput;

  return (
    <section className="w-full py-20 md:py-28 px-6 md:px-12 lg:px-16 max-w-[1720px] mx-auto border-t border-mi-rule">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="text-[12px] font-mono text-mi-muted uppercase tracking-wider">
            Chapter 05 — Compare
          </div>
          <h2 className="text-[36px] sm:text-[44px] md:text-[52px] font-medium text-mi-ink tracking-tight mt-2 leading-[1.08]">
            Change one thing. Read the difference.
          </h2>
          <p className="mt-3 text-[16px] md:text-[17px] text-mi-text max-w-2xl">
            Compare baseline and perturbed assumptions in a single shared coordinate field. The delta highlights consequences directly on the evidence.
          </p>
        </div>

        {/* Input slider control */}
        <div className="w-full md:w-72 p-4 bg-mi-paper border border-mi-rule space-y-2">
          <div className="flex justify-between items-center text-xs font-mono">
            <label htmlFor="intervene-slider" className="text-mi-ink font-medium">Capacity Buffer (Δu):</label>
            <span className="text-mi-change font-bold">+{(intervention * 100).toFixed(0)}%</span>
          </div>
          <input
            id="intervene-slider"
            type="range"
            min="0"
            max="0.5"
            step="0.05"
            value={intervention}
            onChange={(e) => setIntervention(parseFloat(e.target.value))}
            className="w-full accent-mi-ink"
            aria-label="Intervention capacity buffer delta"
          />
        </div>
      </div>

      {/* Shared Coordinate Comparison Canvas */}
      <div className="mt-10 border border-mi-rule bg-mi-paper p-6 md:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Visual: Overlaid Curves in Shared Coordinates */}
          <div className="lg:col-span-8 border border-mi-rule bg-mi-surface-soft p-6 min-h-[380px] flex items-center justify-center relative">
            <svg className="w-full h-full max-h-[340px]" viewBox="0 0 700 340">
              <line x1="60" y1="280" x2="640" y2="280" stroke="#78807C" strokeWidth="1.5" />
              <line x1="60" y1="40" x2="60" y2="280" stroke="#78807C" strokeWidth="1.5" />

              {/* Baseline Curve (Quieter gray) */}
              <path
                d="M 60 220 Q 250 200 400 160 T 640 140"
                fill="none"
                stroke="#78807C"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
              <circle cx="400" cy="160" r="4" fill="#78807C" />
              <text x="415" y="165" font-family="'ABC Diatype Semi Mono', monospace" fontSize="11" fill="#78807C">Baseline (u₀)</text>

              {/* Intervened Changed Curve (Receives Change Signal #E35A35) */}
              <path
                d={`M 60 220 Q 250 ${200 - intervention * 80} 400 ${160 - intervention * 120} T 640 ${140 - intervention * 140}`}
                fill="none"
                stroke="#E35A35"
                strokeWidth="3"
              />
              <circle cx="400" cy={160 - intervention * 120} r="5" fill="#E35A35" />
              <text x="415" y={155 - intervention * 120} font-family="'ABC Diatype Semi Mono', monospace" fontSize="11" fill="#E35A35" fontWeight="bold">
                Intervention (u₀ + Δu)
              </text>

              {/* Difference Delta Bracket */}
              <line
                x1="400"
                y1="160"
                x2="400"
                y2={160 - intervention * 120}
                stroke="#E35A35"
                strokeWidth="1.5"
                strokeDasharray="2 2"
              />
              <text x="340" y={160 - intervention * 60} font-family="'ABC Diatype Semi Mono', monospace" fontSize="11" fill="#E35A35" fontWeight="bold">
                +{(intervention * 120).toFixed(0)} pts
              </text>
            </svg>
          </div>

          {/* Direct Comparative Delta Table */}
          <div className="lg:col-span-4 space-y-4">
            <div className="text-xs font-mono text-mi-muted uppercase">Comparison Delta Summary</div>
            <table className="mi-table text-xs font-mono">
              <thead>
                <tr>
                  <th>METRIC</th>
                  <th>BASE</th>
                  <th>CHANGED</th>
                  <th>DELTA</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-sans font-medium text-mi-ink">Cost ($k)</td>
                  <td className="text-mi-muted">{baselineCost}</td>
                  <td className="text-mi-ink font-semibold">{changedCost}</td>
                  <td className="text-mi-danger">+{deltaCost}</td>
                </tr>
                <tr>
                  <td className="font-sans font-medium text-mi-ink">Failure Risk</td>
                  <td className="text-mi-muted">{(baselineRisk * 100).toFixed(0)}%</td>
                  <td className="text-mi-ink font-semibold">{(changedRisk * 100).toFixed(0)}%</td>
                  <td className="text-mi-success">{(deltaRisk * 100).toFixed(1)}%</td>
                </tr>
                <tr>
                  <td className="font-sans font-medium text-mi-ink">Throughput</td>
                  <td className="text-mi-muted">{baselineThroughput}</td>
                  <td className="text-mi-ink font-semibold">{changedThroughput}</td>
                  <td className="text-mi-change">+{deltaThroughput}</td>
                </tr>
              </tbody>
            </table>

            <div className="p-3 bg-mi-surface-soft border border-mi-rule text-xs text-mi-text leading-relaxed">
              <strong>Analytical Trade-off:</strong> Increasing capacity buffer reduces failure risk by {(Math.abs(deltaRisk) * 100).toFixed(1)}% while increasing unit cost by ${deltaCost}k.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
