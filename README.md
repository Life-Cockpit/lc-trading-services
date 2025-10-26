# Life Cockpit Trading Services

A TypeScript-based monorepo for trading data services, providing modular libraries for fetching and managing financial market data. Built with Nx, this project offers type-safe interfaces and implementations for accessing trading data from various sources.

## Overview

This repository contains reusable TypeScript libraries designed to facilitate integration with financial data providers. The project follows a clean architecture approach by separating interface definitions from concrete implementations, enabling flexibility and testability in your trading applications.

**Key Features:**
- 🔌 Provider-agnostic trading data interfaces
- 📊 Yahoo Finance integration for real-time and historical data
- 💱 Support for Forex, stocks, ETFs, and cryptocurrencies
- ⏱️ Multiple time intervals (1m to 1mo)
- 📦 Publishable npm packages
- ✅ Type-safe TypeScript implementation
- 🧪 Comprehensive test coverage

## Project Structure

This is an Nx monorepo with the following structure:

```
lc-trading-services/
├── libs/                    # Shared libraries
│   ├── lc-trading-data-interface/    # Core data interfaces
│   └── trading-data-client/          # Yahoo Finance implementation
├── examples/                # Usage examples
├── package.json            # Root package configuration
├── nx.json                 # Nx workspace configuration
└── tsconfig.base.json      # Shared TypeScript configuration
```

### Libraries

The project currently does not have an `/apps` directory - all functionality is provided through reusable libraries in the `/libs` directory. Each library is a standalone, publishable npm package that can be consumed by external applications.

#### Available Libraries

The repository contains the following libraries:

#### `lc-trading-data-interface`

**Package:** `@lc-trading-services/lc-trading-data-interface`

This library provides TypeScript interfaces and types that define the contract for trading data providers. It serves as the foundation for all trading data implementations in the project.

**Key Exports:**
- `ITradingDataProvider` - Main interface for data providers
- `OHLCVData` - Open, High, Low, Close, Volume data structure
- `QuoteData` - Real-time quote information
- `HistoricalDataParams` - Parameters for historical data requests
- `TimeInterval` - Supported time intervals (1m, 5m, 15m, 1h, 1d, 1wk, 1mo)

**Purpose:** Decouples data consumers from specific provider implementations, enabling easy swapping of data sources without code changes.

#### `trading-data-client`

**Package:** `@lc-trading-services/trading-data-client`

A concrete implementation of the `ITradingDataProvider` interface using Yahoo Finance as the data source. This client provides production-ready access to financial market data.

**Features:**
- Real-time quotes for stocks, Forex, and cryptocurrencies
- Historical OHLCV data with configurable time intervals
- Support for intraday and daily data
- Robust error handling
- Type-safe API based on the interface definitions

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

### Quick Usage Example

Here's a simple example of using the TradingDataClient:

```typescript
import { TradingDataClient } from '@lc-trading-services/trading-data-client';

// Create a client instance
const client = new TradingDataClient();

// Get current quote for EUR/USD (supports multiple formats)
const quote = await client.getQuote('EUR/USD');  // or 'EURUSD'
console.log(`EUR/USD: ${quote.price}`);

// Get historical data
const historicalData = await client.getHistoricalData({
  symbol: 'AAPL',
  startDate: new Date('2024-01-01'),
  endDate: new Date('2024-01-31'),
  interval: '1d'
});

console.log(`Retrieved ${historicalData.length} data points`);
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
# Build a single library
npx nx build lc-trading-data-interface
npx nx build trading-data-client

# Build all
npx nx run-many -t build
```

### Testing

```bash
# Test a single library
npx nx test lc-trading-data-interface
npx nx test trading-data-client

# Test all
npx nx run-many -t test
```

### Type Checking

```bash
# Type check a single library
npx nx typecheck lc-trading-data-interface

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

The `trading-data-client` and `lc-trading-data-interface` libraries are automatically published to NPM when changes are merged to the `main` branch.

### For Library Consumers

Install the package from NPM:

```bash
npm install @lc-trading-services/trading-data-client
```

See the [NPM package](https://www.npmjs.com/package/@lc-trading-services/trading-data-client) for the latest version.

### For Maintainers

To publish a new version:

1. Ensure all changes are merged to the `main` branch
2. Create and push a Git tag with the version number following [semantic versioning](https://semver.org/):
   ```bash
   git tag v0.1.0
   git push origin v0.1.0
   ```
3. GitHub Actions will automatically:
   - Run tests and builds
   - Publish to NPM
   - Create a GitHub release

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
