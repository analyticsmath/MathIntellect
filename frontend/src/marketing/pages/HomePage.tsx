import React from 'react';
import { RealityStructureScene } from '../scenes/home/RealityStructureScene';
import { UncertaintyScene } from '../scenes/home/UncertaintyScene';
import { SystemsReelScene } from '../scenes/home/SystemsReelScene';
import { StrategyScene } from '../scenes/home/StrategyScene';
import { MarketRegimeScene } from '../scenes/home/MarketRegimeScene';
import { ConflictInteractionScene } from '../scenes/home/ConflictInteractionScene';
import { PerturbCompareScene } from '../scenes/home/PerturbCompareScene';
import { ReplayScene } from '../scenes/home/ReplayScene';
import { ReturnScene } from '../scenes/home/ReturnScene';

export const HomePage: React.FC = () => {
  return (
    <div className="w-full">
      {/* Movement 00 & 01: Reality -> Structure */}
      <RealityStructureScene />

      {/* Movement 02: Uncertainty */}
      <UncertaintyScene />

      {/* Movement 03: Systems Reel */}
      <SystemsReelScene />

      {/* Movement 04: Strategy */}
      <StrategyScene />

      {/* Movement 05: Regime */}
      <MarketRegimeScene />

      {/* Movement 06: Interaction */}
      <ConflictInteractionScene />

      {/* Movement 07 & 08: Perturbation & Comparison */}
      <PerturbCompareScene />

      {/* Movement 09: Replay */}
      <ReplayScene />

      {/* Movement 10: Finale / Return */}
      <ReturnScene />
    </div>
  );
};

export default HomePage;
