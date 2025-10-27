import { TradingDataClient } from './trading-data-client';
import type { IMarketDataProvider } from './interfaces/market-data-provider.interface.js';
import type { INewsProvider } from './interfaces/news-provider.interface.js';

describe('TradingDataClient', () => {
  let client: TradingDataClient;
  let mockMarketDataProvider: jest.Mocked<IMarketDataProvider>;
  let mockNewsProvider: jest.Mocked<INewsProvider>;

  beforeEach(() => {
    jest.clearAllMocks();

    // Create mock providers
    mockMarketDataProvider = {
      getHistoricalData: jest.fn(),
      getQuote: jest.fn(),
    };

    mockNewsProvider = {
      getNews: jest.fn(),
    };

    client = new TradingDataClient(mockMarketDataProvider, mockNewsProvider);
  });

  describe('constructor', () => {
    it('should create an instance', () => {
      expect(client).toBeInstanceOf(TradingDataClient);
    });

    it('should accept injected providers', () => {
      expect(client).toBeDefined();
    });

    it('should use default providers when none are provided', () => {
      const defaultClient = new TradingDataClient();
      expect(defaultClient).toBeInstanceOf(TradingDataClient);
    });
  });

  describe('getHistoricalData', () => {
    it('should delegate to MarketDataClient', async () => {
      const params = {
        symbol: 'AAPL',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-31'),
        interval: '1d' as const,
      };

      const mockData = [
        {
          date: new Date('2024-01-01'),
          open: 100,
          high: 105,
          low: 99,
          close: 103,
          volume: 1000000,
        },
      ];

      mockMarketDataProvider.getHistoricalData.mockResolvedValue(mockData);

      const result = await client.getHistoricalData(params);

      expect(mockMarketDataProvider.getHistoricalData).toHaveBeenCalledWith(params);
      expect(result).toBe(mockData);
    });
  });

  describe('getQuote', () => {
    it('should delegate to MarketDataClient', async () => {
      const symbol = 'AAPL';
      const mockQuote = {
        symbol: 'AAPL',
        price: 150.0,
        timestamp: new Date(),
      };

      mockMarketDataProvider.getQuote.mockResolvedValue(mockQuote);

      const result = await client.getQuote(symbol);

      expect(mockMarketDataProvider.getQuote).toHaveBeenCalledWith(symbol);
      expect(result).toBe(mockQuote);
    });
  });

  describe('getNews', () => {
    it('should delegate to NewsClient', async () => {
      const params = {
        query: 'AAPL',
        count: 5,
      };

      const mockNews = [
        {
          uuid: 'news-1',
          title: 'Test News',
          publisher: 'Publisher',
          link: 'https://example.com',
          providerPublishTime: new Date(),
          type: 'STORY',
        },
      ];

      mockNewsProvider.getNews.mockResolvedValue(mockNews);

      const result = await client.getNews(params);

      expect(mockNewsProvider.getNews).toHaveBeenCalledWith(params);
      expect(result).toBe(mockNews);
    });
  });

  describe('ITradingDataProvider implementation', () => {
    it('should implement ITradingDataProvider interface', () => {
      expect(typeof client.getHistoricalData).toBe('function');
      expect(typeof client.getQuote).toBe('function');
      expect(typeof client.getNews).toBe('function');
    });
  });
});
