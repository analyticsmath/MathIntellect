export interface DecisionAlternative {
  option: string;
  pros: string[];
  cons: string[];
}

export interface DecisionResponse {
  decision: string;
  reasoning: string[];
  risk_tradeoff: string;
  alternatives: DecisionAlternative[];
  confidence: number;
}
