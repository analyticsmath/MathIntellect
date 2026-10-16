import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { MonteCarloResult } from "../../math/deterministicModels";
import { TrajectoryPlot } from "./TrajectoryPlot";

type ModelJourneyProps = {
  mu: number;
  sigma: number;
  seed: number;
  paths: number;
  current: MonteCarloResult;
};

function EndpointDistribution({ result }: { result: MonteCarloResult }) {
  const endpoints = result.paths.map((path) => path[path.length - 1] ?? 0);
  const min = Math.min(...endpoints);
  const max = Math.max(...endpoints);
  const span = Math.max(max - min, 0.0001);
  const binCount = 14;
  const bins = Array.from({ length: binCount }, () => 0);
  endpoints.forEach((value) => {
    const index = Math.min(binCount - 1, Math.floor(((value - min) / span) * binCount));
    bins[index] += 1;
  });

  const left = 76;
  const top = 44;
  const chartWidth = 790;
  const chartHeight = 250;
  const slot = chartWidth / binCount;
  const barWidth = slot * 0.64;
  const maxCount = Math.max(...bins, 1);
  const meanX = left + ((result.mean - min) / span) * chartWidth;

  return (
    <svg
      className="mi-endpoint-distribution"
      viewBox="0 0 930 370"
      role="img"
      aria-label={"Distribution of " + endpoints.length + " calculated endpoints. Mean " + result.mean.toFixed(4) + "; variance " + result.variance.toFixed(4) + "."}
    >
      <line className="mi-histogram-axis" x1={left} y1={top + chartHeight} x2={left + chartWidth} y2={top + chartHeight} />
      <line className="mi-histogram-mean" x1={meanX} y1={top - 6} x2={meanX} y2={top + chartHeight} />
      {bins.map((count, index) => {
        const height = (count / maxCount) * chartHeight;
        return (
          <rect
            key={index}
            className="mi-histogram-bar"
            x={left + index * slot + (slot - barWidth) / 2}
            y={top + chartHeight - height}
            width={barWidth}
            height={height}
          />
        );
      })}
      <g className="mi-histogram-labels" aria-hidden="true">
        <text x={left} y="340">{min.toFixed(2)}</text>
        <text x={left + chartWidth} y="340" textAnchor="end">{max.toFixed(2)}</text>
        <text x={meanX + 8} y="34">mean {result.mean.toFixed(3)}</text>
      </g>
    </svg>
  );
}

export function ModelJourney({ mu, sigma, seed, paths, current }: ModelJourneyProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia(section);

    media.add("(min-width: 960px) and (prefers-reduced-motion: no-preference)", () => {
      const steps = gsap.utils.toArray<HTMLElement>("[data-journey-step]", section);
      const stages = gsap.utils.toArray<HTMLElement>("[data-journey-stage]", section);
      if (!steps.length || !stages.length) return;

      gsap.set(steps, { autoAlpha: 0.42, y: 10 });
      gsap.set(steps[0], { autoAlpha: 1, y: 0 });
      gsap.set(stages, { autoAlpha: 0, y: 18, scale: 0.985 });
      gsap.set(stages[0], { autoAlpha: 1, y: 0, scale: 1 });

      let activeIndex = 0;
      const activate = (index: number) => {
        if (index === activeIndex) return;
        activeIndex = index;
        steps.forEach((step, stepIndex) => {
          gsap.to(step, {
            autoAlpha: stepIndex === index ? 1 : 0.42,
            y: stepIndex === index ? 0 : 10,
            duration: 0.68,
            ease: "power3.out",
            overwrite: "auto",
          });
        });
        stages.forEach((stage, stageIndex) => {
          gsap.to(stage, {
            autoAlpha: stageIndex === index ? 1 : 0,
            y: stageIndex === index ? 0 : -16,
            scale: stageIndex === index ? 1 : 0.985,
            duration: stageIndex === index ? 0.72 : 0.48,
            ease: stageIndex === index ? "power3.out" : "power2.inOut",
            overwrite: "auto",
          });
        });
      };

      steps.forEach((step, index) => {
        ScrollTrigger.create({
          trigger: step,
          start: "top 58%",
          end: "bottom 45%",
          onEnter: () => activate(index),
          onEnterBack: () => activate(index),
        });
      });
    });

    return () => media.revert();
  }, []);

  return (
    <section className="mi-journey" id="model-story" ref={sectionRef} aria-labelledby="mi-journey-title">
      <header className="mi-journey-intro" data-reveal>
        <h2 id="mi-journey-title">Follow one calculation from input to evidence.</h2>
        <p>
          This public example keeps its conditions in view as it moves from a seeded model to its sampled outcomes.
        </p>
      </header>

      <div className="mi-journey-layout">
        <div className="mi-journey-steps">
          <article className="mi-journey-step" data-journey-step>
            <h3>Set the conditions.</h3>
            <p>
              The run starts at zero. Drift, volatility, path count, horizon, and seed define the calculation.
            </p>
          </article>
          <article className="mi-journey-step" data-journey-step>
            <h3>Calculate every path.</h3>
            <p>
              The same seeded model adds one Gaussian step at a time. All 24 paths share the same starting value and assumptions.
            </p>
          </article>
          <article className="mi-journey-step" data-journey-step>
            <h3>Read the endpoints.</h3>
            <p>
              The distribution summarizes these 24 outcomes. It describes this sample, not a guaranteed real-world result.
            </p>
          </article>
        </div>

        <div className="mi-journey-visual" aria-label="The same calculation shown at three stages">
          <figure className="mi-journey-stage mi-journey-stage--conditions" data-journey-stage>
            <dl className="mi-journey-condition-sheet">
              <div><dt>Starting value</dt><dd>0</dd></div>
              <div><dt>Drift</dt><dd>μ {mu.toFixed(2)}</dd></div>
              <div><dt>Volatility</dt><dd>σ {sigma.toFixed(2)}</dd></div>
              <div><dt>Paths</dt><dd>{paths}</dd></div>
              <div><dt>Steps</dt><dd>{current.steps}</dd></div>
              <div><dt>Seed</dt><dd>{seed}</dd></div>
            </dl>
          </figure>
          <figure className="mi-journey-stage mi-journey-stage--paths" data-journey-stage data-path-draw>
            <TrajectoryPlot current={current} draw />
          </figure>
          <figure className="mi-journey-stage mi-journey-stage--distribution" data-journey-stage>
            <EndpointDistribution result={current} />
            <dl className="mi-journey-endpoint-stats">
              <div><dt>Mean</dt><dd>{current.mean.toFixed(4)}</dd></div>
              <div><dt>Variance</dt><dd>{current.variance.toFixed(4)}</dd></div>
              <div><dt>Endpoints</dt><dd>{current.paths.length}</dd></div>
            </dl>
          </figure>
        </div>
      </div>
    </section>
  );
}

export default ModelJourney;
