# trading-data-client

A Yahoo Finance-based implementation of the trading data provider interface for fetching asset data including Forex, stocks, and other financial instruments.

## Installation

```bash
npm install @lc-trading-services/trading-data-client
```

Or use it locally during development:

```bash
# In your project
npm install /path/to/lc-trading-services/libs/trading-data-client
```

This package depends on:
- `yahoo-finance2` - Yahoo Finance API client

## Key Exports

- `TradingDataClient` - Main client class for accessing trading data
- `ITradingDataProvider` - Interface for data providers
- `OHLCVData` - Open, High, Low, Close, Volume data structure
- `QuoteData` - Real-time quote information
- `NewsData` - News article data structure
- `HistoricalDataParams` - Parameters for historical data requests
- `NewsParams` - Parameters for news requests
- `TimeInterval` - Supported time intervals (1m, 2m, 5m, 15m, 30m, 1h, 1d, 1wk, 1mo)

## Features

- ✅ Fetch historical OHLCV (Open, High, Low, Close, Volume) data
- ✅ Support for multiple time intervals (1m, 2m, 5m, 15m, 30m, 1h, 1d, 1wk, 1mo)
- ✅ Get real-time quote data
- ✅ Fetch news articles for symbols and search queries
- ✅ Support for Forex pairs with user-friendly formats (e.g., `EURUSD`, `EUR/USD`)
- ✅ Support for stocks, ETFs, and other instruments
- ✅ Type-safe implementation using TypeScript
- ✅ Automatic symbol normalization to Yahoo Finance format
- ✅ Robust error handling

## Supported Assets

- **Forex pairs**: `EURUSD`, `EUR/USD`, `GBPUSD`, `GBP/USD`, etc.
- **Stocks**: `AAPL`, `MSFT`, `GOOGL`, etc.
- **ETFs and indices**
- **Cryptocurrencies**: `BTC-USD`, `ETH-USD`, etc.

## Quick Start Guide

```typescript
import { TradingDataClient } from '@lc-trading-services/trading-data-client';

// Create client
const client = new TradingDataClient();

// Get real-time quote
const quote = await client.getQuote('EUR/USD');
console.log('Price:', quote.price);

// Get historical data
const data = await client.getHistoricalData({
  symbol: 'AAPL',
  startDate: new Date('2024-01-01'),
  endDate: new Date('2024-01-31'),
  interval: '1d'
});

// Get news articles
const news = await client.getNews({
  query: 'AAPL',
  count: 5
});
console.log('Latest news:', news[0].title);
```

**Supported Intervals:** `1m`, `2m`, `5m`, `15m`, `30m`, `1h`, `1d`, `1wk`, `1mo`

For more detailed examples, see the [examples/trading-data-client](../../examples/trading-data-client/) directory in the repository root.

## Usage

### Basic Example

```typescript
import { TradingDataClient } from '@lc-trading-services/trading-data-client';

// Create a client instance
const client = new TradingDataClient();

// Get current quote for EUR/USD
// Supports multiple formats: 'EUR/USD', 'EURUSD', or 'EURUSD=X'
const quote = await client.getQuote('EUR/USD');
console.log(`EUR/USD: ${quote.price}`);

// Get historical data
const historicalData = await client.getHistoricalData({
  symbol: 'EURUSD',  // Also accepts 'EUR/USD' or 'EURUSD=X'
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

// Forex pairs support multiple formats:
// - With slash: 'EUR/USD', 'GBP/USD', 'USD/JPY'
// - Without slash: 'EURUSD', 'GBPUSD', 'USDJPY'
// - Yahoo Finance format: 'EURUSD=X', 'GBPUSD=X', 'USDJPY=X'
const forexPairs = ['EUR/USD', 'GBP/USD', 'USD/JPY'];

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

### News Example

```typescript
import { TradingDataClient } from '@lc-trading-services/trading-data-client';

const client = new TradingDataClient();

// Get news articles for Apple Inc.
const appleNews = await client.getNews({
  query: 'AAPL',
  count: 10  // Fetch up to 10 articles (default is 10)
});

appleNews.forEach(article => {
  console.log(`${article.title}`);
  console.log(`Publisher: ${article.publisher}`);
  console.log(`Published: ${article.providerPublishTime.toLocaleString()}`);
  console.log(`Link: ${article.link}`);
  
  if (article.relatedTickers) {
    console.log(`Related Tickers: ${article.relatedTickers.join(', ')}`);
  }
  
  if (article.thumbnail) {
    console.log(`Thumbnail: ${article.thumbnail.resolutions[0]?.url}`);
  }
  console.log('');
});

// Get news for forex pairs
const forexNews = await client.getNews({
  query: 'EUR/USD',
  count: 5
});
```

## API Reference

### `TradingDataClient`

Implements the `ITradingDataProvider` interface from `@lc-trading-services/lc-trading-data-interface`.

#### Methods

##### `getHistoricalData(params: HistoricalDataParams): Promise<OHLCVData[]>`

Fetches historical OHLCV data for an asset.

**Parameters:**
- `params.symbol` - Asset symbol. Supports multiple formats:
  - Forex: `EURUSD`, `EUR/USD`, or `EURUSD=X`
  - Stocks: `AAPL`, `MSFT`
  - Crypto: `BTC-USD`, `ETH-USD`
- `params.startDate` - Start date for historical data
- `params.endDate` - End date (optional, defaults to current date)
- `params.interval` - Time interval (optional, defaults to '1d')

**Returns:** Array of OHLCV data points

##### `getQuote(symbol: string): Promise<QuoteData>`

Fetches current quote data for an asset.

**Parameters:**
- `symbol` - Asset symbol (supports same formats as getHistoricalData)

**Returns:** Current quote data

##### `getNews(params: NewsParams): Promise<NewsData[]>`

Fetches news articles for a symbol or search query.

**Parameters:**
- `params.query` - Search query or symbol to get news for (supports same formats as getHistoricalData)
- `params.count` - Maximum number of news articles to return (optional, defaults to 10)

**Returns:** Array of news articles with the following structure:
- `uuid` - Unique identifier for the article
- `title` - Article title
- `publisher` - Publisher name
- `link` - URL to the full article
- `providerPublishTime` - Publication timestamp
- `type` - Article type (e.g., 'STORY')
- `thumbnail` - Optional thumbnail with multiple resolutions
- `relatedTickers` - Optional array of related ticker symbols

## Supported Symbols

The client automatically normalizes symbols to Yahoo Finance format, allowing you to use more intuitive formats.

### Forex Pairs
Forex pairs can be specified in multiple formats:
- **With slash**: `EUR/USD`, `GBP/USD`, `USD/JPY`
- **Without slash**: `EURUSD`, `GBPUSD`, `USDJPY`
- **Yahoo Finance format**: `EURUSD=X`, `GBPUSD=X`, `USDJPY=X` (also accepted for backward compatibility)

All formats are automatically converted to Yahoo Finance format internally.

**Examples:**
- EUR/USD: `EUR/USD`, `EURUSD`, or `EURUSD=X`
- GBP/USD: `GBP/USD`, `GBPUSD`, or `GBPUSD=X`
- USD/JPY: `USD/JPY`, `USDJPY`, or `USDJPY=X`
- AUD/USD: `AUD/USD`, `AUDUSD`, or `AUDUSD=X`
- USD/CAD: `USD/CAD`, `USDCAD`, or `USDCAD=X`

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

## Development

This library was generated with [Nx](https://nx.dev).

### Building

Run `nx build trading-data-client` to build the library.

### Testing

Run `nx test trading-data-client` to execute the unit tests via [Jest](https://jestjs.io).

## Publishing

This library is published to the [NPM registry](https://www.npmjs.com/package/@lc-trading-services/trading-data-client) automatically via GitHub Actions when a version tag is pushed.

### Publishing Process

1. **Ensure Changes are Merged**: Make sure all your changes are merged to the `main` branch

2. **Create and Push a Git Tag**: Tag the release with a version number following [semver](https://semver.org/):
   - **Patch** (0.0.x): Bug fixes and minor changes
   - **Minor** (0.x.0): New features (backward compatible)
   - **Major** (x.0.0): Breaking changes

   ```bash
   # Example: Releasing version 0.1.0
   git checkout main
   git pull origin main
   git tag v0.1.0
   git push origin v0.1.0
   ```

3. **Automatic Publishing**: The GitHub Actions workflow will:
   - Detect the new tag
   - Extract the version from the tag name
   - Run tests and build the library
   - Update package.json with the version
   - Publish to NPM
   - Create a GitHub release

### Manual Publishing (Local Development)

For testing purposes, you can publish to a local NPM registry:

```bash
# Start local registry
npx nx local-registry

# In another terminal, build and publish
npx nx build trading-data-client
cd libs/trading-data-client
npm publish --registry http://localhost:4873
```

### NPM Token Setup

To enable automatic publishing, a repository administrator must configure an NPM token:

1. Create an NPM token with publish permissions at [npmjs.com](https://www.npmjs.com/settings/~/tokens)
2. Add the token as a GitHub secret named `NPM_TOKEN` in the repository settings
3. Ensure the token has permission to publish to the `@lc-trading-services` scope

### Package Metadata

- **Name**: `@lc-trading-services/trading-data-client`
- **Scope**: `@lc-trading-services`
- **Registry**: [npm.js](https://www.npmjs.com/package/@lc-trading-services/trading-data-client)
- **Access**: Public
- **License**: MIT
