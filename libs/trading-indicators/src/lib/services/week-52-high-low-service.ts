import type { TradingDataClient } from '@lc-trading-services/trading-data-client';
import type { WeekHighLowResult } from '../types/index.js';

/**
 * Service for calculating 52-week high and low prices
 */
export class Week52HighLowService {
  constructor(private readonly dataClient: TradingDataClient) {}

  /**
   * Calculate 52-week high and low for a symbol
   * @param symbol - Asset symbol (e.g., 'EURUSD', 'AAPL')
   * @returns 52-week high and low result
   */
  async calculate52WeekHighLow(symbol: string): Promise<WeekHighLowResult> {
    // Get historical data for the last 52 weeks (364 days)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 364); // 52 weeks * 7 days

    const historicalData = await this.dataClient.getHistoricalData({
      symbol,
      startDate,
      endDate,
      interval: '1d',
    });

    if (historicalData.length === 0) {
      throw new Error(`No historical data found for ${symbol}`);
    }

    // Find 52-week high and low
    let high52Week = historicalData[0].high;
    let high52WeekDate = historicalData[0].date;
    let low52Week = historicalData[0].low;
    let low52WeekDate = historicalData[0].date;

    for (const data of historicalData) {
      if (data.high > high52Week) {
        high52Week = data.high;
        high52WeekDate = data.date;
      }
      if (data.low < low52Week) {
        low52Week = data.low;
        low52WeekDate = data.date;
      }
    }

    return {
      symbol,
      high52Week,
      high52WeekDate,
      low52Week,
      low52WeekDate,
      timestamp: new Date(),
    };
  }
}
