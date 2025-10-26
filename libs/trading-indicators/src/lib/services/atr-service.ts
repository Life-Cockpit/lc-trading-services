import type { TradingDataClient, TimeInterval } from '@lc-trading-services/trading-data-client';
import type { ATRResult } from '../types/index.js';

/**
 * Service for calculating Average True Range (ATR) indicator
 * ATR measures market volatility by decomposing the entire range of an asset price for that period
 */
export class ATRService {
  constructor(private readonly dataClient: TradingDataClient) {}

  /**
   * Calculate Average True Range for a symbol
   * @param symbol - Asset symbol (e.g., 'EURUSD', 'AAPL')
   * @param interval - Time interval ('1d' or '1h')
   * @param period - ATR period (default: 14)
   * @returns ATR result
   */
  async calculateATR(
    symbol: string,
    interval: TimeInterval,
    period = 14
  ): Promise<ATRResult> {
    // Get historical data - need at least period + 1 data points
    const endDate = new Date();
    const startDate = new Date();
    
    // Calculate start date based on interval to ensure we have enough data
    const daysNeeded = this.calculateDaysNeeded(interval, period);
    startDate.setDate(startDate.getDate() - daysNeeded);

    const historicalData = await this.dataClient.getHistoricalData({
      symbol,
      startDate,
      endDate,
      interval,
    });

    if (historicalData.length < period + 1) {
      throw new Error(
        `Insufficient data for ATR calculation. Need at least ${period + 1} data points, got ${historicalData.length}`
      );
    }

    // Calculate True Range for each period
    const trueRanges: number[] = [];
    
    for (let i = 1; i < historicalData.length; i++) {
      const current = historicalData[i];
      const previous = historicalData[i - 1];
      
      const highLow = current.high - current.low;
      const highClose = Math.abs(current.high - previous.close);
      const lowClose = Math.abs(current.low - previous.close);
      
      const trueRange = Math.max(highLow, highClose, lowClose);
      trueRanges.push(trueRange);
    }

    // Calculate initial ATR (simple average of first 'period' true ranges)
    let atr = trueRanges.slice(0, period).reduce((sum, tr) => sum + tr, 0) / period;

    // Calculate subsequent ATR values using exponential moving average
    for (let i = period; i < trueRanges.length; i++) {
      atr = (atr * (period - 1) + trueRanges[i]) / period;
    }

    return {
      symbol,
      interval,
      atr: Number(atr.toFixed(6)),
      timestamp: new Date(),
    };
  }

  /**
   * Calculate days needed to fetch based on interval
   */
  private calculateDaysNeeded(interval: TimeInterval, period: number): number {
    const multiplier = 2; // Safety multiplier for weekends/holidays
    
    switch (interval) {
      case '1h':
        // Need period hours, assuming ~6.5 trading hours per day
        return Math.ceil((period / 6.5) * multiplier);
      case '1d':
        // Need period days
        return period * multiplier;
      default:
        return period * multiplier;
    }
  }
}
