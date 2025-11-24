import { MarketDataClient } from './market-data-client';
import type { IDataSourceAdapter } from './interfaces/data-source-adapter.interface.js';

describe('MarketDataClient', () => {
  let client: MarketDataClient;
  let mockDataSource: jest.Mocked<IDataSourceAdapter>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Create mock data source
    mockDataSource = {
      search: jest.fn(),
      chart: jest.fn(),
      quote: jest.fn(),
    };

    client = new MarketDataClient(mockDataSource);
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

      mockDataSource.chart.mockResolvedValue(mockChartData);

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
      mockDataSource.chart.mockResolvedValue({ quotes: [] });

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

      mockDataSource.chart.mockResolvedValue(mockChartData);

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
      mockDataSource.chart.mockResolvedValue({ quotes: [] });

      await client.getHistoricalData({
        symbol: 'AAPL',
        startDate: new Date('2024-01-01'),
      });

      expect(mockDataSource.chart).toHaveBeenCalledWith('AAPL', {
        period1: expect.any(Date),
        period2: expect.any(Date),
        interval: '1d',
      });
    });

    it('should use endDate when provided', async () => {
      mockDataSource.chart.mockResolvedValue({ quotes: [] });

      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');

      await client.getHistoricalData({
        symbol: 'AAPL',
        startDate,
        endDate,
        interval: '1d',
      });

      expect(mockDataSource.chart).toHaveBeenCalledWith('AAPL', {
        period1: startDate,
        period2: endDate,
        interval: '1d',
      });
    });

    it('should throw error when chart API fails', async () => {
      const errorMessage = 'API Error';
      mockDataSource.chart.mockRejectedValue(new Error(errorMessage));

      await expect(
        client.getHistoricalData({
          symbol: 'INVALID',
          startDate: new Date('2024-01-01'),
        })
      ).rejects.toThrow('Failed to fetch historical data for INVALID');
    });

    it('should support different time intervals', async () => {
      mockDataSource.chart.mockResolvedValue({ quotes: [] });

      const intervals: Array<
        '1m' | '2m' | '5m' | '15m' | '30m' | '1h' | '1d' | '1wk' | '1mo'
      > = ['1m', '5m', '1h', '1d', '1wk', '1mo'];

      for (const interval of intervals) {
        await client.getHistoricalData({
          symbol: 'AAPL',
          startDate: new Date('2024-01-01'),
          interval,
        });

        expect(mockDataSource.chart).toHaveBeenCalledWith(
          'AAPL',
          expect.objectContaining({
            interval,
          })
        );
      }
    });

    it('should support 4h interval by fetching 1h data and aggregating', async () => {
      // Create mock 1-hour data spanning 8 hours (should create 2 4-hour candles)
      const mockChartData = {
        quotes: [
          // First 4-hour candle (hours 0-3)
          {
            date: new Date('2024-01-01T00:00:00Z'),
            open: 100,
            high: 105,
            low: 99,
            close: 102,
            volume: 1000,
            adjclose: 102,
          },
          {
            date: new Date('2024-01-01T01:00:00Z'),
            open: 102,
            high: 106,
            low: 101,
            close: 104,
            volume: 1500,
            adjclose: 104,
          },
          {
            date: new Date('2024-01-01T02:00:00Z'),
            open: 104,
            high: 107,
            low: 103,
            close: 105,
            volume: 2000,
            adjclose: 105,
          },
          {
            date: new Date('2024-01-01T03:00:00Z'),
            open: 105,
            high: 108,
            low: 104,
            close: 106,
            volume: 1200,
            adjclose: 106,
          },
          // Second 4-hour candle (hours 4-7)
          {
            date: new Date('2024-01-01T04:00:00Z'),
            open: 106,
            high: 110,
            low: 105,
            close: 108,
            volume: 1800,
            adjclose: 108,
          },
          {
            date: new Date('2024-01-01T05:00:00Z'),
            open: 108,
            high: 111,
            low: 107,
            close: 109,
            volume: 1600,
            adjclose: 109,
          },
          {
            date: new Date('2024-01-01T06:00:00Z'),
            open: 109,
            high: 112,
            low: 108,
            close: 110,
            volume: 1400,
            adjclose: 110,
          },
          {
            date: new Date('2024-01-01T07:00:00Z'),
            open: 110,
            high: 113,
            low: 109,
            close: 111,
            volume: 1300,
            adjclose: 111,
          },
        ],
      };

      mockDataSource.chart.mockResolvedValue(mockChartData);

      const result = await client.getHistoricalData({
        symbol: 'AAPL',
        startDate: new Date('2024-01-01'),
        interval: '4h',
      });

      // Should fetch 1h data
      expect(mockDataSource.chart).toHaveBeenCalledWith(
        'AAPL',
        expect.objectContaining({
          interval: '1h',
        })
      );

      // Should return 2 4-hour candles
      expect(result).toHaveLength(2);

      // First 4-hour candle should aggregate hours 0-3
      expect(result[0]).toMatchObject({
        open: 100, // Open of first hour
        high: 108, // Max high across all 4 hours
        low: 99,   // Min low across all 4 hours
        close: 106, // Close of last hour
        volume: 5700, // Sum of volumes (1000 + 1500 + 2000 + 1200)
        adjClose: 106, // Last adjClose value
      });

      // Second 4-hour candle should aggregate hours 4-7
      expect(result[1]).toMatchObject({
        open: 106, // Open of first hour
        high: 113, // Max high across all 4 hours
        low: 105,  // Min low across all 4 hours
        close: 111, // Close of last hour
        volume: 6100, // Sum of volumes (1800 + 1600 + 1400 + 1300)
        adjClose: 111, // Last adjClose value
      });
    });

    it('should handle 4h interval with incomplete 4-hour periods', async () => {
      // Create mock 1-hour data with only 3 hours (incomplete 4-hour period)
      const mockChartData = {
        quotes: [
          {
            date: new Date('2024-01-01T00:00:00Z'),
            open: 100,
            high: 105,
            low: 99,
            close: 102,
            volume: 1000,
            adjclose: 102,
          },
          {
            date: new Date('2024-01-01T01:00:00Z'),
            open: 102,
            high: 106,
            low: 101,
            close: 104,
            volume: 1500,
            adjclose: 104,
          },
          {
            date: new Date('2024-01-01T02:00:00Z'),
            open: 104,
            high: 107,
            low: 103,
            close: 105,
            volume: 2000,
            adjclose: 105,
          },
        ],
      };

      mockDataSource.chart.mockResolvedValue(mockChartData);

      const result = await client.getHistoricalData({
        symbol: 'AAPL',
        startDate: new Date('2024-01-01'),
        interval: '4h',
      });

      // Should return 1 incomplete 4-hour candle
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        open: 100,
        high: 107,
        low: 99,
        close: 105,
        volume: 4500,
      });
    });

    it('should handle 4h interval across different 4-hour periods', async () => {
      // Test data that spans different 4-hour periods (0-3, 4-7, 8-11, 12-15, 16-19, 20-23)
      const mockChartData = {
        quotes: [
          {
            date: new Date('2024-01-01T02:00:00Z'),
            open: 100,
            high: 105,
            low: 99,
            close: 102,
            volume: 1000,
            adjclose: 102,
          },
          {
            date: new Date('2024-01-01T03:00:00Z'),
            open: 102,
            high: 106,
            low: 101,
            close: 104,
            volume: 1500,
            adjclose: 104,
          },
          {
            date: new Date('2024-01-01T04:00:00Z'),
            open: 104,
            high: 107,
            low: 103,
            close: 105,
            volume: 2000,
            adjclose: 105,
          },
          {
            date: new Date('2024-01-01T08:00:00Z'),
            open: 105,
            high: 110,
            low: 104,
            close: 108,
            volume: 1800,
            adjclose: 108,
          },
        ],
      };

      mockDataSource.chart.mockResolvedValue(mockChartData);

      const result = await client.getHistoricalData({
        symbol: 'AAPL',
        startDate: new Date('2024-01-01'),
        interval: '4h',
      });

      // Should return 3 candles:
      // - One for hours 0-3 (with data at hours 2 and 3)
      // - One for hours 4-7 (with data only at hour 4)
      // - One for hours 8-11 (with data only at hour 8)
      expect(result).toHaveLength(3);
      
      // First candle (hours 0-3)
      expect(result[0]).toMatchObject({
        open: 100,
        close: 104,
        volume: 2500,
      });
      
      // Second candle (hours 4-7)
      expect(result[1]).toMatchObject({
        open: 104,
        close: 105,
        volume: 2000,
      });
      
      // Third candle (hours 8-11)
      expect(result[2]).toMatchObject({
        open: 105,
        close: 108,
        volume: 1800,
      });
    });


    it('should normalize simple forex format (EURUSD) for historical data', async () => {
      mockDataSource.chart.mockResolvedValue({ quotes: [] });

      await client.getHistoricalData({
        symbol: 'EURUSD',
        startDate: new Date('2024-01-01'),
      });

      expect(mockDataSource.chart).toHaveBeenCalledWith(
        'EURUSD=X',
        expect.any(Object)
      );
    });

    it('should normalize forex format with slash (EUR/USD) for historical data', async () => {
      mockDataSource.chart.mockResolvedValue({ quotes: [] });

      await client.getHistoricalData({
        symbol: 'EUR/USD',
        startDate: new Date('2024-01-01'),
      });

      expect(mockDataSource.chart).toHaveBeenCalledWith(
        'EURUSD=X',
        expect.any(Object)
      );
    });

    it('should not modify stock symbols for historical data', async () => {
      mockDataSource.chart.mockResolvedValue({ quotes: [] });

      await client.getHistoricalData({
        symbol: 'AAPL',
        startDate: new Date('2024-01-01'),
      });

      expect(mockDataSource.chart).toHaveBeenCalledWith(
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

      mockDataSource.quote.mockResolvedValue(mockQuote);

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

      mockDataSource.quote.mockResolvedValue(mockQuote);

      const result = await client.getQuote('TEST');

      expect(result.price).toBe(0);
    });

    it('should handle missing optional fields', async () => {
      const mockQuote = {
        symbol: 'TEST',
        regularMarketPrice: 100,
        regularMarketTime: new Date(),
      };

      mockDataSource.quote.mockResolvedValue(mockQuote);

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

      mockDataSource.quote.mockResolvedValue(mockQuote);

      const result = await client.getQuote('TEST');

      expect(result.timestamp).toBeInstanceOf(Date);
    });

    it('should throw error when quote is null', async () => {
      mockDataSource.quote.mockResolvedValue(null);

      await expect(client.getQuote('INVALID')).rejects.toThrow(
        'No quote data found for INVALID'
      );
    });

    it('should throw error when quote API fails', async () => {
      const errorMessage = 'API Error';
      mockDataSource.quote.mockRejectedValue(new Error(errorMessage));

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

        mockDataSource.quote.mockResolvedValue(mockQuote);

        const result = await client.getQuote(symbol);

        expect(result.symbol).toBe(symbol);
        expect(mockDataSource.quote).toHaveBeenCalledWith(symbol);
      }
    });

    it('should normalize simple forex format (EURUSD) to Yahoo Finance format', async () => {
      const mockQuote = {
        symbol: 'EURUSD=X',
        regularMarketPrice: 1.0850,
        regularMarketTime: new Date(),
      };

      mockDataSource.quote.mockResolvedValue(mockQuote);

      const result = await client.getQuote('EURUSD');

      expect(result.symbol).toBe('EURUSD=X');
      expect(mockDataSource.quote).toHaveBeenCalledWith('EURUSD=X');
    });

    it('should normalize forex format with slash (EUR/USD) to Yahoo Finance format', async () => {
      const mockQuote = {
        symbol: 'EURUSD=X',
        regularMarketPrice: 1.0850,
        regularMarketTime: new Date(),
      };

      mockDataSource.quote.mockResolvedValue(mockQuote);

      const result = await client.getQuote('EUR/USD');

      expect(result.symbol).toBe('EURUSD=X');
      expect(mockDataSource.quote).toHaveBeenCalledWith('EURUSD=X');
    });

    it('should not modify stock symbols', async () => {
      const mockQuote = {
        symbol: 'AAPL',
        regularMarketPrice: 150.0,
        regularMarketTime: new Date(),
      };

      mockDataSource.quote.mockResolvedValue(mockQuote);

      const result = await client.getQuote('AAPL');

      expect(result.symbol).toBe('AAPL');
      expect(mockDataSource.quote).toHaveBeenCalledWith('AAPL');
    });
  });

  describe('constructor', () => {
    it('should create an instance with default adapter when no parameter provided', () => {
      const defaultClient = new MarketDataClient();
      expect(defaultClient).toBeInstanceOf(MarketDataClient);
    });

    it('should create an instance with custom adapter when provided', () => {
      const customClient = new MarketDataClient(mockDataSource);
      expect(customClient).toBeInstanceOf(MarketDataClient);
    });
  });
});
