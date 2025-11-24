import type { TradingDataClient, TimeInterval } from '@lc-trading-services/trading-data-client';
import type { RSIResult } from '../types/index.js';

/**
 * Service for calculating Relative Strength Index (RSI) indicator
 * RSI measures the magnitude of recent price changes to evaluate overbought or oversold conditions
 */
export class RSIService {
  constructor(private readonly dataClient: TradingDataClient) {}

  /**
   * Calculate RSI for a symbol
   * @param symbol - Asset symbol (e.g., 'EURUSD', 'AAPL')
   * @param period - RSI period (default: 14)
   * @param interval - Time interval (default: '1d')
   * @returns RSI result
   */
  async calculateRSI(
    symbol: string,
    period = 14,
    interval: TimeInterval = '1d'
  ): Promise<RSIResult> {
    // Get historical data - need at least period + 1 for accurate calculation
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

    if (historicalData.length < period + 1) {
      throw new Error(
        `Insufficient data for RSI calculation. Need at least ${period + 1} data points, got ${historicalData.length}`
      );
    }

    // Extract closing prices
    const prices = historicalData.map((data) => data.close);

    // Calculate RSI
    const rsi = this.computeRSI(prices, period);

    // Determine signal based on RSI value
    const signal = this.getSignal(rsi);

    return {
      symbol,
      period,
      rsi: Number(rsi.toFixed(2)),
      signal,
      timestamp: new Date(),
    };
  }

  /**
   * Compute RSI from price array using exponential moving average
   * @param prices - Array of closing prices
   * @param period - RSI period
   * @returns RSI value (0-100)
   */
  private computeRSI(prices: number[], period: number): number {
    if (prices.length < period + 1) {
      throw new Error(`Not enough prices for RSI calculation`);
    }

    // Calculate price changes
    const changes: number[] = [];
    for (let i = 1; i < prices.length; i++) {
      changes.push(prices[i] - prices[i - 1]);
    }

    // Separate gains and losses
    const gains: number[] = changes.map(change => change > 0 ? change : 0);
    const losses: number[] = changes.map(change => change < 0 ? Math.abs(change) : 0);

    // Calculate initial average gain and loss (simple average)
    let avgGain = gains.slice(0, period).reduce((sum, gain) => sum + gain, 0) / period;
    let avgLoss = losses.slice(0, period).reduce((sum, loss) => sum + loss, 0) / period;

    // Calculate subsequent averages using exponential moving average
    for (let i = period; i < gains.length; i++) {
      avgGain = (avgGain * (period - 1) + gains[i]) / period;
      avgLoss = (avgLoss * (period - 1) + losses[i]) / period;
    }

    // Calculate RSI
    if (avgLoss === 0) {
      return 100; // No losses means RSI is 100
    }

    const rs = avgGain / avgLoss;
    const rsi = 100 - (100 / (1 + rs));

    return rsi;
  }

  /**
   * Determine RSI signal based on value
   * @param rsi - RSI value (0-100)
   * @returns Signal interpretation
   */
  private getSignal(rsi: number): 'overbought' | 'oversold' | 'neutral' {
    if (rsi >= 70) {
      return 'overbought';
    } else if (rsi <= 30) {
      return 'oversold';
    }
    return 'neutral';
  }

  /**
   * Calculate days needed to fetch based on interval
   */
  private calculateDaysNeeded(interval: TimeInterval, period: number): number {
    // Use period * 3 for better accuracy
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
