# trading-data-client

A Yahoo Finance-based implementation of the trading data provider interface for fetching asset data including Forex, stocks, and other financial instruments.

## Installation

```bash
npm install @lc-trading-services/trading-data-client
```

This package depends on:
- `@lc-trading-services/lc-trading-data-interface` - The interface definitions
- `yahoo-finance2` - Yahoo Finance API client

## Features

- ✅ Fetch historical OHLCV (Open, High, Low, Close, Volume) data
- ✅ Support for multiple time intervals (1m, 2m, 5m, 15m, 30m, 1h, 1d, 1wk, 1mo)
- ✅ Get real-time quote data
- ✅ Support for Forex pairs (e.g., EURUSD=X)
- ✅ Support for stocks, ETFs, and other instruments
- ✅ Type-safe implementation using TypeScript

## Usage

### Basic Example

```typescript
import { TradingDataClient } from '@lc-trading-services/trading-data-client';

// Create a client instance
const client = new TradingDataClient();

// Get current quote for EUR/USD
const quote = await client.getQuote('EURUSD=X');
console.log(`EUR/USD: ${quote.price}`);

// Get historical data
const historicalData = await client.getHistoricalData({
  symbol: 'EURUSD=X',
  startDate: new Date('2024-01-01'),
  endDate: new Date('2024-01-31'),
  interval: '1d'
});

console.log(`Retrieved ${historicalData.length} data points`);
historicalData.forEach(point => {
  console.log(`${point.date}: Open=${point.open}, Close=${point.close}`);
});
```

### Forex Example

```typescript
import { TradingDataClient } from '@lc-trading-services/trading-data-client';

const client = new TradingDataClient();

// Common Forex pairs use the format: XXXYYY=X
const forexPairs = ['EURUSD=X', 'GBPUSD=X', 'USDJPY=X'];

for (const pair of forexPairs) {
  const quote = await client.getQuote(pair);
  console.log(`${pair}: ${quote.price}`);
}
```

### Stock Example

```typescript
import { TradingDataClient } from '@lc-trading-services/trading-data-client';

const client = new TradingDataClient();

// Get Apple stock quote
const appleQuote = await client.getQuote('AAPL');
console.log(`Apple: $${appleQuote.price}`);
console.log(`Day High: $${appleQuote.dayHigh}`);
console.log(`Day Low: $${appleQuote.dayLow}`);
console.log(`Volume: ${appleQuote.volume}`);
```

### Intraday Data Example

```typescript
import { TradingDataClient } from '@lc-trading-services/trading-data-client';

const client = new TradingDataClient();

// Get 5-minute interval data for the last 7 days
const intradayData = await client.getHistoricalData({
  symbol: 'AAPL',
  startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
  interval: '5m'
});

console.log(`Retrieved ${intradayData.length} 5-minute candles`);
```

## API Reference

### `TradingDataClient`

Implements the `ITradingDataProvider` interface from `@lc-trading-services/lc-trading-data-interface`.

#### Methods

##### `getHistoricalData(params: HistoricalDataParams): Promise<OHLCVData[]>`

Fetches historical OHLCV data for an asset.

**Parameters:**
- `params.symbol` - Asset symbol (e.g., 'EURUSD=X' for Forex, 'AAPL' for stocks)
- `params.startDate` - Start date for historical data
- `params.endDate` - End date (optional, defaults to current date)
- `params.interval` - Time interval (optional, defaults to '1d')

**Returns:** Array of OHLCV data points

##### `getQuote(symbol: string): Promise<QuoteData>`

Fetches current quote data for an asset.

**Parameters:**
- `symbol` - Asset symbol

**Returns:** Current quote data

## Supported Symbols

### Forex Pairs
Yahoo Finance uses the format `XXXYYY=X` for Forex pairs:
- EUR/USD: `EURUSD=X`
- GBP/USD: `GBPUSD=X`
- USD/JPY: `USDJPY=X`
- AUD/USD: `AUDUSD=X`
- USD/CAD: `USDCAD=X`

### Stocks
Use the ticker symbol directly:
- Apple: `AAPL`
- Microsoft: `MSFT`
- Google: `GOOGL`

### Cryptocurrencies
- Bitcoin USD: `BTC-USD`
- Ethereum USD: `ETH-USD`

## Error Handling

The client throws errors with descriptive messages when operations fail:

```typescript
import { TradingDataClient } from '@lc-trading-services/trading-data-client';

const client = new TradingDataClient();

try {
  const quote = await client.getQuote('INVALID_SYMBOL');
} catch (error) {
  console.error('Failed to fetch quote:', error.message);
}
```

## License

MIT


This library was generated with [Nx](https://nx.dev).

## Building

Run `nx build trading-data-client` to build the library.
