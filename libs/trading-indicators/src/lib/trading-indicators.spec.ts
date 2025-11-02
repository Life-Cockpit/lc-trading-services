import { TradingIndicators } from './trading-indicators.js';
import { TradingDataClient } from '@lc-trading-services/trading-data-client';
import { ATRService } from './services/atr-service.js';
import { EMAService } from './services/ema-service.js';
import { AllTimeHighLowService } from './services/all-time-high-low-service.js';
import { Week52HighLowService } from './services/week-52-high-low-service.js';
import { SupportResistanceService } from './services/support-resistance-service.js';
import { TrendlineService } from './services/trendline-service.js';

describe('TradingIndicators', () => {
  it('should create instance with default data client', () => {
    const indicators = new TradingIndicators();

    expect(indicators).toBeDefined();
    expect(indicators.atr).toBeInstanceOf(ATRService);
    expect(indicators.ema).toBeInstanceOf(EMAService);
    expect(indicators.allTimeHighLow).toBeInstanceOf(AllTimeHighLowService);
    expect(indicators.week52HighLow).toBeInstanceOf(Week52HighLowService);
    expect(indicators.supportResistance).toBeInstanceOf(SupportResistanceService);
    expect(indicators.trendline).toBeInstanceOf(TrendlineService);
  });

  it('should create instance with custom data client', () => {
    const customClient = new TradingDataClient();
    const indicators = new TradingIndicators(customClient);

    expect(indicators).toBeDefined();
    expect(indicators.atr).toBeInstanceOf(ATRService);
    expect(indicators.ema).toBeInstanceOf(EMAService);
    expect(indicators.allTimeHighLow).toBeInstanceOf(AllTimeHighLowService);
    expect(indicators.week52HighLow).toBeInstanceOf(Week52HighLowService);
    expect(indicators.supportResistance).toBeInstanceOf(SupportResistanceService);
    expect(indicators.trendline).toBeInstanceOf(TrendlineService);
  });

  it('should provide access to all indicator services', () => {
    const indicators = new TradingIndicators();

    expect(typeof indicators.atr.calculateATR).toBe('function');
    expect(typeof indicators.ema.calculateEMA).toBe('function');
    expect(typeof indicators.ema.calculateMultipleEMAs).toBe('function');
    expect(typeof indicators.allTimeHighLow.calculateAllTimeHighLow).toBe('function');
    expect(typeof indicators.week52HighLow.calculate52WeekHighLow).toBe('function');
    expect(typeof indicators.supportResistance.calculateSupportResistance).toBe('function');
    expect(typeof indicators.trendline.calculateTrendlines).toBe('function');
  });
});
