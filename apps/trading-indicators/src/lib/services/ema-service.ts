import type { TradingDataClient, TimeInterval } from '@lc-trading-services/trading-data-client';
import type { EMAResult } from '../types/index.js';

/**
 * Service for calculating Exponential Moving Average (EMA) indicator
 * EMA gives more weight to recent prices, making it more responsive to new information
 */
export class EMAService {
  constructor(private readonly dataClient: TradingDataClient) {}

  /**
   * Calculate EMA for a symbol
   * @param symbol - Asset symbol (e.g., 'EURUSD', 'AAPL')
   * @param period - EMA period (e.g., 9, 20, 50, 200)
   * @param interval - Time interval (default: '1d')
   * @returns EMA result
   */
  async calculateEMA(
    symbol: string,
    period: number,
    interval: TimeInterval = '1d'
  ): Promise<EMAResult> {
    // Get historical data - need at least period * 2 for accuracy
    const endDate = new Date();
    const startDate = new Date();
    
    const daysNeeded = this.calculateDaysNeeded(interval, period);
    startDate.setDate(startDate.getDate() - daysNeeded);

    const historicalData = await this.dataClient.getHistoricalData({
      symbol,
      startDate,
      endDate,
      interval,
    });

    if (historicalData.length < period) {
      throw new Error(
        `Insufficient data for EMA calculation. Need at least ${period} data points, got ${historicalData.length}`
      );
    }

    // Extract closing prices
    const prices = historicalData.map((data) => data.close);

    // Calculate EMA
    const ema = this.computeEMA(prices, period);

    return {
      symbol,
      period,
      ema: Number(ema.toFixed(6)),
      timestamp: new Date(),
    };
  }

  /**
   * Calculate multiple EMAs at once (more efficient)
   * @param symbol - Asset symbol
   * @param periods - Array of EMA periods (e.g., [9, 20, 50, 200])
   * @param interval - Time interval (default: '1d')
   * @returns Array of EMA results
   */
  async calculateMultipleEMAs(
    symbol: string,
    periods: number[],
    interval: TimeInterval = '1d'
  ): Promise<EMAResult[]> {
    const maxPeriod = Math.max(...periods);
    
    // Get historical data once for all calculations
    const endDate = new Date();
    const startDate = new Date();
    
    const daysNeeded = this.calculateDaysNeeded(interval, maxPeriod);
    startDate.setDate(startDate.getDate() - daysNeeded);

    const historicalData = await this.dataClient.getHistoricalData({
      symbol,
      startDate,
      endDate,
      interval,
    });

    if (historicalData.length < maxPeriod) {
      throw new Error(
        `Insufficient data for EMA calculation. Need at least ${maxPeriod} data points, got ${historicalData.length}`
      );
    }

    const prices = historicalData.map((data) => data.close);
    const timestamp = new Date();

    return periods.map((period) => ({
      symbol,
      period,
      ema: Number(this.computeEMA(prices, period).toFixed(6)),
      timestamp,
    }));
  }

  /**
   * Compute EMA from price array
   * @param prices - Array of prices
   * @param period - EMA period
   * @returns EMA value
   */
  private computeEMA(prices: number[], period: number): number {
    if (prices.length < period) {
      throw new Error(`Not enough prices for EMA calculation`);
    }

    // Calculate initial SMA (Simple Moving Average)
    const initialSMA = prices.slice(0, period).reduce((sum, price) => sum + price, 0) / period;
    
    // Calculate multiplier: (2 / (period + 1))
    const multiplier = 2 / (period + 1);
    
    // Start with SMA as the first EMA value
    let ema = initialSMA;
    
    // Calculate EMA for remaining prices
    for (let i = period; i < prices.length; i++) {
      ema = (prices[i] - ema) * multiplier + ema;
    }
    
    return ema;
  }

  /**
   * Calculate days needed to fetch based on interval
   */
  private calculateDaysNeeded(interval: TimeInterval, period: number): number {
    // Use period * 2 for better accuracy
    const multiplier = 3; // Safety multiplier for weekends/holidays
    
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
