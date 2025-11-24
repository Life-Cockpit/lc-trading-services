import type {
  HistoricalDataParams,
  OHLCVData,
  QuoteData,
  TimeInterval,
} from './types/index.js';
import type { IMarketDataProvider } from './interfaces/market-data-provider.interface.js';
import type { IDataSourceAdapter } from './interfaces/data-source-adapter.interface.js';
import { normalizeSymbol } from './symbol-normalizer.js';
import { YahooFinanceAdapter } from './adapters/yahoo-finance.adapter.js';

/**
 * Client for fetching market data (historical data and quotes)
 * 
 * Design principles:
 * - Only handles market data fetching (single responsibility)
 * - Can work with any IDataSourceAdapter implementation (extensible)
 * - Implements IMarketDataProvider interface (substitutable)
 * - Uses focused IDataSourceAdapter interface
 * - Depends on IDataSourceAdapter abstraction, not concrete implementation
 */
export class MarketDataClient implements IMarketDataProvider {
  private dataSource: IDataSourceAdapter;

  /**
   * Constructor with optional dependency injection
   * @param dataSource - Optional data source adapter (defaults to YahooFinanceAdapter)
   * 
   * @example
   * // Simple usage with defaults
   * const client = new MarketDataClient();
   * 
   * @example
   * // Advanced usage with custom adapter
   * const adapter = new YahooFinanceAdapter();
   * const client = new MarketDataClient(adapter);
   */
  constructor(dataSource?: IDataSourceAdapter) {
    this.dataSource = dataSource || new YahooFinanceAdapter();
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
      // For 4h interval, fetch 1h data and aggregate it
      const fetchInterval = interval === '4h' ? '1h' : interval;

      const queryOptions = {
        period1: startDate,
        period2: endDate || new Date(),
        interval: this.mapInterval(fetchInterval),
      };

      // Use chart module for full interval support
      const result = await this.dataSource.chart(normalizedSymbol, queryOptions);

      // Check if result contains quotes
      if (!result.quotes || result.quotes.length === 0) {
        return [];
      }

      const ohlcvData = result.quotes.map((item: any) => ({
        date: item.date,
        open: item.open ?? 0,
        high: item.high ?? 0,
        low: item.low ?? 0,
        close: item.close ?? 0,
        volume: item.volume ?? 0,
        adjClose: item.adjclose ?? undefined,
      }));

      // If 4h interval was requested, aggregate the 1h data
      if (interval === '4h') {
        return this.aggregateTo4HourCandles(ohlcvData);
      }

      return ohlcvData;
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
   * Aggregate 1-hour OHLCV data into 4-hour candles
   * @param hourlyData - Array of 1-hour OHLCV data points
   * @returns Array of 4-hour OHLCV data points
   */
  private aggregateTo4HourCandles(hourlyData: OHLCVData[]): OHLCVData[] {
    if (hourlyData.length === 0) {
      return [];
    }

    const fourHourCandles: OHLCVData[] = [];
    let currentCandle: OHLCVData | null = null;
    let candleStartHour = -1;

    for (const hourData of hourlyData) {
      const hour = hourData.date.getUTCHours();
      
      // Determine if this hour starts a new 4-hour period (0, 4, 8, 12, 16, 20)
      const periodStartHour = Math.floor(hour / 4) * 4;
      
      if (candleStartHour !== periodStartHour) {
        // Start a new 4-hour candle
        if (currentCandle !== null) {
          fourHourCandles.push(currentCandle);
        }
        
        currentCandle = {
          date: hourData.date,
          open: hourData.open,
          high: hourData.high,
          low: hourData.low,
          close: hourData.close,
          volume: hourData.volume,
          adjClose: hourData.adjClose,
        };
        candleStartHour = periodStartHour;
      } else if (currentCandle !== null) {
        // Update the current 4-hour candle
        currentCandle.high = Math.max(currentCandle.high, hourData.high);
        currentCandle.low = Math.min(currentCandle.low, hourData.low);
        currentCandle.close = hourData.close;
        currentCandle.volume += hourData.volume;
        // For adjClose, use the most recent value if available
        if (hourData.adjClose !== undefined) {
          currentCandle.adjClose = hourData.adjClose;
        }
      }
    }

    // Don't forget to add the last candle
    if (currentCandle !== null) {
      fourHourCandles.push(currentCandle);
    }

    return fourHourCandles;
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
    // Our interface uses: 1m, 2m, 5m, 15m, 30m, 1h, 4h, 1d, 1wk, 1mo
    // Note: 4h is handled by fetching 1h data and aggregating it, so it won't reach this method as 4h
    return interval as '1m' | '2m' | '5m' | '15m' | '30m' | '60m' | '90m' | '1h' | '1d' | '5d' | '1wk' | '1mo' | '3mo';
  }
}
