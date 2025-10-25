# Examples

This directory contains example code demonstrating how to use the trading data libraries.

## Running the Examples

First, make sure you have built the libraries:

```bash
npm install
npx nx build lc-trading-data-interface
npx nx build trading-data-client
```

Then you can run the examples using `ts-node` or compile them first:

### Using ts-node

```bash
npx ts-node --esm examples/forex-example.ts
```

### Or compile and run with Node.js

```bash
npx tsc examples/forex-example.ts --module nodenext --moduleResolution nodenext --target es2022
node examples/forex-example.js
```

## Available Examples

### forex-example.ts

Demonstrates how to:
- Fetch current quotes for Forex pairs (EUR/USD, GBP/USD, etc.)
- Retrieve historical OHLCV data
- Handle multiple currency pairs
- Work with different time intervals

## Note

These examples make real API calls to Yahoo Finance. Be mindful of rate limits and ensure you have an active internet connection when running them.
