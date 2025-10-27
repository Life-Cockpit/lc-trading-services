import YahooFinance from 'yahoo-finance2';
import type {
  ITradingDataProvider,
  HistoricalDataParams,
  OHLCVData,
  QuoteData,
  NewsParams,
  NewsData,
} from './types/index.js';
import { MarketDataClient } from './market-data-client.js';
import { NewsClient } from './news-client.js';

/**
 * Trading data client implementing the ITradingDataProvider interface
 * Uses Yahoo Finance as the data source
 * 
 * This is a facade that composes MarketDataClient and NewsClient to provide
 * a unified interface for accessing trading data and news.
 */
export class TradingDataClient implements ITradingDataProvider {
  private marketDataClient: MarketDataClient;
  private newsClient: NewsClient;

  constructor() {
    const yahooFinance = new YahooFinance();
    this.marketDataClient = new MarketDataClient(yahooFinance);
    this.newsClient = new NewsClient(yahooFinance);
  }

  /**
   * Fetch historical OHLCV data for an asset
   * @param params - Parameters for fetching historical data
   * @returns Promise resolving to array of OHLCV data points
   */
  async getHistoricalData(params: HistoricalDataParams): Promise<OHLCVData[]> {
    return this.marketDataClient.getHistoricalData(params);
  }

  /**
   * Fetch current quote data for an asset
   * @param symbol - Asset symbol (e.g., 'EURUSD', 'EUR/USD', or 'EURUSD=X' for Forex)
   * @returns Promise resolving to quote data
   */
  async getQuote(symbol: string): Promise<QuoteData> {
    return this.marketDataClient.getQuote(symbol);
  }

  /**
   * Fetch news articles for a symbol or search query
   * @param params - Parameters for fetching news
   * @returns Promise resolving to array of news articles
   */
  async getNews(params: NewsParams): Promise<NewsData[]> {
    return this.newsClient.getNews(params);
  }
}
