import type { TimeInterval } from '@lc-trading-services/trading-data-client';

/**
 * Represents a support or resistance zone
 */
export interface SupportResistanceZone {
  /** The price level of the zone */
  level: number;
  /** Number of times this level acted as support */
  supportCount: number;
  /** Number of times this level acted as resistance */
  resistanceCount: number;
  /** Total number of times this level was touched */
  totalTouches: number;
  /** Strength score (0-1) based on frequency and recency */
  strength: number;
}

/**
 * Result of support and resistance zone calculation
 */
export interface SupportResistanceResult {
  /** Symbol analyzed */
  symbol: string;
  /** Time interval used for analysis */
  interval: TimeInterval;
  /** Array of identified zones */
  zones: SupportResistanceZone[];
  /** Calculation timestamp */
  timestamp: Date;
}

/**
 * Average True Range indicator result
 */
export interface ATRResult {
  /** Symbol analyzed */
  symbol: string;
  /** Time interval used */
  interval: TimeInterval;
  /** Current ATR value */
  atr: number;
  /** Calculation timestamp */
  timestamp: Date;
}

/**
 * All-time high and low result
 */
export interface AllTimeHighLowResult {
  /** Symbol analyzed */
  symbol: string;
  /** All-time high price */
  allTimeHigh: number;
  /** Date of all-time high */
  allTimeHighDate: Date;
  /** All-time low price */
  allTimeLow: number;
  /** Date of all-time low */
  allTimeLowDate: Date;
  /** Calculation timestamp */
  timestamp: Date;
}

/**
 * 52-week high and low result
 */
export interface WeekHighLowResult {
  /** Symbol analyzed */
  symbol: string;
  /** 52-week high price */
  high52Week: number;
  /** Date of 52-week high */
  high52WeekDate: Date;
  /** 52-week low price */
  low52Week: number;
  /** Date of 52-week low */
  low52WeekDate: Date;
  /** Calculation timestamp */
  timestamp: Date;
}

/**
 * EMA (Exponential Moving Average) result
 */
export interface EMAResult {
  /** Symbol analyzed */
  symbol: string;
  /** EMA period (e.g., 9, 20, 50, 200) */
  period: number;
  /** Current EMA value */
  ema: number;
  /** Calculation timestamp */
  timestamp: Date;
}

/**
 * Represents a single trendline connecting exactly 2 price points
 */
export interface Trendline {
  /** Type of trendline */
  type: 'support' | 'resistance';
  /** First point on the trendline */
  point1: TrendlinePoint;
  /** Second point on the trendline */
  point2: TrendlinePoint;
  /** Slope of the trendline (price change per period) */
  slope: number;
  /** Y-intercept of the trendline */
  intercept: number;
  /** Strength score (0-1) based on price span and time span */
  strength: number;
}

/**
 * Represents a point on a trendline
 */
export interface TrendlinePoint {
  /** Date of the point */
  date: Date;
  /** Price at this point */
  price: number;
  /** Index in the historical data array */
  index: number;
}

/**
 * Result of trendline calculation
 */
export interface TrendlineResult {
  /** Symbol analyzed */
  symbol: string;
  /** Time interval used for analysis */
  interval: TimeInterval;
  /** Array of identified support trendlines */
  supportTrendlines: Trendline[];
  /** Array of identified resistance trendlines */
  resistanceTrendlines: Trendline[];
  /** Calculation timestamp */
  timestamp: Date;
}

/**
 * RSI (Relative Strength Index) result
 */
export interface RSIResult {
  /** Symbol analyzed */
  symbol: string;
  /** RSI period (e.g., 14) */
  period: number;
  /** Current RSI value (0-100) */
  rsi: number;
  /** RSI signal interpretation */
  signal: 'overbought' | 'oversold' | 'neutral';
  /** Calculation timestamp */
  timestamp: Date;
}

/**
 * MACD (Moving Average Convergence Divergence) result
 */
export interface MACDResult {
  /** Symbol analyzed */
  symbol: string;
  /** Fast EMA period (default: 12) */
  fastPeriod: number;
  /** Slow EMA period (default: 26) */
  slowPeriod: number;
  /** Signal period (default: 9) */
  signalPeriod: number;
  /** MACD line value (fast EMA - slow EMA) */
  macd: number;
  /** Signal line value (EMA of MACD) */
  signal: number;
  /** MACD histogram (MACD - Signal) */
  histogram: number;
  /** Calculation timestamp */
  timestamp: Date;
}

/**
 * Pivot Points result with support and resistance levels
 */
export interface PivotPointsResult {
  /** Symbol analyzed */
  symbol: string;
  /** Time interval used */
  interval: TimeInterval;
  /** Pivot Point (PP) - central level */
  pivotPoint: number;
  /** First resistance level */
  r1: number;
  /** Second resistance level */
  r2: number;
  /** Third resistance level */
  r3: number;
  /** First support level */
  s1: number;
  /** Second support level */
  s2: number;
  /** Third support level */
  s3: number;
  /** High price from previous period */
  previousHigh: number;
  /** Low price from previous period */
  previousLow: number;
  /** Close price from previous period */
  previousClose: number;
  /** Calculation timestamp */
  timestamp: Date;
}
