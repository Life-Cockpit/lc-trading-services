import type { NewsParams, NewsData } from './types/index.js';
import type { INewsProvider } from './interfaces/news-provider.interface.js';
import type { IDataSourceAdapter } from './interfaces/data-source-adapter.interface.js';
import { normalizeSymbol } from './symbol-normalizer.js';
import { YahooFinanceAdapter } from './adapters/yahoo-finance.adapter.js';

/**
 * Client for fetching news articles
 * 
 * Design principles:
 * - Only handles news fetching (single responsibility)
 * - Can work with any IDataSourceAdapter implementation (extensible)
 * - Implements INewsProvider interface (substitutable)
 * - Uses focused IDataSourceAdapter interface
 * - Depends on IDataSourceAdapter abstraction, not concrete implementation
 */
export class NewsClient implements INewsProvider {
  private dataSource: IDataSourceAdapter;

  /**
   * Constructor with optional dependency injection
   * @param dataSource - Optional data source adapter (defaults to YahooFinanceAdapter)
   * 
   * @example
   * // Simple usage with defaults
   * const client = new NewsClient();
   * 
   * @example
   * // Advanced usage with custom adapter
   * const adapter = new YahooFinanceAdapter();
   * const client = new NewsClient(adapter);
   */
  constructor(dataSource?: IDataSourceAdapter) {
    this.dataSource = dataSource || new YahooFinanceAdapter();
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
      const searchResult = await this.dataSource.search(normalizedQuery, {
        newsCount: count,
        quotesCount: 0, // We only want news, not quotes
      });

      if (!searchResult.news || searchResult.news.length === 0) {
        return [];
      }

      return searchResult.news.map((article: any) => ({
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
