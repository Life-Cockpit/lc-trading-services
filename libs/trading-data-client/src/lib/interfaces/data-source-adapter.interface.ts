/**
 * Interface for data source adapters
 * Follows the Dependency Inversion Principle
 * This abstracts the underlying data source (e.g., Yahoo Finance)
 */
export interface IDataSourceAdapter {
  /**
   * Search for financial data and news
   */
  search(query: string, options: any): Promise<any>;

  /**
   * Fetch chart/historical data
   */
  chart(symbol: string, options: any): Promise<any>;

  /**
   * Fetch quote data
   */
  quote(symbol: string): Promise<any>;
}
