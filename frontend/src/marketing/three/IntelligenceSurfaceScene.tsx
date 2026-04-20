import { useEffect, useRef } from 'react';
import * as THREE from 'three';

type QualityTier = 'low' | 'medium' | 'high';

interface SceneStats {
  fps: number;
  quality: QualityTier;
}

interface IntelligenceSurfaceSceneProps {
  className?: string;
  onStats?: (stats: SceneStats) => void;
}

const TIER_ORDER: QualityTier[] = ['low', 'medium', 'high'];

const TIER_CONFIG: Record<QualityTier, { pixelRatio: number; nodeCount: number; updateModulo: number; particleCount: number }> = {
  low: { pixelRatio: 1, nodeCount: 84, updateModulo: 2, particleCount: 120 },
  medium: { pixelRatio: 1.25, nodeCount: 150, updateModulo: 1, particleCount: 220 },
  high: { pixelRatio: 1.65, nodeCount: 240, updateModulo: 1, particleCount: 340 },
};

function detectInitialTier(): QualityTier {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobile = window.matchMedia('(max-width: 900px)').matches;
  const automated = navigator.webdriver === true;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;

  if (automated || reduced || memory <= 4) {
    return 'low';
  }

  if (mobile || memory <= 6) {
    return 'medium';
  }

  return 'high';
}

function shouldUseStaticFallback() {
  if (typeof window === 'undefined') {
    return true;
  }

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const automated = navigator.webdriver === true;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  return reduced || automated || memory <= 2;
}

function createFibonacciSphere(count: number, radius: number) {
  const points = new Float32Array(count * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));

  for (let index = 0; index < count; index += 1) {
    const y = 1 - (index / (count - 1)) * 2;
    const ring = Math.sqrt(1 - y * y);
    const theta = golden * index;

    const x = Math.cos(theta) * ring;
    const z = Math.sin(theta) * ring;

    const i = index * 3;
    points[i] = x * radius;
    points[i + 1] = y * radius;
    points[i + 2] = z * radius;
  }

  return points;
}

function createLinePairs(nodeCount: number) {
  const pairs: Array<[number, number]> = [];
  for (let index = 0; index < nodeCount; index += 1) {
    pairs.push([index, (index + 7) % nodeCount]);
    if (index % 2 === 0) {
      pairs.push([index, (index + 21) % nodeCount]);
    }
  }
  return pairs;
}

export default function IntelligenceSurfaceScene({ className, onStats }: IntelligenceSurfaceSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const staticFallback = shouldUseStaticFallback();

  useEffect(() => {
    if (!staticFallback) {
      return;
    }
    onStats?.({ fps: 60, quality: 'low' });
  }, [onStats, staticFallback]);

  useEffect(() => {
    if (staticFallback) {
      return;
    }

    const mount = mountRef.current;
    if (!mount) {
      return;
    }

    const initialTier = detectInitialTier();
    let activeTier = initialTier;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05070d, 0.06);

    const camera = new THREE.PerspectiveCamera(52, 1, 0.1, 100);
    camera.position.set(0, 0.2, 5.8);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });

    renderer.setClearAlpha(0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.16;

    let composer: {
      setSize: (width: number, height: number) => void;
      render: () => void;
      dispose?: () => void;
    } | null = null;

    const setRendererQuality = (tier: QualityTier) => {
      activeTier = tier;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, TIER_CONFIG[tier].pixelRatio));
      onStats?.({ fps: 0, quality: tier });
    };

    setRendererQuality(initialTier);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    const coreSphere = new THREE.Mesh(
      new THREE.SphereGeometry(1.46, 96, 96),
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#111827'),
        transmission: 0.72,
        roughness: 0.12,
        thickness: 1.1,
        metalness: 0.35,
        clearcoat: 1,
        clearcoatRoughness: 0.08,
        ior: 1.36,
        emissive: new THREE.Color('#1d4ed8'),
        emissiveIntensity: 0.22,
        transparent: true,
        opacity: 0.92,
      }),
    );
    rootGroup.add(coreSphere);

    const corePulse = new THREE.Mesh(
      new THREE.SphereGeometry(0.74, 64, 64),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color('#22d3ee'),
        transparent: true,
        opacity: 0.16,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    rootGroup.add(corePulse);

    const haloSphere = new THREE.Mesh(
      new THREE.SphereGeometry(1.94, 64, 64),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color('#22d3ee'),
        transparent: true,
        opacity: 0.08,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    rootGroup.add(haloSphere);

    const nodeCount = TIER_CONFIG[activeTier].nodeCount;
    const basePoints = createFibonacciSphere(nodeCount, 1.78);
    const nodePositions = new Float32Array(basePoints);
    const nodePhases = Float32Array.from({ length: nodeCount }, () => Math.random() * Math.PI * 2);

    const nodeColors = new Float32Array(nodeCount * 3);
    for (let index = 0; index < nodeCount; index += 1) {
      const tint = index / Math.max(1, nodeCount - 1);
      const color = new THREE.Color().setHSL(0.55 + tint * 0.16, 0.9, 0.62);
      const i = index * 3;
      nodeColors[i] = color.r;
      nodeColors[i + 1] = color.g;
      nodeColors[i + 2] = color.b;
    }

    const nodeGeometry = new THREE.BufferGeometry();
    nodeGeometry.setAttribute('position', new THREE.BufferAttribute(nodePositions, 3));
    nodeGeometry.setAttribute('color', new THREE.BufferAttribute(nodeColors, 3));

    const nodes = new THREE.Points(
      nodeGeometry,
      new THREE.PointsMaterial({
        size: 0.038,
        sizeAttenuation: true,
        vertexColors: true,
        transparent: true,
        opacity: 0.96,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    rootGroup.add(nodes);

    const linePairs = createLinePairs(nodeCount);
    const linePositions = new Float32Array(linePairs.length * 2 * 3);
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));

    const lines = new THREE.LineSegments(
      lineGeometry,
      new THREE.LineBasicMaterial({
        color: new THREE.Color('#3b82f6'),
        transparent: true,
        opacity: 0.27,
      }),
    );
    rootGroup.add(lines);

    const particleCount = TIER_CONFIG[activeTier].particleCount;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i += 1) {
      const ring = 2.2 + Math.random() * 1.6;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 1.8;
      particlePositions[i * 3] = Math.cos(theta) * ring;
      particlePositions[i * 3 + 1] = y;
      particlePositions[i * 3 + 2] = Math.sin(theta) * ring;
    }

    const particles = new THREE.Points(
      new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(particlePositions, 3)),
      new THREE.PointsMaterial({
        color: new THREE.Color('#22d3ee'),
        size: 0.018,
        transparent: true,
        opacity: 0.36,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    scene.add(particles);

    const ambient = new THREE.AmbientLight(0xdbeafe, 0.45);
    const key = new THREE.DirectionalLight(0x93c5fd, 1.25);
    key.position.set(3.4, 2.5, 4.2);
    const fill = new THREE.DirectionalLight(0x22d3ee, 0.78);
    fill.position.set(-3.2, -1.2, 2.4);
    const rim = new THREE.PointLight(0x8b5cf6, 0.92, 14);
    rim.position.set(0, 2.8, -2.6);
    scene.add(ambient, key, fill, rim);

    const groundGlow = new THREE.Mesh(
      new THREE.CircleGeometry(2.95, 52),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color('#22d3ee'),
        transparent: true,
        opacity: 0.12,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    groundGlow.rotation.x = -Math.PI / 2;
    groundGlow.position.y = -1.95;
    scene.add(groundGlow);

    let pointerRaf = 0;
    let scrollRaf = 0;
    let queuedPointerX = 0;
    let queuedPointerY = 0;
    let queuedScrollY = window.scrollY;
    const pointerTarget = new THREE.Vector2(0, 0);
    const pointer = new THREE.Vector2(0, 0);
    let scrollProgressTarget = 0;
    let scrollProgress = 0;

    const flushPointer = () => {
      pointerRaf = 0;
      pointerTarget.set(
        THREE.MathUtils.clamp(queuedPointerX, -1, 1),
        THREE.MathUtils.clamp(queuedPointerY, -1, 1),
      );
    };

    const updatePointer = (event: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      if (!rect.width || !rect.height) {
        return;
      }
      queuedPointerX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      queuedPointerY = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
      if (!pointerRaf) {
        pointerRaf = window.requestAnimationFrame(flushPointer);
      }
    };

    const resetPointer = () => {
      queuedPointerX = 0;
      queuedPointerY = 0;
      if (!pointerRaf) {
        pointerRaf = window.requestAnimationFrame(flushPointer);
      }
    };

    const flushScroll = () => {
      scrollRaf = 0;
      const maxScrollable = Math.max(1, document.body.scrollHeight - window.innerHeight);
      scrollProgressTarget = THREE.MathUtils.clamp(queuedScrollY / maxScrollable, 0, 1);
    };

    const queueScroll = () => {
      queuedScrollY = window.scrollY;
      if (!scrollRaf) {
        scrollRaf = window.requestAnimationFrame(flushScroll);
      }
    };

    const resize = () => {
      const width = Math.max(1, mount.clientWidth);
      const height = Math.max(1, mount.clientHeight);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, TIER_CONFIG[activeTier].pixelRatio));
      composer?.setSize(width, height);
    };

    resize();
    mount.appendChild(renderer.domElement);

    let disposed = false;
    void (async () => {
      try {
        const [{ EffectComposer }, { RenderPass }, { UnrealBloomPass }] = await Promise.all([
          import('three/examples/jsm/postprocessing/EffectComposer.js'),
          import('three/examples/jsm/postprocessing/RenderPass.js'),
          import('three/examples/jsm/postprocessing/UnrealBloomPass.js'),
        ]);

        if (disposed) {
          return;
        }

        const nextComposer = new EffectComposer(renderer);
        nextComposer.addPass(new RenderPass(scene, camera));
        const bloom = new UnrealBloomPass(new THREE.Vector2(mount.clientWidth, mount.clientHeight), 0.72, 0.56, 0.22);
        nextComposer.addPass(bloom);
        nextComposer.setSize(mount.clientWidth, mount.clientHeight);
        composer = nextComposer;
      } catch {
        composer = null;
      }
    })();

    const clock = new THREE.Clock();
    let rafId = 0;
    let frame = 0;
    let fpsWindowStart = performance.now();
    let fpsFrames = 0;

    const animate = () => {
      rafId = window.requestAnimationFrame(animate);
      frame += 1;
      const elapsed = clock.getElapsedTime();

      pointer.lerp(pointerTarget, 0.08);
      scrollProgress = THREE.MathUtils.lerp(scrollProgress, scrollProgressTarget, 0.05);

      fpsFrames += 1;
      const now = performance.now();
      if (now - fpsWindowStart >= 1000) {
        const fps = Math.round((fpsFrames * 1000) / (now - fpsWindowStart));
        onStats?.({ fps, quality: activeTier });

        const tierIndex = TIER_ORDER.indexOf(activeTier);
        if (fps < 42 && tierIndex > 0) {
          setRendererQuality(TIER_ORDER[tierIndex - 1]);
        } else if (fps > 57 && tierIndex < TIER_ORDER.indexOf(initialTier)) {
          setRendererQuality(TIER_ORDER[tierIndex + 1]);
        }

        fpsFrames = 0;
        fpsWindowStart = now;
      }

      if (frame % TIER_CONFIG[activeTier].updateModulo === 0) {
        for (let i = 0; i < nodeCount; i += 1) {
          const phase = nodePhases[i] + elapsed * 0.45;
          const idx = i * 3;
          const bx = basePoints[idx];
          const by = basePoints[idx + 1];
          const bz = basePoints[idx + 2];

          const orbitOffset = Math.sin(phase) * 0.12;
          nodePositions[idx] = bx + Math.cos(phase * 1.3) * 0.08;
          nodePositions[idx + 1] = by + Math.sin(phase * 1.7) * 0.06;
          nodePositions[idx + 2] = bz + orbitOffset;
        }
        (nodeGeometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;

        for (let i = 0; i < linePairs.length; i += 1) {
          const [a, b] = linePairs[i];
          const ai = a * 3;
          const bi = b * 3;
          const li = i * 6;

          linePositions[li] = nodePositions[ai];
          linePositions[li + 1] = nodePositions[ai + 1];
          linePositions[li + 2] = nodePositions[ai + 2];

          linePositions[li + 3] = nodePositions[bi];
          linePositions[li + 4] = nodePositions[bi + 1];
          linePositions[li + 5] = nodePositions[bi + 2];
        }
        (lineGeometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      }

      const pulse = Math.sin(elapsed * 1.25) * 0.06;
      corePulse.scale.setScalar(1 + pulse * 0.5);
      haloSphere.scale.setScalar(1 + pulse * 0.44);

      const autoSpin = elapsed * 0.18;
      rootGroup.rotation.y = autoSpin + pointer.x * 0.28;
      rootGroup.rotation.x = pointer.y * 0.22;
      particles.rotation.y = -elapsed * 0.05;

      const depth = THREE.MathUtils.smoothstep(scrollProgress, 0, 1);
      camera.position.z = 5.8 + depth * 1.7;
      camera.position.y = 0.2 - depth * 0.34 + pointer.y * 0.22;
      camera.position.x = pointer.x * 0.46;

      rim.position.x = Math.sin(elapsed * 0.65) * 1.35;
      (groundGlow.material as THREE.MeshBasicMaterial).opacity = 0.1 + (Math.sin(elapsed * 1.2) * 0.5 + 0.5) * 0.08;

      camera.lookAt(0, 0, 0);
      if (composer) {
        composer.render();
      } else {
        renderer.render(scene, camera);
      }
    };

    animate();

    mount.addEventListener('pointermove', updatePointer);
    mount.addEventListener('pointerleave', resetPointer);
    window.addEventListener('scroll', queueScroll, { passive: true });
    window.addEventListener('resize', resize);
    queueScroll();

    return () => {
      disposed = true;
      mount.removeEventListener('pointermove', updatePointer);
      mount.removeEventListener('pointerleave', resetPointer);
      window.removeEventListener('scroll', queueScroll);
      window.removeEventListener('resize', resize);

      window.cancelAnimationFrame(rafId);
      if (pointerRaf) {
        window.cancelAnimationFrame(pointerRaf);
      }
      if (scrollRaf) {
        window.cancelAnimationFrame(scrollRaf);
      }

      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }

      scene.traverse((object) => {
        if ('geometry' in object) {
          (object.geometry as THREE.BufferGeometry).dispose?.();
        }
        if ('material' in object) {
          const material = object.material as THREE.Material | THREE.Material[];
          if (Array.isArray(material)) {
            material.forEach((item) => item.dispose());
          } else {
            material.dispose();
          }
        }
      });

      composer?.dispose?.();
      renderer.dispose();
    };
  }, [onStats, staticFallback]);

  const fallbackStyle = staticFallback
    ? {
      background:
        'radial-gradient(circle at 50% 48%, rgba(34,211,238,0.28), rgba(59,130,246,0.16) 34%, rgba(139,92,246,0.1) 62%, transparent 82%), radial-gradient(circle at 50% 50%, rgba(17,24,39,0.94), rgba(11,16,32,0.92) 66%, rgba(6,7,10,0.92) 100%)',
      filter: 'drop-shadow(0 34px 70px rgba(59,130,246,0.2))',
      borderRadius: '9999px',
      opacity: 0.96,
    }
    : undefined;

  return <div ref={mountRef} className={className ?? 'w-full h-full'} style={fallbackStyle} aria-hidden />;
}
