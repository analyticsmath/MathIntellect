import { expect, it } from "vitest";
import {
  calculateGameEquilibrium,
  runMarketDynamics,
  runConflictInteraction,
} from "../../../math/deterministicModels";
import {
  DEFAULT_GAME_VISUAL,
  DEFAULT_MARKET_VISUAL,
  DEFAULT_AGENT_VISUAL,
} from "./modelVisualData";
it("derives the public illustrative structures from exact deterministic defaults", () => {
  expect(DEFAULT_GAME_VISUAL).toEqual(calculateGameEquilibrium());
  expect(DEFAULT_GAME_VISUAL.matrix.map((row) => row.length)).toEqual([2, 2]);
  expect(DEFAULT_MARKET_VISUAL).toEqual(runMarketDynamics());
  expect(DEFAULT_MARKET_VISUAL.series.length).toBeGreaterThan(0);
  expect(DEFAULT_AGENT_VISUAL).toEqual(runConflictInteraction());
  expect(DEFAULT_AGENT_VISUAL.agents).toHaveLength(32);
});
