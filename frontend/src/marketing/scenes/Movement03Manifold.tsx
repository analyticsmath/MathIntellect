import { useLayoutEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import * as THREE from "three"
import { DESKTOP_MOTION } from "../components/DesktopLenisBridge"
import { SystemAnchorOverlay } from "../components/SystemAnchorOverlay"
import { FallbackSvgManifold } from "../components/FallbackSvgManifold"

import vertShader from "../shaders/topology.vert?raw"
import fragShader from "../shaders/topology.frag?raw"

gsap.registerPlugin(ScrollTrigger)

export function Movement03Manifold() {
  const root = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const canvasContainer = useRef<HTMLDivElement>(null)
  const [webglFailed, setWebglFailed] = useState(false)

  useLayoutEffect(() => {
    const mm = gsap.matchMedia()

    mm.add(DESKTOP_MOTION, () => {
      if (!root.current || !stage.current || !canvasContainer.current || webglFailed) return

      let renderer: THREE.WebGLRenderer | null = null
      let scene: THREE.Scene | null = null
      let camera: THREE.PerspectiveCamera | null = null
      let material: THREE.ShaderMaterial | null = null
      let animationFrame = 0

      try {
        const container = canvasContainer.current
        const width = container.clientWidth
        const height = container.clientHeight

        // Test context creation
        const testCanvas = document.createElement("canvas")
        const gl = testCanvas.getContext("webgl2")
        if (!gl) throw new Error("WebGL2 Unsupported")

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        renderer.setSize(width, height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.0))
        container.appendChild(renderer.domElement)

        scene = new THREE.Scene()
        camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
        camera.position.set(0, -3.5, 4.2)
        camera.lookAt(0, 0, 0)

        const geometry = new THREE.PlaneGeometry(8, 8, 128, 128)
        material = new THREE.ShaderMaterial({
          vertexShader: vertShader,
          fragmentShader: fragShader,
          uniforms: {
            uProgress: { value: 0.0 },
            uAmplitude: { value: 1.2 },
            uAlpha: { value: 1.0 }
          },
          wireframe: false,
          transparent: true
        })

        const mesh = new THREE.Mesh(geometry, material)
        scene.add(mesh)

        const progressRef = { value: 0 }

        const tl = gsap.timeline({
          scrollTrigger: {
            id: "movement03Manifold",
            trigger: root.current,
            pin: stage.current,
            start: "top top",
            end: () => `+=${window.innerHeight * 1.5}`,
            scrub: 0.65,
            pinSpacing: true,
            anticipatePin: 1,
            onUpdate: self => {
              progressRef.value = self.progress
              if (material) material.uniforms.uProgress.value = self.progress
            }
          }
        })

        const render = () => {
          if (renderer && scene && camera) {
            renderer.render(scene, camera)
          }
          animationFrame = requestAnimationFrame(render)
        }
        render()

        return () => {
          cancelAnimationFrame(animationFrame)
          tl.kill()
          renderer?.dispose()
          geometry.dispose()
          material?.dispose()
          if (renderer?.domElement && container.contains(renderer.domElement)) {
            container.removeChild(renderer.domElement)
          }
        }
      } catch (err) {
        console.warn("WebGL Initialization Guard Triggered. Mounting Fallback.", err)
        setWebglFailed(true)
      }
    })

    return () => mm.revert()
  }, [webglFailed])

  return (
    <section ref={root} className="relative bg-[#07080B] text-[#ECEFF5] border-b border-[#1A1D26]">
      <div ref={stage} className="relative h-[100svh] w-full overflow-hidden">
        <SystemAnchorOverlay
          systemTag="ENGINE 02 // MARKET DYNAMICS"
          telemetryMetric="GARCH(1,1) // VOLATILITY ACTIVE"
          coordSystem="MANIFOLD // LAT 24.7136 LNG 46.6753"
          verificationState="DRIFT // +0.03 PERCENT"
        />

        {/* 100vw Topological Manifold Takeover */}
        <div className="absolute inset-x-[5vw] top-[10svh] h-[78svh] overflow-hidden bg-[#0E1015] border border-white/10 relative">
          
          {/* Sourced Joshua Kettle Aerial Dunes Substrate */}
          <div className="absolute inset-0 z-0">
            <img
              src="/media/math/joshua-kettle-dunes.jpg"
              alt="Aerial desert dune ridge strata"
              className="w-full h-full object-cover grayscale contrast-125 brightness-50"
            />
          </div>

          {/* Three.js Interactive Volatility Mesh or Verified SVG Fallback */}
          <div ref={canvasContainer} className="absolute inset-0 z-10">
            {webglFailed && <FallbackSvgManifold />}
          </div>

          {/* Spatial Syntax Typographic Overlay */}
          <div className="absolute left-8 bottom-8 z-30 max-w-xl">
            <h2 className="font-sans text-[clamp(2rem,4vw,3.75rem)] font-medium leading-[0.94] tracking-[-0.03em] uppercase">
              Volatility builds physical geometry
            </h2>
            <div className="mt-3 space-y-1 font-mono text-[11px] uppercase tracking-[0.08em] text-[#5F6575]">
              <p className="text-[#ECEFF5]">Price shock creates terrain</p>
              <p className="pl-[18px]">Markov regimes govern the shift</p>
              <p className="pl-[36px] text-[#2D5BFF]">Market structure made tangible</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
