// Main class
export { TradingIndicators } from './lib/trading-indicators.js';

// Individual services
export { ATRService } from './lib/services/atr-service.js';
export { EMAService } from './lib/services/ema-service.js';
export { AllTimeHighLowService } from './lib/services/all-time-high-low-service.js';
export { Week52HighLowService } from './lib/services/week-52-high-low-service.js';
export { SupportResistanceService } from './lib/services/support-resistance-service.js';

// Types
export type {
  SupportResistanceZone,
  SupportResistanceResult,
  ATRResult,
  AllTimeHighLowResult,
  WeekHighLowResult,
  EMAResult,
} from './lib/types/index.js';

