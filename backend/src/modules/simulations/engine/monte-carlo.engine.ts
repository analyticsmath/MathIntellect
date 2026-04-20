import { Injectable, BadRequestException } from '@nestjs/common';
import {
  MonteCarloParams,
  MonteCarloResult,
  VariableDefinition,
  HistogramBin,
  ProgressCallback,
} from '../interfaces/engine.interfaces';

/**
 * Monte Carlo Engine
 *
 * Runs N independent random trials by sampling each input variable from its
 * declared probability distribution and evaluating a safe arithmetic expression.
 * Executes in batches of ~10% so WebSocket progress events are dispatched
 * between batches via setImmediate yielding.
 */
@Injectable()
export class MonteCarloEngine {
  async run(
    params: MonteCarloParams,
    onProgress?: ProgressCallback,
  ): Promise<MonteCarloResult> {
    const t0 = Date.now();
    const { iterations, variables, seed } = params;

    if (iterations < 1 || iterations > 1_000_000) {
      throw new BadRequestException(
        'iterations must be between 1 and 1,000,000',
      );
    }

    const rng = this.buildRng(seed);
    const samples: number[] = new Array(iterations);
    const tailRiskAmplifier =
      typeof params.tailRiskAmplifier === 'number' &&
      Number.isFinite(params.tailRiskAmplifier)
        ? Math.max(1, params.tailRiskAmplifier)
        : 1;
    const scenarioBranchDepth = this.clampInt(
      params.scenarioBranchDepth ?? 2,
      1,
      5,
    );
    const riskCurveWindows = this.clampInt(params.riskCurveWindows ?? 20, 8, 80);

    const normalVariableIndexes = variables
      .map((entry, index) => ({ distribution: entry.distribution, index }))
      .filter((entry) => entry.distribution === 'normal')
      .map((entry) => entry.index);

    const correlationMatrix = this.normalizeCorrelationMatrix(
      params.correlationMatrix,
      normalVariableIndexes.length,
    );

    const correlationCholesky =
      correlationMatrix.length >= 2
        ? this.choleskyDecomposition(correlationMatrix)
        : null;

    const normalIndexMap = new Map<number, number>();
    normalVariableIndexes.forEach((value, index) => {
      normalIndexMap.set(value, index);
    });

    // Process in ~10 batches so progress events are emitted between them
    const BATCH = Math.max(100, Math.ceil(iterations / 10));

    for (let start = 0; start < iterations; start += BATCH) {
      const end = Math.min(start + BATCH, iterations);

      for (let i = start; i < end; i++) {
        const context: Record<string, number> = {};
        const correlatedNormals =
          correlationCholesky && normalVariableIndexes.length >= 2
            ? this.multiplyLowerTriangular(
                correlationCholesky,
                normalVariableIndexes.map(() => this.standardNormal(rng)),
              )
            : [];

        for (let variableIndex = 0; variableIndex < variables.length; variableIndex++) {
          const v = variables[variableIndex];
          const index = variableIndex;
          const normalPosition = normalIndexMap.get(index);

          if (v.distribution === 'normal' && normalPosition !== undefined) {
            const p = v.params;
            const mean = p.mean ?? 0;
            const std = p.std ?? 1;
            const z =
              correlatedNormals[normalPosition] ?? this.standardNormal(rng);
            let sampled = mean + std * z;

            if (tailRiskAmplifier > 1 && rng() > 0.97) {
              sampled = mean + (sampled - mean) * tailRiskAmplifier;
            }

            context[v.name] = sampled;
            continue;
          }

          context[v.name] = this.sample(v, rng);
        }
        samples[i] = this.evaluate(params.outputExpression, context);
      }

      const progress = Math.round((end / iterations) * 100);
      onProgress?.(progress, { samplesProcessed: end, total: iterations });

      // Yield to event loop so WS events can be flushed between batches
      if (end < iterations) {
        await new Promise<void>((resolve) => setImmediate(resolve));
      }
    }

    const sorted = [...samples].sort((a, b) => a - b);
    const mean = samples.reduce((s, v) => s + v, 0) / iterations;
    const variance =
      samples.reduce((s, v) => s + (v - mean) ** 2, 0) / iterations;
    const stdDev = Math.sqrt(variance);
    const min = sorted[0];
    const max = sorted[iterations - 1];
    const median = this.percentile(sorted, 50);
    const percentile95 = this.percentile(sorted, 95);
    const percentile5 = this.percentile(sorted, 5);
    const histogram = this.buildHistogram(sorted, 20);
    const scenarioBranches = this.buildScenarioBranches(
      sorted,
      scenarioBranchDepth,
    );
    const riskEvolutionCurve = this.buildRiskEvolutionCurve(
      samples,
      riskCurveWindows,
    );
    const confidenceStory = this.buildConfidenceStory(
      mean,
      stdDev,
      percentile5,
      percentile95,
      iterations,
    );

    return {
      type: 'monte_carlo',
      iterations,
      samples: iterations <= 10_000 ? samples : [],
      expectedValue: mean,
      variance,
      stdDev,
      min,
      max,
      median,
      percentile95,
      percentile5,
      histogram,
      scenarioBranches,
      riskEvolutionCurve,
      confidenceStory,
      executionTimeMs: Date.now() - t0,
    };
  }

  // ─── Sampling ───────────────────────────────────────────────────────────────

  private sample(v: VariableDefinition, rng: () => number): number {
    const p = v.params;
    switch (v.distribution) {
      case 'normal': {
        const z = this.standardNormal(rng);
        return (p.mean ?? 0) + (p.std ?? 1) * z;
      }
      case 'uniform':
        return (p.min ?? 0) + rng() * ((p.max ?? 1) - (p.min ?? 0));
      case 'exponential':
        return -Math.log(1 - rng()) / (p.lambda ?? p.rate ?? 1);
      case 'bernoulli':
        return rng() < (p.p ?? p.probability ?? 0.5) ? 1 : 0;
      default:
        throw new BadRequestException(
          `Unknown distribution: ${v.distribution}`,
        );
    }
  }

  // ─── Expression evaluator (safe subset) ─────────────────────────────────────

  private evaluate(expr: string, ctx: Record<string, number>): number {
    let resolved = expr;
    for (const [name, value] of Object.entries(ctx)) {
      resolved = resolved.replace(
        new RegExp(`\\b${name}\\b`, 'g'),
        String(value),
      );
    }
    if (!/^[\d\s\.\+\-\*\/\(\)eE]+$/.test(resolved)) {
      throw new BadRequestException(`Unsafe expression: ${expr}`);
    }
    try {
      return Function(`"use strict"; return (${resolved})`)() as number;
    } catch {
      throw new BadRequestException(`Cannot evaluate expression: ${expr}`);
    }
  }

  // ─── Statistics helpers ─────────────────────────────────────────────────────

  private percentile(sorted: number[], p: number): number {
    const idx = (p / 100) * (sorted.length - 1);
    const lo = Math.floor(idx);
    const hi = Math.ceil(idx);
    return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo);
  }

  private buildHistogram(sorted: number[], bins: number): HistogramBin[] {
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const width = (max - min) / bins || 1;
    const result: HistogramBin[] = [];

    for (let i = 0; i < bins; i++) {
      const binMin = min + i * width;
      const binMax = binMin + width;
      const count = sorted.filter(
        (v) => v >= binMin && (i === bins - 1 ? v <= binMax : v < binMax),
      ).length;
      result.push({
        min: binMin,
        max: binMax,
        count,
        frequency: count / sorted.length,
      });
    }
    return result;
  }

  private buildScenarioBranches(
    sorted: number[],
    depth: number,
  ): Array<{
    id: string;
    depth: number;
    label: string;
    probability: number;
    mean: number;
    range: [number, number];
  }> {
    if (sorted.length === 0) {
      return [];
    }

    const branches: Array<{
      id: string;
      depth: number;
      label: string;
      probability: number;
      mean: number;
      range: [number, number];
    }> = [];

    const recurse = (
      values: number[],
      currentDepth: number,
      id: string,
      label: string,
    ) => {
      if (values.length === 0) return;
      const min = values[0];
      const max = values[values.length - 1];
      const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
      branches.push({
        id,
        depth: currentDepth,
        label,
        probability: Number((values.length / sorted.length).toFixed(4)),
        mean: Number(mean.toFixed(6)),
        range: [Number(min.toFixed(6)), Number(max.toFixed(6))],
      });

      if (currentDepth >= depth) return;

      const q1 = Math.floor(values.length / 3);
      const q2 = Math.floor((values.length * 2) / 3);
      const left = values.slice(0, q1);
      const mid = values.slice(q1, q2);
      const right = values.slice(q2);

      recurse(left, currentDepth + 1, `${id}-L`, `${label} / Conservative`);
      recurse(mid, currentDepth + 1, `${id}-M`, `${label} / Baseline`);
      recurse(right, currentDepth + 1, `${id}-H`, `${label} / Opportunistic`);
    };

    recurse(sorted, 1, 'root', 'Scenario Root');
    return branches;
  }

  private buildRiskEvolutionCurve(
    samples: number[],
    windows: number,
  ): Array<{
    step: number;
    expectedValue: number;
    riskScore: number;
    lowerBand: number;
    upperBand: number;
  }> {
    if (samples.length === 0) return [];

    const points: Array<{
      step: number;
      expectedValue: number;
      riskScore: number;
      lowerBand: number;
      upperBand: number;
    }> = [];

    const stepSize = Math.max(1, Math.floor(samples.length / windows));
    for (let end = stepSize; end <= samples.length; end += stepSize) {
      const slice = samples.slice(0, end);
      const mean = slice.reduce((sum, value) => sum + value, 0) / slice.length;
      const variance =
        slice.reduce((sum, value) => sum + (value - mean) ** 2, 0) /
        slice.length;
      const std = Math.sqrt(variance);
      const riskScore = this.clamp(std * 7.5 + Math.abs(mean) * 0.4, 0, 100);

      points.push({
        step: end,
        expectedValue: Number(mean.toFixed(6)),
        riskScore: Number(riskScore.toFixed(4)),
        lowerBand: Number((mean - 1.96 * std).toFixed(6)),
        upperBand: Number((mean + 1.96 * std).toFixed(6)),
      });
    }

    if (points.at(-1)?.step !== samples.length) {
      const mean = samples.reduce((sum, value) => sum + value, 0) / samples.length;
      const variance =
        samples.reduce((sum, value) => sum + (value - mean) ** 2, 0) /
        samples.length;
      const std = Math.sqrt(variance);
      points.push({
        step: samples.length,
        expectedValue: Number(mean.toFixed(6)),
        riskScore: Number(this.clamp(std * 7.5 + Math.abs(mean) * 0.4, 0, 100).toFixed(4)),
        lowerBand: Number((mean - 1.96 * std).toFixed(6)),
        upperBand: Number((mean + 1.96 * std).toFixed(6)),
      });
    }

    return points;
  }

  private buildConfidenceStory(
    mean: number,
    stdDev: number,
    p5: number,
    p95: number,
    iterations: number,
  ): string[] {
    const bandWidth = Math.abs(p95 - p5);
    const stabilityTag =
      stdDev < Math.max(1, Math.abs(mean)) * 0.45
        ? 'stable'
        : stdDev < Math.max(1, Math.abs(mean)) * 0.9
          ? 'moderately volatile'
          : 'highly volatile';

    return [
      `Expected outcome centers near ${mean.toFixed(4)} after ${iterations.toLocaleString()} trials.`,
      `Confidence interval proxy (5th–95th) spans ${p5.toFixed(4)} to ${p95.toFixed(4)} with width ${bandWidth.toFixed(4)}.`,
      `Risk posture is ${stabilityTag}; standard deviation is ${stdDev.toFixed(4)} relative to mean.`,
    ];
  }

  // ─── Seeded RNG (Mulberry32) ────────────────────────────────────────────────

  private buildRng(seed?: number): () => number {
    if (seed === undefined) return Math.random;
    let s = seed >>> 0;
    return () => {
      s += 0x6d2b79f5;
      let t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  private standardNormal(rng: () => number): number {
    const u1 = Math.max(rng(), Number.EPSILON);
    const u2 = rng();
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  }

  private normalizeCorrelationMatrix(
    matrix: number[][] | undefined,
    size: number,
  ): number[][] {
    if (!Array.isArray(matrix) || size < 2) {
      return [];
    }

    const validShape =
      matrix.length === size && matrix.every((row) => row.length === size);
    if (!validShape) {
      return [];
    }

    return matrix.map((row, rowIndex) =>
      row.map((value, colIndex) => {
        if (rowIndex === colIndex) {
          return 1;
        }
        return this.clamp(value, -0.95, 0.95);
      }),
    );
  }

  private choleskyDecomposition(matrix: number[][]): number[][] | null {
    const n = matrix.length;
    if (n === 0) return null;

    const lower = Array.from({ length: n }, () => Array(n).fill(0));

    for (let i = 0; i < n; i++) {
      for (let j = 0; j <= i; j++) {
        let sum = matrix[i][j];
        for (let k = 0; k < j; k++) {
          sum -= lower[i][k] * lower[j][k];
        }

        if (i === j) {
          if (sum <= 0) {
            return null;
          }
          lower[i][j] = Math.sqrt(sum);
        } else {
          lower[i][j] = sum / Math.max(lower[j][j], Number.EPSILON);
        }
      }
    }

    return lower;
  }

  private multiplyLowerTriangular(
    lower: number[][],
    vector: number[],
  ): number[] {
    const n = lower.length;
    const result = new Array<number>(n).fill(0);

    for (let row = 0; row < n; row++) {
      let value = 0;
      for (let col = 0; col <= row; col++) {
        value += lower[row][col] * (vector[col] ?? 0);
      }
      result[row] = value;
    }

    return result;
  }

  private clamp(value: number, min: number, max: number): number {
    if (!Number.isFinite(value)) return min;
    return Math.max(min, Math.min(max, value));
  }

  private clampInt(value: number, min: number, max: number): number {
    return Math.round(this.clamp(value, min, max));
  }
}
