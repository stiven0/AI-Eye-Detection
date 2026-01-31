export interface Prediction {
  mode: 'quick' | 'specialist';
  result: ResultPrediction
}

export interface ResultPrediction {
  confidence: number;
  index: number;
  label: string;
  predictions: any[];
}

