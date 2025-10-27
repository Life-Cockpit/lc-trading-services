import { NewsClient } from './news-client';
import type { IDataSourceAdapter } from './interfaces/data-source-adapter.interface.js';

describe('NewsClient', () => {
  let client: NewsClient;
  let mockDataSource: jest.Mocked<IDataSourceAdapter>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Create mock data source
    mockDataSource = {
      search: jest.fn(),
      chart: jest.fn(),
      quote: jest.fn(),
    };

    client = new NewsClient(mockDataSource);
  });

  describe('getNews', () => {
    it('should fetch news articles successfully', async () => {
      const mockSearchResult = {
        news: [
          {
            uuid: 'news-uuid-1',
            title: 'Apple announces new product',
            publisher: 'TechNews',
            link: 'https://example.com/news/1',
            providerPublishTime: new Date('2024-01-01T12:00:00Z'),
            type: 'STORY',
            thumbnail: {
              resolutions: [
                {
                  url: 'https://example.com/thumb.jpg',
                  width: 200,
                  height: 150,
                  tag: 'original',
                },
              ],
            },
            relatedTickers: ['AAPL'],
          },
          {
            uuid: 'news-uuid-2',
            title: 'Apple stock reaches new high',
            publisher: 'FinanceDaily',
            link: 'https://example.com/news/2',
            providerPublishTime: new Date('2024-01-02T10:30:00Z'),
            type: 'STORY',
            relatedTickers: ['AAPL', 'NASDAQ'],
          },
        ],
        quotes: [],
        count: 0,
        explains: [],
        nav: [],
        lists: [],
        researchReports: [],
        totalTime: 100,
        timeTakenForQuotes: 0,
        timeTakenForNews: 50,
        timeTakenForAlgowatchlist: 0,
        timeTakenForPredefinedScreener: 0,
        timeTakenForCrunchbase: 0,
        timeTakenForNav: 0,
        timeTakenForResearchReports: 0,
        timeTakenForScreenerField: 0,
        timeTakenForCulturalAssets: 0,
        timeTakenForSearchLists: 0,
      };

      mockDataSource.search.mockResolvedValue(mockSearchResult);

      const result = await client.getNews({ query: 'AAPL' });

      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject({
        uuid: 'news-uuid-1',
        title: 'Apple announces new product',
        publisher: 'TechNews',
        link: 'https://example.com/news/1',
        type: 'STORY',
      });
      expect(result[0].providerPublishTime).toBeInstanceOf(Date);
      expect(result[0].thumbnail).toBeDefined();
      expect(result[0].relatedTickers).toEqual(['AAPL']);

      expect(result[1]).toMatchObject({
        uuid: 'news-uuid-2',
        title: 'Apple stock reaches new high',
        publisher: 'FinanceDaily',
      });
      expect(result[1].thumbnail).toBeUndefined();
    });

    it('should use default count when not specified', async () => {
      mockDataSource.search.mockResolvedValue({ news: [], quotes: [] });

      await client.getNews({ query: 'AAPL' });

      expect(mockDataSource.search).toHaveBeenCalledWith('AAPL', {
        newsCount: 10,
        quotesCount: 0,
      });
    });

    it('should use custom count when specified', async () => {
      mockDataSource.search.mockResolvedValue({ news: [], quotes: [] });

      await client.getNews({ query: 'TSLA', count: 20 });

      expect(mockDataSource.search).toHaveBeenCalledWith('TSLA', {
        newsCount: 20,
        quotesCount: 0,
      });
    });

    it('should return empty array when no news available', async () => {
      mockDataSource.search.mockResolvedValue({ news: [], quotes: [] });

      const result = await client.getNews({ query: 'INVALID' });

      expect(result).toEqual([]);
    });

    it('should handle missing news property', async () => {
      mockDataSource.search.mockResolvedValue({ quotes: [] });

      const result = await client.getNews({ query: 'TEST' });

      expect(result).toEqual([]);
    });

    it('should throw error when search API fails', async () => {
      const errorMessage = 'API Error';
      mockDataSource.search.mockRejectedValue(new Error(errorMessage));

      await expect(
        client.getNews({ query: 'INVALID' })
      ).rejects.toThrow('Failed to fetch news for INVALID');
    });

    it('should normalize forex symbols', async () => {
      mockDataSource.search.mockResolvedValue({ news: [], quotes: [] });

      await client.getNews({ query: 'EURUSD' });

      expect(mockDataSource.search).toHaveBeenCalledWith('EURUSD=X', {
        newsCount: 10,
        quotesCount: 0,
      });
    });

    it('should normalize forex symbols with slash', async () => {
      mockDataSource.search.mockResolvedValue({ news: [], quotes: [] });

      await client.getNews({ query: 'EUR/USD' });

      expect(mockDataSource.search).toHaveBeenCalledWith('EURUSD=X', {
        newsCount: 10,
        quotesCount: 0,
      });
    });

    it('should not modify stock symbols', async () => {
      mockDataSource.search.mockResolvedValue({ news: [], quotes: [] });

      await client.getNews({ query: 'AAPL' });

      expect(mockDataSource.search).toHaveBeenCalledWith('AAPL', {
        newsCount: 10,
        quotesCount: 0,
      });
    });

    it('should handle news without optional fields', async () => {
      const mockSearchResult = {
        news: [
          {
            uuid: 'news-uuid-1',
            title: 'Simple news article',
            publisher: 'NewsSource',
            link: 'https://example.com/news/1',
            providerPublishTime: new Date('2024-01-01T12:00:00Z'),
            type: 'STORY',
          },
        ],
        quotes: [],
      };

      mockDataSource.search.mockResolvedValue(mockSearchResult);

      const result = await client.getNews({ query: 'AAPL' });

      expect(result).toHaveLength(1);
      expect(result[0].thumbnail).toBeUndefined();
      expect(result[0].relatedTickers).toBeUndefined();
    });

    it('should preserve all thumbnail resolutions', async () => {
      const mockSearchResult = {
        news: [
          {
            uuid: 'news-uuid-1',
            title: 'News with multiple thumbnails',
            publisher: 'NewsSource',
            link: 'https://example.com/news/1',
            providerPublishTime: new Date('2024-01-01T12:00:00Z'),
            type: 'STORY',
            thumbnail: {
              resolutions: [
                {
                  url: 'https://example.com/thumb-small.jpg',
                  width: 100,
                  height: 75,
                  tag: 'small',
                },
                {
                  url: 'https://example.com/thumb-large.jpg',
                  width: 400,
                  height: 300,
                  tag: 'large',
                },
              ],
            },
          },
        ],
        quotes: [],
      };

      mockDataSource.search.mockResolvedValue(mockSearchResult);

      const result = await client.getNews({ query: 'AAPL' });

      expect(result[0].thumbnail?.resolutions).toHaveLength(2);
      expect(result[0].thumbnail?.resolutions[0]).toMatchObject({
        url: 'https://example.com/thumb-small.jpg',
        width: 100,
        height: 75,
        tag: 'small',
      });
      expect(result[0].thumbnail?.resolutions[1]).toMatchObject({
        url: 'https://example.com/thumb-large.jpg',
        width: 400,
        height: 300,
        tag: 'large',
      });
    });
  });

  describe('constructor', () => {
    it('should create an instance with default adapter when no parameter provided', () => {
      const defaultClient = new NewsClient();
      expect(defaultClient).toBeInstanceOf(NewsClient);
    });

    it('should create an instance with custom adapter when provided', () => {
      const customClient = new NewsClient(mockDataSource);
      expect(customClient).toBeInstanceOf(NewsClient);
    });
  });
});
