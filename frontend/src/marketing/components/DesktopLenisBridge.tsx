import { type PropsWithChildren, useEffect } from "react"
import Lenis from "lenis"
import "lenis/dist/lenis.css"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export const DESKTOP_MOTION =
  "(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)"

export function DesktopLenisBridge({ children }: PropsWithChildren) {
  useEffect(() => {
    const media = window.matchMedia(DESKTOP_MOTION)
    let lenis: Lenis | null = null
    let ticker: ((time: number) => void) | null = null

    const stop = () => {
      if (ticker) gsap.ticker.remove(ticker)
      lenis?.destroy()
      ticker = null
      lenis = null
      gsap.ticker.lagSmoothing(500, 33)
    }

    const sync = () => {
      stop()
      if (!media.matches) return

      lenis = new Lenis({
        autoRaf: false,
        smoothWheel: true,
        syncTouch: false,
        lerp: 0.08, // Mandated by Jury: heavy concrete mass
        easing: (t: number) => 1 - Math.pow(1 - t, 4), // Heavy Quartic Out
        wheelMultiplier: 0.85,
        touchMultiplier: 1.0,
        anchors: true,
        respectReducedMotion: true
      })

      lenis.on("scroll", ScrollTrigger.update)
      ticker = (time: number) => lenis?.raf(time * 1000)
      gsap.ticker.add(ticker)
      gsap.ticker.lagSmoothing(0)
      ScrollTrigger.refresh(true)
    }

    sync()
    media.addEventListener("change", sync)

    return () => {
      media.removeEventListener("change", sync)
      stop()
    }
  }, [])

  return <>{children}</>
}
