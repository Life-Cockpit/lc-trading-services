import type { HistoricalDataParams, OHLCVData, QuoteData } from '../types/index.js';

/**
 * Interface for market data providers
 * Follows the Dependency Inversion Principle by depending on abstractions
 */
export interface IMarketDataProvider {
  /**
   * Fetch historical OHLCV data for an asset
   * @param params - Parameters for fetching historical data
   * @returns Promise resolving to array of OHLCV data points
   */
  getHistoricalData(params: HistoricalDataParams): Promise<OHLCVData[]>;

  /**
   * Fetch current quote data for an asset
   * @param symbol - Asset symbol
   * @returns Promise resolving to quote data
   */
  getQuote(symbol: string): Promise<QuoteData>;
}
