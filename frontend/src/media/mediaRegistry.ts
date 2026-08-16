export interface MediaItem {
  id: string;
  title: string;
  src: string;
  alt: string;
  aspectRatio?: string;
  focalPoint?: string;
}

export const PHOTO_MEDIA: Record<string, MediaItem> = {
  'hero-01': {
    id: 'hero-01',
    title: 'Model what changes',
    src: '/assets/media/math-intellect/photos/mi-hero-01.jpg',
    alt: 'Atmospheric mathematical landscape and natural systems in motion',
    aspectRatio: '16/9',
    focalPoint: '50% 40%',
  },
  'world-01': {
    id: 'world-01',
    title: 'Uncertainty',
    src: '/assets/media/math-intellect/photos/mi-world-01.jpg',
    alt: 'Stochastic diffusion and branching natural terrain',
    aspectRatio: '3/4',
    focalPoint: '50% 50%',
  },
  'world-02': {
    id: 'world-02',
    title: 'Assumptions & Calibration',
    src: '/assets/media/math-intellect/photos/mi-world-02.jpg',
    alt: 'Structured spatial environment and calibrated parameter boundaries',
    aspectRatio: '4/3',
    focalPoint: '50% 50%',
  },
  'world-03': {
    id: 'world-03',
    title: 'Strategic Equilibrium',
    src: '/assets/media/math-intellect/photos/mi-world-03.jpg',
    alt: 'Interacting structural planes and strategic payoff dynamics',
    aspectRatio: '3/4',
    focalPoint: '50% 50%',
  },
  'world-04': {
    id: 'world-04',
    title: 'Governing Relations',
    src: '/assets/media/math-intellect/photos/mi-world-04.jpg',
    alt: 'Continuous dynamic field and mathematical relation',
    aspectRatio: '4/3',
    focalPoint: '50% 50%',
  },
  'world-05': {
    id: 'world-05',
    title: 'Dynamic Trajectories',
    src: '/assets/media/math-intellect/photos/mi-world-05.jpg',
    alt: 'Time series state flow and logistical trajectory paths',
    aspectRatio: '3/4',
    focalPoint: '50% 50%',
  },
  'world-06': {
    id: 'world-06',
    title: 'Agent Interaction Field',
    src: '/assets/media/math-intellect/photos/mi-world-06.jpg',
    alt: 'Multi-agent network interactions and emergent collective behavior',
    aspectRatio: '3/4',
    focalPoint: '50% 50%',
  },
  'world-07': {
    id: 'world-07',
    title: 'Evidence & Invariants',
    src: '/assets/media/math-intellect/photos/mi-world-07.jpg',
    alt: 'Empirical measurement and invariant distributions',
    aspectRatio: '4/3',
    focalPoint: '50% 50%',
  },
  'world-08': {
    id: 'world-08',
    title: 'Testing & Verification',
    src: '/assets/media/math-intellect/photos/mi-world-08.jpg',
    alt: 'Analytical testing, computational verification, and scenario comparison',
    aspectRatio: '3/4',
    focalPoint: '50% 50%',
  },
  'world-09': {
    id: 'world-09',
    title: 'Decisions & Interventions',
    src: '/assets/media/math-intellect/photos/mi-world-09.jpg',
    alt: 'Decision space comparison and state transitions',
    aspectRatio: '4/3',
    focalPoint: '50% 50%',
  },
};
