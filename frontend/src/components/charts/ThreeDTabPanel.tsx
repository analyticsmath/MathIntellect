import { useEffect, useMemo, useRef, useState } from 'react';
import type { SurfacePlot3D, ThreeDResponse, Visualization3D } from '../../types/api.types';
import { Card } from '../ui/Card';
import { ErrorState } from '../ui/ErrorState';
import { Loader } from '../ui/Loader';

type SceneFlavor = 'monte_carlo' | 'market' | 'game_theory' | 'conflict';
type QualityMode = 'low' | 'high';

interface HoverState {
  x: number;
  y: number;
  title: string;
  value: string;
}

interface NumericSurface {
  x: number[];
  y: number[];
  z: number[][];
}

interface NumericScatter {
  x: number[];
  y: number[];
  z: number[];
  colorValues?: number[];
}

interface SceneController {
  animate: (elapsed: number) => void;
  onPointerMove?: (event: PointerEvent) => void;
  onPointerLeave?: () => void;
  dispose: () => void;
  cameraTarget: { x: number; y: number; z: number };
}

interface BuildContext {
  THREE: typeof import('three');
  scene: import('three').Scene;
  camera: import('three').PerspectiveCamera;
  renderer: import('three').WebGLRenderer;
  host: HTMLDivElement;
  quality: QualityMode;
  flavor: SceneFlavor;
  surface: NumericSurface;
  scatter: NumericScatter;
  onHover: (state: HoverState | null) => void;
}

function toFlavor(type: string | undefined): SceneFlavor {
  const normalized = (type ?? '').toLowerCase();
  if (normalized.includes('market')) {
    return 'market';
  }
  if (normalized.includes('game')) {
    return 'game_theory';
  }
  if (normalized.includes('conflict')) {
    return 'conflict';
  }
  return 'monte_carlo';
}

function asNumberArray(values: Array<number | string> | undefined, fallbackLength: number): number[] {
  if (!values || values.length === 0) {
    return Array.from({ length: fallbackLength }, (_, i) => i);
  }

  if (typeof values[0] === 'number') {
    return values as number[];
  }

  return Array.from({ length: values.length }, (_, i) => i);
}

function seeded(seedSource: string, offset = 0) {
  let h = 2166136261 ^ offset;
  for (let i = 0; i < seedSource.length; i += 1) {
    h ^= seedSource.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h += 0x6d2b79f5;
    let t = Math.imul(h ^ (h >>> 15), 1 | h);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function sampleGaussian(rng: () => number) {
  const u = Math.max(1e-9, rng());
  const v = Math.max(1e-9, rng());
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function extractSurface(visualizations: Record<string, Visualization3D>, seedKey: string): NumericSurface {
  const surface = Object.values(visualizations).find((viz): viz is SurfacePlot3D => viz.plotType === 'surface');
  if (surface && surface.z.length > 0 && surface.z[0]?.length) {
    const rows = surface.z.length;
    const cols = surface.z[0].length;
    return {
      x: asNumberArray(surface.x as Array<number | string>, cols),
      y: asNumberArray(surface.y as Array<number | string>, rows),
      z: surface.z,
    };
  }

  const rng = seeded(seedKey, 9);
  const size = 26;
  const x = Array.from({ length: size }, (_, i) => i / 1.8);
  const y = Array.from({ length: size }, (_, i) => i / 1.8);
  const z = y.map((yv) => x.map((xv) => {
    const wave = Math.sin(xv * 0.32) * Math.cos(yv * 0.27);
    const hill = Math.exp(-((xv - 6.4) ** 2 + (yv - 7.1) ** 2) / 17);
    return 42 + wave * 14 + hill * 34 + rng() * 4;
  }));
  return { x, y, z };
}

function extractScatter(visualizations: Record<string, Visualization3D>, seedKey: string): NumericScatter {
  const scatter = Object.values(visualizations).find(
    (viz): viz is Extract<Visualization3D, { plotType: 'scatter3d' }> => viz.plotType === 'scatter3d',
  );
  if (scatter && scatter.x.length > 0) {
    return {
      x: scatter.x,
      y: scatter.y,
      z: scatter.z,
      colorValues: scatter.colorValues,
    };
  }

  const rng = seeded(seedKey, 21);
  const count = 180;
  const x: number[] = [];
  const y: number[] = [];
  const z: number[] = [];
  const colorValues: number[] = [];
  for (let i = 0; i < count; i += 1) {
    const t = (i / count) * Math.PI * 2;
    const r = 1.5 + rng() * 3.2;
    x.push(Math.cos(t) * r + (rng() - 0.5) * 0.8);
    y.push(Math.sin(t) * r + (rng() - 0.5) * 0.8);
    z.push((rng() - 0.5) * 3.6);
    colorValues.push(45 + rng() * 55);
  }
  return { x, y, z, colorValues };
}

function flatten(values: number[][]): number[] {
  return values.reduce<number[]>((acc, row) => acc.concat(row), []);
}

function minMax(values: number[]) {
  let min = Number.POSITIVE_INFINITY;
  let max = Number.NEGATIVE_INFINITY;
  for (const value of values) {
    if (value < min) {
      min = value;
    }
    if (value > max) {
      max = value;
    }
  }
  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    return { min: 0, max: 1 };
  }
  return { min, max: max === min ? min + 1 : max };
}

function normalize(value: number, min: number, max: number) {
  return (value - min) / (max - min);
}

function colorByStop(t: number, stops: string[], THREE: typeof import('three')) {
  const clamped = Math.min(0.999, Math.max(0, t));
  const segment = clamped * (stops.length - 1);
  const i = Math.floor(segment);
  const local = segment - i;
  const a = new THREE.Color(stops[i]);
  const b = new THREE.Color(stops[Math.min(stops.length - 1, i + 1)]);
  return a.lerp(b, local);
}

function buildEnvironment(THREE: typeof import('three'), scene: import('three').Scene) {
  scene.fog = new THREE.FogExp2('#0b1220', 0.08);
  scene.background = new THREE.Color('#081120');

  const ambient = new THREE.AmbientLight('#dbeafe', 0.38);
  const key = new THREE.DirectionalLight('#6ee7ff', 0.95);
  key.position.set(4.2, 8.4, 6.8);
  const rim = new THREE.DirectionalLight('#8b5cf6', 0.42);
  rim.position.set(-5.2, 4.1, -7.3);
  const accent = new THREE.PointLight('#22d3ee', 0.85, 22);
  accent.position.set(0, 5, 0);

  scene.add(ambient, key, rim, accent);
}

function buildMonteCarlo(ctx: BuildContext): SceneController {
  const { THREE, scene, host, quality, scatter, onHover } = ctx;
  const count = quality === 'low' ? 1200 : 2600;
  const rng = seeded(host.dataset.seed ?? 'monte-carlo', 33);
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const base = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  const sourceY = scatter.y.length > 0 ? scatter.y : [0, 1];
  const yStats = minMax(sourceY);
  const sorted = [...sourceY].sort((a, b) => a - b);

  const palette = ['#183153', '#1d4ed8', '#22d3ee', '#6ee7ff'];
  for (let i = 0; i < count; i += 1) {
    const gx = sampleGaussian(rng);
    const gy = sampleGaussian(rng) * 0.7;
    const gz = sampleGaussian(rng);
    const density = Math.exp(-(gx ** 2 + gy ** 2 + gz ** 2) / 3.4);
    const radius = 2.1 + rng() * 5.2 * density;
    const theta = rng() * Math.PI * 2;
    const phi = Math.acos(2 * rng() - 1);
    const x = radius * Math.sin(phi) * Math.cos(theta) + gx * 0.8;
    const y = radius * Math.sin(phi) * Math.sin(theta) + gy * 0.8;
    const z = radius * Math.cos(phi) + gz * 0.8;

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
    base[i * 3] = x;
    base[i * 3 + 1] = y;
    base[i * 3 + 2] = z;

    const t = normalize(y, yStats.min - 4, yStats.max + 4);
    const col = colorByStop(t, palette, THREE);
    colors[i * 3] = col.r;
    colors[i * 3 + 1] = col.g;
    colors[i * 3 + 2] = col.b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const material = new THREE.PointsMaterial({
    size: quality === 'low' ? 0.07 : 0.09,
    transparent: true,
    opacity: 0.9,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const cloud = new THREE.Points(geometry, material);
  scene.add(cloud);

  const core = new THREE.Mesh(
    new THREE.SphereGeometry(0.45, 28, 28),
    new THREE.MeshBasicMaterial({ color: '#6ee7ff', transparent: true, opacity: 0.55 }),
  );
  scene.add(core);

  const raycaster = new THREE.Raycaster();
  raycaster.params.Points.threshold = 0.18;
  const pointer = new THREE.Vector2(0, 0);

  const onPointerMove = (event: PointerEvent) => {
    const rect = host.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, ctx.camera);
    const hits = raycaster.intersectObject(cloud);
    if (!hits[0]) {
      onHover(null);
      return;
    }
    const point = hits[0].point;
    const idx = Math.max(0, hits[0].index ?? 0) % sorted.length;
    const ranked = sorted[idx];
    const percentile = Math.round((idx / Math.max(1, sorted.length - 1)) * 100);
    onHover({
      x: event.clientX - rect.left + 10,
      y: event.clientY - rect.top + 10,
      title: `Percentile P${percentile}`,
      value: `Sample ${ranked.toFixed(2)} / cloud ${point.length().toFixed(2)}`,
    });
  };

  return {
    cameraTarget: { x: 7.8, y: 5.2, z: 8.4 },
    animate: (elapsed) => {
      const positionsRef = geometry.getAttribute('position');
      for (let i = 0; i < count; i += 1) {
        positionsRef.array[i * 3 + 1] = base[i * 3 + 1] + Math.sin(elapsed * 1.1 + i * 0.014) * 0.08;
      }
      positionsRef.needsUpdate = true;
      core.scale.setScalar(1 + Math.sin(elapsed * 1.5) * 0.08);
    },
    onPointerMove,
    onPointerLeave: () => onHover(null),
    dispose: () => {
      geometry.dispose();
      material.dispose();
      core.geometry.dispose();
      (core.material as import('three').Material).dispose();
    },
  };
}

function buildMarket(ctx: BuildContext): SceneController {
  const { THREE, scene, surface } = ctx;
  const rows = surface.z.length;
  const cols = surface.z[0]?.length ?? 0;
  const values = flatten(surface.z);
  const stats = minMax(values);

  const geometry = new THREE.PlaneGeometry(11, 11, Math.max(2, cols - 1), Math.max(2, rows - 1));
  geometry.rotateX(-Math.PI / 2);
  const pos = geometry.attributes.position;
  const colors = new Float32Array(pos.count * 3);
  for (let i = 0; i < pos.count; i += 1) {
    const gx = i % cols;
    const gy = Math.floor(i / cols);
    const h = surface.z[Math.min(rows - 1, gy)]?.[Math.min(cols - 1, gx)] ?? stats.min;
    const n = normalize(h, stats.min, stats.max);
    const y = n * 2.8 - 1.2;
    pos.setY(i, y);

    const c = colorByStop(n, ['#1e293b', '#2563eb', '#8b5cf6', '#6ee7ff'], THREE);
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.computeVertexNormals();
  const terrainMaterial = new THREE.MeshStandardMaterial({
    vertexColors: true,
    metalness: 0.08,
    roughness: 0.45,
    emissive: new THREE.Color('#0a1a2f'),
    emissiveIntensity: 0.25,
  });
  const terrain = new THREE.Mesh(geometry, terrainMaterial);
  scene.add(terrain);

  const wire = new THREE.LineSegments(
    new THREE.WireframeGeometry(geometry),
    new THREE.LineBasicMaterial({ color: '#6ee7ff', transparent: true, opacity: 0.16 }),
  );
  scene.add(wire);

  const pathPoints: import('three').Vector3[] = [];
  const row = Math.floor(rows * 0.55);
  for (let col = 0; col < cols; col += 1) {
    const x = (col / Math.max(1, cols - 1)) * 11 - 5.5;
    const z = (row / Math.max(1, rows - 1)) * 11 - 5.5;
    const h = surface.z[Math.min(rows - 1, row)]?.[col] ?? stats.min;
    const y = normalize(h, stats.min, stats.max) * 2.8 - 0.95;
    pathPoints.push(new THREE.Vector3(x, y + 0.12, z));
  }
  const pathCurve = new THREE.CatmullRomCurve3(pathPoints);
  const pathGeom = new THREE.BufferGeometry().setFromPoints(pathCurve.getPoints(220));
  pathGeom.setDrawRange(0, 0);
  const pathMaterial = new THREE.LineBasicMaterial({ color: '#f8fafc', transparent: true, opacity: 0.9 });
  const path = new THREE.Line(pathGeom, pathMaterial);
  scene.add(path);

  return {
    cameraTarget: { x: 8.6, y: 6.6, z: 8.8 },
    animate: (elapsed) => {
      const targetDraw = Math.floor(((Math.sin(elapsed * 0.55) + 1) / 2) * pathGeom.attributes.position.count);
      pathGeom.setDrawRange(0, Math.max(2, targetDraw));
      terrain.rotation.y = Math.sin(elapsed * 0.14) * 0.08;
    },
    dispose: () => {
      geometry.dispose();
      terrainMaterial.dispose();
      wire.geometry.dispose();
      (wire.material as import('three').Material).dispose();
      pathGeom.dispose();
      pathMaterial.dispose();
    },
  };
}

function buildGameTheory(ctx: BuildContext): SceneController {
  const { THREE, scene, surface } = ctx;
  const z = surface.z.slice(0, 5).map((row) => row.slice(0, 5));
  const rows = z.length;
  const cols = z[0]?.length ?? 0;
  const values = flatten(z);
  const stats = minMax(values);

  const cubes: Array<{ mesh: import('three').Mesh; value: number; row: number; col: number }> = [];
  let bestIdx = 0;
  for (let i = 1; i < values.length; i += 1) {
    if (values[i] > values[bestIdx]) {
      bestIdx = i;
    }
  }
  const bestRow = Math.floor(bestIdx / cols);
  const bestCol = bestIdx % cols;

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const value = z[row][col];
      const n = normalize(value, stats.min, stats.max);
      const height = 0.4 + n * 2.4;
      const geo = new THREE.BoxGeometry(0.86, height, 0.86);
      const mat = new THREE.MeshStandardMaterial({
        color: row === bestRow && col === bestCol ? '#f59e0b' : '#8b5cf6',
        emissive: row === bestRow && col === bestCol ? '#f59e0b' : '#334155',
        emissiveIntensity: row === bestRow && col === bestCol ? 0.55 : 0.18,
        metalness: 0.24,
        roughness: 0.32,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(col - (cols - 1) / 2, height / 2 - 1, row - (rows - 1) / 2);
      scene.add(mesh);
      cubes.push({ mesh, value, row, col });
    }
  }

  const grid = new THREE.GridHelper(8, 12, '#334155', '#334155');
  grid.position.y = -1.02;
  scene.add(grid);

  const nashRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.78, 0.04, 24, 72),
    new THREE.MeshBasicMaterial({ color: '#facc15', transparent: true, opacity: 0.9 }),
  );
  nashRing.rotation.x = Math.PI / 2;
  nashRing.position.set(bestCol - (cols - 1) / 2, cubes[bestIdx].mesh.position.y + 0.2, bestRow - (rows - 1) / 2);
  scene.add(nashRing);

  return {
    cameraTarget: { x: 6.8, y: 5.8, z: 9.2 },
    animate: (elapsed) => {
      nashRing.scale.setScalar(1 + Math.sin(elapsed * 2.2) * 0.12);
      cubes.forEach((entry, idx) => {
        const mat = entry.mesh.material as import('three').MeshStandardMaterial;
        const rowPulse = entry.row === bestRow ? 0.24 : 0.1;
        const colPulse = entry.col === bestCol ? 0.24 : 0.1;
        mat.emissiveIntensity = idx === bestIdx
          ? 0.6 + Math.sin(elapsed * 2.8) * 0.16
          : rowPulse + colPulse + Math.sin(elapsed * 1.2 + idx * 0.15) * 0.05;
      });
    },
    dispose: () => {
      cubes.forEach(({ mesh }) => {
        mesh.geometry.dispose();
        (mesh.material as import('three').Material).dispose();
      });
      grid.geometry.dispose();
      const gridMaterial = grid.material as import('three').Material | import('three').Material[];
      if (Array.isArray(gridMaterial)) {
        gridMaterial.forEach((entry) => entry.dispose());
      } else {
        gridMaterial.dispose();
      }
      nashRing.geometry.dispose();
      (nashRing.material as import('three').Material).dispose();
    },
  };
}

function buildConflict(ctx: BuildContext): SceneController {
  const { THREE, scene, scatter } = ctx;
  const count = Math.min(44, Math.max(18, scatter.x.length));
  const nodes: import('three').Mesh[] = [];
  const positions: import('three').Vector3[] = [];
  const edgesAllies: number[] = [];
  const edgesBetrayals: number[] = [];
  const rng = seeded(ctx.host.dataset.seed ?? 'conflict', 74);

  for (let i = 0; i < count; i += 1) {
    const x = scatter.x[i % scatter.x.length] ?? (rng() - 0.5) * 6;
    const y = (scatter.y[i % scatter.y.length] ?? (rng() - 0.5) * 4) * 0.45;
    const z = scatter.z[i % scatter.z.length] ?? (rng() - 0.5) * 6;
    const pos = new THREE.Vector3(x, y, z);
    positions.push(pos);

    const node = new THREE.Mesh(
      new THREE.SphereGeometry(0.12 + rng() * 0.09, 16, 16),
      new THREE.MeshStandardMaterial({
        color: '#6ee7ff',
        emissive: '#0ea5e9',
        emissiveIntensity: 0.26,
        roughness: 0.32,
        metalness: 0.12,
      }),
    );
    node.position.copy(pos);
    scene.add(node);
    nodes.push(node);
  }

  for (let i = 0; i < positions.length; i += 1) {
    for (let j = i + 1; j < positions.length; j += 1) {
      const distance = positions[i].distanceTo(positions[j]);
      if (distance > 2.8) {
        continue;
      }
      const bucket = rng() > 0.72 ? edgesBetrayals : edgesAllies;
      bucket.push(
        positions[i].x, positions[i].y, positions[i].z,
        positions[j].x, positions[j].y, positions[j].z,
      );
    }
  }

  const allyGeom = new THREE.BufferGeometry();
  allyGeom.setAttribute('position', new THREE.Float32BufferAttribute(edgesAllies, 3));
  const allyLines = new THREE.LineSegments(
    allyGeom,
    new THREE.LineBasicMaterial({ color: '#22c55e', transparent: true, opacity: 0.44 }),
  );
  scene.add(allyLines);

  const betrayalGeom = new THREE.BufferGeometry();
  betrayalGeom.setAttribute('position', new THREE.Float32BufferAttribute(edgesBetrayals, 3));
  const betrayalLines = new THREE.LineSegments(
    betrayalGeom,
    new THREE.LineBasicMaterial({ color: '#ef4444', transparent: true, opacity: 0.56 }),
  );
  scene.add(betrayalLines);

  const orbiters: import('three').Mesh[] = [];
  const orbitAnchors = positions.slice(0, Math.min(9, positions.length));
  orbitAnchors.forEach((anchor) => {
    const orb = new THREE.Mesh(
      new THREE.SphereGeometry(0.05, 10, 10),
      new THREE.MeshBasicMaterial({ color: '#f8fafc' }),
    );
    orb.position.copy(anchor.clone().add(new THREE.Vector3(0.3, 0.08, 0)));
    orbiters.push(orb);
    scene.add(orb);
  });

  return {
    cameraTarget: { x: 8.4, y: 5.8, z: 8.8 },
    animate: (elapsed) => {
      orbiters.forEach((orb, idx) => {
        const anchor = orbitAnchors[idx];
        const radius = 0.28 + (idx % 3) * 0.08;
        const angle = elapsed * (0.7 + idx * 0.04);
        orb.position.set(
          anchor.x + Math.cos(angle) * radius,
          anchor.y + Math.sin(angle * 1.8) * 0.08,
          anchor.z + Math.sin(angle) * radius,
        );
      });
      nodes.forEach((node, idx) => {
        node.scale.setScalar(1 + Math.sin(elapsed * 1.2 + idx * 0.2) * 0.07);
      });
    },
    dispose: () => {
      nodes.forEach((node) => {
        node.geometry.dispose();
        (node.material as import('three').Material).dispose();
      });
      allyGeom.dispose();
      betrayalGeom.dispose();
      (allyLines.material as import('three').Material).dispose();
      (betrayalLines.material as import('three').Material).dispose();
      orbiters.forEach((orb) => {
        orb.geometry.dispose();
        (orb.material as import('three').Material).dispose();
      });
    },
  };
}

function buildScene(ctx: BuildContext): SceneController {
  if (ctx.flavor === 'market') {
    return buildMarket(ctx);
  }
  if (ctx.flavor === 'game_theory') {
    return buildGameTheory(ctx);
  }
  if (ctx.flavor === 'conflict') {
    return buildConflict(ctx);
  }
  return buildMonteCarlo(ctx);
}

function sceneLabel(flavor: SceneFlavor) {
  if (flavor === 'market') {
    return {
      title: 'Market Terrain',
      copy: 'Height maps price momentum. Valleys indicate crashes, peaks indicate rallies, and path lines show trend drift.',
    };
  }
  if (flavor === 'game_theory') {
    return {
      title: 'Game Theory Matrix',
      copy: '3D payoff cubes surface strategic pressure. Nash equilibrium is highlighted and dominant lanes pulse.',
    };
  }
  if (flavor === 'conflict') {
    return {
      title: 'Conflict Network',
      copy: 'Alliance edges glow green, betrayal edges glow red, and resource orbits expose pressure concentration.',
    };
  }
  return {
    title: 'Monte Carlo Probability Cloud',
    copy: 'Particle density reflects probability mass and flowing samples expose percentile movement in real time.',
  };
}

interface ThreeDSceneProps {
  data: ThreeDResponse;
}

function ThreeDScene({ data }: ThreeDSceneProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [hover, setHover] = useState<HoverState | null>(null);
  const [visible, setVisible] = useState(false);

  const flavor = useMemo(() => toFlavor(data.simulationType), [data.simulationType]);
  const label = useMemo(() => sceneLabel(flavor), [flavor]);

  const surface = useMemo(() => extractSurface(data.visualizations, data.simulationId), [data.visualizations, data.simulationId]);
  const scatter = useMemo(() => extractScatter(data.visualizations, data.simulationId), [data.visualizations, data.simulationId]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || visible) {
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '240px 0px' },
    );
    observer.observe(host);
    return () => observer.disconnect();
  }, [visible]);

  useEffect(() => {
    if (!visible) {
      return;
    }

    const host = hostRef.current;
    if (!host) {
      return;
    }

    let cancelled = false;
    let cleanup = () => {};

    const boot = async () => {
      const [THREE, { OrbitControls }, postFx] = await Promise.all([
        import('three'),
        import('three/examples/jsm/controls/OrbitControls.js'),
        Promise.all([
          import('three/examples/jsm/postprocessing/EffectComposer.js'),
          import('three/examples/jsm/postprocessing/RenderPass.js'),
          import('three/examples/jsm/postprocessing/UnrealBloomPass.js'),
          import('three/examples/jsm/postprocessing/SSAOPass.js'),
        ]),
      ]).then(([three, controls, fx]) => {
        const [composer, renderPass, bloomPass, ssaoPass] = fx;
        return [
          three,
          controls,
          {
            EffectComposer: composer.EffectComposer,
            RenderPass: renderPass.RenderPass,
            UnrealBloomPass: bloomPass.UnrealBloomPass,
            SSAOPass: ssaoPass.SSAOPass,
          },
        ] as const;
      });

      if (cancelled) {
        return;
      }

      const width = host.clientWidth;
      const height = host.clientHeight;
      const lowPower = (
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
        || width < 920
        || (((navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8) <= 4)
        || ((navigator.hardwareConcurrency ?? 8) <= 4)
      );
      const quality: QualityMode = lowPower ? 'low' : 'high';
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(50, width / Math.max(1, height), 0.1, 100);
      camera.position.set(7.4, 5.2, 8.4);
      scene.add(camera);

      buildEnvironment(THREE, scene);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: lowPower ? 'low-power' : 'high-performance' });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, lowPower ? 1.2 : 1.8));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      host.appendChild(renderer.domElement);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.08;
      controls.rotateSpeed = lowPower ? 0.58 : 0.8;
      controls.minDistance = 4.6;
      controls.maxDistance = 18;

      const composer = new postFx.EffectComposer(renderer);
      const renderPass = new postFx.RenderPass(scene, camera);
      const bloom = new postFx.UnrealBloomPass(new THREE.Vector2(width, height), lowPower ? 0.42 : 0.65, 0.62, 0.86);
      const ssao = new postFx.SSAOPass(scene, camera, width, height);
      ssao.kernelRadius = lowPower ? 5 : 11;
      ssao.minDistance = 0.002;
      ssao.maxDistance = 0.1;
      composer.addPass(renderPass);
      composer.addPass(ssao);
      composer.addPass(bloom);

      host.dataset.seed = data.simulationId;
      const controller = buildScene({
        THREE,
        scene,
        camera,
        renderer,
        host,
        quality,
        flavor,
        surface,
        scatter,
        onHover: setHover,
      });
      const target = new THREE.Vector3(controller.cameraTarget.x, controller.cameraTarget.y, controller.cameraTarget.z);

      let raf = 0;
      let start = 0;
      const animate = (timestamp: number) => {
        if (cancelled) {
          return;
        }
        if (!start) {
          start = timestamp;
        }
        const elapsed = (timestamp - start) / 1000;

        if (elapsed < 3.2) {
          camera.position.lerp(target, 0.016);
        }

        controller.animate(elapsed);
        controls.update();
        composer.render();
        raf = window.requestAnimationFrame(animate);
      };
      raf = window.requestAnimationFrame(animate);

      const onResize = () => {
        const nextW = host.clientWidth;
        const nextH = host.clientHeight;
        camera.aspect = nextW / Math.max(1, nextH);
        camera.updateProjectionMatrix();
        renderer.setSize(nextW, nextH);
        composer.setSize(nextW, nextH);
      };
      window.addEventListener('resize', onResize);

      const pointerMove = (event: PointerEvent) => controller.onPointerMove?.(event);
      const pointerLeave = () => controller.onPointerLeave?.();
      host.addEventListener('pointermove', pointerMove);
      host.addEventListener('pointerleave', pointerLeave);

      cleanup = () => {
        window.cancelAnimationFrame(raf);
        window.removeEventListener('resize', onResize);
        host.removeEventListener('pointermove', pointerMove);
        host.removeEventListener('pointerleave', pointerLeave);
        setHover(null);
        controller.dispose();
        controls.dispose();
        composer.dispose();
        renderer.dispose();
        renderer.forceContextLoss();
        renderer.domElement.remove();
      };
    };

    void boot();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [data.simulationId, flavor, scatter, surface, visible]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs uppercase tracking-[0.16em]" style={{ color: 'var(--signal-cyan)' }}>
            {label.title}
          </p>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
            {label.copy}
          </p>
        </div>
        <div
          className="rounded-xl px-3 py-1.5 text-[11px]"
          style={{ border: '1px solid var(--glass-stroke)', background: 'rgba(22, 32, 51, 0.8)', color: 'var(--text-muted)' }}
        >
          Drag to rotate · Scroll to zoom · Hover for signals
        </div>
      </div>

      <div
        ref={hostRef}
        className="relative rounded-3xl overflow-hidden"
        style={{
          height: 'min(66vh, 620px)',
          border: '1px solid var(--glass-stroke)',
          background: 'linear-gradient(180deg, rgba(14, 22, 36, 0.94), rgba(8, 14, 24, 0.98))',
        }}
      >
        {!visible && (
          <div className="absolute inset-0 grid place-items-center">
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Preparing adaptive 3D engine…</p>
          </div>
        )}

        {hover && (
          <div
            className="absolute z-30 pointer-events-none rounded-xl px-3 py-2"
            style={{
              left: hover.x,
              top: hover.y,
              transform: 'translate3d(0, 0, 0)',
              border: '1px solid rgba(110, 231, 255, 0.34)',
              background: 'rgba(8, 14, 24, 0.9)',
              color: 'var(--text-main)',
              boxShadow: '0 16px 34px rgba(2, 8, 20, 0.55)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <p className="text-[11px] font-semibold">{hover.title}</p>
            <p className="text-[11px]" style={{ color: 'var(--text-soft)' }}>{hover.value}</p>
          </div>
        )}
      </div>
    </div>
  );
}

interface ThreeDTabPanelProps {
  threeD: ThreeDResponse | null;
  loading: boolean;
  error: string | null;
}

export default function ThreeDTabPanel({ threeD, loading, error }: ThreeDTabPanelProps) {
  if (loading) {
    return <Loader size="md" message="Loading premium 3D intelligence layer..." />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (!threeD) {
    return <Loader size="md" message="Preparing adaptive 3D scene..." />;
  }

  return (
    <Card className="p-0" glow="cyan">
      <div className="p-5 md:p-6">
        <ThreeDScene data={threeD} />
      </div>
    </Card>
  );
}
