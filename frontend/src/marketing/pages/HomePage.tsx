import { MarketingLayout } from '../components/MarketingLayout';
import { ScandiHero } from '../scenes/ScandiHero';
import { ModelWorldsScroller } from '../scenes/ModelWorldsScroller';
import { MathPracticeScroller } from '../scenes/MathPracticeScroller';
import { CircularConstellation } from '../scenes/CircularConstellation';
import { MethodsScroller } from '../scenes/MethodsScroller';
import { ProductWorkbenchReveal } from '../scenes/ProductWorkbenchReveal';
import { MethodJournalStrip } from '../scenes/MethodJournalStrip';
import { TrustBoundariesScene } from '../scenes/TrustBoundariesScene';

export function HomePage() {
  return (
    <MarketingLayout>
      {/* 1. Full Photographic Opening Hero */}
      <ScandiHero />

      {/* 2. First Image Scroller: Model Worlds (Embla Carousel) */}
      <ModelWorldsScroller />

      {/* 3. Second Image Scroller: Mathematics in Practice */}
      <MathPracticeScroller />

      {/* 4. Circular Image Constellation: From Assumption to Decision */}
      <CircularConstellation />

      {/* 5. Third Image Scroller: Methods & Formulas */}
      <MethodsScroller />

      {/* 6. Product Reveal: Real Simulation Workbench */}
      <ProductWorkbenchReveal />

      {/* 7. Journal / Method Editorial Objects Strip */}
      <MethodJournalStrip />

      {/* 8. Trust Boundaries & Final Terminal Action */}
      <TrustBoundariesScene />
    </MarketingLayout>
  );
}

export default HomePage;
