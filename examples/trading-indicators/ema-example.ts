/**
 * Example: Using EMA (Exponential Moving Average) indicators
 * 
 * This example demonstrates how to calculate EMAs and use them for trend analysis
 */

import { TradingIndicators } from '@lc-trading-services/trading-indicators';

async function main() {
  const indicators = new TradingIndicators();

  console.log('=== EMA (Exponential Moving Average) Example ===\n');

  // Calculate all common EMAs at once
  try {
    console.log('Calculating EMAs for Apple (AAPL):');
    const emas = await indicators.ema.calculateMultipleEMAs('AAPL', [9, 20, 50, 200]);
    
    console.log('\nEMA Values:');
    emas.forEach(result => {
      console.log(`  EMA ${result.period.toString().padStart(3)}: $${result.ema.toFixed(2)}`);
    });
    console.log('');
  } catch (error) {
    console.error('Error calculating EMAs:', error);
  }

  // Calculate individual EMA
  try {
    console.log('Calculating EMA 20 for EUR/USD:');
    const ema20 = await indicators.ema.calculateEMA('EURUSD', 20);
    
    console.log(`  EMA 20: ${ema20.ema.toFixed(5)}`);
    console.log(`  Symbol: ${ema20.symbol}`);
    console.log(`  Timestamp: ${ema20.timestamp.toISOString()}`);
    console.log('');
  } catch (error) {
    console.error('Error calculating EMA 20:', error);
  }

  // Trend Analysis Example
  console.log('=== Trend Analysis Example ===\n');
  
  try {
    const symbol = 'AAPL';
    const emas = await indicators.ema.calculateMultipleEMAs(symbol, [9, 20, 50, 200]);
    
    const ema9 = emas.find(e => e.period === 9)?.ema ?? 0;
    const ema20 = emas.find(e => e.period === 20)?.ema ?? 0;
    const ema50 = emas.find(e => e.period === 50)?.ema ?? 0;
    const ema200 = emas.find(e => e.period === 200)?.ema ?? 0;
    
    console.log(`${symbol} EMA Analysis:`);
    console.log(`  EMA 9:   $${ema9.toFixed(2)}`);
    console.log(`  EMA 20:  $${ema20.toFixed(2)}`);
    console.log(`  EMA 50:  $${ema50.toFixed(2)}`);
    console.log(`  EMA 200: $${ema200.toFixed(2)}`);
    console.log('');
    
    // Determine overall trend
    console.log('Trend Analysis:');
    if (ema9 > ema20 && ema20 > ema50 && ema50 > ema200) {
      console.log('  📈 STRONG BULLISH TREND - All EMAs aligned upward');
    } else if (ema9 < ema20 && ema20 < ema50 && ema50 < ema200) {
      console.log('  📉 STRONG BEARISH TREND - All EMAs aligned downward');
    } else if (ema9 > ema50 && ema50 > ema200) {
      console.log('  📈 BULLISH TREND - Price above long-term EMAs');
    } else if (ema9 < ema50 && ema50 < ema200) {
      console.log('  📉 BEARISH TREND - Price below long-term EMAs');
    } else {
      console.log('  ↔️  SIDEWAYS/CHOPPY - Mixed EMA signals');
    }
    
    // Check for Golden Cross or Death Cross
    console.log('\nCrossover Signals:');
    if (ema50 > ema200) {
      const crossStrength = ((ema50 - ema200) / ema200 * 100);
      console.log(`  ⚡ GOLDEN CROSS - EMA 50 above EMA 200 by ${crossStrength.toFixed(2)}%`);
      console.log('     Bullish signal - potential upward momentum');
    } else {
      const crossStrength = ((ema200 - ema50) / ema200 * 100);
      console.log(`  ⚡ DEATH CROSS - EMA 50 below EMA 200 by ${crossStrength.toFixed(2)}%`);
      console.log('     Bearish signal - potential downward momentum');
    }
    console.log('');
  } catch (error) {
    console.error('Error in trend analysis:', error);
  }

  // Compare EMAs across different symbols
  console.log('=== Comparing EMAs Across Symbols ===\n');
  
  const symbols = ['AAPL', 'MSFT', 'GOOGL', 'TSLA'];
  
  for (const symbol of symbols) {
    try {
      const emas = await indicators.ema.calculateMultipleEMAs(symbol, [20, 50]);
      const ema20 = emas.find(e => e.period === 20)?.ema ?? 0;
      const ema50 = emas.find(e => e.period === 50)?.ema ?? 0;
      
      const trend = ema20 > ema50 ? '↑ Bullish' : '↓ Bearish';
      console.log(`${symbol.padEnd(6)}: EMA20=$${ema20.toFixed(2)}, EMA50=$${ema50.toFixed(2)} - ${trend}`);
    } catch (error) {
      console.error(`Error for ${symbol}:`, error);
    }
  }

  // Using different intervals
  console.log('\n=== EMA with Different Time Intervals ===\n');
  
  try {
    console.log('EUR/USD EMA 9:');
    
    const emaDaily = await indicators.ema.calculateEMA('EURUSD', 9, '1d');
    console.log(`  Daily:  ${emaDaily.ema.toFixed(5)}`);
    
    const emaHourly = await indicators.ema.calculateEMA('EURUSD', 9, '1h');
    console.log(`  Hourly: ${emaHourly.ema.toFixed(5)}`);
    console.log('');
  } catch (error) {
    console.error('Error calculating EMAs with different intervals:', error);
  }

  // Trading Strategy Example
  console.log('=== EMA Crossover Trading Strategy ===\n');
  
  try {
    const symbol = 'AAPL';
    const emas = await indicators.ema.calculateMultipleEMAs(symbol, [9, 20]);
    
    const ema9 = emas.find(e => e.period === 9)?.ema ?? 0;
    const ema20 = emas.find(e => e.period === 20)?.ema ?? 0;
    
    console.log(`${symbol} Short-term Crossover Strategy:`);
    console.log(`  EMA 9:  $${ema9.toFixed(2)}`);
    console.log(`  EMA 20: $${ema20.toFixed(2)}`);
    
    const difference = ema9 - ema20;
    const percentDiff = (difference / ema20 * 100);
    
    console.log(`  Difference: $${difference.toFixed(2)} (${percentDiff.toFixed(2)}%)`);
    
    if (difference > 0) {
      console.log('\n  Signal: 🟢 BULLISH - EMA 9 crossed above EMA 20');
      console.log('  Action: Consider long positions or hold existing longs');
    } else {
      console.log('\n  Signal: 🔴 BEARISH - EMA 9 crossed below EMA 20');
      console.log('  Action: Consider short positions or exit longs');
    }
    
    if (Math.abs(percentDiff) < 0.5) {
      console.log('  Warning: EMAs are very close - weak signal');
    }
  } catch (error) {
    console.error('Error in trading strategy example:', error);
  }
}

// Run the example
main().catch(console.error);
