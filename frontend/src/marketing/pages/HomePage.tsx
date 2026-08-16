import React from 'react';
import { SystemsAtlasHero } from '../scenes/SystemsAtlasHero';
import { WorldStructureTransition } from '../scenes/WorldStructureTransition';
import { ModelWorlds } from '../scenes/ModelWorlds';
import { EvidenceSequence } from '../scenes/EvidenceSequence';
import { ScenarioCompare } from '../scenes/ScenarioCompare';
import { WorkbenchBridge } from '../scenes/WorkbenchBridge';
import { ResolveScene } from '../scenes/ResolveScene';
import MarketingLayout from '../components/MarketingLayout';

export const HomePage: React.FC = () => {
  return (
    <MarketingLayout>
      <div className="w-full flex flex-col bg-mi-canvas text-mi-ink">
        {/* Chapter 01: Systems Atlas */}
        <SystemsAtlasHero />

        {/* Chapter 02: World → Structure */}
        <WorldStructureTransition />

        {/* Chapter 03: Model Worlds */}
        <ModelWorlds />

        {/* Chapter 04: Evidence */}
        <EvidenceSequence />

        {/* Chapter 05: Compare */}
        <ScenarioCompare />

        {/* Chapter 06: Workbench Bridge */}
        <WorkbenchBridge />

        {/* Chapter 07: Resolve */}
        <ResolveScene />
      </div>
    </MarketingLayout>
  );
};

export default HomePage;
