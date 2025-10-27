import YahooFinance from 'yahoo-finance2';
import type { IDataSourceAdapter } from '../interfaces/data-source-adapter.interface.js';

/**
 * Adapter for Yahoo Finance data source
 * Follows the Adapter pattern and Dependency Inversion Principle
 * This allows the system to be extended with other data sources (Open/Closed Principle)
 */
export class YahooFinanceAdapter implements IDataSourceAdapter {
  private yahooFinance: InstanceType<typeof YahooFinance>;

  constructor(yahooFinance?: InstanceType<typeof YahooFinance>) {
    this.yahooFinance = yahooFinance || new YahooFinance();
  }

  async search(query: string, options: any): Promise<any> {
    return this.yahooFinance.search(query, options);
  }

  async chart(symbol: string, options: any): Promise<any> {
    return this.yahooFinance.chart(symbol, options);
  }

  async quote(symbol: string): Promise<any> {
    return this.yahooFinance.quote(symbol);
  }
}
