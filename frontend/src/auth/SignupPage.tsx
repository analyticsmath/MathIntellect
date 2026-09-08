import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"

export function SignupPage() {
  const [identifier, setIdentifier] = useState("")
  const [secret, setSecret] = useState("")
  const [confirmSecret, setConfirmSecret] = useState("")
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (secret !== confirmSecret) {
      setError("SECRET MISMATCH DETECTED")
      return
    }
    navigate("/app")
  }

  return (
    <div className="min-h-[100svh] w-full bg-[#07080B] text-[#ECEFF5] flex flex-col lg:flex-row border-b border-[#1A1D26]">
      
      {/* 65% Viewport Mass: Colin + Meg Stone Portal */}
      <div className="hidden lg:block lg:w-[65%] h-[100svh] relative overflow-hidden bg-[#0E1015] border-r border-[#1A1D26]">
        <img
          src="/media/math/colin-meg-stone-portal.jpg"
          alt="Monolithic stone portal"
          className="w-full h-full object-cover grayscale contrast-125 brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#07080B]" />
        <div className="absolute top-8 left-8 font-mono text-[9px] uppercase tracking-[0.14em] text-[#5F6575]">
          INITIAL REGISTRATION AIRLOCK 00
        </div>
        <div className="absolute bottom-8 left-8 font-mono text-[9px] uppercase tracking-[0.14em] text-[#2D5BFF]">
          CRYPTOGRAPHIC IDENTITY SEED GENERATOR
        </div>
      </div>

      {/* 35% Viewport Milled Form Terminal */}
      <div className="w-full lg:w-[35%] min-h-[100svh] flex flex-col justify-center px-8 sm:px-14 py-12 relative z-10">
        <div className="mb-8">
          <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#5F6575] block mb-2">
            REGISTRATION GATEWAY
          </span>
          <h1 className="font-['Space_Grotesk',sans-serif] text-3xl font-medium tracking-[-0.03em] uppercase text-[#ECEFF5]">
            Create Identity
          </h1>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-950/40 border border-red-500/30 font-mono text-[10px] uppercase tracking-wider text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-[0.12em] text-[#5F6575] mb-2">
              System Identifier
            </label>
            <input
              type="text"
              required
              value={identifier}
              onChange={e => setIdentifier(e.target.value)}
              placeholder="analyst@institution.internal"
              className="milled-input w-full"
            />
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase tracking-[0.12em] text-[#5F6575] mb-2">
              Access Secret
            </label>
            <input
              type="password"
              required
              value={secret}
              onChange={e => setSecret(e.target.value)}
              placeholder="••••••••••••"
              className="milled-input w-full"
            />
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase tracking-[0.12em] text-[#5F6575] mb-2">
              Confirm Secret
            </label>
            <input
              type="password"
              required
              value={confirmSecret}
              onChange={e => setConfirmSecret(e.target.value)}
              placeholder="••••••••••••"
              className="milled-input w-full"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#ECEFF5] text-[#07080B] font-mono text-[11px] uppercase tracking-[0.14em] py-4 hover:bg-white transition-colors"
          >
            Authorize Terminal
          </button>
        </form>

        <div className="mt-10 pt-6 border-t border-[#1A1D26] flex justify-between items-center font-mono text-[10px] uppercase tracking-wider text-[#5F6575]">
          <span>Existing analyst</span>
          <a href="/login" className="text-[#ECEFF5] hover:text-[#2D5BFF] transition-colors">
            Enter Laboratory
          </a>
        </div>
      </div>

    </div>
  )
}
