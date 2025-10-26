# trading-indicators

A comprehensive trading indicators library providing technical analysis tools including support/resistance zones, ATR (Average True Range), EMA (Exponential Moving Average), and high/low calculations.

## Installation

```bash
npm install @lc-trading-services/trading-indicators
```

Or use it locally during development:

```bash
# In your project
npm install /path/to/lc-trading-services/apps/trading-indicators
```

This package depends on:
- `@lc-trading-services/trading-data-client` - For fetching market data

## Key Exports

### Main Class
- `TradingIndicators` - Main service class providing access to all indicators

### Services
- `ATRService` - Average True Range calculations
- `EMAService` - Exponential Moving Average calculations
- `AllTimeHighLowService` - All-time high and low calculations
- `Week52HighLowService` - 52-week high and low calculations
- `SupportResistanceService` - Support and resistance zone identification

### Types
- `ATRResult` - ATR calculation result
- `EMAResult` - EMA calculation result
- `AllTimeHighLowResult` - All-time high/low result
- `WeekHighLowResult` - 52-week high/low result
- `SupportResistanceResult` - Support/resistance zones result
- `SupportResistanceZone` - Individual support/resistance zone

## Features

- ✅ **ATR (Average True Range)** - Measure market volatility for 1d and 1h intervals
- ✅ **EMA (Exponential Moving Average)** - Calculate EMA 9, 20, 50, and 200
- ✅ **Support and Resistance Zones** - Identify key price levels with frequency tracking
- ✅ **All-Time High/Low** - Find historical price extremes
- ✅ **52-Week High/Low** - Track yearly price ranges
- ✅ **Type-safe** - Full TypeScript support
- ✅ **Comprehensive Testing** - 42 test cases covering all services
- ✅ **Flexible API** - Use the main class or individual services

## Quick Start Guide

```typescript
import { TradingIndicators } from '@lc-trading-services/trading-indicators';

// Create indicators instance (uses default TradingDataClient)
const indicators = new TradingIndicators();

// Calculate ATR for Apple stock
const atr = await indicators.atr.calculateATR('AAPL', '1d');
console.log(`ATR: ${atr.atr}`);

// Calculate multiple EMAs at once
const emas = await indicators.ema.calculateMultipleEMAs('AAPL', [9, 20, 50, 200]);
emas.forEach(result => {
  console.log(`EMA ${result.period}: ${result.ema}`);
});

// Get 52-week high and low
const week52 = await indicators.week52HighLow.calculate52WeekHighLow('AAPL');
console.log(`52-Week High: ${week52.high52Week} on ${week52.high52WeekDate}`);
console.log(`52-Week Low: ${week52.low52Week} on ${week52.low52WeekDate}`);

// Identify support and resistance zones
const zones = await indicators.supportResistance.calculateSupportResistance('AAPL', '1d');
zones.zones.forEach(zone => {
  console.log(`Zone at ${zone.level}: Support=${zone.supportCount}, Resistance=${zone.resistanceCount}, Strength=${zone.strength}`);
});
```

## Supported Symbols

All services support the same symbols as `@lc-trading-services/trading-data-client`:

### Forex Pairs
- EUR/USD: `EURUSD`, `EUR/USD`, or `EURUSD=X`
- GBP/USD: `GBPUSD`, `GBP/USD`, or `GBPUSD=X`
- USD/JPY: `USDJPY`, `USD/JPY`, or `USDJPY=X`

### Stocks
- Apple: `AAPL`
- Microsoft: `MSFT`
- Google: `GOOGL`

### Cryptocurrencies
- Bitcoin: `BTC-USD`
- Ethereum: `ETH-USD`

## API Reference

### TradingIndicators

Main service class that provides access to all trading indicators.

#### Constructor

```typescript
constructor(dataClient?: TradingDataClient)
```

**Parameters:**
- `dataClient` (optional) - Custom TradingDataClient instance. If not provided, creates a new instance.

**Properties:**
- `atr: ATRService` - ATR indicator service
- `ema: EMAService` - EMA indicator service
- `allTimeHighLow: AllTimeHighLowService` - All-time high/low service
- `week52HighLow: Week52HighLowService` - 52-week high/low service
- `supportResistance: SupportResistanceService` - Support/resistance zones service

### ATRService

Average True Range indicator service for measuring market volatility.

#### calculateATR

```typescript
async calculateATR(
  symbol: string,
  interval: TimeInterval,
  period?: number
): Promise<ATRResult>
```

**Parameters:**
- `symbol` - Asset symbol (e.g., 'EURUSD', 'AAPL')
- `interval` - Time interval ('1d' or '1h')
- `period` (optional) - ATR period (default: 14)

**Returns:** Promise resolving to ATRResult

**Example:**
```typescript
const atr = await indicators.atr.calculateATR('AAPL', '1d', 14);
console.log(`ATR: ${atr.atr}`);
```

### EMAService

Exponential Moving Average indicator service.

#### calculateEMA

```typescript
async calculateEMA(
  symbol: string,
  period: number,
  interval?: TimeInterval
): Promise<EMAResult>
```

**Parameters:**
- `symbol` - Asset symbol
- `period` - EMA period (e.g., 9, 20, 50, 200)
- `interval` (optional) - Time interval (default: '1d')

**Returns:** Promise resolving to EMAResult

**Example:**
```typescript
const ema20 = await indicators.ema.calculateEMA('AAPL', 20);
console.log(`EMA 20: ${ema20.ema}`);
```

#### calculateMultipleEMAs

```typescript
async calculateMultipleEMAs(
  symbol: string,
  periods: number[],
  interval?: TimeInterval
): Promise<EMAResult[]>
```

**Parameters:**
- `symbol` - Asset symbol
- `periods` - Array of EMA periods (e.g., [9, 20, 50, 200])
- `interval` (optional) - Time interval (default: '1d')

**Returns:** Promise resolving to array of EMAResult

**Example:**
```typescript
const emas = await indicators.ema.calculateMultipleEMAs('AAPL', [9, 20, 50, 200]);
emas.forEach(result => {
  console.log(`EMA ${result.period}: ${result.ema}`);
});
```

### AllTimeHighLowService

Service for calculating all-time high and low prices.

#### calculateAllTimeHighLow

```typescript
async calculateAllTimeHighLow(
  symbol: string,
  lookbackYears?: number
): Promise<AllTimeHighLowResult>
```

**Parameters:**
- `symbol` - Asset symbol
- `lookbackYears` (optional) - Number of years to look back (default: 20)

**Returns:** Promise resolving to AllTimeHighLowResult

**Example:**
```typescript
const allTime = await indicators.allTimeHighLow.calculateAllTimeHighLow('AAPL');
console.log(`All-Time High: ${allTime.allTimeHigh} on ${allTime.allTimeHighDate}`);
console.log(`All-Time Low: ${allTime.allTimeLow} on ${allTime.allTimeLowDate}`);
```

### Week52HighLowService

Service for calculating 52-week high and low prices.

#### calculate52WeekHighLow

```typescript
async calculate52WeekHighLow(symbol: string): Promise<WeekHighLowResult>
```

**Parameters:**
- `symbol` - Asset symbol

**Returns:** Promise resolving to WeekHighLowResult

**Example:**
```typescript
const week52 = await indicators.week52HighLow.calculate52WeekHighLow('AAPL');
console.log(`52-Week High: ${week52.high52Week} on ${week52.high52WeekDate}`);
console.log(`52-Week Low: ${week52.low52Week} on ${week52.low52WeekDate}`);
```

### SupportResistanceService

Service for identifying support and resistance zones using price action analysis.

#### calculateSupportResistance

```typescript
async calculateSupportResistance(
  symbol: string,
  interval?: TimeInterval,
  lookbackPeriods?: number,
  tolerance?: number
): Promise<SupportResistanceResult>
```

**Parameters:**
- `symbol` - Asset symbol
- `interval` (optional) - Time interval ('1d' or '1h', default: '1d')
- `lookbackPeriods` (optional) - Number of periods to analyze (default: 100)
- `tolerance` (optional) - Price tolerance for zone clustering as percentage (default: 0.5%)

**Returns:** Promise resolving to SupportResistanceResult with up to 10 top zones

**Example:**
```typescript
const zones = await indicators.supportResistance.calculateSupportResistance('AAPL', '1d');
zones.zones.forEach(zone => {
  console.log(`Level: ${zone.level}`);
  console.log(`  Support Count: ${zone.supportCount}`);
  console.log(`  Resistance Count: ${zone.resistanceCount}`);
  console.log(`  Total Touches: ${zone.totalTouches}`);
  console.log(`  Strength: ${zone.strength}`);
});
```

For more examples, see the [examples directory](../../examples/) in the repository root.

## License

MIT
