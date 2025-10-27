import type {
  ITradingDataProvider,
  HistoricalDataParams,
  OHLCVData,
  QuoteData,
  NewsParams,
  NewsData,
} from './types/index.js';
import type { IMarketDataProvider } from './interfaces/market-data-provider.interface.js';
import type { INewsProvider } from './interfaces/news-provider.interface.js';
import { MarketDataClient } from './market-data-client.js';
import { NewsClient } from './news-client.js';
import { YahooFinanceAdapter } from './adapters/yahoo-finance.adapter.js';

/**
 * Trading data client implementing the ITradingDataProvider interface
 * 
 * Design principles:
 * - Coordinates market data and news providers (single responsibility)
 * - Open for extension (can accept any providers), closed for modification
 * - Can be replaced with any ITradingDataProvider implementation (substitutable)
 * - Depends on focused IMarketDataProvider and INewsProvider interfaces
 * - Depends on abstractions (interfaces), not concrete implementations
 * 
 * This is a facade that composes IMarketDataProvider and INewsProvider to provide
 * a unified interface for accessing trading data and news.
 */
export class TradingDataClient implements ITradingDataProvider {
  private marketDataProvider: IMarketDataProvider;
  private newsProvider: INewsProvider;

  /**
   * Constructor with optional dependency injection
   * If no providers are supplied, defaults to Yahoo Finance-based implementations
   * 
   * @param marketDataProvider - Provider for market data (optional)
   * @param newsProvider - Provider for news data (optional)
   */
  constructor(
    marketDataProvider?: IMarketDataProvider,
    newsProvider?: INewsProvider
  ) {
    // Default to Yahoo Finance if no providers specified
    if (!marketDataProvider || !newsProvider) {
      const dataSource = new YahooFinanceAdapter();
      this.marketDataProvider = marketDataProvider || new MarketDataClient(dataSource);
      this.newsProvider = newsProvider || new NewsClient(dataSource);
    } else {
      this.marketDataProvider = marketDataProvider;
      this.newsProvider = newsProvider;
    }
  }

  /**
   * Fetch historical OHLCV data for an asset
   * @param params - Parameters for fetching historical data
   * @returns Promise resolving to array of OHLCV data points
   */
  async getHistoricalData(params: HistoricalDataParams): Promise<OHLCVData[]> {
    return this.marketDataProvider.getHistoricalData(params);
  }

  /**
   * Fetch current quote data for an asset
   * @param symbol - Asset symbol (e.g., 'EURUSD', 'EUR/USD', or 'EURUSD=X' for Forex)
   * @returns Promise resolving to quote data
   */
  async getQuote(symbol: string): Promise<QuoteData> {
    return this.marketDataProvider.getQuote(symbol);
  }

  /**
   * Fetch news articles for a symbol or search query
   * @param params - Parameters for fetching news
   * @returns Promise resolving to array of news articles
   */
  async getNews(params: NewsParams): Promise<NewsData[]> {
    return this.newsProvider.getNews(params);
  }
}
