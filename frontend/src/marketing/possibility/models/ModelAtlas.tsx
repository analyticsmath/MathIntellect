import { Link, useLocation } from "react-router-dom";
import { useScenario } from "../../film/scenario";
import { TrajectoryField } from "../trajectory/TrajectoryField";
import { GameMatrixGraphic } from "./GameMatrixGraphic";
import { MarketFlowGraphic } from "./MarketFlowGraphic";
import { AgentNetworkGraphic } from "./AgentNetworkGraphic";
import {
  DEFAULT_AGENT_VISUAL,
  DEFAULT_GAME_VISUAL,
  DEFAULT_MARKET_VISUAL,
} from "./modelVisualData";
import { MediaPlane } from "../media/MediaPlane";
import { ActionLink, Arrow } from "../Primitives";
const models = [
  {
    id: "monte-carlo",
    name: "Monte Carlo",
    title: "Sample the possible.",
    description:
      "Follow an ensemble of sampled paths from one shared origin. Change volatility, hold a baseline and inspect the distribution of endpoints.",
    question: "How might outcomes vary under stated assumptions?",
    equation: "xₜ₊₁ = xₜ + μΔt + σ√Δt Zₜ",
    metric: "24 sampled paths",
    note: "The public workbench runs this additive diffusion example.",
  },
  {
    id: "game-theory",
    name: "Game Theory",
    title: "Map the payoff.",
    description:
      "Represent the relationship between two decision makers. Inspect a two-by-two zero-sum payoff matrix and its mixed-strategy equilibrium.",
    question: "How does one choice depend on another?",
    equation: "p(A) = 0.500 · q(A) = 0.667",
    metric: "Expected payoff 3.000",
    note: "Illustrative zero-sum structure. The photograph supplies context.",
  },
  {
    id: "market-dynamics",
    name: "Market Dynamics",
    title: "Systems respond to systems.",
    description:
      "Examine an autoregressive series in which the next state depends on the previous state and a sampled innovation.",
    question: "How much of the previous state persists?",
    equation: "xₜ = ρxₜ₋₁ + εₜ",
    metric: "Persistence 0.65",
    note: "A seeded AR(1) illustration. This is not a market forecast.",
  },
  {
    id: "agent-interaction",
    name: "Agent Interaction",
    title: "Local rules. Collective behaviour.",
    description:
      "Inspect the positions and velocity vectors of a deterministic field of agents. Explore the distinction between individual direction and aggregate coherence.",
    question: "What can individual behaviour reveal about a system?",
    equation: "32 agents · Seed 77",
    metric: "Position and velocity field",
    note: "An illustrative agent model, independent of the photographed fish.",
  },
] as const;
export function ModelAtlas() {
  const { hash } = useLocation();
  const legacyHashes: Record<string, string> = {
    market: "market-dynamics",
    conflict: "agent-interaction",
  };
  const requested = legacyHashes[hash.slice(1)] ?? hash.slice(1);
  const selected = models.findIndex((model) => model.id === requested);
  const index = selected < 0 ? 0 : selected;
  const demo = useScenario();
  return (
    <div className={"pe-atlas pe-atlas--" + models[index].id}>
      <header className="pe-atlas-intro">
        <p className="pe-eyebrow">The model atlas</p>
        <h1 tabIndex={-1}>
          Give your question
          <br />
          the right structure.
        </h1>
        <p>One origin. Four mathematical perspectives.</p>
      </header>
      <nav className="pe-atlas-index" aria-label="Model families">
        {models.map((model, i) => (
          <Link
            key={model.id}
            to={"#" + model.id}
            aria-current={i === index ? "true" : undefined}
          >
            <span>{model.name}</span>
            <Arrow diagonal />
          </Link>
        ))}
      </nav>
      <div className="pe-atlas-stage">
        {models.map((model, i) => (
          <section
            key={model.id}
            id={model.id}
            tabIndex={-1}
            hidden={i !== index}
            aria-labelledby={model.id + "-title"}
            className="pe-atlas-selected"
          >
            {i === 0 && (
              <div className="pe-atlas-visual pe-atlas-trajectories">
                <TrajectoryField current={demo.current} variant="field" />
              </div>
            )}
            {i === 1 && (
              <div className="pe-atlas-visual pe-atlas-game">
                <MediaPlane
                  role="gameForeground"
                  alt="A hand and white king on a chessboard"
                />
                <GameMatrixGraphic result={DEFAULT_GAME_VISUAL} />
              </div>
            )}
            {i === 2 && (
              <div className="pe-atlas-visual pe-atlas-market">
                <MediaPlane
                  role="marketEnvironment"
                  alt="A top-down view of an intersecting highway system"
                />
                <MarketFlowGraphic result={DEFAULT_MARKET_VISUAL} />
              </div>
            )}
            {i === 3 && (
              <div className="pe-atlas-visual pe-atlas-agents">
                <MediaPlane
                  role="agentCollective"
                  alt="A school of fish underwater"
                />
                <AgentNetworkGraphic result={DEFAULT_AGENT_VISUAL} />
              </div>
            )}
            <div className="pe-atlas-copy">
              <p className="pe-eyebrow">{model.name}</p>
              <h2 id={model.id + "-title"}>{model.title}</h2>
              <p>{model.description}</p>
              <ActionLink
                to={i === 0 ? "/workbench" : "/signup"}
                primary
                carry={i === 0}
              >
                {i === 0 ? "Enter the workbench" : "Explore in your account"}
              </ActionLink>
            </div>
            <div className="pe-atlas-question">
              <span>The question</span>
              <p>{model.question}</p>
            </div>
            <div className="pe-atlas-facts">
              <span>{model.equation}</span>
              <span>{model.metric}</span>
              <p>{model.note}</p>
            </div>
          </section>
        ))}
      </div>
      <div className="pe-atlas-next">
        <span>A different question?</span>
        <Link to={"#" + models[(index + 1) % models.length].id}>
          Explore {models[(index + 1) % models.length].name}
          <Arrow />
        </Link>
      </div>
    </div>
  );
}
