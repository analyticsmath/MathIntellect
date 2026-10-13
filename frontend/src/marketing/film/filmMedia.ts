export type ModelId =
  | "monte-carlo"
  | "game-theory"
  | "market"
  | "conflict"
  | "custom";
export type PhotoId = ModelId | "aftermath" | "method";
const root = "/media/math-intellect/cinematic";
const versions = (stem: string, widths: number[]) =>
  widths
    .map((w) => `${root}/optimized/webp/${stem}-${w}.webp ${w}w`)
    .join(", ");

export const FILM_PHOTOS: Record<
  PhotoId,
  {
    src: string;
    srcSet?: string;
    alt: string;
    credit: string;
    url: string;
    position: string;
  }
> = {
  "monte-carlo": {
    src: "/media/math-intellect/optimized/webp/mi-river-branching-01-1920.webp",
    srcSet: [
      "/media/math-intellect/optimized/webp/mi-river-branching-01-768.webp 768w",
      "/media/math-intellect/optimized/webp/mi-river-branching-01-1280.webp 1280w",
      "/media/math-intellect/optimized/webp/mi-river-branching-01-1920.webp 1920w",
      "/media/math-intellect/optimized/webp/mi-river-branching-01-2560.webp 2560w",
    ].join(", "),
    alt: "River channels dividing across a green floodplain, an editorial illustration of branching possibilities",
    credit: "Dan Roizer",
    url: "https://unsplash.com/photos/GygPFmXGD1o",
    position: "50% 56%",
  },
  aftermath: {
    src: `${root}/optimized/webp/mi-film-impact-aftermath-1800.webp`,
    srcSet: versions("mi-film-impact-aftermath", [960, 1800]),
    alt: "An alternate liquid-impact photograph with a spreading crown",
    credit: "Pete Godfrey",
    url: "https://unsplash.com/photos/UAjcZ1qBzE0",
    position: "50% 50%",
  },
  "game-theory": {
    src: `${root}/optimized/webp/mi-film-game-theory-1920.webp`,
    srcSet: versions("mi-film-game-theory", [960, 1920]),
    alt: "Two people seated opposite one another, engaged in conversation",
    credit: "Adam Rutkowski",
    url: "https://unsplash.com/photos/r_WVQzfgClw",
    position: "50% 50%",
  },
  market: {
    src: `${root}/source/mi-film-market-floor-highsmith-loc.jpg`,
    alt: "An archival photograph of people working on the New York Stock Exchange trading floor",
    credit: "Carol M. Highsmith / Library of Congress",
    url: "https://www.loc.gov/item/2011630168/",
    position: "50% 50%",
  },
  conflict: {
    src: "/media/math-intellect/optimized/webp/mi-murmuration-01-1920.webp",
    srcSet: [768, 1280, 1920, 2560]
      .map(
        (w) =>
          `/media/math-intellect/optimized/webp/mi-murmuration-01-${w}.webp ${w}w`,
      )
      .join(", "),
    alt: "A dense flock of starlings forming a collective silhouette in the sky",
    credit: "James Wainscoat",
    url: "https://unsplash.com/photos/b7MZ6iGIoSI",
    position: "50% 50%",
  },
  custom: {
    src: `${root}/optimized/webp/mi-film-custom-precision-nci-1920.webp`,
    srcSet: versions("mi-film-custom-precision-nci", [960, 1920]),
    alt: "Two hands using a precision tool and a specimen dish in a laboratory",
    credit: "National Cancer Institute",
    url: "https://unsplash.com/photos/OYlhHhzksuk",
    position: "50% 50%",
  },
  method: {
    src: `${root}/optimized/webp/mi-film-method-measurement-1920.webp`,
    srcSet: versions("mi-film-method-measurement", [960, 1920]),
    alt: "Analog measurement equipment with dials and physical input controls",
    credit: "Eric Prouzet",
    url: "https://unsplash.com/photos/US1ndpdptUI",
    position: "50% 50%",
  },
};

export const MODEL_STORIES: {
  id: ModelId;
  name: string;
  title: string;
  description: string;
  question: string;
  parameters: string[];
  evidence: string[];
}[] = [
  {
    id: "monte-carlo",
    name: "Monte Carlo",
    title: "One start.\nMany possibilities.",
    description:
      "Explore a range of sampled outcomes instead of treating one answer as the whole picture.",
    question: "How much could the outcome vary?",
    parameters: [
      "Distribution and assumptions",
      "Random seed",
      "Number of samples",
    ],
    evidence: [
      "Sampled outcomes",
      "Mean and variance",
      "Distribution and percentiles",
    ],
  },
  {
    id: "game-theory",
    name: "Game Theory",
    title: "Your choice meets\nsomeone else’s.",
    description:
      "Put actions and payoffs in the same decision space. Examine what changes when another participant responds.",
    question: "What happens when decisions depend on each other?",
    parameters: [
      "Players and actions",
      "Payoff matrix",
      "Interaction settings",
    ],
    evidence: [
      "Strategies and payoffs",
      "Equilibrium analysis",
      "Comparisons between choices",
    ],
  },
  {
    id: "market",
    name: "Market",
    title: "Conditions change.\nSo do the paths.",
    description:
      "Explore market scenarios under specified assumptions about movement, volatility and shocks.",
    question: "What might a different market condition change?",
    parameters: [
      "Drift and volatility",
      "Scenario and shock settings",
      "Seed and horizon",
    ],
    evidence: [
      "Simulated paths",
      "Scenario comparisons",
      "Risk and return measures",
    ],
  },
  {
    id: "conflict",
    name: "Conflict",
    title: "Many agents.\nA changing field.",
    description:
      "Examine interactions between agents, including cooperation and competition, within a defined model.",
    question: "What emerges when individual decisions interact?",
    parameters: [
      "Agents and strategies",
      "Interaction rules",
      "Rounds and seed",
    ],
    evidence: [
      "Agent outcomes",
      "Cooperation and competition",
      "Changes across interactions",
    ],
  },
  {
    id: "custom",
    name: "Custom",
    title: "When the question\nis yours.",
    description:
      "Define your own mathematical question with explicit variables and expressions, then inspect the result.",
    question: "Which assumption do you want to test?",
    parameters: [
      "Variables and expressions",
      "Input assumptions",
      "Run settings",
    ],
    evidence: [
      "Computed results",
      "Parameter sensitivity",
      "Repeatable comparisons",
    ],
  },
];
