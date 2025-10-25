import type {
  ITradingDataProvider,
  OHLCVData,
  QuoteData,
  HistoricalDataParams,
  TimeInterval,
} from './lc-trading-data-interface';

describe('lc-trading-data-interface', () => {
  describe('TimeInterval', () => {
    it('should accept valid time intervals', () => {
      const validIntervals: TimeInterval[] = [
        '1m',
        '2m',
        '5m',
        '15m',
        '30m',
        '1h',
        '1d',
        '1wk',
        '1mo',
      ];
      expect(validIntervals.length).toBe(9);
    });
  });

  describe('OHLCVData', () => {
    it('should have required properties', () => {
      const data: OHLCVData = {
        date: new Date('2024-01-01'),
        open: 100,
        high: 105,
        low: 99,
        close: 103,
        volume: 1000000,
      };

      expect(data.date).toBeInstanceOf(Date);
      expect(data.open).toBe(100);
      expect(data.high).toBe(105);
      expect(data.low).toBe(99);
      expect(data.close).toBe(103);
      expect(data.volume).toBe(1000000);
    });

    it('should allow optional adjClose property', () => {
      const dataWithAdjClose: OHLCVData = {
        date: new Date('2024-01-01'),
        open: 100,
        high: 105,
        low: 99,
        close: 103,
        volume: 1000000,
        adjClose: 102.5,
      };

      expect(dataWithAdjClose.adjClose).toBe(102.5);
    });
  });

  describe('QuoteData', () => {
    it('should have required properties', () => {
      const quote: QuoteData = {
        symbol: 'EURUSD=X',
        price: 1.0850,
        timestamp: new Date(),
      };

      expect(quote.symbol).toBe('EURUSD=X');
      expect(quote.price).toBe(1.0850);
      expect(quote.timestamp).toBeInstanceOf(Date);
    });

    it('should allow optional properties', () => {
      const quote: QuoteData = {
        symbol: 'AAPL',
        price: 150.25,
        timestamp: new Date(),
        previousClose: 149.50,
        open: 150.00,
        dayHigh: 151.00,
        dayLow: 149.00,
        volume: 50000000,
        marketCap: 2500000000000,
      };

      expect(quote.previousClose).toBe(149.50);
      expect(quote.open).toBe(150.00);
      expect(quote.dayHigh).toBe(151.00);
      expect(quote.dayLow).toBe(149.00);
      expect(quote.volume).toBe(50000000);
      expect(quote.marketCap).toBe(2500000000000);
    });
  });

  describe('HistoricalDataParams', () => {
    it('should have required symbol and startDate', () => {
      const params: HistoricalDataParams = {
        symbol: 'EURUSD=X',
        startDate: new Date('2024-01-01'),
      };

      expect(params.symbol).toBe('EURUSD=X');
      expect(params.startDate).toBeInstanceOf(Date);
    });

    it('should allow optional endDate and interval', () => {
      const params: HistoricalDataParams = {
        symbol: 'AAPL',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        interval: '1d',
      };

      expect(params.endDate).toBeInstanceOf(Date);
      expect(params.interval).toBe('1d');
    });
  });

  describe('ITradingDataProvider', () => {
    it('should define the provider interface structure', () => {
      class MockProvider implements ITradingDataProvider {
        async getHistoricalData(
          params: HistoricalDataParams
        ): Promise<OHLCVData[]> {
          return [
            {
              date: params.startDate,
              open: 100,
              high: 105,
              low: 99,
              close: 103,
              volume: 1000000,
            },
          ];
        }

        async getQuote(symbol: string): Promise<QuoteData> {
          return {
            symbol,
            price: 100,
            timestamp: new Date(),
          };
        }
      }

      const provider = new MockProvider();
      expect(provider).toBeDefined();
      expect(typeof provider.getHistoricalData).toBe('function');
      expect(typeof provider.getQuote).toBe('function');
    });

    it('should allow implementation of getHistoricalData', async () => {
      class MockProvider implements ITradingDataProvider {
        async getHistoricalData(
          params: HistoricalDataParams
        ): Promise<OHLCVData[]> {
          return [
            {
              date: params.startDate,
              open: 100,
              high: 105,
              low: 99,
              close: 103,
              volume: 1000000,
            },
          ];
        }

        async getQuote(symbol: string): Promise<QuoteData> {
          return {
            symbol,
            price: 100,
            timestamp: new Date(),
          };
        }
      }

      const provider = new MockProvider();
      const data = await provider.getHistoricalData({
        symbol: 'TEST',
        startDate: new Date('2024-01-01'),
      });

      expect(data).toHaveLength(1);
      expect(data[0].open).toBe(100);
    });

    it('should allow implementation of getQuote', async () => {
      class MockProvider implements ITradingDataProvider {
        async getHistoricalData(): Promise<OHLCVData[]> {
          return [];
        }

        async getQuote(symbol: string): Promise<QuoteData> {
          return {
            symbol,
            price: 1.0850,
            timestamp: new Date(),
          };
        }
      }

      const provider = new MockProvider();
      const quote = await provider.getQuote('EURUSD=X');

      expect(quote.symbol).toBe('EURUSD=X');
      expect(quote.price).toBe(1.0850);
    });
  });
});
