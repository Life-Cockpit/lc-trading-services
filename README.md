# Life Cockpit Trading Services

A TypeScript-based monorepo for trading data services, providing modular libraries for fetching and managing financial market data. Built with Nx, this project offers type-safe interfaces and implementations for accessing trading data from various sources.

## Overview

This repository contains reusable TypeScript libraries designed to facilitate integration with financial data providers. The project follows a clean architecture approach by separating interface definitions from concrete implementations, enabling flexibility and testability in your trading applications.

**Key Features:**
- 🔌 Provider-agnostic trading data interfaces
- 📊 Yahoo Finance integration for real-time and historical data
- 💱 Support for Forex, stocks, ETFs, and cryptocurrencies
- ⏱️ Multiple time intervals (1m to 1mo)
- 📦 Publishable npm packages with independent versioning
- ✅ Type-safe TypeScript implementation
- 🧪 Comprehensive test coverage

## Monorepo Architecture

This project uses **Nx with independent versioning** for maximum flexibility:

- **Independent Packages**: Each library and app has its own version number
- **Selective Publishing**: Publish only the packages that changed
- **Dedicated Releases**: Each package gets its own git tags and releases
- **Flexible Deployment**: Deploy packages independently without coordinating versions

This architecture allows teams to:
- Release breaking changes to one package without affecting others
- Maintain different release cadences for different packages
- Publish security fixes to specific packages quickly
- Keep package versions aligned with semantic versioning principles

## Project Structure

This is an Nx monorepo with the following structure:

```
lc-trading-services/
├── libs/                    # Shared libraries
│   └── trading-data-client/          # Yahoo Finance implementation
├── examples/                # Usage examples
├── package.json            # Root package configuration
├── nx.json                 # Nx workspace configuration
└── tsconfig.base.json      # Shared TypeScript configuration
```

### Libraries

The project currently does not have an `/apps` directory - all functionality is provided through reusable libraries in the `/libs` directory. The library is a standalone, publishable npm package that can be consumed by external applications.

#### Available Library

#### `trading-data-client`

**Package:** `@lc-trading-services/trading-data-client`

A Yahoo Finance-based trading data provider that provides production-ready access to financial market data. This library includes all necessary TypeScript interfaces and types.

**Key Exports:**
- `TradingDataClient` - Main client class for accessing trading data
- `ITradingDataProvider` - Interface for data providers
- `OHLCVData` - Open, High, Low, Close, Volume data structure
- `QuoteData` - Real-time quote information
- `HistoricalDataParams` - Parameters for historical data requests
- `TimeInterval` - Supported time intervals (1m, 5m, 15m, 1h, 1d, 1wk, 1mo)

**Features:**
- Real-time quotes for stocks, Forex, and cryptocurrencies
- Historical OHLCV data with configurable time intervals
- Support for intraday and daily data
- Robust error handling
- Type-safe API with all types included

**Supported Assets:**
- Forex pairs (e.g., `EURUSD`, `EUR/USD`)
- Stocks (e.g., `AAPL`, `MSFT`)
- ETFs and indices
- Cryptocurrencies (e.g., `BTC-USD`)

## Installation and Setup

### Prerequisites

- Node.js (v20 or higher recommended)
- npm (comes with Node.js)

### Quick Start

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Life-Cockpit/lc-trading-services.git
   cd lc-trading-services
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Build all libraries:**
   ```bash
   npx nx run-many -t build
   ```

4. **Run tests:**
   ```bash
   npx nx run-many -t test
   ```

5. **Type check:**
   ```bash
   npx nx run-many -t typecheck
   ```

### Using the Libraries in Your Project

The library is published to the [NPM registry](https://www.npmjs.com/) and can be installed using npm:

```bash
npm install @lc-trading-services/trading-data-client
```

The package includes all necessary TypeScript types and interfaces.

**NPM Package:**
- [@lc-trading-services/trading-data-client](https://www.npmjs.com/package/@lc-trading-services/trading-data-client)

Or use it locally during development:

```bash
# In your project
npm install /path/to/lc-trading-services/libs/trading-data-client
```

### Quick Start Guide

#### Basic Usage

##### 1. Import and Create Client

```typescript
import { TradingDataClient } from '@lc-trading-services/trading-data-client';

const client = new TradingDataClient();
```

##### 2. Get Real-Time Quote

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

##### 3. Get Historical Data

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

#### Common Use Cases

##### Forex Trading

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

##### Stock Analysis

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

##### Intraday Trading

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

#### TypeScript Types

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

#### Supported Intervals

- `'1m'` - 1 minute
- `'2m'` - 2 minutes
- `'5m'` - 5 minutes
- `'15m'` - 15 minutes
- `'30m'` - 30 minutes
- `'1h'` - 1 hour
- `'1d'` - 1 day (default)
- `'1wk'` - 1 week
- `'1mo'` - 1 month

#### Error Handling

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

#### Complete Example

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

For more detailed examples, see the [trading-data-client README](libs/trading-data-client/README.md) or check the [examples directory](examples/).

### Running Examples

The `examples/` directory contains sample code demonstrating library usage:

```bash
# Build the libraries first
npx nx run-many -t build

# Run an example
npx ts-node --esm examples/forex-example.ts
```

## Development Workflow

### Building Specific Libraries

```bash
# Build the library
npx nx build trading-data-client

# Build all
npx nx run-many -t build
```

### Testing

```bash
# Test the library
npx nx test trading-data-client

# Test all
npx nx run-many -t test
```

### Type Checking

```bash
# Type check the library
npx nx typecheck trading-data-client

# Type check all
npx nx run-many -t typecheck
```

### Viewing the Project Graph

Visualize project dependencies:

```bash
npx nx graph
```

### Syncing TypeScript Project References

Nx automatically keeps TypeScript project references in sync. To manually sync:

```bash
npx nx sync
```

To verify sync status (useful in CI):

```bash
npx nx sync:check
```

## Publishing to NPM

This monorepo uses **independent versioning** - each library and application can be versioned and published separately.

### For Library Consumers

Install packages from NPM:

```bash
npm install @lc-trading-services/trading-data-client
```

See the [NPM package](https://www.npmjs.com/package/@lc-trading-services/trading-data-client) for the latest version.

### For Maintainers

To publish a package, create and push a tag following the format `<package-name>-v<version>`:

1. Ensure all changes are merged to the `main` branch
2. Create and push a Git tag for the specific package:
   ```bash
   # Example: Publish trading-data-client version 0.2.0
   git tag trading-data-client-v0.2.0
   git push origin trading-data-client-v0.2.0
   ```
3. GitHub Actions will automatically:
   - Run tests and build for that specific package
   - Publish to NPM
   - Create a GitHub release

**Each package has its own version** - you can publish packages independently without affecting others.

For detailed publishing instructions, see [PUBLISHING.md](PUBLISHING.md).

**Required Setup:**
- NPM token must be configured as `NPM_TOKEN` in GitHub secrets
- Token must have publish permissions for `@lc-trading-services` scope

## Contributing

We welcome contributions to the Life Cockpit Trading Services project! Here's how you can help:

### Getting Started

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes using conventional commits (`git commit -m 'feat: add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Commit Message Convention

We follow the conventional commits specification:

- `feat(scope): description` - New features
- `fix(scope): description` - Bug fixes
- `docs(scope): description` - Documentation changes
- `refactor(scope): description` - Code refactoring
- `test(scope): description` - Test additions or modifications
- `chore(scope): description` - Build process or tooling changes

Example: `feat(trading-client): add support for options data`

### Code Standards

- Follow TypeScript strict mode guidelines
- Write unit tests for new functionality
- Ensure all tests pass before submitting PR
- Update documentation for API changes
- Keep libraries focused with single responsibility
- Use descriptive variable and function names

### Adding a New Library

Use Nx generators to create new libraries:

```bash
npx nx g @nx/js:lib libs/your-library-name --publishable --importPath=@lc-trading-services/your-library-name
```

### Pull Request Process

1. Ensure your code builds without errors
2. Run all tests and ensure they pass
3. Update the README if you've added new features
4. Describe your changes clearly in the PR description
5. Link any related issues

### Reporting Issues

- Use the GitHub issue tracker
- Provide detailed reproduction steps
- Include error messages and logs
- Specify your environment (Node.js version, OS, etc.)

## License

This project is licensed under the MIT License.

```
MIT License

Copyright (c) 2025 Life Cockpit

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

**Built with [Nx](https://nx.dev) • Powered by TypeScript**
