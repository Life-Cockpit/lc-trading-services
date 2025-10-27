import type { HistoricalDataParams, OHLCVData, QuoteData } from './market-data.types.js';
import type { NewsParams, NewsData } from './news.types.js';

/**
 * Interface for trading data provider
 */
export interface ITradingDataProvider {
  /**
   * Fetch historical OHLCV data for an asset
   * @param params - Parameters for fetching historical data
   * @returns Promise resolving to array of OHLCV data points
   */
  getHistoricalData(params: HistoricalDataParams): Promise<OHLCVData[]>;

  /**
   * Fetch current quote data for an asset
   * @param symbol - Asset symbol (e.g., 'EURUSD=X' for Forex)
   * @returns Promise resolving to quote data
   */
  getQuote(symbol: string): Promise<QuoteData>;

  /**
   * Fetch news articles for a symbol or search query
   * @param params - Parameters for fetching news
   * @returns Promise resolving to array of news articles
   */
  getNews(params: NewsParams): Promise<NewsData[]>;
}
