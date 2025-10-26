import { TradingDataClient } from '@lc-trading-services/trading-data-client';
import { ATRService } from './services/atr-service.js';
import { EMAService } from './services/ema-service.js';
import { AllTimeHighLowService } from './services/all-time-high-low-service.js';
import { Week52HighLowService } from './services/week-52-high-low-service.js';
import { SupportResistanceService } from './services/support-resistance-service.js';

/**
 * Main service class that provides access to all trading indicators
 */
export class TradingIndicators {
  public readonly atr: ATRService;
  public readonly ema: EMAService;
  public readonly allTimeHighLow: AllTimeHighLowService;
  public readonly week52HighLow: Week52HighLowService;
  public readonly supportResistance: SupportResistanceService;

  constructor(dataClient?: TradingDataClient) {
    const client = dataClient || new TradingDataClient();
    
    this.atr = new ATRService(client);
    this.ema = new EMAService(client);
    this.allTimeHighLow = new AllTimeHighLowService(client);
    this.week52HighLow = new Week52HighLowService(client);
    this.supportResistance = new SupportResistanceService(client);
  }
}
