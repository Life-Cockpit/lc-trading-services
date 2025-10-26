import type { TradingDataClient } from '@lc-trading-services/trading-data-client';
import type { AllTimeHighLowResult } from '../types/index.js';

/**
 * Service for calculating all-time high and low prices
 */
export class AllTimeHighLowService {
  constructor(private readonly dataClient: TradingDataClient) {}

  /**
   * Calculate all-time high and low for a symbol
   * @param symbol - Asset symbol (e.g., 'EURUSD', 'AAPL')
   * @param lookbackYears - Number of years to look back (default: 20)
   * @returns All-time high and low result
   */
  async calculateAllTimeHighLow(
    symbol: string,
    lookbackYears = 20
  ): Promise<AllTimeHighLowResult> {
    // Get historical data for maximum available period
    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - lookbackYears);

    const historicalData = await this.dataClient.getHistoricalData({
      symbol,
      startDate,
      endDate,
      interval: '1d',
    });

    if (historicalData.length === 0) {
      throw new Error(`No historical data found for ${symbol}`);
    }

    // Find all-time high and low
    let allTimeHigh = historicalData[0].high;
    let allTimeHighDate = historicalData[0].date;
    let allTimeLow = historicalData[0].low;
    let allTimeLowDate = historicalData[0].date;

    for (const data of historicalData) {
      if (data.high > allTimeHigh) {
        allTimeHigh = data.high;
        allTimeHighDate = data.date;
      }
      if (data.low < allTimeLow) {
        allTimeLow = data.low;
        allTimeLowDate = data.date;
      }
    }

    return {
      symbol,
      allTimeHigh,
      allTimeHighDate,
      allTimeLow,
      allTimeLowDate,
      timestamp: new Date(),
    };
  }
}
