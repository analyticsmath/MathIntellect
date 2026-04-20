import { Injectable, BadRequestException } from '@nestjs/common';
import {
  MarketParams,
  MarketResult,
  ProgressCallback,
} from '../interfaces/engine.interfaces';

/**
 * Market Simulation Engine — Geometric Brownian Motion (GBM)
 *
 * Supports:
 * - single-asset GBM
 * - multi-asset portfolio simulation
 * - optional regime switching
 * - optional volatility clustering (GARCH-like approximation)
 */
@Injectable()
export class MarketEngine {
  private readonly TRADING_DAYS_PER_YEAR = 252;

  async run(
    params: MarketParams,
    onProgress?: ProgressCallback,
  ): Promise<MarketResult> {
    const t0 = Date.now();
    const { initialPrice, volatility, drift, timeHorizonDays, paths, seed } =
      params;

    if (initialPrice <= 0)
      throw new BadRequestException('initialPrice must be > 0');
    if (volatility < 0) throw new BadRequestException('volatility must be ≥ 0');
    if (timeHorizonDays < 1)
      throw new BadRequestException('timeHorizonDays must be ≥ 1');
    if (paths < 1 || paths > 10_000)
      throw new BadRequestException('paths must be 1–10,000');

    const rng = this.buildRng(seed);
    const dt = 1 / this.TRADING_DAYS_PER_YEAR;

    const assets = this.resolveAssets(params);
    const assetCount = assets.length;
    const weights = this.normalizeWeights(assets.map((asset) => asset.weight));

    const correlation = this.resolveCorrelationMatrix(
      params.portfolioCorrelationMatrix,
      assetCount,
    );
    const cholesky = this.cholesky(correlation);

    const allPaths: number[][] = [];
    const finalPrices: number[] = new Array(paths);
    const assetFinalPrices: Record<string, number[]> = {};
    const dayReturnAccumulator = new Array<number>(timeHorizonDays).fill(0);
    const dayReturnCounts = new Array<number>(timeHorizonDays).fill(0);
    const shockEventsApplied: Array<{
      path: number;
      day: number;
      magnitude: number;
      label: string;
    }> = [];
    const explicitShockMap = this.normalizeShockEvents(
      params.shockEvents,
      timeHorizonDays,
    );
    const shockEventProbability = this.clamp(
      params.shockEventProbability ?? 0,
      0,
      0.2,
    );
    const shockMagnitude = this.clamp(params.shockMagnitude ?? 0.08, 0.005, 0.6);
    assets.forEach((asset) => {
      assetFinalPrices[asset.id] = new Array(paths);
    });

    let maxDrawdown = 0;

    const BATCH = Math.max(1, Math.ceil(paths / 10));

    for (let pStart = 0; pStart < paths; pStart += BATCH) {
      const pEnd = Math.min(pStart + BATCH, paths);

      for (let p = pStart; p < pEnd; p++) {
        const assetPrices = assets.map((asset) => asset.initialPrice);
        const sigmaState = assets.map((asset) => asset.volatility);
        const previousLogReturns = assets.map(() => 0);
        const portfolioPath = new Array<number>(timeHorizonDays + 1);

        let regimeState = 0;
        portfolioPath[0] = this.portfolioValue(assetPrices, weights);

        for (let d = 1; d <= timeHorizonDays; d++) {
          if (params.regimeSwitching) {
            regimeState = this.nextRegime(
              regimeState,
              params.regimeTransitionMatrix,
              rng,
            );
          }

          const shocks = this.correlatedNormals(assetCount, cholesky, rng);

          for (let assetIndex = 0; assetIndex < assetCount; assetIndex++) {
            const asset = assets[assetIndex];

            let effectiveSigma = asset.volatility;

            if (params.regimeSwitching) {
              const multipliers = params.regimeVolatilityMultipliers ?? [1, 1.8];
              const regimeMultiplier =
                multipliers[regimeState] ?? multipliers[multipliers.length - 1] ?? 1;
              effectiveSigma *= regimeMultiplier;
            }

            if (params.volatilityClustering) {
              const alpha = this.clamp(params.garchAlpha ?? 0.08, 0.01, 0.35);
              const beta = this.clamp(params.garchBeta ?? 0.86, 0.5, 0.97);
              const omega = Math.max(1e-8, (1 - alpha - beta) * asset.volatility ** 2);

              sigmaState[assetIndex] = Math.sqrt(
                omega +
                  alpha * previousLogReturns[assetIndex] ** 2 +
                  beta * sigmaState[assetIndex] ** 2,
              );
              effectiveSigma = sigmaState[assetIndex];
            }

            const driftAdj = (asset.drift - 0.5 * effectiveSigma ** 2) * dt;
            const volComponent = effectiveSigma * Math.sqrt(dt) * shocks[assetIndex];
            let nextPrice =
              assetPrices[assetIndex] * Math.exp(driftAdj + volComponent);

            const explicitShock = explicitShockMap.get(d) ?? 0;
            const randomShock =
              shockEventProbability > 0 && rng() < shockEventProbability
                ? (rng() < 0.5 ? -1 : 1) * shockMagnitude
                : 0;
            const totalShock = explicitShock + randomShock;

            if (totalShock !== 0) {
              nextPrice *= Math.max(0.2, 1 + totalShock);
              if (shockEventsApplied.length < 650) {
                shockEventsApplied.push({
                  path: p,
                  day: d,
                  magnitude: Number(totalShock.toFixed(6)),
                  label: explicitShock !== 0 ? 'configured' : 'stochastic',
                });
              }
            }

            previousLogReturns[assetIndex] =
              Math.log(nextPrice / Math.max(assetPrices[assetIndex], Number.EPSILON));
            assetPrices[assetIndex] = nextPrice;
          }

          const previousPortfolio = portfolioPath[d - 1] ?? portfolioPath[0];
          const currentPortfolio = this.portfolioValue(assetPrices, weights);
          portfolioPath[d] = currentPortfolio;

          const dailyReturn =
            (currentPortfolio - previousPortfolio) /
            Math.max(previousPortfolio, Number.EPSILON);
          dayReturnAccumulator[d - 1] += dailyReturn;
          dayReturnCounts[d - 1] += 1;
        }

        if (paths <= 100) {
          allPaths.push(portfolioPath);
        }

        const portfolioFinal = portfolioPath[timeHorizonDays];
        finalPrices[p] = portfolioFinal;

        assets.forEach((asset, index) => {
          assetFinalPrices[asset.id][p] = assetPrices[index];
        });

        maxDrawdown = Math.max(maxDrawdown, this.computePathDrawdown(portfolioPath));
      }

      const progress = Math.round((pEnd / paths) * 100);
      onProgress?.(progress, { pathsProcessed: pEnd, total: paths });

      if (pEnd < paths) {
        await new Promise<void>((resolve) => setImmediate(resolve));
      }
    }

    const sorted = [...finalPrices].sort((a, b) => a - b);
    const mean = finalPrices.reduce((s, v) => s + v, 0) / paths;
    const variance =
      finalPrices.reduce((s, v) => s + (v - mean) ** 2, 0) / paths;
    const stdDev = Math.sqrt(variance);
    const valueAtRisk95 = this.percentile(sorted, 5);
    const mid = Math.floor(paths / 2);
    const median =
      paths % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];

    const T = timeHorizonDays / this.TRADING_DAYS_PER_YEAR;
    const annualizedReturn = Math.log(mean / Math.max(initialPrice, 1e-6)) / T;
    const annualizedVolatility = stdDev / (Math.max(initialPrice, 1e-6) * Math.sqrt(T));
    const detectedRegimes = this.detectRegimes(
      dayReturnAccumulator,
      dayReturnCounts,
    );
    const sentimentProxy =
      params.sentimentModeling === false
        ? undefined
        : this.buildSentimentProxy(
            annualizedReturn,
            annualizedVolatility,
            maxDrawdown,
            detectedRegimes,
          );

    return {
      type: 'market',
      paths: allPaths,
      finalPrices,
      assetFinalPrices: assetCount > 1 ? assetFinalPrices : undefined,
      expectedFinalPrice: mean,
      valueAtRisk95,
      maxDrawdown,
      annualizedReturn,
      annualizedVolatility,
      detectedRegimes,
      shockEventsApplied: shockEventsApplied.length > 0 ? shockEventsApplied : undefined,
      sentimentProxy,
      priceStats: {
        mean,
        stdDev,
        min: sorted[0],
        max: sorted[sorted.length - 1],
        median,
      },
      executionTimeMs: Date.now() - t0,
    };
  }

  private resolveAssets(
    params: MarketParams,
  ): Array<{
    id: string;
    initialPrice: number;
    volatility: number;
    drift: number;
    weight: number;
  }> {
    const assets = Array.isArray(params.assets) ? params.assets : [];

    if (assets.length === 0) {
      return [
        {
          id: 'asset_1',
          initialPrice: params.initialPrice,
          volatility: params.volatility,
          drift: params.drift,
          weight: 1,
        },
      ];
    }

    return assets.map((asset, index) => ({
      id: asset.id || `asset_${index + 1}`,
      initialPrice: this.clamp(asset.initialPrice, 1e-6, Number.MAX_SAFE_INTEGER),
      volatility: this.clamp(asset.volatility, 0, 5),
      drift: this.clamp(asset.drift, -2, 2),
      weight: Number.isFinite(asset.weight) ? asset.weight : 1,
    }));
  }

  private normalizeWeights(weights: number[]): number[] {
    const positives = weights.map((weight) => (weight > 0 ? weight : 0));
    const total = positives.reduce((sum, value) => sum + value, 0);

    if (total <= 0) {
      return positives.map(() => 1 / positives.length);
    }

    return positives.map((value) => value / total);
  }

  private resolveCorrelationMatrix(
    matrix: number[][] | undefined,
    size: number,
  ): number[][] {
    if (!Array.isArray(matrix) || matrix.length !== size) {
      return this.identity(size);
    }

    const valid = matrix.every((row) => Array.isArray(row) && row.length === size);
    if (!valid) {
      return this.identity(size);
    }

    return matrix.map((row, rowIndex) =>
      row.map((value, colIndex) => {
        if (rowIndex === colIndex) return 1;
        return this.clamp(value, -0.95, 0.95);
      }),
    );
  }

  private identity(size: number): number[][] {
    return Array.from({ length: size }, (_, row) =>
      Array.from({ length: size }, (_, col) => (row === col ? 1 : 0)),
    );
  }

  private cholesky(matrix: number[][]): number[][] {
    const n = matrix.length;
    const lower = Array.from({ length: n }, () => Array(n).fill(0));

    for (let i = 0; i < n; i++) {
      for (let j = 0; j <= i; j++) {
        let sum = matrix[i][j];
        for (let k = 0; k < j; k++) {
          sum -= lower[i][k] * lower[j][k];
        }

        if (i === j) {
          lower[i][j] = Math.sqrt(Math.max(sum, 1e-10));
        } else {
          lower[i][j] = sum / Math.max(lower[j][j], Number.EPSILON);
        }
      }
    }

    return lower;
  }

  private correlatedNormals(
    size: number,
    lower: number[][],
    rng: () => number,
  ): number[] {
    const independent = Array.from({ length: size }, () => this.standardNormal(rng));
    const result = new Array<number>(size).fill(0);

    for (let row = 0; row < size; row++) {
      let value = 0;
      for (let col = 0; col <= row; col++) {
        value += lower[row][col] * independent[col];
      }
      result[row] = value;
    }

    return result;
  }

  private nextRegime(
    currentRegime: number,
    transition: number[][] | undefined,
    rng: () => number,
  ): number {
    const transitions = Array.isArray(transition)
      ? transition
      : [
          [0.9, 0.1],
          [0.2, 0.8],
        ];

    const currentRow = transitions[currentRegime] ?? transitions[0] ?? [1];
    const random = rng();
    let cumulative = 0;

    for (let index = 0; index < currentRow.length; index++) {
      cumulative += currentRow[index];
      if (random <= cumulative) {
        return index;
      }
    }

    return currentRegime;
  }

  private normalizeShockEvents(
    events: Array<{ day: number; magnitude: number; label?: string }> | undefined,
    maxDay: number,
  ): Map<number, number> {
    const map = new Map<number, number>();
    if (!Array.isArray(events)) {
      return map;
    }

    for (const event of events) {
      if (
        !Number.isFinite(event.day) ||
        !Number.isFinite(event.magnitude) ||
        event.day < 1 ||
        event.day > maxDay
      ) {
        continue;
      }
      map.set(Math.round(event.day), this.clamp(event.magnitude, -0.9, 2));
    }

    return map;
  }

  private detectRegimes(
    dayReturnAccumulator: number[],
    dayReturnCounts: number[],
  ): Array<{ day: number; state: 'bull' | 'bear' | 'neutral'; signal: number }> {
    const regimes: Array<{
      day: number;
      state: 'bull' | 'bear' | 'neutral';
      signal: number;
    }> = [];

    for (let index = 0; index < dayReturnAccumulator.length; index++) {
      const avgReturn =
        dayReturnAccumulator[index] / Math.max(1, dayReturnCounts[index]);
      const signal = Number((avgReturn * 100).toFixed(5));
      const state: 'bull' | 'bear' | 'neutral' =
        avgReturn > 0.12 / 252
          ? 'bull'
          : avgReturn < -0.12 / 252
            ? 'bear'
            : 'neutral';

      regimes.push({
        day: index + 1,
        state,
        signal,
      });
    }

    return regimes;
  }

  private buildSentimentProxy(
    annualizedReturn: number,
    annualizedVolatility: number,
    maxDrawdown: number,
    regimes: Array<{ day: number; state: 'bull' | 'bear' | 'neutral'; signal: number }>,
  ): { score: number; label: 'bullish' | 'neutral' | 'bearish'; reasoning: string } {
    const bullDays = regimes.filter((regime) => regime.state === 'bull').length;
    const bearDays = regimes.filter((regime) => regime.state === 'bear').length;

    const regimeTilt =
      (bullDays - bearDays) / Math.max(1, regimes.length);

    const score = this.clamp(
      50 +
        annualizedReturn * 130 -
        annualizedVolatility * 55 -
        maxDrawdown * 36 +
        regimeTilt * 22,
      0,
      100,
    );

    const label: 'bullish' | 'neutral' | 'bearish' =
      score >= 60 ? 'bullish' : score <= 40 ? 'bearish' : 'neutral';

    const reasoning =
      `Sentiment proxy combines return (${(annualizedReturn * 100).toFixed(2)}%), ` +
      `volatility (${(annualizedVolatility * 100).toFixed(2)}%), drawdown (${(maxDrawdown * 100).toFixed(2)}%), ` +
      `and regime tilt ${regimeTilt.toFixed(3)}.`;

    return {
      score: Number(score.toFixed(3)),
      label,
      reasoning,
    };
  }

  private standardNormal(rng: () => number): number {
    let u: number, v: number, s: number;
    do {
      u = 2 * rng() - 1;
      v = 2 * rng() - 1;
      s = u * u + v * v;
    } while (s >= 1 || s === 0);
    return u * Math.sqrt((-2 * Math.log(s)) / s);
  }

  private portfolioValue(prices: number[], weights: number[]): number {
    return prices.reduce(
      (sum, price, index) => sum + price * (weights[index] ?? 0),
      0,
    );
  }

  private computePathDrawdown(path: number[]): number {
    if (path.length === 0) return 0;

    let peak = path[0];
    let maxDrawdown = 0;

    for (const value of path) {
      if (value > peak) peak = value;
      const drawdown = (peak - value) / Math.max(peak, Number.EPSILON);
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown;
      }
    }

    return maxDrawdown;
  }

  private percentile(sorted: number[], p: number): number {
    const idx = (p / 100) * (sorted.length - 1);
    const lo = Math.floor(idx);
    const hi = Math.ceil(idx);
    return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo);
  }

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

  private clamp(value: number, min: number, max: number): number {
    if (!Number.isFinite(value)) return min;
    return Math.max(min, Math.min(max, value));
  }
}
