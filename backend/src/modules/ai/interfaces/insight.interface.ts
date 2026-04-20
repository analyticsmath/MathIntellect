export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface InsightRiskAnalysis {
  level: RiskLevel;
  explanation: string;
}

export interface InsightResponse {
  summary: string;
  key_findings: string[];
  risk_analysis: InsightRiskAnalysis;
  opportunity_analysis: string[];
  mathematical_interpretation: string;
  confidence_score: number;
  recommendation: string;
}
