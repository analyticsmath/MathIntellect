import { useRef } from "react";
import { Link } from "react-router-dom";
import { useScenario } from "../../film/scenario";
import { TrajectoryField } from "../trajectory/TrajectoryField";
import { GameMatrixGraphic } from "../models/GameMatrixGraphic";
import { MarketFlowGraphic } from "../models/MarketFlowGraphic";
import { AgentNetworkGraphic } from "../models/AgentNetworkGraphic";
import {
  DEFAULT_AGENT_VISUAL,
  DEFAULT_GAME_VISUAL,
  DEFAULT_MARKET_VISUAL,
} from "../models/modelVisualData";
import { MediaPlane } from "../media/MediaPlane";
import { ActionLink, Arrow, OriginSymbol } from "../Primitives";
import { useHomeFilmMotion } from "./useHomeFilmMotion";
export function HomeFilm() {
  const demo = useScenario();
  const root = useRef<HTMLDivElement>(null);
  useHomeFilmMotion(root);
  const delta = demo.current.variance - demo.baseline.variance;
  return (
    <div ref={root} className="pe-home">
      <section className="pe-hero" aria-labelledby="origin-title">
        <div className="pe-hero-copy">
          <p className="pe-eyebrow">
            <span className="pe-live-dot" />
            Mathematics, in your hands
          </p>
          <h1 id="origin-title" tabIndex={-1}>
            Every outcome
            <br />
            starts with
            <br />a condition.
          </h1>
          <div className="pe-hero-intent">
            <p>
              Change one variable. Follow the possible paths.
              <br className="pe-desktop-break" /> Understand what made the
              difference.
            </p>
            <ActionLink to="/workbench" primary carry>
              Enter the model
            </ActionLink>
          </div>
        </div>
        <div className="pe-hero-field">
          <TrajectoryField
            current={demo.current}
            variant="hero"
            focusPathIndex={4}
          />
          <span className="pe-origin-label">
            x₀ = 0<span>the origin state</span>
          </span>
          <span className="pe-endpoint-label">Possibility, calculated.</span>
        </div>
        <div className="pe-hero-bottom">
          <span>Interactive mathematical modelling</span>
          <span className="pe-hero-conditions">
            {demo.paths} paths <i /> Seed {demo.seed}
          </span>
          <a href="#reality" className="pe-scroll-link">
            Follow the conditions <span aria-hidden="true">↓</span>
          </a>
        </div>
      </section>
      <section
        id="reality"
        className="pe-reality"
        aria-labelledby="reality-title"
      >
        <div className="pe-reality-frame">
          <MediaPlane
            role="worldCollision"
            alt="People and traffic moving through Shibuya Crossing, photographed from above"
          />
          <div className="pe-reality-grid" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className="pe-reality-copy">
            <p className="pe-eyebrow">From the world to the model</p>
            <h2 id="reality-title">
              Reality moves.
              <br />
              What will you
              <br />
              measure?
            </h2>
          </div>
          <p className="pe-context-note">
            An environment for a question.
            <br />
            The calculation begins with assumptions.
          </p>
        </div>
      </section>
      <section
        className="pe-conditions pe-light"
        aria-labelledby="conditions-title"
      >
        <div className="pe-section-top">
          <p className="pe-eyebrow">The starting conditions</p>
          <h2 id="conditions-title">
            Hold the conditions.
            <br />
            Read the paths.
          </h2>
        </div>
        <div className="pe-condition-system">
          <div className="pe-condition pe-condition--drift">
            <span>Drift</span>
            <strong>μ {demo.mu.toFixed(2)}</strong>
            <p>A constant directional increment.</p>
          </div>
          <div className="pe-condition-origin">
            <OriginSymbol />
            <strong>x₀ = 0</strong>
            <span>One shared starting state</span>
          </div>
          <div className="pe-condition pe-condition--sigma">
            <span>Volatility</span>
            <strong>σ {demo.sigma.toFixed(2)}</strong>
            <p>The scale of the sampled variation.</p>
          </div>
        </div>
        <div className="pe-condition-ledger">
          <span>
            Seed <b>{demo.seed}</b>
          </span>
          <span>
            Sample paths <b>24</b>
          </span>
          <span>
            Time steps <b>50</b>
          </span>
          <span>
            Horizon <b>1</b>
          </span>
        </div>
      </section>
      <section
        className="pe-experiment pe-light"
        aria-labelledby="experiment-title"
      >
        <div className="pe-experiment-heading">
          <p className="pe-eyebrow">A real calculation. Yours to change.</p>
          <h2 id="experiment-title">
            One origin.
            <br />
            24 possible paths.
          </h2>
          <p>
            Increase the volatility. Keep the seed.
            <br />
            See exactly what moves.
          </p>
        </div>
        <div className="pe-experiment-field">
          <TrajectoryField
            current={demo.current}
            baseline={demo.baseline}
            compare={demo.sigma !== 0.35}
            variant="comparison"
          />
          <div className="pe-chart-axis">
            <span>Starting state</span>
            <span>50 steps</span>
          </div>
        </div>
        <div className="pe-intervention">
          <div className="pe-home-control">
            <label htmlFor="home-volatility">
              Volatility <strong>σ {demo.sigma.toFixed(2)}</strong>
            </label>
            <input
              id="home-volatility"
              aria-label="Volatility"
              type="range"
              min="0.05"
              max="0.9"
              step="0.01"
              value={demo.sigma}
              onChange={(e) => demo.setSigma(Number(e.target.value))}
            />
            <div className="pe-range-labels">
              <span>Less variation</span>
              <span>More variation</span>
            </div>
          </div>
          <div className="pe-inline-evidence">
            <span>Endpoint variance</span>
            <strong>{demo.current.variance.toFixed(4)}</strong>
            <span>
              Change from baseline{" "}
              <b>
                {delta > 0 ? "+" : ""}
                {delta.toFixed(4)}
              </b>
            </span>
          </div>
        </div>
        <div className="pe-comparison-caption">
          <span>
            <i className="pe-legend pe-legend--baseline" />
            Baseline σ 0.35
          </span>
          <span>
            <i className="pe-legend" />
            Current σ {demo.sigma.toFixed(2)}
          </span>
          <span>Same seed. One shared scale.</span>
          <Link to="/workbench" data-transition-kind="trajectory">
            Open the workbench <Arrow diagonal />
          </Link>
        </div>
      </section>
      <section className="pe-model-threshold">
        <p className="pe-eyebrow">The question changes the structure</p>
        <h2>
          There is more
          <br />
          than one way
          <br />
          to see a system.
        </h2>
        <div className="pe-threshold-orbits" aria-hidden="true">
          <span />
          <span />
          <span />
          <OriginSymbol />
        </div>
        <ActionLink to="/models">Explore the model atlas</ActionLink>
      </section>
      <section className="pe-monte" aria-labelledby="monte-title">
        <div className="pe-model-copy">
          <p className="pe-eyebrow">Monte Carlo</p>
          <h2 id="monte-title">
            Sample
            <br />
            the possible.
          </h2>
          <p>
            One set of assumptions.
            <br />
            An ensemble of sampled outcomes.
          </p>
          <ActionLink to="/models#monte-carlo">Explore Monte Carlo</ActionLink>
        </div>
        <div className="pe-monte-field">
          <TrajectoryField current={demo.current} variant="field" />
        </div>
        <div className="pe-model-data">
          <span>Actual public run</span>
          <span>24 paths · 50 steps · Seed {demo.seed}</span>
        </div>
      </section>
      <section className="pe-game" aria-labelledby="game-title">
        <div className="pe-game-photo">
          <MediaPlane
            role="gameForeground"
            alt="A hand moving a white king on a chessboard"
          />
        </div>
        <div className="pe-game-matrix">
          <GameMatrixGraphic result={DEFAULT_GAME_VISUAL} />
          <span>Zero-sum payoff structure</span>
        </div>
        <div className="pe-model-copy">
          <p className="pe-eyebrow">Game Theory</p>
          <h2 id="game-title">
            Map
            <br />
            the payoff.
          </h2>
          <p>
            Every choice changes the field
            <br />
            for someone else.
          </p>
          <ActionLink to="/models#game-theory">Explore Game Theory</ActionLink>
        </div>
        <div className="pe-game-foreground" aria-hidden="true">
          <img
            src="/media/math-intellect/possibility/game-foreground-cutout.webp"
            alt=""
            loading="lazy"
            width="1400"
            height="933"
          />
        </div>
        <div className="pe-model-data">
          <span>A photograph of a decision</span>
          <span>A mathematical structure for choices</span>
        </div>
      </section>
      <section className="pe-market" aria-labelledby="market-title">
        <div className="pe-market-photo">
          <MediaPlane
            role="marketEnvironment"
            alt="An aerial highway interchange with looping roads and intersecting routes"
          />
        </div>
        <div className="pe-model-copy">
          <p className="pe-eyebrow">Market Dynamics</p>
          <h2 id="market-title">
            Systems
            <br />
            respond
            <br />
            to systems.
          </h2>
          <p>
            Inspect persistence, variation
            <br />
            and the effect of the previous state.
          </p>
          <ActionLink to="/models#market-dynamics">
            Explore Market Dynamics
          </ActionLink>
        </div>
        <div className="pe-market-signal">
          <MarketFlowGraphic result={DEFAULT_MARKET_VISUAL} />
          <span>AR(1) · Persistence 0.65 · Seed 101</span>
        </div>
        <div className="pe-model-data">
          <span>Physical flow as context</span>
          <span>Series calculated independently of the photograph</span>
        </div>
      </section>
      <section className="pe-agents" aria-labelledby="agents-title">
        <div className="pe-agent-photo">
          <MediaPlane
            role="agentCollective"
            alt="A dense school of fish moving together underwater"
          />
        </div>
        <div className="pe-model-copy">
          <p className="pe-eyebrow">Agent Interaction</p>
          <h2 id="agents-title">
            Local rules.
            <br />
            Collective
            <br />
            behaviour.
          </h2>
          <p>
            Individual positions and directions.
            <br />A different view of the whole.
          </p>
          <ActionLink to="/models#agent-interaction">
            Explore Agent Interaction
          </ActionLink>
        </div>
        <div className="pe-agent-field">
          <AgentNetworkGraphic result={DEFAULT_AGENT_VISUAL} />
          <span>32 deterministic agents</span>
        </div>
        <div className="pe-model-data">
          <span>Collective behaviour in nature</span>
          <span>The agent field is an independent illustrative model</span>
        </div>
      </section>
      <section
        className="pe-reproduce pe-light"
        aria-labelledby="reproduce-title"
      >
        <div>
          <p className="pe-eyebrow">From a possibility to evidence</p>
          <h2 id="reproduce-title">
            Run it again.
            <br />
            Know what
            <br />
            stays true.
          </h2>
          <p>
            Same inputs. Same seeded run.
            <br />
            Recompute every path and compare the result.
          </p>
          <button className="pe-action pe-action--dark" onClick={demo.replay}>
            Replay this run <span aria-hidden="true">↻</span>
          </button>
          <p role="status" className="pe-replay-status">
            {demo.replayed
              ? "Reproduced. Every path and statistic matches."
              : "Your current conditions are ready to replay."}
          </p>
        </div>
        <div
          className={"pe-run-record " + (demo.replayed ? "is-reproduced" : "")}
        >
          <div className="pe-record-head">
            <OriginSymbol />
            <span>Additive diffusion</span>
            <span className="pe-record-status">
              {demo.replayed ? "Reproduced" : "Calculated"}
            </span>
          </div>
          <TrajectoryField current={demo.current} variant="field" />
          <dl>
            <div>
              <dt>Seed</dt>
              <dd>{demo.seed}</dd>
            </div>
            <div>
              <dt>Mean endpoint</dt>
              <dd>{demo.current.mean.toFixed(4)}</dd>
            </div>
            <div>
              <dt>Variance</dt>
              <dd>{demo.current.variance.toFixed(4)}</dd>
            </div>
          </dl>
          <p>Build a history of evidence.</p>
          <Link to="/signup">
            Create your analyst account <Arrow diagonal />
          </Link>
        </div>
      </section>
      <section className="pe-method-threshold">
        <p className="pe-eyebrow">Nothing hidden in the calculation</p>
        <h2>
          Inspect what
          <br />
          shaped the result.
        </h2>
        <div
          className="pe-equation-spine"
          aria-label="Next state equals current state plus drift increment plus sampled variation"
        >
          x<sub>t+1</sub> <span>=</span> x<sub>t</sub> <span>+</span> μΔt{" "}
          <span>+</span> σ√Δt Z<sub>t</sub>
        </div>
        <ActionLink to="/method">Read the method</ActionLink>
      </section>
      <section className="pe-resolution" aria-labelledby="resolution-title">
        <div className="pe-resolution-field" aria-hidden="true">
          <TrajectoryField current={demo.current} variant="field" />
        </div>
        <OriginSymbol />
        <p className="pe-eyebrow">Back to the beginning</p>
        <h2 id="resolution-title">
          Start with
          <br />
          one condition.
        </h2>
        <ActionLink to="/workbench" primary carry>
          Build a model
        </ActionLink>
        <Link to="/models" className="pe-resolution-secondary">
          Explore the model families <Arrow diagonal />
        </Link>
      </section>
    </div>
  );
}
