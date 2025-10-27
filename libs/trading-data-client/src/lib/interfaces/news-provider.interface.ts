import type { NewsParams, NewsData } from '../types/index.js';

/**
 * Interface for news data providers
 * Follows the Dependency Inversion Principle by depending on abstractions
 */
export interface INewsProvider {
  /**
   * Fetch news articles for a symbol or search query
   * @param params - Parameters for fetching news
   * @returns Promise resolving to array of news articles
   */
  getNews(params: NewsParams): Promise<NewsData[]>;
}
