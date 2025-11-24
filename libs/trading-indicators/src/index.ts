// Main class
export { TradingIndicators } from './lib/trading-indicators.js';

// Individual services
export { ATRService } from './lib/services/atr-service.js';
export { EMAService } from './lib/services/ema-service.js';
export { AllTimeHighLowService } from './lib/services/all-time-high-low-service.js';
export { Week52HighLowService } from './lib/services/week-52-high-low-service.js';
export { SupportResistanceService } from './lib/services/support-resistance-service.js';
export { TrendlineService } from './lib/services/trendline-service.js';
export { RSIService } from './lib/services/rsi-service.js';
export { MACDService } from './lib/services/macd-service.js';
export { PivotPointsService } from './lib/services/pivot-points-service.js';

// Types
export type {
  SupportResistanceZone,
  SupportResistanceResult,
  ATRResult,
  AllTimeHighLowResult,
  WeekHighLowResult,
  EMAResult,
  Trendline,
  TrendlinePoint,
  TrendlineResult,
  RSIResult,
  MACDResult,
  PivotPointsResult,
} from './lib/types/index.js';

