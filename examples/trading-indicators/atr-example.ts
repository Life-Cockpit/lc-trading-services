/**
 * Example: Using ATR (Average True Range) indicator
 * 
 * This example demonstrates how to calculate ATR to measure market volatility
 */

import { TradingIndicators } from '@lc-trading-services/trading-indicators';

async function main() {
  const indicators = new TradingIndicators();

  console.log('=== ATR (Average True Range) Example ===\n');

  // Calculate ATR for Apple stock - Daily interval
  try {
    console.log('Calculating ATR for Apple (AAPL) - Daily:');
    const atrDaily = await indicators.atr.calculateATR('AAPL', '1d', 14);
    
    console.log(`  ATR (14-day): ${atrDaily.atr.toFixed(4)}`);
    console.log(`  Timestamp: ${atrDaily.timestamp.toISOString()}`);
    
    // Interpret volatility
    if (atrDaily.atr > 5) {
      console.log(`  Volatility: HIGH - Price typically moves $${atrDaily.atr.toFixed(2)} per day`);
    } else if (atrDaily.atr > 2) {
      console.log(`  Volatility: MODERATE - Price typically moves $${atrDaily.atr.toFixed(2)} per day`);
    } else {
      console.log(`  Volatility: LOW - Price typically moves $${atrDaily.atr.toFixed(2)} per day`);
    }
    console.log('');
  } catch (error) {
    console.error('Error calculating daily ATR:', error);
  }

  // Calculate ATR for Forex - Hourly interval
  try {
    console.log('Calculating ATR for EUR/USD - Hourly:');
    const atrHourly = await indicators.atr.calculateATR('EURUSD', '1h', 14);
    
    console.log(`  ATR (14-hour): ${atrHourly.atr.toFixed(6)}`);
    console.log(`  Timestamp: ${atrHourly.timestamp.toISOString()}`);
    console.log(`  Typical hourly movement: ${(atrHourly.atr * 10000).toFixed(1)} pips`);
    console.log('');
  } catch (error) {
    console.error('Error calculating hourly ATR:', error);
  }

  // Compare ATR across different symbols
  console.log('=== Comparing Volatility Across Symbols ===\n');
  
  const symbols = ['AAPL', 'MSFT', 'TSLA', 'GOOGL'];
  
  for (const symbol of symbols) {
    try {
      const atr = await indicators.atr.calculateATR(symbol, '1d', 14);
      console.log(`${symbol.padEnd(6)}: ATR = $${atr.atr.toFixed(2)}`);
    } catch (error) {
      console.error(`Error calculating ATR for ${symbol}:`, error);
    }
  }

  console.log('\n=== Using Different Periods ===\n');

  // Compare different ATR periods
  const periods = [7, 14, 21];
  
  for (const period of periods) {
    try {
      const atr = await indicators.atr.calculateATR('AAPL', '1d', period);
      console.log(`ATR (${period}-day): $${atr.atr.toFixed(4)}`);
    } catch (error) {
      console.error(`Error calculating ${period}-day ATR:`, error);
    }
  }

  console.log('\n=== Trading Strategy Example ===\n');
  
  try {
    const atr = await indicators.atr.calculateATR('AAPL', '1d', 14);
    const currentPrice = 150; // Example current price
    
    console.log(`Current Price: $${currentPrice}`);
    console.log(`ATR (14-day): $${atr.atr.toFixed(2)}`);
    console.log('\nSuggested stop-loss levels (using 2x ATR):');
    console.log(`  Long position stop: $${(currentPrice - 2 * atr.atr).toFixed(2)}`);
    console.log(`  Short position stop: $${(currentPrice + 2 * atr.atr).toFixed(2)}`);
    console.log('\nSuggested profit targets (using 3x ATR):');
    console.log(`  Long position target: $${(currentPrice + 3 * atr.atr).toFixed(2)}`);
    console.log(`  Short position target: $${(currentPrice - 3 * atr.atr).toFixed(2)}`);
  } catch (error) {
    console.error('Error in trading strategy example:', error);
  }
}

// Run the example
main().catch(console.error);
