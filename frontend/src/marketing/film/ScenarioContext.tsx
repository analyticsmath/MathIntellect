import type { PropsWithChildren } from "react";
import { ScenarioContext, useScenarioState } from "./scenario";
export function ScenarioProvider({ children }: PropsWithChildren) {
  const scenario = useScenarioState();
  return (
    <ScenarioContext.Provider value={scenario}>
      {children}
    </ScenarioContext.Provider>
  );
}
