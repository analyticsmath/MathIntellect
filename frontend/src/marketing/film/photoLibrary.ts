export interface PhotoAsset {
  alt: string;
  photographer: string;
  photoId: string;
  sourceUrl: string;
  wideSrc: string;
  portraitSrc: string;
  wideDimensions: { width: number; height: number };
  portraitDimensions: { width: number; height: number };
  focalIntent: string;
  retrievedOn: string;
  license: string;
  useNote: string;
}

const media = "/media/math-intellect/unsplash/";

export const PHOTO_LIBRARY = {
  hero: {
    alt: "A white fluid impact suspended above a still surface against a dark background.",
    photographer: "Pete Godfrey",
    photoId: "6ieRRBACAqM",
    sourceUrl: "https://unsplash.com/photos/milk-splash-frozen-in-time-against-black-background-6ieRRBACAqM",
    wideSrc: "/media/math-intellect/cinematic/optimized/webp/mi-film-impact-origin-2560.webp",
    portraitSrc: "/media/math-intellect/cinematic/optimized/mobile/mi-film-impact-origin-portrait-960x1280.webp",
    wideDimensions: { width: 2560, height: 1707 },
    portraitDimensions: { width: 960, height: 1280 },
    focalIntent: "Keep the complete impact column visible. The dark photographic field allows the title to share the composition.",
    retrievedOn: "2026-10-17",
    license: "Unsplash License",
    useNote: "Physical photograph used as context. It is not output from the public diffusion calculation.",
  } satisfies PhotoAsset,
  waterStudy: {
    alt: "Fine overlapping ripples across a dark water surface.",
    photographer: "Valeriia Miller",
    photoId: "ye_2-LjeFVM",
    sourceUrl: "https://unsplash.com/photos/dark-water-ripples-create-an-interesting-pattern-ye_2-LjeFVM",
    wideSrc: media + "water-study-1800x1100.webp",
    portraitSrc: media + "water-study-1800x1100.webp",
    wideDimensions: { width: 1800, height: 1100 },
    portraitDimensions: { width: 1800, height: 1100 },
    focalIntent: "A broad horizontal surface creates a shift of scale from isolated event to a field of motion.",
    retrievedOn: "2026-10-17",
    license: "Unsplash License",
    useNote: "Context photograph, not measured or simulated data.",
  } satisfies PhotoAsset,
  strategy: {
    alt: "Two people face one another across a table while discussing a laptop.",
    photographer: "Adam Rutkowski",
    photoId: "r_WVQzfgClw",
    sourceUrl: "https://unsplash.com/photos/two-men-sitting-at-a-table-with-a-laptop-r_WVQzfgClw",
    wideSrc: media + "strategy-dialogue-1400.webp",
    portraitSrc: media + "strategy-dialogue-1400.webp",
    wideDimensions: { width: 1400, height: 933 },
    portraitDimensions: { width: 1400, height: 933 },
    focalIntent: "Keep both participants in frame on every screen. Do not crop away one side of the exchange.",
    retrievedOn: "2026-10-17",
    license: "Unsplash License",
    useNote: "Editorial context. The subjects are not represented as users or participants in a calculated game.",
  } satisfies PhotoAsset,
  collectiveFlight: {
    alt: "A dense flock of birds forms a sweeping shape above a field.",
    photographer: "James Wainscoat",
    photoId: "b7MZ6iGIoSI",
    sourceUrl: "https://unsplash.com/photos/b7MZ6iGIoSI",
    wideSrc: media + "collective-flight-1600.webp",
    portraitSrc: media + "collective-flight-1600.webp",
    wideDimensions: { width: 1600, height: 1067 },
    portraitDimensions: { width: 1600, height: 1067 },
    focalIntent: "Retain the collective formation in a wide photograph rather than cropping the flock into a portrait.",
    retrievedOn: "2026-10-17",
    license: "Unsplash License",
    useNote: "Natural collective behaviour is an analogy for agent interaction, not the engine's simulated output.",
  } satisfies PhotoAsset,

  cityInterchange: {
    alt: "Aerial view of a city interchange at night, with traffic tracing several routes.",
    photographer: "J F",
    photoId: "A1QE-1VGKPM",
    sourceUrl: "https://unsplash.com/photos/an-aerial-view-of-a-city-intersection-at-night-A1QE-1VGKPM",
    wideSrc: media + "hero-interchange-1800x1220.webp",
    portraitSrc: media + "hero-interchange-900x1150.webp",
    wideDimensions: { width: 1800, height: 1220 },
    portraitDimensions: { width: 900, height: 1150 },
    focalIntent: "Keep the converging and diverging traffic lanes in frame; the portrait crop centers the interchange.",
    retrievedOn: "2026-10-17",
    license: "Unsplash License",
    useNote: "Context photograph, not a calculated result or an endorsement.",
  } satisfies PhotoAsset,
  branchingRiver: {
    alt: "Top-down view of branching waterways crossing a textured river bed.",
    photographer: "Cosmin Andrei Buzamat",
    photoId: "mVNA-yH7wNM",
    sourceUrl: "https://unsplash.com/photos/aerial-view-of-a-river-delta-with-branching-waterways-mVNA-yH7wNM",
    wideSrc: media + "model-branching-river-1400x960.webp",
    portraitSrc: media + "model-branching-river-800x1100.webp",
    wideDimensions: { width: 1400, height: 960 },
    portraitDimensions: { width: 800, height: 1100 },
    focalIntent: "Preserve the visible branching water channels as a natural counterpart to sampled paths.",
    retrievedOn: "2026-10-17",
    license: "Unsplash License",
    useNote: "Context photograph, not a calculated result or an endorsement.",
  } satisfies PhotoAsset,
  chess: {
    alt: "Chess pieces arranged across a board, with a wooden king surrounded by possible moves.",
    photographer: "Haroon Khalid",
    photoId: "53qe9oTOdc8",
    sourceUrl: "https://unsplash.com/photos/chess-pieces-are-arranged-on-a-chessboard-53qe9oTOdc8",
    wideSrc: media + "model-chess-1400x960.webp",
    portraitSrc: media + "model-chess-800x1100.webp",
    wideDimensions: { width: 1400, height: 960 },
    portraitDimensions: { width: 800, height: 1100 },
    focalIntent: "Keep the central king and surrounding pieces visible to establish competing strategies.",
    retrievedOn: "2026-10-17",
    license: "Unsplash License",
    useNote: "Context photograph, not a calculated result or an endorsement.",
  } satisfies PhotoAsset,
  shippingPort: {
    alt: "Aerial view of stacked shipping containers arranged in port lanes.",
    photographer: "Daniel Miksha",
    photoId: "37mW7MvAOvU",
    sourceUrl: "https://unsplash.com/photos/aerial-view-of-stacked-shipping-containers-at-a-port-37mW7MvAOvU",
    wideSrc: media + "model-shipping-port-1400x960.webp",
    portraitSrc: media + "model-shipping-port-800x1100.webp",
    wideDimensions: { width: 1400, height: 960 },
    portraitDimensions: { width: 800, height: 1100 },
    focalIntent: "Retain the grid of containers and lanes that signals movement through a connected market.",
    retrievedOn: "2026-10-17",
    license: "Unsplash License",
    useNote: "Context photograph, not a calculated result or an endorsement.",
  } satisfies PhotoAsset,
  cityCrossing: {
    alt: "A crowd moves through a striped city crosswalk from several directions.",
    photographer: "Xuedi Liu",
    photoId: "cu3sTi1Tf7s",
    sourceUrl: "https://unsplash.com/photos/crowded-crosswalk-in-a-busy-city-street-cu3sTi1Tf7s",
    wideSrc: media + "model-city-crossing-1400x960.webp",
    portraitSrc: media + "model-city-crossing-800x1100.webp",
    wideDimensions: { width: 1400, height: 960 },
    portraitDimensions: { width: 800, height: 1100 },
    focalIntent: "Keep the crossing and separate streams of pedestrians visible as a social system.",
    retrievedOn: "2026-10-17",
    license: "Unsplash License",
    useNote: "Context photograph, not a calculated result or an endorsement.",
  } satisfies PhotoAsset,
};
