import { PHOTO_LIBRARY, type PhotoAsset } from "./photoLibrary";

export type ModelId =
  | "monte-carlo"
  | "game-theory"
  | "market"
  | "conflict";

export interface ModelStory {
  id: ModelId;
  photo: PhotoAsset;
  name: string;
  title: string;
  question: string;
  description: string;
  inputs: string[];
  outputs: string[];
}

export const MODEL_STORIES: ModelStory[] = [
  {
    id: "monte-carlo",
    photo: PHOTO_LIBRARY.branchingRiver,
    name: "Monte Carlo",
    title: "See the spread, not only the average.",
    question: "How do distributions shape the result?",
    description:
      "Choose distributions for the variables, set an iteration count, then evaluate an expression. The public workbench opens one seeded diffusion example.",
    inputs: ["Variables and distributions", "Iterations", "Seed and expression"],
    outputs: ["Sample results", "Distribution", "Summary statistics"],
  },
  {
    id: "game-theory",
    photo: PHOTO_LIBRARY.strategy,
    name: "Game Theory",
    title: "Every choice changes the payoff.",
    question: "Which outcomes suit each player?",
    description:
      "Name two players and their strategies. Set both payoffs for every pairing, then inspect the game defined by those choices.",
    inputs: ["Two players", "Two strategies each", "Both payoffs per outcome"],
    outputs: ["Payoff matrix", "Strategy comparison", "Equilibrium analysis"],
  },
  {
    id: "market",
    photo: PHOTO_LIBRARY.shippingPort,
    name: "Market Dynamics",
    title: "Start from a state. Follow its possible paths.",
    question: "What changes as drift, volatility and horizon change?",
    description:
      "Set an initial asset state, drift, volatility, time horizon and path count. Supply a seed when you want to repeat the run.",
    inputs: ["Initial asset state", "Drift and volatility", "Horizon and path count"],
    outputs: ["Simulated paths", "Summary statistics", "Repeatable run"],
  },
  {
    id: "conflict",
    photo: PHOTO_LIBRARY.collectiveFlight,
    name: "Agent Interaction",
    title: "The rules matter as much as the players.",
    question: "How do strategy and repeated rounds shape the result?",
    description:
      "Configure each agent, its strategy and starting resources. Choose the number of interaction rounds for the run.",
    inputs: ["Agent setup", "Strategy", "Rounds and optional seed"],
    outputs: ["Interaction trace", "Agent outcomes", "Aggregate measures"],
  },
];

