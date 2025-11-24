import type { TradingDataClient, TimeInterval } from '@lc-trading-services/trading-data-client';
import type { PivotPointsResult } from '../types/index.js';

/**
 * Service for calculating Pivot Points indicator
 * Pivot Points are used to identify potential support and resistance levels
 * based on the previous period's high, low, and close prices
 */
export class PivotPointsService {
  constructor(private readonly dataClient: TradingDataClient) {}

  /**
   * Calculate Standard Pivot Points for a symbol
   * @param symbol - Asset symbol (e.g., 'EURUSD', 'AAPL')
   * @param interval - Time interval (default: '1d')
   * @returns Pivot Points result with support and resistance levels
   */
  async calculatePivotPoints(
    symbol: string,
    interval: TimeInterval = '1d'
  ): Promise<PivotPointsResult> {
    // Get historical data - need at least 2 periods (previous and current)
    const endDate = new Date();
    const startDate = new Date();
    
    // Calculate start date based on interval to ensure we have enough data
    const daysNeeded = this.calculateDaysNeeded(interval);
    startDate.setDate(startDate.getDate() - daysNeeded);

    const historicalData = await this.dataClient.getHistoricalData({
      symbol,
      startDate,
      endDate,
      interval,
    });

    if (historicalData.length < 2) {
      throw new Error(
        `Insufficient data for Pivot Points calculation. Need at least 2 data points, got ${historicalData.length}`
      );
    }

    // Get the previous period's data (second to last data point)
    // We use second to last because the last might be incomplete (current period)
    const previousPeriod = historicalData[historicalData.length - 2];
    
    const high = previousPeriod.high;
    const low = previousPeriod.low;
    const close = previousPeriod.close;

    // Calculate Pivot Point (PP)
    const pivotPoint = (high + low + close) / 3;

    // Calculate Support and Resistance levels
    const r1 = (2 * pivotPoint) - low;
    const s1 = (2 * pivotPoint) - high;
    const r2 = pivotPoint + (high - low);
    const s2 = pivotPoint - (high - low);
    const r3 = high + 2 * (pivotPoint - low);
    const s3 = low - 2 * (high - pivotPoint);

    return {
      symbol,
      interval,
      pivotPoint: Number(pivotPoint.toFixed(6)),
      r1: Number(r1.toFixed(6)),
      r2: Number(r2.toFixed(6)),
      r3: Number(r3.toFixed(6)),
      s1: Number(s1.toFixed(6)),
      s2: Number(s2.toFixed(6)),
      s3: Number(s3.toFixed(6)),
      previousHigh: Number(high.toFixed(6)),
      previousLow: Number(low.toFixed(6)),
      previousClose: Number(close.toFixed(6)),
      timestamp: new Date(),
    };
  }

  /**
   * Calculate days needed to fetch based on interval
   * Pivot points only need previous period data, but we add safety margin
   * for weekends, holidays, and incomplete periods
   */
  private calculateDaysNeeded(interval: TimeInterval): number {
    // Safety multiplier to account for weekends/holidays/market closures
    const safetyMultiplier = 3;
    
    switch (interval) {
      case '1m':
      case '2m':
      case '5m':
      case '15m':
      case '30m':
        // For minute intervals, need 1-2 days to ensure 2 complete periods
        return 7; // Safe margin for intraday data
      case '1h':
        // Need 2 periods (2 hours). With ~6.5 trading hours/day, use 1 day * safety
        return Math.ceil((2 / 6.5) * safetyMultiplier);
      case '1d':
        // Need 2 periods (2 days) plus safety margin
        return 2 * safetyMultiplier;
      case '1wk':
        // Need 2 periods (2 weeks = 14 days) plus safety margin
        return 14 * safetyMultiplier;
      case '1mo':
        // Need 2 periods (2 months = ~60 days) plus safety margin
        return 60 * safetyMultiplier;
      default:
        // Default to week of data with safety margin
        return 7;
    }
  }
}
