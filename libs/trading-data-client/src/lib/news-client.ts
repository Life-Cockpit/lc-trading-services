import YahooFinance from 'yahoo-finance2';
import type { NewsParams, NewsData } from './types/index.js';
import { normalizeSymbol } from './symbol-normalizer.js';

/**
 * Client for fetching news articles from Yahoo Finance
 */
export class NewsClient {
  private yahooFinance: InstanceType<typeof YahooFinance>;

  constructor(yahooFinance: InstanceType<typeof YahooFinance>) {
    this.yahooFinance = yahooFinance;
  }

  /**
   * Fetch news articles for a symbol or search query
   * @param params - Parameters for fetching news
   * @returns Promise resolving to array of news articles
   */
  async getNews(params: NewsParams): Promise<NewsData[]> {
    const { query, count = 10 } = params;

    // Normalize the query symbol if it looks like a forex pair
    const normalizedQuery = normalizeSymbol(query);

    try {
      const searchResult = await this.yahooFinance.search(normalizedQuery, {
        newsCount: count,
        quotesCount: 0, // We only want news, not quotes
      });

      if (!searchResult.news || searchResult.news.length === 0) {
        return [];
      }

      return searchResult.news.map((article) => ({
        uuid: article.uuid,
        title: article.title,
        publisher: article.publisher,
        link: article.link,
        providerPublishTime: article.providerPublishTime,
        type: article.type,
        thumbnail: article.thumbnail,
        relatedTickers: article.relatedTickers,
      }));
    } catch (error) {
      throw new Error(
        `Failed to fetch news for ${query}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
}
