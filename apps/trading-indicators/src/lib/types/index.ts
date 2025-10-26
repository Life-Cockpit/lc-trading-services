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
