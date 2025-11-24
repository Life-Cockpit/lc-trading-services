/**
 * Example: Using MACD (Moving Average Convergence Divergence) indicator
 * 
 * This example demonstrates how to calculate MACD and use it for trend and momentum analysis
 */

import { TradingIndicators } from '@lc-trading-services/trading-indicators';

async function main() {
  const indicators = new TradingIndicators();

  console.log('=== MACD (Moving Average Convergence Divergence) Example ===\n');

  // Calculate MACD with default parameters (12, 26, 9)
  try {
    console.log('Calculating MACD for Apple (AAPL):');
    const macd = await indicators.macd.calculateMACD('AAPL');
    
    console.log('\nMACD Values:');
    console.log(`  MACD Line:    ${macd.macd.toFixed(4)}`);
    console.log(`  Signal Line:  ${macd.signal.toFixed(4)}`);
    console.log(`  Histogram:    ${macd.histogram.toFixed(4)}`);
    console.log(`  Parameters:   Fast=${macd.fastPeriod}, Slow=${macd.slowPeriod}, Signal=${macd.signalPeriod}`);
    console.log(`  Timestamp:    ${macd.timestamp.toISOString()}`);
    console.log('');
  } catch (error) {
    console.error('Error calculating MACD:', error);
  }

  // MACD Signal Interpretation
  console.log('=== MACD Signal Interpretation ===\n');
  
  try {
    const symbol = 'AAPL';
    const macd = await indicators.macd.calculateMACD(symbol);
    
    console.log(`${symbol} MACD Analysis:`);
    console.log(`  MACD:      ${macd.macd.toFixed(4)}`);
    console.log(`  Signal:    ${macd.signal.toFixed(4)}`);
    console.log(`  Histogram: ${macd.histogram.toFixed(4)}`);
    console.log('');
    
    // Interpret MACD signals
    console.log('Signal Interpretation:');
    
    // MACD Line vs Zero Line
    if (macd.macd > 0) {
      console.log('  📈 MACD above zero line - Bullish momentum');
    } else {
      console.log('  📉 MACD below zero line - Bearish momentum');
    }
    
    // MACD Line vs Signal Line
    if (macd.macd > macd.signal) {
      console.log('  🟢 MACD above signal line - Potential buy signal');
      if (macd.histogram > 0) {
        console.log(`  💪 Histogram positive (${macd.histogram.toFixed(4)}) - Bullish momentum strengthening`);
      }
    } else {
      console.log('  🔴 MACD below signal line - Potential sell signal');
      if (macd.histogram < 0) {
        console.log(`  📉 Histogram negative (${macd.histogram.toFixed(4)}) - Bearish momentum strengthening`);
      }
    }
    
    // Histogram strength analysis
    const histogramAbs = Math.abs(macd.histogram);
    if (histogramAbs < 0.5) {
      console.log('  ⚠️  Histogram small - Weak signal, use caution');
    } else if (histogramAbs > 2) {
      console.log('  ⚡ Histogram large - Strong momentum signal');
    }
    console.log('');
  } catch (error) {
    console.error('Error in signal interpretation:', error);
  }

  // Calculate MACD with custom parameters
  console.log('=== MACD with Custom Parameters ===\n');
  
  try {
    console.log('Calculating MACD with faster settings (8, 17, 9):');
    const fastMACD = await indicators.macd.calculateMACD('AAPL', 8, 17, 9);
    
    console.log(`  MACD:      ${fastMACD.macd.toFixed(4)}`);
    console.log(`  Signal:    ${fastMACD.signal.toFixed(4)}`);
    console.log(`  Histogram: ${fastMACD.histogram.toFixed(4)}`);
    console.log('  Note: Faster parameters (8,17,9) are more responsive but may give false signals');
    console.log('');
  } catch (error) {
    console.error('Error calculating custom MACD:', error);
  }

  // Compare MACD across different symbols
  console.log('=== Comparing MACD Across Symbols ===\n');
  
  const symbols = ['AAPL', 'MSFT', 'GOOGL'];
  
  for (const symbol of symbols) {
    try {
      const macd = await indicators.macd.calculateMACD(symbol);
      
      const signal = macd.macd > macd.signal ? '🟢 Buy' : '🔴 Sell';
      const momentum = macd.macd > 0 ? 'Bullish' : 'Bearish';
      
      console.log(`${symbol.padEnd(6)}: MACD=${macd.macd.toFixed(2)}, Signal=${macd.signal.toFixed(2)}, Histogram=${macd.histogram.toFixed(2)} - ${signal} (${momentum})`);
    } catch (error) {
      console.error(`Error for ${symbol}:`, error);
    }
  }
  console.log('');

  // Using different intervals
  console.log('=== MACD with Different Time Intervals ===\n');
  
  try {
    console.log('EUR/USD MACD:');
    
    const macdDaily = await indicators.macd.calculateMACD('EURUSD', 12, 26, 9, '1d');
    console.log(`  Daily:  MACD=${macdDaily.macd.toFixed(5)}, Histogram=${macdDaily.histogram.toFixed(5)}`);
    
    const macdHourly = await indicators.macd.calculateMACD('EURUSD', 12, 26, 9, '1h');
    console.log(`  Hourly: MACD=${macdHourly.macd.toFixed(5)}, Histogram=${macdHourly.histogram.toFixed(5)}`);
    console.log('');
  } catch (error) {
    console.error('Error calculating MACD with different intervals:', error);
  }

  // MACD Divergence Example
  console.log('=== Understanding MACD Divergence ===\n');
  
  try {
    const symbol = 'AAPL';
    const macd = await indicators.macd.calculateMACD(symbol);
    
    console.log(`${symbol} MACD Divergence Analysis:`);
    console.log('');
    console.log('Types of Divergence:');
    console.log('  1. Bullish Divergence: Price makes lower lows, MACD makes higher lows');
    console.log('     → Potential trend reversal to the upside');
    console.log('');
    console.log('  2. Bearish Divergence: Price makes higher highs, MACD makes lower highs');
    console.log('     → Potential trend reversal to the downside');
    console.log('');
    console.log('  3. Hidden Bullish Divergence: Price makes higher lows, MACD makes lower lows');
    console.log('     → Continuation of uptrend');
    console.log('');
    console.log('  4. Hidden Bearish Divergence: Price makes lower highs, MACD makes higher highs');
    console.log('     → Continuation of downtrend');
    console.log('');
    console.log('Current MACD State:');
    console.log(`  MACD:      ${macd.macd.toFixed(4)}`);
    console.log(`  Signal:    ${macd.signal.toFixed(4)}`);
    console.log(`  Histogram: ${macd.histogram.toFixed(4)}`);
    console.log('');
    console.log('Note: To detect divergence, compare multiple MACD readings over time');
    console.log('      with corresponding price movements.');
    console.log('');
  } catch (error) {
    console.error('Error in divergence analysis:', error);
  }

  // Trading Strategy Example
  console.log('=== MACD Trading Strategy ===\n');
  
  try {
    const symbol = 'BTC-USD';
    const macd = await indicators.macd.calculateMACD(symbol);
    
    console.log(`${symbol} MACD Trading Strategy:`);
    console.log(`  MACD:      ${macd.macd.toFixed(4)}`);
    console.log(`  Signal:    ${macd.signal.toFixed(4)}`);
    console.log(`  Histogram: ${macd.histogram.toFixed(4)}`);
    console.log('');
    
    // Generate trading signal
    if (macd.macd > macd.signal && macd.macd > 0) {
      console.log('  Signal: 🟢 STRONG BUY');
      console.log('  Reason: MACD crossed above signal AND above zero line');
      console.log('  Action: Consider entering long positions');
    } else if (macd.macd > macd.signal && macd.macd < 0) {
      console.log('  Signal: 🟡 CAUTIOUS BUY');
      console.log('  Reason: MACD crossed above signal BUT still below zero');
      console.log('  Action: Early bullish signal, wait for confirmation');
    } else if (macd.macd < macd.signal && macd.macd < 0) {
      console.log('  Signal: 🔴 STRONG SELL');
      console.log('  Reason: MACD crossed below signal AND below zero line');
      console.log('  Action: Consider exiting longs or entering shorts');
    } else if (macd.macd < macd.signal && macd.macd > 0) {
      console.log('  Signal: 🟠 CAUTIOUS SELL');
      console.log('  Reason: MACD crossed below signal BUT still above zero');
      console.log('  Action: Early bearish signal, monitor closely');
    }
    
    // Histogram analysis for timing
    console.log('');
    console.log('  Timing Analysis:');
    if (Math.abs(macd.histogram) < 1) {
      console.log('  ⏳ Histogram small - Signal just forming, early entry');
    } else if (Math.abs(macd.histogram) > 3) {
      console.log('  ⚠️  Histogram large - Signal may be overextended, late entry');
    } else {
      console.log('  ✅ Histogram moderate - Good timing for entry');
    }
    
    console.log('');
    console.log('  Risk Management:');
    console.log('  - Always use stop-loss orders');
    console.log('  - Confirm MACD signals with other indicators (e.g., RSI, support/resistance)');
    console.log('  - Consider volume and overall market trend');
  } catch (error) {
    console.error('Error in trading strategy example:', error);
  }
}

// Run the example
main().catch(console.error);
