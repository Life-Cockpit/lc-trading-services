import type {
  HistoricalDataParams,
  OHLCVData,
  QuoteData,
  TimeInterval,
} from './types/index.js';
import type { IMarketDataProvider } from './interfaces/market-data-provider.interface.js';
import type { IDataSourceAdapter } from './interfaces/data-source-adapter.interface.js';
import { normalizeSymbol } from './symbol-normalizer.js';

/**
 * Client for fetching market data (historical data and quotes)
 * Follows SOLID principles:
 * - Single Responsibility: Only handles market data fetching (historical & quotes)
 * - Open/Closed: Can work with any IDataSourceAdapter implementation
 * - Liskov Substitution: Implements IMarketDataProvider interface
 * - Interface Segregation: Uses focused IDataSourceAdapter interface
 * - Dependency Inversion: Depends on IDataSourceAdapter abstraction, not concrete implementation
 */
export class MarketDataClient implements IMarketDataProvider {
  private dataSource: IDataSourceAdapter;

  /**
   * Constructor with dependency injection
   * @param dataSource - Data source adapter (e.g., YahooFinanceAdapter)
   */
  constructor(dataSource: IDataSourceAdapter) {
    this.dataSource = dataSource;
  }

  /**
   * Fetch historical OHLCV data for an asset
   * @param params - Parameters for fetching historical data
   * @returns Promise resolving to array of OHLCV data points
   */
  async getHistoricalData(params: HistoricalDataParams): Promise<OHLCVData[]> {
    const { symbol, startDate, endDate, interval = '1d' } = params;

    // Normalize the symbol to Yahoo Finance format
    const normalizedSymbol = normalizeSymbol(symbol);

    try {
      const queryOptions = {
        period1: startDate,
        period2: endDate || new Date(),
        interval: this.mapInterval(interval),
      };

      // Use chart module for full interval support
      const result = await this.dataSource.chart(normalizedSymbol, queryOptions);

      // Check if result contains quotes
      if (!result.quotes || result.quotes.length === 0) {
        return [];
      }

      return result.quotes.map((item: any) => ({
        date: item.date,
        open: item.open ?? 0,
        high: item.high ?? 0,
        low: item.low ?? 0,
        close: item.close ?? 0,
        volume: item.volume ?? 0,
        adjClose: item.adjclose ?? undefined,
      }));
    } catch (error) {
      throw new Error(
        `Failed to fetch historical data for ${symbol}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Fetch current quote data for an asset
   * @param symbol - Asset symbol (e.g., 'EURUSD', 'EUR/USD', or 'EURUSD=X' for Forex)
   * @returns Promise resolving to quote data
   */
  async getQuote(symbol: string): Promise<QuoteData> {
    // Normalize the symbol to Yahoo Finance format
    const normalizedSymbol = normalizeSymbol(symbol);

    try {
      const quote = await this.dataSource.quote(normalizedSymbol);

      if (!quote) {
        throw new Error(`No quote data found for ${symbol}`);
      }

      return {
        symbol: quote.symbol,
        price: quote.regularMarketPrice ?? 0,
        previousClose: quote.regularMarketPreviousClose,
        open: quote.regularMarketOpen,
        dayHigh: quote.regularMarketDayHigh,
        dayLow: quote.regularMarketDayLow,
        volume: quote.regularMarketVolume,
        marketCap: quote.marketCap,
        timestamp: quote.regularMarketTime || new Date(),
      };
    } catch (error) {
      throw new Error(
        `Failed to fetch quote for ${symbol}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Map our TimeInterval type to yahoo-finance2's interval format
   * @param interval - Our time interval type
   * @returns yahoo-finance2 compatible interval string
   */
  private mapInterval(
    interval: TimeInterval
  ): '1m' | '2m' | '5m' | '15m' | '30m' | '60m' | '90m' | '1h' | '1d' | '5d' | '1wk' | '1mo' | '3mo' {
    // yahoo-finance2 chart accepts: 1m, 2m, 5m, 15m, 30m, 60m, 90m, 1h, 1d, 5d, 1wk, 1mo, 3mo
    // Our interface uses: 1m, 2m, 5m, 15m, 30m, 1h, 1d, 1wk, 1mo
    return interval as '1m' | '2m' | '5m' | '15m' | '30m' | '60m' | '90m' | '1h' | '1d' | '5d' | '1wk' | '1mo' | '3mo';
  }
}
