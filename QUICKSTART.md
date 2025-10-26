# Quick Start Guide - Using trading-data-client

This guide helps you get started with `@lc-trading-services/trading-data-client` in your project.

## Installation

```bash
npm install @lc-trading-services/trading-data-client
```

This will automatically install the required interface package as well.

## Basic Usage

### 1. Import and Create Client

```typescript
import { TradingDataClient } from '@lc-trading-services/trading-data-client';

const client = new TradingDataClient();
```

### 2. Get Real-Time Quote

```typescript
async function getCurrentPrice() {
  try {
    // Get EUR/USD quote
    const quote = await client.getQuote('EUR/USD');

    console.log('Current Price:', quote.price);
    console.log('Day High:', quote.dayHigh);
    console.log('Day Low:', quote.dayLow);
    console.log('Volume:', quote.volume);
  } catch (error) {
    console.error('Error fetching quote:', error.message);
  }
}

getCurrentPrice();
```

### 3. Get Historical Data

```typescript
async function getHistoricalPrices() {
  try {
    const data = await client.getHistoricalData({
      symbol: 'AAPL',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-31'),
      interval: '1d'
    });

    console.log(`Retrieved ${data.length} data points`);

    // Print first 5 data points
    data.slice(0, 5).forEach(point => {
      console.log(
        `${point.date.toISOString().split('T')[0]}: ` +
        `Open=${point.open}, Close=${point.close}, ` +
        `High=${point.high}, Low=${point.low}, Volume=${point.volume}`
      );
    });
  } catch (error) {
    console.error('Error fetching historical data:', error.message);
  }
}

getHistoricalPrices();
```

## Common Use Cases

### Forex Trading

```typescript
async function forexExample() {
  const client = new TradingDataClient();

  // All these formats work
  const formats = ['EUR/USD', 'EURUSD', 'EURUSD=X'];

  for (const symbol of formats) {
    const quote = await client.getQuote(symbol);
    console.log(`${symbol}: ${quote.price}`);
  }
}
```

### Stock Analysis

```typescript
async function stockAnalysis() {
  const client = new TradingDataClient();
  const symbol = 'AAPL';

  // Get 30 days of daily data
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 30);

  const data = await client.getHistoricalData({
    symbol,
    startDate,
    endDate,
    interval: '1d'
  });

  // Calculate average closing price
  const avgClose = data.reduce((sum, d) => sum + d.close, 0) / data.length;
  console.log(`Average closing price: $${avgClose.toFixed(2)}`);

  // Find highest and lowest
  const highest = Math.max(...data.map(d => d.high));
  const lowest = Math.min(...data.map(d => d.low));
  console.log(`30-day range: $${lowest.toFixed(2)} - $${highest.toFixed(2)}`);
}
```

### Intraday Trading

```typescript
async function intradayExample() {
  const client = new TradingDataClient();

  // Get 5-minute candles for the last 5 days
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 5);

  const data = await client.getHistoricalData({
    symbol: 'SPY', // S&P 500 ETF
    startDate,
    endDate,
    interval: '5m'
  });

  console.log(`Retrieved ${data.length} 5-minute candles`);
}
```

## TypeScript Types

The library is fully typed. You can import types for better IDE support:

```typescript
import {
  TradingDataClient,
  type ITradingDataProvider,
  type OHLCVData,
  type QuoteData,
  type HistoricalDataParams,
  type TimeInterval
} from '@lc-trading-services/trading-data-client';

// Use the interface to allow for different implementations
function processData(provider: ITradingDataProvider) {
  return provider.getQuote('AAPL');
}

const client = new TradingDataClient();
const quote = await processData(client);
```

## Supported Intervals

- `'1m'` - 1 minute
- `'2m'` - 2 minutes
- `'5m'` - 5 minutes
- `'15m'` - 15 minutes
- `'30m'` - 30 minutes
- `'1h'` - 1 hour
- `'1d'` - 1 day (default)
- `'1wk'` - 1 week
- `'1mo'` - 1 month

## Error Handling

Always wrap API calls in try-catch blocks:

```typescript
async function safeQuote(symbol: string) {
  const client = new TradingDataClient();

  try {
    return await client.getQuote(symbol);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Failed to get quote for ${symbol}:`, error.message);
    }
    // Return a default or throw
    throw error;
  }
}
```

## Complete Example

Here's a complete working example:

```typescript
import { TradingDataClient } from '@lc-trading-services/trading-data-client';

async function main() {
  const client = new TradingDataClient();

  // 1. Get current prices for multiple symbols
  const symbols = ['AAPL', 'MSFT', 'EUR/USD', 'BTC-USD'];

  console.log('Current Prices:');
  for (const symbol of symbols) {
    try {
      const quote = await client.getQuote(symbol);
      console.log(`${symbol}: ${quote.price}`);
    } catch (error) {
      console.error(`Error fetching ${symbol}:`, error.message);
    }
  }

  // 2. Get historical data for Apple stock
  console.log('\nApple Stock - Last 7 Days:');
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 7);

  try {
    const historicalData = await client.getHistoricalData({
      symbol: 'AAPL',
      startDate,
      endDate,
      interval: '1d'
    });

    historicalData.forEach(point => {
      const date = point.date.toISOString().split('T')[0];
      console.log(`${date}: Close=$${point.close.toFixed(2)}`);
    });
  } catch (error) {
    console.error('Error fetching historical data:', error.message);
  }
}

main().catch(console.error);
```

## Next Steps

- Read the [full README](https://github.com/Life-Cockpit/lc-trading-services/blob/main/libs/trading-data-client/README.md)
- Check out the [examples directory](https://github.com/Life-Cockpit/lc-trading-services/tree/main/examples)
- Learn about [implementing your own provider](https://github.com/Life-Cockpit/lc-trading-services/blob/main/libs/lc-trading-data-interface/README.md)

## Support

- [GitHub Issues](https://github.com/Life-Cockpit/lc-trading-services/issues)
- [NPM Package](https://www.npmjs.com/package/@lc-trading-services/trading-data-client)
