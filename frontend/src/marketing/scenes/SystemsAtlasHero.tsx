import React from 'react';
import { Link } from 'react-router-dom';
import { ResponsiveMedia } from '../../media/ResponsiveMedia';

export const SystemsAtlasHero: React.FC = () => {
  return (
    <section className="relative w-full min-h-[92svh] md:min-h-[100svh] flex flex-col justify-between pt-24 md:pt-28 pb-12 px-6 md:px-12 lg:px-16 max-w-[1720px] mx-auto">
      {/* Top Territory: Authored Editorial Headline & Support */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 z-10">
          <h1 className="text-[46px] sm:text-[56px] md:text-[74px] lg:text-[88px] font-medium text-mi-ink tracking-tight leading-[1.04] max-w-4xl">
            Model what changes.
          </h1>
          <p className="mt-5 text-lg md:text-[21px] text-mi-text max-w-2xl font-normal leading-relaxed">
            Build simulations for uncertainty, strategy, markets and interacting systems. Inspect the mathematics behind every result.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/workbench"
              className="mi-btn-primary px-6 h-12 text-[15px]"
            >
              Open workbench
            </Link>
            <Link
              to="/models"
              className="mi-btn-secondary px-6 h-12 text-[15px]"
            >
              Explore models
            </Link>
          </div>
        </div>

        {/* Analytical detail actor (MI-03) */}
        <div className="hidden lg:flex lg:col-span-4 justify-end pt-4">
          <div className="w-[180px] xl:w-[220px] bg-mi-paper border border-mi-rule p-2.5">
            <ResponsiveMedia
              mediaKey="mi-03"
              aspectRatio="1/1"
              priority
              className="w-full"
            />
            <div className="mt-2 text-[11px] text-mi-muted font-mono flex items-center justify-between">
              <span>MI-03</span>
              <span>DRAFTING DETAIL</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dominant Spatial Center: Systems Atlas Dominant (MI-01) + Structural Foreshadowing */}
      <div className="relative mt-8 md:mt-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
        {/* Dominant MI-01 world image */}
        <div className="lg:col-span-9 relative border border-mi-rule bg-mi-paper">
          <ResponsiveMedia
            mediaKey="mi-01"
            priority
            aspectRatio="16/9"
            className="w-full max-h-[58svh] object-cover"
          />
          <div className="absolute bottom-3 left-3 bg-mi-paper/90 px-2.5 py-1 text-[11px] font-mono text-mi-ink-2 border border-mi-rule">
            SYSTEMS ATLAS • SPATIAL TOPOLOGY
          </div>
        </div>

        {/* Structural Foreshadowing Actor */}
        <div className="lg:col-span-3 border border-mi-rule bg-mi-paper p-4 flex flex-col justify-between h-full min-h-[160px]">
          <div>
            <div className="text-[11px] font-mono text-mi-muted uppercase tracking-wider">
              Structure emergence
            </div>
            <div className="text-[14px] font-medium text-mi-ink mt-1">
              Topological invariants
            </div>
            <p className="text-[13px] text-mi-text mt-1.5 leading-snug">
              Continuous physical flows reduce to discrete nodes, transitions, and probability matrices.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-mi-rule flex items-center justify-between text-[12px] font-mono text-mi-muted">
            <span>NODES: 128</span>
            <span className="text-mi-change">Δt = 0.02s</span>
          </div>
        </div>
      </div>
    </section>
  );
};
