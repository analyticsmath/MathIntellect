import { KaTeXBlock } from "../../math/KaTeXBlock"

export function MethodPage() {
  const sections = [
    { id: "section-01", num: "01", title: "Numerical Discretization" },
    { id: "section-02", num: "02", title: "Fokker Planck Diffusion" },
    { id: "section-03", num: "03", title: "Strategic Equilibria" },
    { id: "section-04", num: "04", title: "Empirical Quantile Metric" },
    { id: "section-05", num: "05", title: "Operational AI Boundaries" }
  ]

  return (
    <main className="min-h-[100svh] bg-[#07080B] text-[#ECEFF5] selection:bg-[#2D5BFF] selection:text-white">
      {/* Architectural Navigation Header */}
      <header className="fixed top-0 inset-x-0 z-50 h-16 border-b border-white/10 bg-[#07080B]/80 backdrop-blur-md px-6 flex justify-between items-center">
        <a href="/" className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#ECEFF5] font-semibold">
          MATHINTELLECT
        </a>

        <nav className="flex items-center gap-8 font-mono text-[10px] uppercase tracking-[0.12em] text-[#5F6575]">
          <a href="/models" className="hover:text-[#ECEFF5] transition-colors">Models</a>
          <a href="/method" className="text-[#ECEFF5] transition-colors">Method</a>
          <a
            href="/login"
            className="text-[#ECEFF5] border border-white/20 px-3.5 py-1.5 hover:border-white transition-colors"
          >
            Access
          </a>
        </nav>
      </header>

      {/* Main Container */}
      <div className="pt-28 pb-24 px-[5vw] max-w-7xl mx-auto">
        {/* Paper Header Dossier */}
        <div className="border-b border-white/10 pb-10 mb-14">
          <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#2D5BFF] block mb-2">
            RESEARCH PUBLICATION DOSSIER
          </span>
          <h1 className="font-['Space_Grotesk',sans-serif] text-[clamp(2.5rem,5vw,4.5rem)] font-medium leading-[0.9] tracking-[-0.035em] uppercase">
            The Method
          </h1>
          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.08em] text-[#5F6575] max-w-2xl">
            Mathematical doctrine and epistemic foundations governing deterministic simulation
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-6 font-mono text-[9px] uppercase tracking-[0.12em] text-[#5F6575]">
            <span>DOCUMENT VERSION 2.4</span>
            <span>SOLVER KERNEL C99/WASM</span>
            <span>CONVERGENCE TOLERANCE 1E-8</span>
          </div>
        </div>

        {/* Academic Research Paper Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Sticky Analytical Left Navigation */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-24 space-y-4">
            <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-[#5F6575] block mb-2">
              SECTION DIRECTORY
            </span>
            <nav className="space-y-1">
              {sections.map(sec => (
                <a
                  key={sec.id}
                  href={`#${sec.id}`}
                  className="block py-2 px-3 rounded-lg border border-transparent font-mono text-[10px] uppercase tracking-[0.08em] text-[#5F6575] hover:text-[#ECEFF5] hover:border-white/10 hover:bg-[#0E1015] transition-all"
                >
                  <span className="text-[#2D5BFF] mr-2">{sec.num}</span>
                  <span>{sec.title}</span>
                </a>
              ))}
            </nav>

            <div className="pt-6 border-t border-white/10 font-mono text-[8px] uppercase tracking-[0.1em] text-[#5F6575] space-y-1">
              <p>DETERMINISTIC KERNEL</p>
              <p className="text-[#ECEFF5]">ZERO GENERATIVE GUESSWORK</p>
            </div>
          </aside>

          {/* Right Column: Dense KaTeX Derivations & Analytical Flow */}
          <div className="lg:col-span-9 space-y-20">
            
            {/* Section 01 */}
            <section id="section-01" className="scroll-mt-24 space-y-6">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[9px] text-[#2D5BFF] uppercase tracking-[0.14em]">01</span>
                <span className="font-mono text-[9px] text-[#5F6575] uppercase tracking-[0.14em]">NUMERICAL DISCRETIZATION</span>
              </div>
              <h2 className="font-['Space_Grotesk',sans-serif] text-2xl sm:text-3xl font-medium tracking-tight uppercase text-[#ECEFF5]">
                Stochastic differential equation integration
              </h2>
              <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#ECEFF5]/80 leading-relaxed">
                Continuous physical state vectors evolve under Ito stochastic differential equations.
                Math Intellect computes discrete step realizations using the Euler Maruyama discretization scheme.
              </p>

              {/* KaTeX Derivation Plate */}
              <div className="p-6 bg-[#0E1015] border border-white/10 rounded-xl space-y-4 shadow-[inset_0_2px_4px_rgba(0,0,0,0.7),0_1px_0_rgba(255,255,255,0.04)]">
                <div className="text-center py-2 overflow-x-auto text-sm sm:text-base text-[#ECEFF5]">
                  <KaTeXBlock math="d\mathbf{x}_t = \mathbf{f}(\mathbf{x}_t, t) dt + \mathbf{G}(\mathbf{x}_t, t) d\mathbf{W}_t" />
                </div>
                <div className="text-center py-2 border-t border-white/5 overflow-x-auto text-xs sm:text-sm text-[#2D5BFF]">
                  <KaTeXBlock math="\mathbf{x}_{k+1} = \mathbf{x}_k + \mathbf{f}(\mathbf{x}_k, t_k) \Delta t + \mathbf{G}(\mathbf{x}_k, t_k) \sqrt{\Delta t} \mathbf{Z}_k \quad \mathbf{Z}_k \sim \mathcal{N}(\mathbf{0}, \mathbf{I})" />
                </div>
              </div>

              {/* Spatial Syntax Hierarchy Indentation */}
              <div className="space-y-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-[#5F6575] pt-2">
                <p className="text-[#ECEFF5]">State vector x spans n continuous dimensions</p>
                <p className="pl-[18px] text-[#ECEFF5]/80">Drift operator f defines deterministic deterministic momentum</p>
                <p className="pl-[36px] text-[#2D5BFF]">Diffusion tensor G maps Gaussian increments into correlated space</p>
              </div>
            </section>

            {/* Section 02 */}
            <section id="section-02" className="scroll-mt-24 space-y-6 pt-10 border-t border-white/10">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[9px] text-[#2D5BFF] uppercase tracking-[0.14em]">02</span>
                <span className="font-mono text-[9px] text-[#5F6575] uppercase tracking-[0.14em]">PROBABILITY EVOLUTION</span>
              </div>
              <h2 className="font-['Space_Grotesk',sans-serif] text-2xl sm:text-3xl font-medium tracking-tight uppercase text-[#ECEFF5]">
                Fokker Planck probability density transport
              </h2>
              <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#ECEFF5]/80 leading-relaxed">
                Individual sample paths display brownian variance yet the ensemble distribution transports deterministically.
                The time evolution of the probability density function obeys the partial differential transport equation.
              </p>

              <div className="p-6 bg-[#0E1015] border border-white/10 rounded-xl space-y-4 shadow-[inset_0_2px_4px_rgba(0,0,0,0.7),0_1px_0_rgba(255,255,255,0.04)]">
                <div className="text-center py-2 overflow-x-auto text-sm sm:text-base text-[#ECEFF5]">
                  <KaTeXBlock math="\frac{\partial p(\mathbf{x}, t)}{\partial t} = -\sum_{i=1}^n \frac{\partial}{\partial x_i} \left[ f_i(\mathbf{x}, t) p(\mathbf{x}, t) \right] + \frac{1}{2} \sum_{i=1}^n \sum_{j=1}^n \frac{\partial^2}{\partial x_i \partial x_j} \left[ D_{ij}(\mathbf{x}, t) p(\mathbf{x}, t) \right]" />
                </div>
                <div className="text-center py-2 border-t border-white/5 overflow-x-auto text-xs sm:text-sm text-[#2D5BFF]">
                  <KaTeXBlock math="D_{ij} = \sum_k G_{ik} G_{jk} = \left( \mathbf{G}\mathbf{G}^T \right)_{ij}" />
                </div>
              </div>

              {/* Inline SVG Vector Phase Portrait */}
              <div className="mt-4 p-4 bg-[#07080B] border border-white/10 rounded-lg">
                <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-[#5F6575] block mb-2">
                  DENSITY CONTOUR PHASE PROJECTION
                </span>
                <svg viewBox="0 0 700 160" className="w-full h-auto" fill="none">
                  <ellipse cx="350" cy="80" rx="280" ry="60" stroke="#ECEFF5" strokeWidth="0.75" strokeOpacity="0.2" />
                  <ellipse cx="350" cy="80" rx="190" ry="40" stroke="#ECEFF5" strokeWidth="1" strokeOpacity="0.4" />
                  <ellipse cx="350" cy="80" rx="90" ry="20" stroke="#2D5BFF" strokeWidth="1.5" />
                  <circle cx="350" cy="80" r="3" fill="#2D5BFF" />
                  <line x1="70" y1="80" x2="630" y2="80" stroke="white" strokeOpacity="0.1" strokeDasharray="3 3" />
                  <line x1="350" y1="20" x2="350" y2="140" stroke="white" strokeOpacity="0.1" strokeDasharray="3 3" />
                </svg>
              </div>
            </section>

            {/* Section 03 */}
            <section id="section-03" className="scroll-mt-24 space-y-6 pt-10 border-t border-white/10">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[9px] text-[#2D5BFF] uppercase tracking-[0.14em]">03</span>
                <span className="font-mono text-[9px] text-[#5F6575] uppercase tracking-[0.14em]">EQUILIBRIUM RESOLUTION</span>
              </div>
              <h2 className="font-['Space_Grotesk',sans-serif] text-2xl sm:text-3xl font-medium tracking-tight uppercase text-[#ECEFF5]">
                Strategic game equilibria and saddle convergence
              </h2>
              <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#ECEFF5]/80 leading-relaxed">
                Strategic confrontations resolve via deterministic equilibrium points where no rational participant benefits by unilateral deviation.
                Zero sum zero deviation conditions converge to the saddle point value.
              </p>

              <div className="p-6 bg-[#0E1015] border border-white/10 rounded-xl space-y-4 shadow-[inset_0_2px_4px_rgba(0,0,0,0.7),0_1px_0_rgba(255,255,255,0.04)]">
                <div className="text-center py-2 overflow-x-auto text-sm sm:text-base text-[#ECEFF5]">
                  <KaTeXBlock math="\max_{p \in \Delta_1} \min_{q \in \Delta_2} p^T \mathbf{A} q = \min_{q \in \Delta_2} \max_{p \in \Delta_1} p^T \mathbf{A} q = v^*" />
                </div>
                <div className="text-center py-2 border-t border-white/5 overflow-x-auto text-xs sm:text-sm text-[#2D5BFF]">
                  <KaTeXBlock math="u_i(s_i^*, s_{-i}^*) \ge u_i(s_i, s_{-i}^*) \quad \forall s_i \in S_i" />
                </div>
              </div>

              <div className="space-y-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-[#5F6575] pt-2">
                <p className="text-[#ECEFF5]">Simplex delta represents valid probability distribution sets</p>
                <p className="pl-[18px] text-[#ECEFF5]/80">Payoff matrix A determines state utilities across players</p>
                <p className="pl-[36px] text-[#2D5BFF]">Value v locks into unique deterministic saddle coordinate</p>
              </div>
            </section>

            {/* Section 04 */}
            <section id="section-04" className="scroll-mt-24 space-y-6 pt-10 border-t border-white/10">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[9px] text-[#2D5BFF] uppercase tracking-[0.14em]">04</span>
                <span className="font-mono text-[9px] text-[#5F6575] uppercase tracking-[0.14em]">QUANTILE ARCHITECTURE</span>
              </div>
              <h2 className="font-['Space_Grotesk',sans-serif] text-2xl sm:text-3xl font-medium tracking-tight uppercase text-[#ECEFF5]">
                Empirical quantile structures and tail probabilities
              </h2>
              <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#ECEFF5]/80 leading-relaxed">
                Risk evaluation rejects singular summary estimates.
                Math Intellect constructs the complete quantile profile from the computed sample realization ensemble.
              </p>

              <div className="p-6 bg-[#0E1015] border border-white/10 rounded-xl space-y-4 shadow-[inset_0_2px_4px_rgba(0,0,0,0.7),0_1px_0_rgba(255,255,255,0.04)]">
                <div className="text-center py-2 overflow-x-auto text-sm sm:text-base text-[#ECEFF5]">
                  <KaTeXBlock math="q_\alpha = \inf \left\{ x \in \mathbb{R} : F_N(x) \ge \alpha \right\} \quad \alpha \in (0, 1)" />
                </div>
                <div className="text-center py-2 border-t border-white/5 overflow-x-auto text-xs sm:text-sm text-[#2D5BFF]">
                  <KaTeXBlock math="\text{VaR}_\alpha = -\inf \left\{ x : P(X \le x) \ge 1 - \alpha \right\}" />
                </div>
              </div>

              <div className="space-y-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-[#5F6575] pt-2">
                <p className="text-[#ECEFF5]">Quantile alpha guarantees non parametric distribution tracking</p>
                <p className="pl-[18px] text-[#ECEFF5]/80">Ensemble empirical CDF FN converges at root N rate</p>
                <p className="pl-[36px] text-[#2D5BFF]">Extremal percentiles isolate asymptotic tail hazard</p>
              </div>
            </section>

            {/* Section 05 */}
            <section id="section-05" className="scroll-mt-24 space-y-6 pt-10 border-t border-white/10">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[9px] text-[#2D5BFF] uppercase tracking-[0.14em]">05</span>
                <span className="font-mono text-[9px] text-[#5F6575] uppercase tracking-[0.14em]">GOVERNANCE MANDATE</span>
              </div>
              <h2 className="font-['Space_Grotesk',sans-serif] text-2xl sm:text-3xl font-medium tracking-tight uppercase text-[#ECEFF5]">
                Operational boundaries of artificial intelligence
              </h2>
              <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#ECEFF5]/80 leading-relaxed">
                Artificial intelligence serves exclusively as a translation interface for human analysts.
                Neural inference never performs simulation math or fabricates statistical proof.
              </p>

              <div className="p-6 bg-[#0E1015] border border-white/10 rounded-xl space-y-4 font-mono text-[11px] uppercase tracking-[0.08em]">
                <div className="flex items-center gap-3 text-[#ECEFF5]">
                  <span className="text-[#2D5BFF]">ACTIVE</span>
                  <span>DETERMINISTIC VERIFICATION PROTOCOL</span>
                </div>
                <ul className="space-y-2.5 text-[#5F6575] pt-2">
                  <li className="flex items-start gap-2">
                    <span className="text-[#ECEFF5]">RULE 01</span>
                    <span className="text-[#ECEFF5]/80">Deterministic equations calculate every numerical trajectory</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#ECEFF5]">RULE 02</span>
                    <span className="text-[#ECEFF5]/80">Language models explain parameter bounds without modifying values</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#ECEFF5]">RULE 03</span>
                    <span className="text-[#ECEFF5]/80">Identical input seeds produce identical numerical history</span>
                  </li>
                </ul>
              </div>
            </section>

          </div>

        </div>
      </div>
    </main>
  )
}

export default MethodPage
