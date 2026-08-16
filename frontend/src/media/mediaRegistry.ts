export interface MediaItem {
  id: string;
  title: string;
  creator: string;
  sourcePage: string;
  role: string;
  desktopSrc: string;
  mobileSrc: string;
  alt: string;
  aspectRatio: string;
  focalPoint?: string;
}

export const MEDIA_REGISTRY: Record<string, MediaItem> = {
  'mi-01': {
    id: 'mi-01',
    title: 'Systems Atlas Dominant',
    creator: 'Haim Charbit',
    sourcePage: 'https://unsplash.com/photos/aerial-view-of-a-complex-highway-interchange-sTfJ10a5-CM',
    role: 'Dominant hero world; engineered flow, crossings, branching, density',
    desktopSrc: '/assets/media/math-intellect/systems-atlas-highway.svg',
    mobileSrc: '/assets/media/math-intellect/systems-atlas-highway-mobile.svg',
    alt: 'Aerial perspective of a complex multi-tier highway interchange system demonstrating flow and branching geometry',
    aspectRatio: '16/10',
    focalPoint: 'center 45%',
  },
  'mi-02': {
    id: 'mi-02',
    title: 'Strategy / Human System',
    creator: 'ommy',
    sourcePage: 'https://www.pexels.com/photo/aerial-view-of-crowd-in-sunny-porto-plaza-33710818/',
    role: 'Human agents and spatial interaction in equilibrium',
    desktopSrc: '/assets/media/math-intellect/strategy-porto-plaza.svg',
    mobileSrc: '/assets/media/math-intellect/strategy-porto-plaza.svg',
    alt: 'Top-down aerial view of individuals and groups moving across an open plaza',
    aspectRatio: '4/3',
    focalPoint: '50% 50%',
  },
  'mi-03': {
    id: 'mi-03',
    title: 'Analytical Detail',
    creator: 'Ron Lach',
    sourcePage: 'https://www.pexels.com/photo/mans-hands-on-drawing-accessories-9617889/',
    role: 'Close physical reasoning and drafting detail actor',
    desktopSrc: '/assets/media/math-intellect/analytical-drafting-detail.svg',
    mobileSrc: '/assets/media/math-intellect/analytical-drafting-detail.svg',
    alt: 'Precision drafting instruments and hands working on technical structural blueprints',
    aspectRatio: '1/1',
    focalPoint: 'center',
  },
  'mi-04': {
    id: 'mi-04',
    title: 'World → Structure Bridge',
    creator: 'Bernd Dittrich',
    sourcePage: 'https://unsplash.com/photos/an-aerial-view-of-a-highway-intersection-in-a-city-40lOEmDssF8',
    role: 'Alternate engineered system for conceptual structural handoff',
    desktopSrc: '/assets/media/math-intellect/structure-highway-river.svg',
    mobileSrc: '/assets/media/math-intellect/structure-highway-river.svg',
    alt: 'Highway interchange spanning an urban water basin with structural grid lines',
    aspectRatio: '16/9',
    focalPoint: 'center',
  },
  'mi-05': {
    id: 'mi-05',
    title: 'Uncertainty World',
    creator: 'Cosmin Andrei Buzamat',
    sourcePage: 'https://unsplash.com/photos/aerial-view-of-a-river-delta-with-branching-streams-2Mt6dVvoLLs/',
    role: 'Branching fluvial delta illustrating stochastic dispersion and variance',
    desktopSrc: '/assets/media/math-intellect/uncertainty-river-delta.svg',
    mobileSrc: '/assets/media/math-intellect/uncertainty-river-delta.svg',
    alt: 'Aerial photograph of a natural river delta with branching braided channels',
    aspectRatio: '16/10',
    focalPoint: 'center',
  },
  'mi-06': {
    id: 'mi-06',
    title: 'Dynamics World',
    creator: 'Daniel Miksha',
    sourcePage: 'https://unsplash.com/photos/aerial-view-of-stacked-shipping-containers-at-a-port-37mW7MvAOvU',
    role: 'Logistics and container port state flow through time',
    desktopSrc: '/assets/media/math-intellect/dynamics-container-port.svg',
    mobileSrc: '/assets/media/math-intellect/dynamics-container-port.svg',
    alt: 'Organized container terminal with high-density inventory channels and cranes',
    aspectRatio: '16/10',
    focalPoint: 'center',
  },
  'mi-07': {
    id: 'mi-07',
    title: 'Interaction World',
    creator: 'Lara Farber',
    sourcePage: 'https://www.pexels.com/photo/aerial-view-of-people-gathering-near-park-28898230/',
    role: 'Multi-agent spatial environment and collective dynamics',
    desktopSrc: '/assets/media/math-intellect/interaction-park-agents.svg',
    mobileSrc: '/assets/media/math-intellect/interaction-park-agents.svg',
    alt: 'High-angle perspective of people congregating and interacting in an urban green space',
    aspectRatio: '16/10',
    focalPoint: 'center',
  },
  'mi-08': {
    id: 'mi-08',
    title: 'Method / Engineering Detail',
    creator: 'ThisIsEngineering',
    sourcePage: 'https://www.pexels.com/photo/civil-engineer-looking-at-blueprint-3862628/',
    role: 'Human reasoning, method, and blueprint analysis',
    desktopSrc: '/assets/media/math-intellect/method-blueprint.svg',
    mobileSrc: '/assets/media/math-intellect/method-blueprint.svg',
    alt: 'Engineer examining complex technical schematics with mathematical annotation',
    aspectRatio: '16/10',
    focalPoint: 'center',
  },
};
