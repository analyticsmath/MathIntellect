import { DesktopLenisBridge } from "./components/DesktopLenisBridge"
import { Movement01Axiom } from "./scenes/Movement01Axiom"
import { Movement02Stochastic } from "./scenes/Movement02Stochastic"
import { Movement03Manifold } from "./scenes/Movement03Manifold"
import { Movement04Equilibrium } from "./scenes/Movement04Equilibrium"
import { Movement05Resolution } from "./scenes/Movement05Resolution"

export function MarketingLayout() {
  return (
    <DesktopLenisBridge>
      <main className="bg-[#07080B] min-h-[100svh] relative selection:bg-[#2D5BFF] selection:text-white">
        
        {/* Persistent Architectural Top Navigation */}
        <header className="fixed top-0 inset-x-0 z-50 h-16 border-b border-white/10 bg-[#07080B]/80 backdrop-blur-md px-6 flex justify-between items-center">
          <a href="/" className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#ECEFF5] font-semibold">
            MATHINTELLECT
          </a>

          <nav className="flex items-center gap-8 font-mono text-[10px] uppercase tracking-[0.12em] text-[#5F6575]">
            <a href="/models" className="hover:text-[#ECEFF5] transition-colors">Models</a>
            <a href="/method" className="hover:text-[#ECEFF5] transition-colors">Method</a>
            <a
              href="/login"
              className="text-[#ECEFF5] border border-white/20 px-3.5 py-1.5 hover:border-white transition-colors"
            >
              Access
            </a>
          </nav>
        </header>

        {/* The 5 Scrollytelling Movements */}
        <Movement01Axiom />
        <Movement02Stochastic />
        <Movement03Manifold />
        <Movement04Equilibrium />
        <Movement05Resolution />

      </main>
    </DesktopLenisBridge>
  )
}
