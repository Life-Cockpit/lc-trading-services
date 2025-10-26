import { TradingDataClient } from './trading-data-client';
import type {
  OHLCVData,
  QuoteData,
} from '@lc-trading-services/lc-trading-data-interface';

// Mock yahoo-finance2
const mockChartFn = jest.fn();
const mockQuoteFn = jest.fn();

jest.mock('yahoo-finance2', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      chart: mockChartFn,
      quote: mockQuoteFn,
    })),
  };
});

describe('TradingDataClient', () => {
  let client: TradingDataClient;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Create a new client instance
    client = new TradingDataClient();
  });

  describe('constructor', () => {
    it('should create an instance', () => {
      expect(client).toBeInstanceOf(TradingDataClient);
    });

    it('should initialize yahooFinance instance', () => {
      expect(client).toBeDefined();
    });
  });

  describe('getHistoricalData', () => {
    it('should fetch historical data successfully', async () => {
      const mockChartData = {
        quotes: [
          {
            date: new Date('2024-01-01'),
            open: 1.0850,
            high: 1.0900,
            low: 1.0800,
            close: 1.0875,
            volume: 1000000,
            adjclose: 1.0875,
          },
          {
            date: new Date('2024-01-02'),
            open: 1.0875,
            high: 1.0950,
            low: 1.0850,
            close: 1.0920,
            volume: 1100000,
            adjclose: 1.0920,
          },
        ],
      };

      mockChartFn.mockResolvedValue(mockChartData);

      const result = await client.getHistoricalData({
        symbol: 'EURUSD=X',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02'),
        interval: '1d',
      });

      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject({
        open: 1.0850,
        high: 1.0900,
        low: 1.0800,
        close: 1.0875,
        volume: 1000000,
        adjClose: 1.0875,
      });
      expect(result[0].date).toBeInstanceOf(Date);
    });

    it('should return empty array when no quotes available', async () => {
      mockChartFn.mockResolvedValue({ quotes: [] });

      const result = await client.getHistoricalData({
        symbol: 'INVALID',
        startDate: new Date('2024-01-01'),
      });

      expect(result).toEqual([]);
    });

    it('should handle null values in OHLCV data', async () => {
      const mockChartData = {
        quotes: [
          {
            date: new Date('2024-01-01'),
            open: null,
            high: 1.0900,
            low: null,
            close: 1.0875,
            volume: null,
            adjclose: null,
          },
        ],
      };

      mockChartFn.mockResolvedValue(mockChartData);

      const result = await client.getHistoricalData({
        symbol: 'TEST',
        startDate: new Date('2024-01-01'),
      });

      expect(result).toHaveLength(1);
      expect(result[0].open).toBe(0);
      expect(result[0].high).toBe(1.0900);
      expect(result[0].low).toBe(0);
      expect(result[0].volume).toBe(0);
      expect(result[0].adjClose).toBeUndefined();
    });

    it('should use default interval when not specified', async () => {
      mockChartFn.mockResolvedValue({ quotes: [] });

      await client.getHistoricalData({
        symbol: 'AAPL',
        startDate: new Date('2024-01-01'),
      });

      expect(mockChartFn).toHaveBeenCalledWith('AAPL', {
        period1: expect.any(Date),
        period2: expect.any(Date),
        interval: '1d',
      });
    });

    it('should use endDate when provided', async () => {
      mockChartFn.mockResolvedValue({ quotes: [] });

      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');

      await client.getHistoricalData({
        symbol: 'AAPL',
        startDate,
        endDate,
        interval: '1d',
      });

      expect(mockChartFn).toHaveBeenCalledWith('AAPL', {
        period1: startDate,
        period2: endDate,
        interval: '1d',
      });
    });

    it('should throw error when chart API fails', async () => {
      const errorMessage = 'API Error';
      mockChartFn.mockRejectedValue(new Error(errorMessage));

      await expect(
        client.getHistoricalData({
          symbol: 'INVALID',
          startDate: new Date('2024-01-01'),
        })
      ).rejects.toThrow('Failed to fetch historical data for INVALID');
    });

    it('should support different time intervals', async () => {
      mockChartFn.mockResolvedValue({ quotes: [] });

      const intervals: Array<
        '1m' | '2m' | '5m' | '15m' | '30m' | '1h' | '1d' | '1wk' | '1mo'
      > = ['1m', '5m', '1h', '1d', '1wk', '1mo'];

      for (const interval of intervals) {
        await client.getHistoricalData({
          symbol: 'AAPL',
          startDate: new Date('2024-01-01'),
          interval,
        });

        expect(mockChartFn).toHaveBeenCalledWith(
          'AAPL',
          expect.objectContaining({
            interval,
          })
        );
      }
    });

    it('should normalize simple forex format (EURUSD) for historical data', async () => {
      mockChartFn.mockResolvedValue({ quotes: [] });

      await client.getHistoricalData({
        symbol: 'EURUSD',
        startDate: new Date('2024-01-01'),
      });

      expect(mockChartFn).toHaveBeenCalledWith(
        'EURUSD=X',
        expect.any(Object)
      );
    });

    it('should normalize forex format with slash (EUR/USD) for historical data', async () => {
      mockChartFn.mockResolvedValue({ quotes: [] });

      await client.getHistoricalData({
        symbol: 'EUR/USD',
        startDate: new Date('2024-01-01'),
      });

      expect(mockChartFn).toHaveBeenCalledWith(
        'EURUSD=X',
        expect.any(Object)
      );
    });

    it('should not modify stock symbols for historical data', async () => {
      mockChartFn.mockResolvedValue({ quotes: [] });

      await client.getHistoricalData({
        symbol: 'AAPL',
        startDate: new Date('2024-01-01'),
      });

      expect(mockChartFn).toHaveBeenCalledWith(
        'AAPL',
        expect.any(Object)
      );
    });
  });

  describe('getQuote', () => {
    it('should fetch quote data successfully', async () => {
      const mockQuote = {
        symbol: 'EURUSD=X',
        regularMarketPrice: 1.0850,
        regularMarketPreviousClose: 1.0825,
        regularMarketOpen: 1.0830,
        regularMarketDayHigh: 1.0900,
        regularMarketDayLow: 1.0800,
        regularMarketVolume: 1000000,
        marketCap: null,
        regularMarketTime: new Date('2024-01-01T12:00:00Z'),
      };

      mockQuoteFn.mockResolvedValue(mockQuote);

      const result = await client.getQuote('EURUSD=X');

      expect(result).toMatchObject({
        symbol: 'EURUSD=X',
        price: 1.0850,
        previousClose: 1.0825,
        open: 1.0830,
        dayHigh: 1.0900,
        dayLow: 1.0800,
        volume: 1000000,
      });
      expect(result.timestamp).toBeInstanceOf(Date);
    });

    it('should handle null regularMarketPrice', async () => {
      const mockQuote = {
        symbol: 'TEST',
        regularMarketPrice: null,
        regularMarketTime: new Date(),
      };

      mockQuoteFn.mockResolvedValue(mockQuote);

      const result = await client.getQuote('TEST');

      expect(result.price).toBe(0);
    });

    it('should handle missing optional fields', async () => {
      const mockQuote = {
        symbol: 'TEST',
        regularMarketPrice: 100,
        regularMarketTime: new Date(),
      };

      mockQuoteFn.mockResolvedValue(mockQuote);

      const result = await client.getQuote('TEST');

      expect(result.symbol).toBe('TEST');
      expect(result.price).toBe(100);
      expect(result.previousClose).toBeUndefined();
      expect(result.open).toBeUndefined();
    });

    it('should use current date if regularMarketTime is missing', async () => {
      const mockQuote = {
        symbol: 'TEST',
        regularMarketPrice: 100,
        regularMarketTime: null,
      };

      mockQuoteFn.mockResolvedValue(mockQuote);

      const result = await client.getQuote('TEST');

      expect(result.timestamp).toBeInstanceOf(Date);
    });

    it('should throw error when quote is null', async () => {
      mockQuoteFn.mockResolvedValue(null);

      await expect(client.getQuote('INVALID')).rejects.toThrow(
        'No quote data found for INVALID'
      );
    });

    it('should throw error when quote API fails', async () => {
      const errorMessage = 'API Error';
      mockQuoteFn.mockRejectedValue(new Error(errorMessage));

      await expect(client.getQuote('INVALID')).rejects.toThrow(
        'Failed to fetch quote for INVALID'
      );
    });

    it('should handle Forex pair symbols', async () => {
      const forexPairs = ['EURUSD=X', 'GBPUSD=X', 'USDJPY=X'];

      for (const symbol of forexPairs) {
        const mockQuote = {
          symbol,
          regularMarketPrice: 1.0,
          regularMarketTime: new Date(),
        };

        mockQuoteFn.mockResolvedValue(mockQuote);

        const result = await client.getQuote(symbol);

        expect(result.symbol).toBe(symbol);
        expect(mockQuoteFn).toHaveBeenCalledWith(symbol);
      }
    });

    it('should normalize simple forex format (EURUSD) to Yahoo Finance format', async () => {
      const mockQuote = {
        symbol: 'EURUSD=X',
        regularMarketPrice: 1.0850,
        regularMarketTime: new Date(),
      };

      mockQuoteFn.mockResolvedValue(mockQuote);

      const result = await client.getQuote('EURUSD');

      expect(result.symbol).toBe('EURUSD=X');
      expect(mockQuoteFn).toHaveBeenCalledWith('EURUSD=X');
    });

    it('should normalize forex format with slash (EUR/USD) to Yahoo Finance format', async () => {
      const mockQuote = {
        symbol: 'EURUSD=X',
        regularMarketPrice: 1.0850,
        regularMarketTime: new Date(),
      };

      mockQuoteFn.mockResolvedValue(mockQuote);

      const result = await client.getQuote('EUR/USD');

      expect(result.symbol).toBe('EURUSD=X');
      expect(mockQuoteFn).toHaveBeenCalledWith('EURUSD=X');
    });

    it('should not modify stock symbols', async () => {
      const mockQuote = {
        symbol: 'AAPL',
        regularMarketPrice: 150.0,
        regularMarketTime: new Date(),
      };

      mockQuoteFn.mockResolvedValue(mockQuote);

      const result = await client.getQuote('AAPL');

      expect(result.symbol).toBe('AAPL');
      expect(mockQuoteFn).toHaveBeenCalledWith('AAPL');
    });
  });

  describe('ITradingDataProvider implementation', () => {
    it('should implement ITradingDataProvider interface', () => {
      expect(typeof client.getHistoricalData).toBe('function');
      expect(typeof client.getQuote).toBe('function');
    });

    it('should return correct types from getHistoricalData', async () => {
      mockChartFn.mockResolvedValue({
        quotes: [
          {
            date: new Date('2024-01-01'),
            open: 100,
            high: 105,
            low: 99,
            close: 103,
            volume: 1000000,
            adjclose: 103,
          },
        ],
      });

      const result = await client.getHistoricalData({
        symbol: 'AAPL',
        startDate: new Date('2024-01-01'),
      });

      expect(Array.isArray(result)).toBe(true);
      result.forEach((item: OHLCVData) => {
        expect(item).toHaveProperty('date');
        expect(item).toHaveProperty('open');
        expect(item).toHaveProperty('high');
        expect(item).toHaveProperty('low');
        expect(item).toHaveProperty('close');
        expect(item).toHaveProperty('volume');
      });
    });

    it('should return correct type from getQuote', async () => {
      mockQuoteFn.mockResolvedValue({
        symbol: 'AAPL',
        regularMarketPrice: 150,
        regularMarketTime: new Date(),
      });

      const result = await client.getQuote('AAPL');

      expect(result).toHaveProperty('symbol');
      expect(result).toHaveProperty('price');
      expect(result).toHaveProperty('timestamp');
    });
  });
});
