import type { TradingDataClient, TimeInterval, OHLCVData } from '@lc-trading-services/trading-data-client';
import type { Trendline, TrendlinePoint, TrendlineResult } from '../types/index.js';

/**
 * Service for calculating trendlines with exactly 2 hits
 * Identifies support and resistance trendlines by connecting pivot points
 */
export class TrendlineService {
  // Constants for strength calculation
  private static readonly TIME_SPAN_WEIGHT = 0.4;
  private static readonly PRICE_SPAN_WEIGHT = 0.3;
  private static readonly RECENCY_WEIGHT = 0.3;
  private static readonly TIME_SPAN_NORMALIZATION_FACTOR = 0.5; // 50% of total periods
  private static readonly PRICE_SPAN_NORMALIZATION_FACTOR = 10; // Scale factor for small percentages
  
  // Constants for data calculation
  // Note: Trading hours per day assumes stock market hours (e.g., NYSE: 6.5 hours).
  // This may differ for other markets (FOREX: 24h, crypto: 24h). Adjust if needed.
  private static readonly TRADING_HOURS_PER_DAY = 6.5;
  private static readonly DAYS_MULTIPLIER = 2; // Safety multiplier for weekends/holidays

  constructor(private readonly dataClient: TradingDataClient) {}

  /**
   * Calculate trendlines with exactly 2 hits for a symbol
   * @param symbol - Asset symbol (e.g., 'EURUSD', 'AAPL')
   * @param interval - Time interval ('1d' or '1h')
   * @param lookbackPeriods - Number of periods to analyze (default: 100)
   * @param maxTrendlines - Maximum number of trendlines to return per type (default: 10)
   * @returns Trendline calculation result with support and resistance trendlines
   */
  async calculateTrendlines(
    symbol: string,
    interval: TimeInterval = '1d',
    lookbackPeriods = 100,
    maxTrendlines = 10
  ): Promise<TrendlineResult> {
    if (interval !== '1d' && interval !== '1h') {
      throw new Error('Trendline calculation only supports 1d and 1h intervals');
    }

    // Get historical data
    const endDate = new Date();
    const startDate = new Date();
    
    const daysNeeded = this.calculateDaysNeeded(interval, lookbackPeriods);
    startDate.setDate(startDate.getDate() - daysNeeded);

    const historicalData = await this.dataClient.getHistoricalData({
      symbol,
      startDate,
      endDate,
      interval,
    });

    if (historicalData.length < 20) {
      throw new Error(
        `Insufficient data for trendline calculation. Need at least 20 data points, got ${historicalData.length}`
      );
    }

    // Identify pivot points (local highs and lows)
    const pivotHighs = this.findPivotHighs(historicalData);
    const pivotLows = this.findPivotLows(historicalData);

    // Calculate resistance trendlines from pivot highs
    const resistanceTrendlines = this.findTrendlines(
      pivotHighs,
      'resistance',
      historicalData
    );

    // Calculate support trendlines from pivot lows
    const supportTrendlines = this.findTrendlines(
      pivotLows,
      'support',
      historicalData
    );

    // Sort by strength and return top trendlines
    resistanceTrendlines.sort((a, b) => b.strength - a.strength);
    supportTrendlines.sort((a, b) => b.strength - a.strength);

    return {
      symbol,
      interval,
      supportTrendlines: supportTrendlines.slice(0, maxTrendlines),
      resistanceTrendlines: resistanceTrendlines.slice(0, maxTrendlines),
      timestamp: new Date(),
    };
  }

  /**
   * Find pivot highs (local maxima)
   */
  private findPivotHighs(data: OHLCVData[], leftBars = 5, rightBars = 5): TrendlinePoint[] {
    const pivots: TrendlinePoint[] = [];

    for (let i = leftBars; i < data.length - rightBars; i++) {
      const currentHigh = data[i].high;
      let isPivot = true;

      // Check left bars
      for (let j = i - leftBars; j < i; j++) {
        if (data[j].high > currentHigh) {
          isPivot = false;
          break;
        }
      }

      // Check right bars
      if (isPivot) {
        for (let j = i + 1; j <= i + rightBars; j++) {
          if (data[j].high > currentHigh) {
            isPivot = false;
            break;
          }
        }
      }

      if (isPivot) {
        pivots.push({
          index: i,
          price: currentHigh,
          date: data[i].date,
        });
      }
    }

    return pivots;
  }

  /**
   * Find pivot lows (local minima)
   */
  private findPivotLows(data: OHLCVData[], leftBars = 5, rightBars = 5): TrendlinePoint[] {
    const pivots: TrendlinePoint[] = [];

    for (let i = leftBars; i < data.length - rightBars; i++) {
      const currentLow = data[i].low;
      let isPivot = true;

      // Check left bars
      for (let j = i - leftBars; j < i; j++) {
        if (data[j].low < currentLow) {
          isPivot = false;
          break;
        }
      }

      // Check right bars
      if (isPivot) {
        for (let j = i + 1; j <= i + rightBars; j++) {
          if (data[j].low < currentLow) {
            isPivot = false;
            break;
          }
        }
      }

      if (isPivot) {
        pivots.push({
          index: i,
          price: currentLow,
          date: data[i].date,
        });
      }
    }

    return pivots;
  }

  /**
   * Find trendlines by connecting pairs of pivot points
   * Each trendline connects exactly 2 points (2 hits)
   */
  private findTrendlines(
    pivots: TrendlinePoint[],
    type: 'support' | 'resistance',
    historicalData: OHLCVData[]
  ): Trendline[] {
    const trendlines: Trendline[] = [];

    // Connect each pair of pivots to create trendlines with exactly 2 hits
    for (let i = 0; i < pivots.length - 1; i++) {
      for (let j = i + 1; j < pivots.length; j++) {
        const point1 = pivots[i];
        const point2 = pivots[j];

        // Calculate slope and intercept
        const indexDiff = point2.index - point1.index;
        const priceDiff = point2.price - point1.price;
        const slope = priceDiff / indexDiff;
        const intercept = point1.price - slope * point1.index;

        // Calculate strength based on:
        // 1. Time span (longer is stronger)
        // 2. Price span (larger is stronger)
        // 3. Recency (more recent is stronger)
        const strength = this.calculateTrendlineStrength(
          point1,
          point2,
          historicalData.length
        );

        trendlines.push({
          type,
          point1,
          point2,
          slope: Number(slope.toFixed(6)),
          intercept: Number(intercept.toFixed(6)),
          strength: Number(strength.toFixed(3)),
        });
      }
    }

    return trendlines;
  }

  /**
   * Calculate trendline strength based on time span, price relevance, and recency
   * @returns Strength score between 0 and 1
   */
  private calculateTrendlineStrength(
    point1: TrendlinePoint,
    point2: TrendlinePoint,
    totalPeriods: number
  ): number {
    // Time span factor (normalized by total periods)
    const timeSpan = point2.index - point1.index;
    const timeSpanFactor = Math.min(
      timeSpan / (totalPeriods * TrendlineService.TIME_SPAN_NORMALIZATION_FACTOR),
      1
    );

    // Price span factor (normalized percentage change)
    const priceSpan = Math.abs(point2.price - point1.price);
    const avgPrice = (point1.price + point2.price) / 2;
    const priceSpanFactor = Math.min(
      (priceSpan / avgPrice) * TrendlineService.PRICE_SPAN_NORMALIZATION_FACTOR,
      1
    );

    // Recency factor (more recent second point = higher strength)
    const recencyFactor = point2.index / totalPeriods;

    // Combined strength with weighted factors
    return (
      timeSpanFactor * TrendlineService.TIME_SPAN_WEIGHT +
      priceSpanFactor * TrendlineService.PRICE_SPAN_WEIGHT +
      recencyFactor * TrendlineService.RECENCY_WEIGHT
    );
  }

  /**
   * Calculate days needed based on interval
   */
  private calculateDaysNeeded(interval: TimeInterval, periods: number): number {
    switch (interval) {
      case '1h':
        return Math.ceil(
          (periods / TrendlineService.TRADING_HOURS_PER_DAY) * TrendlineService.DAYS_MULTIPLIER
        );
      case '1d':
        return periods * TrendlineService.DAYS_MULTIPLIER;
      default:
        return periods * TrendlineService.DAYS_MULTIPLIER;
    }
  }
}
