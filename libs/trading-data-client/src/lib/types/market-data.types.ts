/**
 * Represents a time interval for asset data
 */
export type TimeInterval =
  | '1m'
  | '2m'
  | '5m'
  | '15m'
  | '30m'
  | '1h'
  | '1d'
  | '1wk'
  | '1mo';

/**
 * Represents a single OHLCV (Open, High, Low, Close, Volume) data point
 */
export interface OHLCVData {
  /** Timestamp of the data point */
  date: Date;
  /** Opening price */
  open: number;
  /** Highest price */
  high: number;
  /** Lowest price */
  low: number;
  /** Closing price */
  close: number;
  /** Trading volume */
  volume: number;
  /** Adjusted closing price (if available) */
  adjClose?: number;
}

/**
 * Represents current quote data for an asset
 */
export interface QuoteData {
  /** Asset symbol */
  symbol: string;
  /** Current price */
  price: number;
  /** Previous close price */
  previousClose?: number;
  /** Opening price */
  open?: number;
  /** Day's high price */
  dayHigh?: number;
  /** Day's low price */
  dayLow?: number;
  /** Trading volume */
  volume?: number;
  /** Market cap */
  marketCap?: number;
  /** Timestamp of the quote */
  timestamp: Date;
}

/**
 * Parameters for fetching historical asset data
 */
export interface HistoricalDataParams {
  /** Asset symbol (e.g., 'EURUSD=X' for Forex) */
  symbol: string;
  /** Start date for historical data */
  startDate: Date;
  /** End date for historical data */
  endDate?: Date;
  /** Time interval for the data */
  interval?: TimeInterval;
}
