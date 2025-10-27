import type { TradingDataClient, TimeInterval, OHLCVData } from '@lc-trading-services/trading-data-client';
import type { SupportResistanceZone, SupportResistanceResult } from '../types/index.js';

/**
 * Service for identifying support and resistance zones
 * Uses price action analysis to identify key levels where price has historically bounced or reversed
 */
export class SupportResistanceService {
  constructor(private readonly dataClient: TradingDataClient) {}

  /**
   * Calculate support and resistance zones for a symbol
   * @param symbol - Asset symbol (e.g., 'EURUSD', 'AAPL')
   * @param interval - Time interval ('1d' or '1h')
   * @param lookbackPeriods - Number of periods to analyze (default: 100)
   * @param tolerance - Price tolerance for zone clustering as percentage (default: 0.5%)
   * @returns Support and resistance zones result
   */
  async calculateSupportResistance(
    symbol: string,
    interval: TimeInterval = '1d',
    lookbackPeriods = 100,
    tolerance = 0.005
  ): Promise<SupportResistanceResult> {
    if (interval !== '1d' && interval !== '1h') {
      throw new Error('Support/Resistance calculation only supports 1d and 1h intervals');
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
        `Insufficient data for support/resistance calculation. Need at least 20 data points, got ${historicalData.length}`
      );
    }

    // Identify pivot points (local highs and lows)
    const pivotHighs = this.findPivotHighs(historicalData);
    const pivotLows = this.findPivotLows(historicalData);

    // Cluster similar price levels into zones
    const zones = this.clusterPriceLevels(
      pivotHighs,
      pivotLows,
      historicalData,
      tolerance
    );

    // Sort zones by strength
    zones.sort((a, b) => b.strength - a.strength);

    return {
      symbol,
      interval,
      zones: zones.slice(0, 10), // Return top 10 zones
      timestamp: new Date(),
    };
  }

  /**
   * Find pivot highs (local maxima)
   */
  private findPivotHighs(data: OHLCVData[], leftBars = 5, rightBars = 5): Array<{
    index: number;
    price: number;
    date: Date;
  }> {
    const pivots: Array<{ index: number; price: number; date: Date }> = [];

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
  private findPivotLows(data: OHLCVData[], leftBars = 5, rightBars = 5): Array<{
    index: number;
    price: number;
    date: Date;
  }> {
    const pivots: Array<{ index: number; price: number; date: Date }> = [];

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
   * Cluster price levels into zones and count support/resistance occurrences
   */
  private clusterPriceLevels(
    pivotHighs: Array<{ index: number; price: number; date: Date }>,
    pivotLows: Array<{ index: number; price: number; date: Date }>,
    historicalData: OHLCVData[],
    tolerance: number
  ): SupportResistanceZone[] {
    const zones = new Map<number, SupportResistanceZone>();

    // Process pivot highs (resistance)
    for (const pivot of pivotHighs) {
      this.addToZone(zones, pivot.price, 'resistance', pivot.index, tolerance, historicalData);
    }

    // Process pivot lows (support)
    for (const pivot of pivotLows) {
      this.addToZone(zones, pivot.price, 'support', pivot.index, tolerance, historicalData);
    }

    return Array.from(zones.values());
  }

  /**
   * Add a price level to a zone or create a new zone
   */
  private addToZone(
    zones: Map<number, SupportResistanceZone>,
    price: number,
    type: 'support' | 'resistance',
    index: number,
    tolerance: number,
    historicalData: OHLCVData[]
  ): void {
    // Find if there's an existing zone within tolerance
    let foundZone: { key: number; zone: SupportResistanceZone } | null = null;
    
    for (const [key, zone] of zones.entries()) {
      if (Math.abs(key - price) / key <= tolerance) {
        foundZone = { key, zone };
        break;
      }
    }

    if (foundZone) {
      // Update existing zone
      const { zone } = foundZone;
      if (type === 'support') {
        zone.supportCount++;
      } else {
        zone.resistanceCount++;
      }
      zone.totalTouches++;
      
      // Recalculate strength
      zone.strength = this.calculateStrength(
        zone.supportCount,
        zone.resistanceCount,
        index,
        historicalData.length
      );
    } else {
      // Create new zone
      const zone: SupportResistanceZone = {
        level: Number(price.toFixed(6)),
        supportCount: type === 'support' ? 1 : 0,
        resistanceCount: type === 'resistance' ? 1 : 0,
        totalTouches: 1,
        strength: this.calculateStrength(
          type === 'support' ? 1 : 0,
          type === 'resistance' ? 1 : 0,
          index,
          historicalData.length
        ),
      };
      zones.set(price, zone);
    }
  }

  /**
   * Calculate zone strength based on touches and recency
   * @returns Strength score between 0 and 1
   */
  private calculateStrength(
    supportCount: number,
    resistanceCount: number,
    lastIndex: number,
    totalPeriods: number
  ): number {
    // Base strength from total touches
    const totalTouches = supportCount + resistanceCount;
    const touchStrength = Math.min(totalTouches / 10, 1); // Max out at 10 touches
    
    // Recency factor (more recent = higher strength)
    const recencyFactor = lastIndex / totalPeriods;
    
    // Combined strength with 70% weight on touches, 30% on recency
    return Number((touchStrength * 0.7 + recencyFactor * 0.3).toFixed(3));
  }

  /**
   * Calculate days needed based on interval
   */
  private calculateDaysNeeded(interval: TimeInterval, periods: number): number {
    const multiplier = 2; // Safety multiplier
    
    switch (interval) {
      case '1h':
        return Math.ceil((periods / 6.5) * multiplier);
      case '1d':
        return periods * multiplier;
      default:
        return periods * multiplier;
    }
  }
}
