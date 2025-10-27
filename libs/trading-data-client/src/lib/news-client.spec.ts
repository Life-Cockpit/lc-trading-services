import { NewsClient } from './news-client';
import type { NewsData } from './types/index.js';

// Mock yahoo-finance2
const mockSearchFn = jest.fn();

const createMockYahooFinance = () => ({
  search: mockSearchFn,
  chart: jest.fn(),
  quote: jest.fn(),
});

describe('NewsClient', () => {
  let client: NewsClient;
  let mockYahooFinance: ReturnType<typeof createMockYahooFinance>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockYahooFinance = createMockYahooFinance();
    client = new NewsClient(mockYahooFinance as any);
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

      mockSearchFn.mockResolvedValue(mockSearchResult);

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
      mockSearchFn.mockResolvedValue({ news: [], quotes: [] });

      await client.getNews({ query: 'AAPL' });

      expect(mockSearchFn).toHaveBeenCalledWith('AAPL', {
        newsCount: 10,
        quotesCount: 0,
      });
    });

    it('should use custom count when specified', async () => {
      mockSearchFn.mockResolvedValue({ news: [], quotes: [] });

      await client.getNews({ query: 'TSLA', count: 20 });

      expect(mockSearchFn).toHaveBeenCalledWith('TSLA', {
        newsCount: 20,
        quotesCount: 0,
      });
    });

    it('should return empty array when no news available', async () => {
      mockSearchFn.mockResolvedValue({ news: [], quotes: [] });

      const result = await client.getNews({ query: 'INVALID' });

      expect(result).toEqual([]);
    });

    it('should handle missing news property', async () => {
      mockSearchFn.mockResolvedValue({ quotes: [] });

      const result = await client.getNews({ query: 'TEST' });

      expect(result).toEqual([]);
    });

    it('should throw error when search API fails', async () => {
      const errorMessage = 'API Error';
      mockSearchFn.mockRejectedValue(new Error(errorMessage));

      await expect(
        client.getNews({ query: 'INVALID' })
      ).rejects.toThrow('Failed to fetch news for INVALID');
    });

    it('should normalize forex symbols', async () => {
      mockSearchFn.mockResolvedValue({ news: [], quotes: [] });

      await client.getNews({ query: 'EURUSD' });

      expect(mockSearchFn).toHaveBeenCalledWith('EURUSD=X', {
        newsCount: 10,
        quotesCount: 0,
      });
    });

    it('should normalize forex symbols with slash', async () => {
      mockSearchFn.mockResolvedValue({ news: [], quotes: [] });

      await client.getNews({ query: 'EUR/USD' });

      expect(mockSearchFn).toHaveBeenCalledWith('EURUSD=X', {
        newsCount: 10,
        quotesCount: 0,
      });
    });

    it('should not modify stock symbols', async () => {
      mockSearchFn.mockResolvedValue({ news: [], quotes: [] });

      await client.getNews({ query: 'AAPL' });

      expect(mockSearchFn).toHaveBeenCalledWith('AAPL', {
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

      mockSearchFn.mockResolvedValue(mockSearchResult);

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

      mockSearchFn.mockResolvedValue(mockSearchResult);

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
});
