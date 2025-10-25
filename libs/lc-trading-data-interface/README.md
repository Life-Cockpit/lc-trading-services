# lc-trading-data-interface

This library provides TypeScript interfaces and types for trading data, decoupling the data model from specific data provider implementations.

## Installation

```bash
npm install @lc-trading-services/lc-trading-data-interface
```

## Interfaces

### `ITradingDataProvider`

The main interface that all trading data providers must implement.

```typescript
interface ITradingDataProvider {
  getHistoricalData(params: HistoricalDataParams): Promise<OHLCVData[]>;
  getQuote(symbol: string): Promise<QuoteData>;
}
```

### `OHLCVData`

Represents a single OHLCV (Open, High, Low, Close, Volume) data point.

```typescript
interface OHLCVData {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  adjClose?: number;
}
```

### `QuoteData`

Represents current quote data for an asset.

```typescript
interface QuoteData {
  symbol: string;
  price: number;
  previousClose?: number;
  open?: number;
  dayHigh?: number;
  dayLow?: number;
  volume?: number;
  marketCap?: number;
  timestamp: Date;
}
```

### `HistoricalDataParams`

Parameters for fetching historical asset data.

```typescript
interface HistoricalDataParams {
  symbol: string;
  startDate: Date;
  endDate?: Date;
  interval?: TimeInterval;
}
```

### `TimeInterval`

Supported time intervals for historical data.

```typescript
type TimeInterval =
  | '1m'   // 1 minute
  | '2m'   // 2 minutes
  | '5m'   // 5 minutes
  | '15m'  // 15 minutes
  | '30m'  // 30 minutes
  | '1h'   // 1 hour
  | '1d'   // 1 day
  | '1wk'  // 1 week
  | '1mo'; // 1 month
```

## Usage

This interface package is designed to be implemented by data provider libraries. For a concrete implementation using Yahoo Finance, see `@lc-trading-services/trading-data-client`.

## Example

```typescript
import type { ITradingDataProvider, HistoricalDataParams } from '@lc-trading-services/lc-trading-data-interface';

// Implement the interface
class MyCustomDataProvider implements ITradingDataProvider {
  async getHistoricalData(params: HistoricalDataParams) {
    // Your implementation
  }
  
  async getQuote(symbol: string) {
    // Your implementation
  }
}
```


This library was generated with [Nx](https://nx.dev).

## Building

Run `nx build lc-trading-data-interface` to build the library.
