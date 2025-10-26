# Examples

This directory contains example code demonstrating how to use the trading data library.

## Running the Examples

First, make sure you have built the library:

```bash
npm install
npx nx build trading-data-client
```

Then you can run the examples using `ts-node` or compile them first:

### Using ts-node

```bash
# Forex example
npx ts-node --esm examples/forex-example.ts

# Stock example
npx ts-node --esm examples/stock-example.ts

# Cryptocurrency example
npx ts-node --esm examples/crypto-example.ts

# Intraday data example
npx ts-node --esm examples/intraday-example.ts

# ATR indicator example
npx ts-node --esm examples/atr-example.ts

# EMA indicator example
npx ts-node --esm examples/ema-example.ts

# High/Low calculations example
npx ts-node --esm examples/high-low-example.ts

# Support/Resistance zones example
npx ts-node --esm examples/support-resistance-example.ts
```

### Or compile and run with Node.js

```bash
npx tsc examples/forex-example.ts --module nodenext --moduleResolution nodenext --target es2022
node examples/forex-example.js
```

## Available Examples

### forex-example.ts

Demonstrates how to:
- Fetch current quotes for Forex pairs using user-friendly formats (EUR/USD, GBP/USD, etc.)
- Retrieve historical OHLCV data
- Handle multiple currency pairs
- Work with different time intervals

**Note:** This example uses the user-friendly format `EUR/USD` instead of the Yahoo Finance-specific `EURUSD=X` format. The client automatically handles the conversion.

### stock-example.ts

Demonstrates how to:
- Fetch current quotes for stocks (AAPL, MSFT, GOOGL, etc.)
- Get stock-specific data like market cap and volume
- Retrieve daily historical data for stocks
- Fetch weekly data for longer-term analysis

### crypto-example.ts

Demonstrates how to:
- Fetch current quotes for cryptocurrencies (BTC-USD, ETH-USD, etc.)
- Get crypto-specific data including market cap and volume
- Retrieve historical data for cryptocurrencies
- Perform simple price analysis (average, min, max, price change)

### intraday-example.ts

Demonstrates how to:
- Fetch intraday data at various intervals (1m, 5m, 15m, 30m, 1h)
- Compare data point counts across different intervals
- Analyze intraday volatility and price ranges
- Work with high-frequency trading data

### atr-example.ts

Demonstrates how to:
- Calculate Average True Range (ATR) for volatility measurement
- Use ATR with different time intervals (1d, 1h)
- Compare volatility across different symbols
- Apply ATR to trading strategies (stop-loss and profit targets)

### ema-example.ts

Demonstrates how to:
- Calculate Exponential Moving Averages (EMA 9, 20, 50, 200)
- Perform trend analysis using multiple EMAs
- Detect Golden Cross and Death Cross signals
- Implement EMA crossover trading strategies
- Compare EMAs across different symbols and time intervals

### high-low-example.ts

Demonstrates how to:
- Calculate all-time high and low prices
- Calculate 52-week high and low prices
- Analyze distance from key price levels
- Determine position within 52-week range
- Generate trading insights based on high/low levels
- Compare volatility across different symbols

### support-resistance-example.ts

Demonstrates how to:
- Identify support and resistance zones for daily and hourly intervals
- Analyze zone strength and frequency
- Find nearest support and resistance levels for trading
- Implement trading strategies using support/resistance zones
- Detect potential breakout areas
- Perform zone clustering analysis

## Note

These examples make real API calls to Yahoo Finance. Be mindful of rate limits and ensure you have an active internet connection when running them.
