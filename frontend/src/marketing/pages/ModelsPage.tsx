import { useState } from "react"
import { KaTeXBlock } from "../../math/KaTeXBlock"

interface EngineSpec {
  id: string
  code: string
  name: string
  category: string
  equation: string
  secondaryEquation?: string
  parameters: string[]
  outputs: string[]
  summary: string
  svgType: "diffusion" | "payoff" | "garch" | "topology"
}

const ENGINES: EngineSpec[] = [
  {
    id: "monte-carlo",
    code: "ENG 01",
    name: "Monte Carlo Diffusion",
    category: "STOCHASTIC SYSTEMS",
    equation: "dx_t = \\mu x_t dt + \\sigma x_t dW_t",
    secondaryEquation: "x_{k+1} = x_k (1 + \\mu \\Delta t + \\sigma \\sqrt{\\Delta t} Z_k)",
    parameters: [
      "Initial State x0",
      "Drift Coefficient mu",
      "Volatility Scale sigma",
      "Sample Trajectories N",
      "Discrete Step Delta t"
    ],
    outputs: [
      "Path Realization Ensemble",
      "Terminal Quantile Distribution",
      "Value at Risk Metric"
    ],
    summary: "Computes path ensembles through stochastic numerical integration under geometric Brownian motion",
    svgType: "diffusion"
  },
  {
    id: "game-theory",
    code: "ENG 02",
    name: "Strategic Equilibria",
    category: "STRATEGIC INTERACTIONS",
    equation: "u_i(s_i^*, s_{-i}^*) \\ge u_i(s_i, s_{-i}^*) \\quad \\forall s_i \\in S_i",
    secondaryEquation: "\\mathbf{A} = \\begin{bmatrix} (3, 3) & (0, 5) \\\\ (5, 0) & (1, 1) \\end{bmatrix}",
    parameters: [
      "Payoff Tensor Matrix A",
      "Player Action Spaces",
      "Discount Parameter delta",
      "Information Precision"
    ],
    outputs: [
      "Pure Nash Equilibrium",
      "Mixed Strategy Probability Vector",
      "Pareto Optimal Frontier"
    ],
    summary: "Calculates deterministic equilibrium states and minimax value bounds across payoff tensors",
    svgType: "payoff"
  },
  {
    id: "market",
    code: "ENG 03",
    name: "Market Dynamics GARCH",
    category: "TIME SERIES DYNAMICS",
    equation: "\\sigma_t^2 = \\omega + \\alpha \\epsilon_{t-1}^2 + \\beta \\sigma_{t-1}^2",
    secondaryEquation: "x_t = \\rho x_{t-1} + \\sigma_t \\epsilon_t \\quad |\\rho| < 1",
    parameters: [
      "Autoregressive Factor rho",
      "Base Variance omega",
      "Shock Sensitivity alpha",
      "Volatility Persistence beta"
    ],
    outputs: [
      "Conditional Variance Path",
      "Stationary Regimes",
      "Tail Kurtosis Quantification"
    ],
    summary: "Evaluates volatility clustering and autoregressive persistence under conditional heteroskedasticity",
    svgType: "garch"
  },
  {
    id: "conflict",
    code: "ENG 04",
    name: "Agent Interaction Topology",
    category: "NETWORK DYNAMICS",
    equation: "\\dot{\\mathbf{x}}_i = \\sum_{j \\in \\mathcal{N}_i} A_{ij}(\\mathbf{x}_j - \\mathbf{x}_i) + \\mathbf{F}_{ext}",
    secondaryEquation: "\\Phi = \\frac{1}{N} \\left| \\sum_{j=1}^N \\frac{\\mathbf{v}_j}{\\|\\mathbf{v}_j\\|} \\right|",
    parameters: [
      "Population Size N",
      "Interaction Radius r",
      "Alignment Factor gamma",
      "Boundary Conditions"
    ],
    outputs: [
      "Coordinate Phase Portrait",
      "Global Order Parameter",
      "Bifurcation Threshold"
    ],
    summary: "Simulates continuous coordinate trajectories and collective order emergence in decentralized networks",
    svgType: "topology"
  }
]

function PreviewDiagram({ type }: { type: EngineSpec["svgType"] }) {
  if (type === "diffusion") {
    return (
      <svg viewBox="0 0 600 240" className="w-full h-full" fill="none">
        <path d="M 40 120 C 140 120 220 90 320 60 C 420 30 500 40 560 30" stroke="#2D5BFF" strokeWidth="2" />
        <path d="M 40 120 C 140 115 240 110 340 100 C 440 90 500 85 560 80" stroke="#ECEFF5" strokeWidth="1" strokeOpacity="0.7" />
        <path d="M 40 120 C 140 125 240 130 340 145 C 440 160 500 170 560 180" stroke="#ECEFF5" strokeWidth="1" strokeOpacity="0.7" />
        <path d="M 40 120 C 140 135 240 160 340 180 C 440 200 500 210 560 215" stroke="#ECEFF5" strokeWidth="1" strokeOpacity="0.4" strokeDasharray="4 4" />
        <path d="M 40 120 C 140 105 240 70 340 50 C 440 30 500 20 560 15" stroke="#ECEFF5" strokeWidth="1" strokeOpacity="0.4" strokeDasharray="4 4" />
        <line x1="40" y1="20" x2="40" y2="220" stroke="white" strokeOpacity="0.15" />
        <line x1="40" y1="220" x2="560" y2="220" stroke="white" strokeOpacity="0.15" />
      </svg>
    )
  }

  if (type === "payoff") {
    return (
      <svg viewBox="0 0 600 240" className="w-full h-full" fill="none">
        <polygon points="120,40 480,60 420,200 80,180" stroke="#ECEFF5" strokeWidth="1" strokeOpacity="0.4" fill="rgba(45,91,255,0.06)" />
        <circle cx="300" cy="125" r="5" fill="#2D5BFF" />
        <line x1="300" y1="40" x2="300" y2="200" stroke="#2D5BFF" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.6" />
        <line x1="80" y1="125" x2="480" y2="125" stroke="#2D5BFF" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.6" />
        <text x="315" y="120" fill="#2D5BFF" fontSize="10" fontFamily="monospace">NASH SADDLE POINT</text>
      </svg>
    )
  }

  if (type === "garch") {
    return (
      <svg viewBox="0 0 600 240" className="w-full h-full" fill="none">
        <path d="M 40 120 Q 80 80 120 120 T 200 120 T 280 40 T 360 190 T 440 90 T 520 130 T 560 120" stroke="#ECEFF5" strokeWidth="1.5" />
        <path d="M 40 70 Q 160 65 240 40 T 360 25 T 480 60 T 560 65" stroke="#2D5BFF" strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.8" />
        <path d="M 40 170 Q 160 175 240 200 T 360 215 T 480 180 T 560 175" stroke="#2D5BFF" strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.8" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 600 240" className="w-full h-full" fill="none">
      <circle cx="160" cy="110" r="30" stroke="#ECEFF5" strokeWidth="1" strokeOpacity="0.3" />
      <circle cx="300" cy="80" r="45" stroke="#2D5BFF" strokeWidth="1.5" />
      <circle cx="440" cy="140" r="35" stroke="#ECEFF5" strokeWidth="1" strokeOpacity="0.3" />
      <line x1="185" y1="100" x2="260" y2="85" stroke="#ECEFF5" strokeWidth="1" strokeDasharray="2 2" strokeOpacity="0.5" />
      <line x1="340" y1="95" x2="410" y2="125" stroke="#2D5BFF" strokeWidth="1.5" />
      <line x1="180" y1="130" x2="410" y2="150" stroke="#ECEFF5" strokeWidth="1" strokeOpacity="0.2" />
    </svg>
  )
}

export function ModelsPage() {
  const [selectedId, setSelectedId] = useState("monte-carlo")
  const activeEngine = ENGINES.find(e => e.id === selectedId) || ENGINES[0]

  return (
    <main className="min-h-[100svh] bg-[#07080B] text-[#ECEFF5] selection:bg-[#2D5BFF] selection:text-white">
      {/* Top Architectural Navigation */}
      <header className="fixed top-0 inset-x-0 z-50 h-16 border-b border-white/10 bg-[#07080B]/80 backdrop-blur-md px-6 flex justify-between items-center">
        <a href="/" className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#ECEFF5] font-semibold">
          MATHINTELLECT
        </a>

        <nav className="flex items-center gap-8 font-mono text-[10px] uppercase tracking-[0.12em] text-[#5F6575]">
          <a href="/models" className="text-[#ECEFF5] transition-colors">Models</a>
          <a href="/method" className="hover:text-[#ECEFF5] transition-colors">Method</a>
          <a
            href="/login"
            className="text-[#ECEFF5] border border-white/20 px-3.5 py-1.5 hover:border-white transition-colors"
          >
            Access
          </a>
        </nav>
      </header>

      {/* Main Content Area */}
      <div className="pt-28 pb-20 px-[5vw] max-w-7xl mx-auto">
        {/* Header Block */}
        <div className="mb-12 border-b border-white/10 pb-8">
          <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#5F6575] block mb-2">
            SIMULATION ENGINE DIRECTORY
          </span>
          <h1 className="font-['Space_Grotesk',sans-serif] text-[clamp(2.5rem,5vw,4.5rem)] font-medium leading-[0.9] tracking-[-0.035em] uppercase">
            Model Atlas
          </h1>
          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.08em] text-[#5F6575] max-w-2xl">
            Mathematical specifications and parameter vectors for four simulation engines
          </p>
        </div>

        {/* Two-Column Interactive Model Atlas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Vertical Engine Directory */}
          <div className="lg:col-span-4 space-y-3">
            {ENGINES.map(engine => {
              const isSelected = engine.id === selectedId
              return (
                <button
                  key={engine.id}
                  onClick={() => setSelectedId(engine.id)}
                  className={`w-full text-left p-5 rounded-xl border transition-all duration-200 ${
                    isSelected
                      ? "bg-[#0E1015] border-white/40 shadow-[inset_0_2px_4px_rgba(0,0,0,0.7),0_1px_0_rgba(255,255,255,0.04)]"
                      : "bg-[#07080B] border-white/10 hover:border-white/20 hover:bg-[#0E1015]/40"
                  }`}
                >
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#5F6575]">
                      {engine.code}
                    </span>
                    <span className={`font-mono text-[9px] uppercase tracking-[0.14em] ${isSelected ? "text-[#2D5BFF]" : "text-transparent"}`}>
                      ACTIVE
                    </span>
                  </div>
                  <h2 className="font-['Space_Grotesk',sans-serif] text-lg font-medium tracking-tight text-[#ECEFF5]">
                    {engine.name}
                  </h2>
                  <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-[#5F6575] block mt-1">
                    {engine.category}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Right Column: Persistent Live Manifold Preview Stage */}
          <div className="lg:col-span-8 bg-[#0E1015] border border-white/10 rounded-xl p-8 shadow-[inset_0_2px_4px_rgba(0,0,0,0.7),0_1px_0_rgba(255,255,255,0.04)]">
            
            {/* Stage Header */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-6 border-b border-white/10">
              <div>
                <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#2D5BFF] block">
                  {activeEngine.category}
                </span>
                <h3 className="font-['Space_Grotesk',sans-serif] text-2xl font-medium tracking-tight text-[#ECEFF5] mt-1">
                  {activeEngine.name}
                </h3>
              </div>

              {/* Fork Action Button */}
              <a
                href={`/app/simulations/new?engine=${activeEngine.id}`}
                className="group inline-flex items-center gap-3 bg-[#ECEFF5] text-[#07080B] px-5 py-3 font-mono text-[10px] uppercase tracking-[0.12em] font-medium hover:bg-white transition-colors self-start sm:self-auto"
              >
                <span>FORK ENGINE CONFIGURATION</span>
                <span className="group-hover:translate-x-0.5 transition-transform duration-150">➔</span>
              </a>
            </div>

            {/* Summary */}
            <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.08em] text-[#ECEFF5]/90">
              {activeEngine.summary}
            </p>

            {/* Live KaTeX Equation Plate */}
            <div className="mt-6 p-5 bg-[#07080B] border border-white/10 rounded-lg">
              <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-[#5F6575] block mb-3">
                GOVERNING EQUATION
              </span>
              <div className="text-[#ECEFF5] overflow-x-auto text-sm sm:text-base py-1">
                <KaTeXBlock math={activeEngine.equation} />
              </div>
              {activeEngine.secondaryEquation && (
                <div className="text-[#ECEFF5]/80 overflow-x-auto text-xs sm:text-sm pt-3 mt-3 border-t border-white/5">
                  <KaTeXBlock math={activeEngine.secondaryEquation} />
                </div>
              )}
            </div>

            {/* Simulation Phase Field Preview */}
            <div className="mt-6">
              <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-[#5F6575] block mb-2">
                TRAJECTORY SIMULATION FIELD
              </span>
              <div className="w-full h-44 bg-[#07080B] border border-white/10 rounded-lg flex items-center justify-center p-4">
                <PreviewDiagram type={activeEngine.svgType} />
              </div>
            </div>

            {/* Parameters & Outputs Grid */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-white/10">
              <div>
                <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-[#5F6575] block mb-3">
                  INPUT PARAMETER VECTOR
                </span>
                <ul className="space-y-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-[#ECEFF5]/80">
                  {activeEngine.parameters.map((param, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-[#2D5BFF]" />
                      <span>{param}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-[#5F6575] block mb-3">
                  COMPUTATIONAL OUTPUTS
                </span>
                <ul className="space-y-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-[#ECEFF5]/80">
                  {activeEngine.outputs.map((out, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-white/40" />
                      <span>{out}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>

        </div>
      </div>
    </main>
  )
}

export default ModelsPage
