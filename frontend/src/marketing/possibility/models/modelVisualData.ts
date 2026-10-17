import {
  calculateGameEquilibrium,
  runMarketDynamics,
  runConflictInteraction,
} from "../../../math/deterministicModels";
// Public illustrative model structures, derived from the documented helper defaults.
export const DEFAULT_GAME_VISUAL = calculateGameEquilibrium();
export const DEFAULT_MARKET_VISUAL = runMarketDynamics();
export const DEFAULT_AGENT_VISUAL = runConflictInteraction();
