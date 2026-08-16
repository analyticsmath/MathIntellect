/**
 * Deterministic mathematical simulation models for public interactive demonstrations.
 * All algorithms use fixed pseudo-random number generators with explicit seeds
 * to ensure 100% stable, reproducible output without Math.random().
 */

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Standard normal approximation (Box-Muller) using deterministic PRNG
function gaussianPair(prng: () => number): [number, number] {
  const u1 = Math.max(1e-7, prng());
  const u2 = prng();
  const r = Math.sqrt(-2.0 * Math.log(u1));
  const theta = 2.0 * Math.PI * u2;
  return [r * Math.cos(theta), r * Math.sin(theta)];
}

export interface MonteCarloResult {
  steps: number;
  paths: number[][];
  endpoints: number[];
  mean: number;
  variance: number;
  probAboveZero: number;
  probTailRisk: number; // P(X < -1.5)
}

/**
 * Deterministic Monte Carlo simulation
 * Model: x_t = x_{t-1} + mu*dt + sigma*sqrt(dt)*eps_t
 */
export function runDeterministicMonteCarlo(
  sigma = 0.35,
  mu = 0.05,
  steps = 50,
  numPaths = 24,
  seed = 42
): MonteCarloResult {
  const prng = mulberry32(seed);
  const dt = 1.0 / steps;
  const sqrtDt = Math.sqrt(dt);

  const paths: number[][] = [];
  const endpoints: number[] = [];

  for (let p = 0; p < numPaths; p++) {
    const path = [0];
    let current = 0;
    for (let t = 1; t <= steps; t += 2) {
      const [z1, z2] = gaussianPair(prng);
      current += mu * dt + sigma * sqrtDt * z1;
      path.push(current);
      if (t + 1 <= steps) {
        current += mu * dt + sigma * sqrtDt * z2;
        path.push(current);
      }
    }
    paths.push(path);
    endpoints.push(current);
  }

  const mean = endpoints.reduce((a, b) => a + b, 0) / endpoints.length;
  const variance =
    endpoints.reduce((a, b) => a + Math.pow(b - mean, 2), 0) /
    endpoints.length;
  const probAboveZero =
    endpoints.filter((x) => x > 0).length / endpoints.length;
  const probTailRisk =
    endpoints.filter((x) => x < -0.5).length / endpoints.length;

  return {
    steps,
    paths,
    endpoints,
    mean,
    variance,
    probAboveZero,
    probTailRisk,
  };
}

export interface GameTheoryResult {
  matrix: [[number, number], [number, number]];
  rowProbA: number; // Equilibrium prob of Row picking action A
  colProbA: number; // Equilibrium prob of Col picking action A
  expectedValue: number;
}

/**
 * Deterministic 2x2 zero-sum game equilibrium calculation
 * Matrix:
 * | a  b |
 * | c  d |
 */
export function calculateGameEquilibrium(
  a = 4,
  b = 1,
  c = 2,
  d = 5
): GameTheoryResult {
  const denom = a - b - c + d;
  let rowProbA = 0.5;
  let colProbA = 0.5;

  if (Math.abs(denom) > 1e-6) {
    rowProbA = Math.max(0, Math.min(1, (d - c) / denom));
    colProbA = Math.max(0, Math.min(1, (d - b) / denom));
  }

  const expectedValue =
    rowProbA * (colProbA * a + (1 - colProbA) * b) +
    (1 - rowProbA) * (colProbA * c + (1 - colProbA) * d);

  return {
    matrix: [
      [a, b],
      [c, d],
    ],
    rowProbA,
    colProbA,
    expectedValue,
  };
}

export interface MarketDynamicsResult {
  series: number[];
  persistence: number;
  theoreticalVariance: number;
  regimeSwitches: number;
}

/**
 * Deterministic AR(1) market persistence dynamics
 * Model: x_t = rho * x_{t-1} + eps_t
 */
export function runMarketDynamics(
  rho = 0.65,
  steps = 60,
  seed = 101
): MarketDynamicsResult {
  const prng = mulberry32(seed);
  const series: number[] = [0];
  let current = 0;
  let switches = 0;

  for (let t = 1; t < steps; t += 2) {
    const [z1, z2] = gaussianPair(prng);
    const next1 = rho * current + 0.3 * z1;
    if ((current >= 0 && next1 < 0) || (current < 0 && next1 >= 0)) switches++;
    current = next1;
    series.push(current);

    if (t + 1 < steps) {
      const next2 = rho * current + 0.3 * z2;
      if ((current >= 0 && next2 < 0) || (current < 0 && next2 >= 0)) switches++;
      current = next2;
      series.push(current);
    }
  }

  const theoreticalVariance = 0.09 / (1 - Math.min(0.99, Math.pow(rho, 2)));

  return {
    series,
    persistence: rho,
    theoreticalVariance,
    regimeSwitches: switches,
  };
}

export interface ConflictAgent {
  x: number;
  y: number;
  vx: number;
  vy: number;
  cluster: number;
}

export interface ConflictResult {
  agents: ConflictAgent[];
  coherence: number;
  clusterCount: number;
}

/**
 * Deterministic multi-agent alignment & interaction field
 */
export function runConflictInteraction(
  radius = 0.4,
  coupling = 0.5,
  numAgents = 32,
  seed = 77
): ConflictResult {
  const prng = mulberry32(seed);
  const agents: ConflictAgent[] = [];

  for (let i = 0; i < numAgents; i++) {
    const x = prng() * 100;
    const y = prng() * 100;
    const angle = prng() * Math.PI * 2;
    agents.push({
      x,
      y,
      vx: Math.cos(angle) * (1 - coupling * 0.5),
      vy: Math.sin(angle) * (1 - coupling * 0.5),
      cluster: 0,
    });
  }

  let totalVx = 0;
  let totalVy = 0;
  agents.forEach((ag) => {
    totalVx += ag.vx;
    totalVy += ag.vy;
  });

  const coherence =
    Math.sqrt(totalVx * totalVx + totalVy * totalVy) / numAgents;
  const clusterCount = Math.max(1, Math.round(6 * (1 - radius * 0.8)));

  return {
    agents,
    coherence,
    clusterCount,
  };
}
