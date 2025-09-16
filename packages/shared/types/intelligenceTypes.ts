export interface Decision {
  id: string;
  recommendation: string;
  confidence: number;
  factors: string[];
  timestamp: string;
}

export interface FraudDetectionResult {
  isFraudulent: boolean;
  riskScore: number;
  indicators: string[];
  timestamp: string;
}

export interface MaintenancePrediction {
  equipmentId: string;
  needsMaintenance: boolean;
  predictedTimeframe: string;
  riskFactors: string[];
  confidence: number;
  timestamp: string;
}

export interface Anomaly {
  id: string;
  type: string;
  severity: string;
  description: string;
  timestamp: string;
  data: any;
}