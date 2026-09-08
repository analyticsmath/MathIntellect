export function Movement05Resolution() {
  return (
    <section className="relative bg-[#07080B] text-[#ECEFF5] py-[16svh] px-[5vw]">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
        
        {/* Monolithic Horizon Resolution Plane: Antonio Verdín Machined Seal */}
        <div className="w-full h-[40svh] max-w-5xl overflow-hidden bg-[#0E1015] border border-white/10 relative mb-12">
          <img
            src="/media/math/antonio-verdin-machined-seal.jpg"
            alt="Machined titanium precision calibration block"
            className="w-full h-full object-cover grayscale contrast-140 brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07080B] via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-6 left-6 font-mono text-[9px] uppercase tracking-[0.14em] text-[#5F6575]">
            SHA256 // LOCKED REPLAY DIGEST
          </div>
        </div>

        {/* Spatial Syntax Text Resolution */}
        <h2 className="font-sans text-[clamp(2rem,4.5vw,4.25rem)] font-medium leading-[0.92] tracking-[-0.035em] uppercase max-w-3xl">
          Identical seeds produce identical histories
        </h2>

        <div className="mt-6 space-y-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-[#5F6575] max-w-xl">
          <p className="text-[#ECEFF5]">Every simulation locks to a verifiable hash</p>
          <p>Enter the laboratory</p>
        </div>

        {/* Direct Action Ports */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-6">
          <a
            href="/app/simulations/new"
            className="bg-[#ECEFF5] text-[#07080B] font-mono text-[11px] uppercase tracking-[0.12em] px-8 py-4 hover:bg-white transition-colors"
          >
            Create Model Now
          </a>
          <a
            href="/method"
            className="border border-white/20 text-[#ECEFF5] font-mono text-[11px] uppercase tracking-[0.12em] px-8 py-4 hover:border-white/40 transition-colors"
          >
            Read Methodology
          </a>
        </div>

        {/* Telemetry Footer */}
        <div className="mt-20 pt-8 border-t border-[#1A1D26] w-full flex flex-col sm:flex-row justify-between items-center font-mono text-[9px] uppercase tracking-[0.14em] text-[#5F6575] gap-4">
          <span>SYSTEM COLD RESTART: SECURE</span>
          <span>TIMEOUT: 5000MS</span>
          <span>MEMORY CAP: 256MB</span>
        </div>

      </div>
    </section>
  )
}
