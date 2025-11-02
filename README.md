# Life Cockpit Trading Services

A TypeScript-based monorepo for trading data services, providing modular libraries for fetching and managing financial market data. Built with Nx, this project offers type-safe interfaces and implementations for accessing trading data from various sources.

## Overview

This repository contains reusable TypeScript libraries designed to facilitate integration with financial data providers. The project follows a clean architecture approach by separating interface definitions from concrete implementations, enabling flexibility and testability in your trading applications.

**Key Features:**
- 🔌 Provider-agnostic trading data interfaces
- 📊 Yahoo Finance integration for real-time and historical data
- 💱 Support for Forex, stocks, ETFs, and cryptocurrencies
- ⏱️ Multiple time intervals (1m to 1mo)

## Project Structure

This is an Nx monorepo with the following structure:

```
lc-trading-services/
├── libs/                         # All libraries (publishable modules)
│   ├── trading-indicators/       # Trading indicators library
│   └── trading-data-client/      # Yahoo Finance implementation
├── examples/                     # Usage examples
│   ├── trading-data-client/      # Examples for trading-data-client
│   └── trading-indicators/       # Examples for trading-indicators
├── package.json                  # Root package configuration
├── nx.json                       # Nx workspace configuration
└── tsconfig.base.json            # Shared TypeScript configuration
```

### Libraries

#### `trading-indicators`

**Package:** `@lc-trading-services/trading-indicators`

A comprehensive trading indicators library providing technical analysis tools including support/resistance zones, ATR, EMA, and high/low calculations.

**[📖 View trading-indicators documentation](libs/trading-indicators/README.md)**

**Installation:**
```bash
npm install @lc-trading-services/trading-indicators
```

**Key Features:**
- Average True Range (ATR) for 1d and 1h intervals
- Exponential Moving Averages (EMA 9, 20, 50, 200)
- Support and Resistance zone identification
- All-time high and low calculations
- 52-week high and low calculations

#### `trading-data-client`

**Package:** `@lc-trading-services/trading-data-client`

A Yahoo Finance-based trading data provider that provides production-ready access to financial market data.

**[📖 View trading-data-client documentation](libs/trading-data-client/README.md)**

**Installation:**
```bash
npm install @lc-trading-services/trading-data-client
```

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

Each library is published to the [NPM registry](https://www.npmjs.com/) and can be installed using npm. See individual library documentation for specific installation and usage instructions:

- **[trading-indicators](libs/trading-indicators/README.md)** - Technical analysis indicators (ATR, EMA, Support/Resistance, High/Low)
- **[trading-data-client](libs/trading-data-client/README.md)** - Yahoo Finance integration for trading data

For usage examples, see the [examples/trading-data-client](examples/trading-data-client/) and [examples/trading-indicators](examples/trading-indicators/) directories, or refer to individual library documentation.

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

This monorepo uses **independent versioning** - each package can be versioned and published separately.

**Installation:**
```bash
npm install @lc-trading-services/trading-data-client
```

**Publishing (for maintainers):**
```bash
# Tag format: <package-name>-v<version>
git tag trading-data-client-v0.2.0
git push origin trading-data-client-v0.2.0
```

GitHub Actions automatically tests, builds, and publishes to NPM. Each package maintains its own version (e.g., trading-data-client v2.1.0, other-lib v0.1.0).

See [Contributing](#publishing-packages) section for detailed publishing instructions.

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

### Publishing Packages

This monorepo uses **independent versioning** - each package can be versioned and published separately.

**To publish a package:**

1. Ensure changes are merged to `main`
2. Create and push a tag: `<package-name>-v<version>`
   ```bash
   git tag trading-data-client-v0.2.0
   git push origin trading-data-client-v0.2.0
   ```
3. GitHub Actions automatically tests, builds, and publishes to NPM

**Tag Format:** `<package-name>-v<version>` (e.g., `trading-data-client-v0.1.0`, `my-lib-v2.0.0-beta.1`)

**Semantic Versioning:**
- MAJOR (x.0.0): Breaking changes
- MINOR (0.x.0): New features (backward compatible)
- PATCH (0.0.x): Bug fixes

**Adding a New Package:**
```bash
# Create library
npx nx g @nx/js:lib libs/my-lib --publishable --importPath=@lc-trading-services/my-lib

# Configure package.json with name, version, and publishConfig

# Publish first version
git tag my-lib-v0.0.1
git push origin my-lib-v0.0.1
```

**Troubleshooting:**
- Check GitHub Actions logs for publish failures
- Delete wrong tags: `git tag -d <tag> && git push origin :refs/tags/<tag>`
- Test locally: `npx nx local-registry` or `npm pack`

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
