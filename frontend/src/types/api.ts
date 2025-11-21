// API 响应类型定义

export interface ClassificationResult {
  market_direction: 'bullish' | 'bearish' | 'neutral';
  event_type: 'macro_policy' | 'industry_trend' | 'company_action' | 'financial_report' | 'market_volatility' | 'risk_warning';
  impact_strength: 'high' | 'medium' | 'low';
  risk_signal: 'default_risk' | 'regulatory_risk' | 'liquidity_risk' | 'operational_risk' | 'none';
}

export interface TopKItem {
  label: string;
  score: number;
}

export interface PredictionsResp {
  input: string;
  result: ClassificationResult;
  top_k: TopKItem[];
}

export interface ClassifyRequest {
  text: string;
}
