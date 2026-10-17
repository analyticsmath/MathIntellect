import type { PhotoId } from "./Photo";
export const models: {
  id: string;
  name: string;
  photo: PhotoId;
  question: string;
  summary: string;
  detail: string;
  inputs: string;
  outputs: string;
}[] = [
  {
    id: "monte-carlo",
    name: "Monte Carlo",
    photo: "glider",
    question: "What if the inputs are uncertain?",
    summary: "Give uncertainty a shape. Explore a range of possible results.",
    detail:
      "Define variables and their probability distributions, then write the expression you want to calculate. Repeated samples reveal how uncertainty in the inputs affects your result.",
    inputs:
      "Variables, distributions, expression, sample count and an optional seed.",
    outputs: "Sampled results, average, variance, percentiles and a histogram.",
  },
  {
    id: "game-theory",
    name: "Game theory",
    photo: "chess",
    question: "What if someone chooses differently?",
    summary: "Explore choices in a world where other people are choosing too.",
    detail:
      "Name two players, define their strategies and enter the payoffs for each combination. Look for dominant strategies and pure-strategy Nash equilibria, where neither player benefits by changing their choice alone.",
    inputs: "Players, strategies and payoffs.",
    outputs:
      "Dominant strategies, pure-strategy equilibria and calculated payoffs.",
  },
  {
    id: "market-dynamics",
    name: "Market simulation",
    photo: "turbine",
    question: "What could follow from these conditions?",
    summary: "Set the conditions. Examine a range of simulated price paths.",
    detail:
      "Choose a starting price, drift, volatility and time horizon. Generate simulated paths, then inspect their final values and drawdowns. These are scenarios generated from your assumptions.",
    inputs:
      "Initial price, drift, volatility, horizon, path count and an optional seed.",
    outputs: "Simulated paths, final-price statistics and drawdown.",
  },
  {
    id: "agent-interaction",
    name: "Agent interactions",
    photo: "velodrome",
    question: "What if the rules of interaction change?",
    summary: "Follow how individual behavior changes a shared outcome.",
    detail:
      "Give agents starting resources and interaction strategies. Run repeated rounds to examine actions, payoffs, cooperation and changes in resources.",
    inputs: "Agents, resources, strategies, rounds and an optional seed.",
    outputs:
      "Round history, cooperation rate and each agent’s final resources.",
  },
];
