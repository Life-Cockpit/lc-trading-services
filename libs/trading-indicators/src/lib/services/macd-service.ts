import type { TradingDataClient, TimeInterval } from '@lc-trading-services/trading-data-client';
import type { MACDResult } from '../types/index.js';
import { EMAService } from './ema-service.js';

/**
 * Service for calculating MACD (Moving Average Convergence Divergence) indicator
 * MACD is a trend-following momentum indicator that shows the relationship between two EMAs
 */
export class MACDService {
  private readonly emaService: EMAService;

  constructor(
    private readonly dataClient: TradingDataClient,
    emaService?: EMAService
  ) {
    this.emaService = emaService || new EMAService(dataClient);
  }

  /**
   * Calculate MACD for a symbol
   * @param symbol - Asset symbol (e.g., 'EURUSD', 'AAPL')
   * @param fastPeriod - Fast EMA period (default: 12)
   * @param slowPeriod - Slow EMA period (default: 26)
   * @param signalPeriod - Signal line EMA period (default: 9)
   * @param interval - Time interval (default: '1d')
   * @returns MACD result
   */
  async calculateMACD(
    symbol: string,
    fastPeriod: number = 12,
    slowPeriod: number = 26,
    signalPeriod: number = 9,
    interval: TimeInterval = '1d'
  ): Promise<MACDResult> {
    if (fastPeriod >= slowPeriod) {
      throw new Error('Fast period must be less than slow period');
    }

    // Get historical data - need enough data for slowPeriod + signalPeriod calculations
    const endDate = new Date();
    const startDate = new Date();
    
    const daysNeeded = this.calculateDaysNeeded(interval, slowPeriod + signalPeriod);
    startDate.setDate(startDate.getDate() - daysNeeded);

    const historicalData = await this.dataClient.getHistoricalData({
      symbol,
      startDate,
      endDate,
      interval,
    });

    const requiredDataPoints = slowPeriod + signalPeriod;
    if (historicalData.length < requiredDataPoints) {
      throw new Error(
        `Insufficient data for MACD calculation. Need at least ${requiredDataPoints} data points, got ${historicalData.length}`
      );
    }

    // Extract closing prices
    const prices = historicalData.map((data) => data.close);

    // Calculate MACD components using EMAService
    const fastEMA = this.emaService.computeEMA(prices, fastPeriod);
    const slowEMA = this.emaService.computeEMA(prices, slowPeriod);
    const macdLine = fastEMA - slowEMA;

    // Calculate signal line (EMA of MACD values)
    // To do this, we need to calculate MACD for each data point in the range
    const macdValues: number[] = [];
    
    // Start from slowPeriod because that's when we can first calculate MACD
    for (let i = slowPeriod; i <= prices.length; i++) {
      const priceSlice = prices.slice(0, i);
      const fast = this.emaService.computeEMA(priceSlice, fastPeriod);
      const slow = this.emaService.computeEMA(priceSlice, slowPeriod);
      macdValues.push(fast - slow);
    }

    // Calculate signal line as EMA of MACD values
    const signalLine = this.emaService.computeEMA(macdValues, signalPeriod);
    const histogram = macdLine - signalLine;

    return {
      symbol,
      fastPeriod,
      slowPeriod,
      signalPeriod,
      macd: Number(macdLine.toFixed(6)),
      signal: Number(signalLine.toFixed(6)),
      histogram: Number(histogram.toFixed(6)),
      timestamp: new Date(),
    };
  }

  /**
   * Calculate days needed to fetch based on interval
   */
  private calculateDaysNeeded(interval: TimeInterval, period: number): number {
    // Use period * 3 for safety margin to account for weekends/holidays
    const multiplier = 3;
    
    switch (interval) {
      case '1m':
      case '2m':
      case '5m':
      case '15m':
      case '30m':
        // For minute intervals, we need more calendar days to get enough data points
        return Math.min(7, period * multiplier); // Max 7 days for intraday
      case '1h':
        return Math.ceil((period / 6.5) * multiplier);
      case '1d':
        return period * multiplier;
      case '1wk':
        return period * 7 * multiplier;
      case '1mo':
        return period * 30 * multiplier;
      default:
        return period * multiplier;
    }
  }
}
