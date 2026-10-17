import {
  createContext,
  useContext,
  useMemo,
  useState,
  type SetStateAction,
} from "react";
import { runDeterministicMonteCarlo } from "../../math/deterministicModels";
export function useScenarioState() {
  const [sigma, setSigmaState] = useState(0.35);
  const [mu, setMuState] = useState(0.05);
  const [seed, setSeedState] = useState(42);
  const [replayedKey, setReplayedKey] = useState("");
  const setSigma = (value: SetStateAction<number>) => {
    setReplayedKey("");
    setSigmaState(value);
  };
  const setMu = (value: SetStateAction<number>) => {
    setReplayedKey("");
    setMuState(value);
  };
  const setSeed = (value: SetStateAction<number>) => {
    setReplayedKey("");
    setSeedState(value);
  };
  const paths = 24;
  const current = useMemo(
    () => runDeterministicMonteCarlo(sigma, mu, 50, paths, seed),
    [sigma, mu, seed],
  );
  const baseline = useMemo(
    () => runDeterministicMonteCarlo(0.35, mu, 50, paths, seed),
    [mu, seed],
  );
  const key = JSON.stringify([sigma, mu, seed]);
  const replay = () => {
    const repeated = runDeterministicMonteCarlo(sigma, mu, 50, paths, seed);
    if (JSON.stringify(repeated) === JSON.stringify(current))
      setReplayedKey(key);
  };
  const reset = () => {
    setSigma(0.35);
    setMu(0.05);
    setSeed(42);
    setReplayedKey("");
  };
  return {
    sigma,
    mu,
    seed,
    paths,
    setSigma,
    setMu,
    setSeed,
    current,
    baseline,
    replay,
    reset,
    replayed: replayedKey === key,
  };
}
type Scenario = ReturnType<typeof useScenarioState>;
export const ScenarioContext = createContext<Scenario | null>(null);
export function useScenario() {
  const value = useContext(ScenarioContext);
  if (!value)
    throw new Error("Scenario controls require the marketing provider.");
  return value;
}
