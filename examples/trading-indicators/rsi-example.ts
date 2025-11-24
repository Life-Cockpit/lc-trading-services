import { TradingIndicators, RSIService } from '@lc-trading-services/trading-indicators';

/**
 * Example: RSI (Relative Strength Index) Calculation
 * 
 * This example demonstrates how to use the RSI indicator to identify
 * overbought and oversold conditions in the market.
 * 
 * RSI ranges from 0-100:
 * - RSI >= 70: Overbought (potential sell signal)
 * - RSI <= 30: Oversold (potential buy signal)
 * - RSI between 30-70: Neutral
 */

async function main() {
  console.log('=== RSI (Relative Strength Index) Calculation Examples ===\n');

  // Create trading indicators instance
  const indicators = new TradingIndicators();

  // Example 1: Calculate RSI for a stock
  console.log('Example 1: Calculate RSI for Apple (AAPL)');
  try {
    const appleRSI = await indicators.rsi.calculateRSI('AAPL');
    console.log('Apple (AAPL) RSI:');
    console.log(`  RSI: ${appleRSI.rsi}`);
    console.log(`  Signal: ${appleRSI.signal}`);
    console.log(`  Period: ${appleRSI.period}`);
    console.log(`  Timestamp: ${appleRSI.timestamp.toISOString()}`);
    
    // Interpret the signal
    if (appleRSI.signal === 'overbought') {
      console.log('  💡 Interpretation: The stock may be overbought, consider taking profits');
    } else if (appleRSI.signal === 'oversold') {
      console.log('  💡 Interpretation: The stock may be oversold, consider buying opportunity');
    } else {
      console.log('  💡 Interpretation: The stock is in neutral territory');
    }
  } catch (error) {
    console.error('Error calculating RSI for AAPL:', error);
  }

  console.log('\n---\n');

  // Example 2: Calculate RSI for Forex with custom period
  console.log('Example 2: Calculate RSI for EUR/USD with 21-day period');
  try {
    const eurusdRSI = await indicators.rsi.calculateRSI('EURUSD', 21);
    console.log('EUR/USD RSI (21-period):');
    console.log(`  RSI: ${eurusdRSI.rsi}`);
    console.log(`  Signal: ${eurusdRSI.signal}`);
    console.log(`  Period: ${eurusdRSI.period}`);
  } catch (error) {
    console.error('Error calculating RSI for EURUSD:', error);
  }

  console.log('\n---\n');

  // Example 3: Calculate RSI with hourly interval
  console.log('Example 3: Calculate RSI for Bitcoin with 1-hour interval');
  try {
    const btcRSI = await indicators.rsi.calculateRSI('BTC-USD', 14, '1h');
    console.log('Bitcoin (BTC-USD) RSI (1h):');
    console.log(`  RSI: ${btcRSI.rsi}`);
    console.log(`  Signal: ${btcRSI.signal}`);
    console.log(`  Period: ${btcRSI.period}`);
  } catch (error) {
    console.error('Error calculating RSI for BTC-USD:', error);
  }

  console.log('\n---\n');

  // Example 4: Using RSIService directly
  console.log('Example 4: Using RSIService directly');
  try {
    const rsiService = new RSIService(indicators['atr']['dataClient']);
    const msftRSI = await rsiService.calculateRSI('MSFT', 14);
    console.log('Microsoft (MSFT) RSI:');
    console.log(`  RSI: ${msftRSI.rsi}`);
    console.log(`  Signal: ${msftRSI.signal}`);
  } catch (error) {
    console.error('Error calculating RSI for MSFT:', error);
  }

  console.log('\n---\n');

  // Example 5: Compare RSI values for multiple stocks
  console.log('Example 5: Compare RSI values for multiple tech stocks');
  const symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN'];
  
  console.log('Tech Stocks RSI Comparison:');
  console.log('Symbol | RSI   | Signal');
  console.log('-------|-------|----------');
  
  for (const symbol of symbols) {
    try {
      const rsi = await indicators.rsi.calculateRSI(symbol);
      const signalEmoji = rsi.signal === 'overbought' ? '🔴' : 
                         rsi.signal === 'oversold' ? '🟢' : '🟡';
      console.log(`${symbol.padEnd(6)} | ${rsi.rsi.toString().padEnd(5)} | ${signalEmoji} ${rsi.signal}`);
    } catch (error) {
      console.log(`${symbol.padEnd(6)} | Error | N/A`);
    }
  }

  console.log('\n---\n');

  // Example 6: RSI divergence detection concept
  console.log('Example 6: RSI Trading Strategy Concept');
  console.log('Common RSI Trading Strategies:');
  console.log('1. Overbought/Oversold: Buy when RSI < 30, sell when RSI > 70');
  console.log('2. RSI Centerline Crossover: Buy when RSI crosses above 50, sell when below 50');
  console.log('3. RSI Divergence: Look for price/RSI divergence for reversal signals');
  console.log('4. RSI Failure Swings: Failed attempts to cross overbought/oversold levels');
  console.log('\nNote: Always combine RSI with other indicators for better accuracy!');

  console.log('\n=== Examples Complete ===\n');
}

// Run the examples
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
