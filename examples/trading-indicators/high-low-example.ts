/**
 * Example: Using High/Low indicators
 * 
 * This example demonstrates how to calculate all-time and 52-week highs/lows
 */

import { TradingIndicators } from '@lc-trading-services/trading-indicators';

async function main() {
  const indicators = new TradingIndicators();

  console.log('=== High/Low Calculations Example ===\n');

  // Calculate all-time high and low
  try {
    console.log('Calculating All-Time High/Low for Apple (AAPL):');
    const allTime = await indicators.allTimeHighLow.calculateAllTimeHighLow('AAPL');
    
    console.log('\nAll-Time Records:');
    console.log(`  Highest Price: $${allTime.allTimeHigh.toFixed(2)}`);
    console.log(`  Date: ${allTime.allTimeHighDate.toLocaleDateString()}`);
    console.log(`  Lowest Price: $${allTime.allTimeLow.toFixed(2)}`);
    console.log(`  Date: ${allTime.allTimeLowDate.toLocaleDateString()}`);
    
    const range = allTime.allTimeHigh - allTime.allTimeLow;
    console.log(`  Price Range: $${range.toFixed(2)}`);
    console.log('');
  } catch (error) {
    console.error('Error calculating all-time high/low:', error);
  }

  // Calculate 52-week high and low
  try {
    console.log('Calculating 52-Week High/Low for Apple (AAPL):');
    const week52 = await indicators.week52HighLow.calculate52WeekHighLow('AAPL');
    
    console.log('\n52-Week Records:');
    console.log(`  52-Week High: $${week52.high52Week.toFixed(2)}`);
    console.log(`  Date: ${week52.high52WeekDate.toLocaleDateString()}`);
    console.log(`  52-Week Low: $${week52.low52Week.toFixed(2)}`);
    console.log(`  Date: ${week52.low52WeekDate.toLocaleDateString()}`);
    
    const range52 = week52.high52Week - week52.low52Week;
    const rangePercent = (range52 / week52.low52Week * 100);
    console.log(`  52-Week Range: $${range52.toFixed(2)} (${rangePercent.toFixed(2)}%)`);
    console.log('');
  } catch (error) {
    console.error('Error calculating 52-week high/low:', error);
  }

  // Combined analysis
  console.log('=== Combined High/Low Analysis ===\n');
  
  try {
    const symbol = 'AAPL';
    const allTime = await indicators.allTimeHighLow.calculateAllTimeHighLow(symbol);
    const week52 = await indicators.week52HighLow.calculate52WeekHighLow(symbol);
    
    const currentPrice = 150; // Example current price
    
    console.log(`${symbol} Price Analysis (Current Price: $${currentPrice}):`);
    console.log('');
    
    // Distance from all-time high
    const distFromATH = currentPrice - allTime.allTimeHigh;
    const pctFromATH = (distFromATH / allTime.allTimeHigh * 100);
    console.log('Distance from All-Time High:');
    console.log(`  $${Math.abs(distFromATH).toFixed(2)} (${pctFromATH.toFixed(2)}%)`);
    
    if (pctFromATH > -5) {
      console.log('  Status: 🔥 AT OR NEAR ALL-TIME HIGH');
    } else if (pctFromATH > -20) {
      console.log('  Status: ↗️  RELATIVELY CLOSE TO ALL-TIME HIGH');
    } else {
      console.log('  Status: ↘️  SIGNIFICANTLY BELOW ALL-TIME HIGH');
    }
    console.log('');
    
    // Distance from 52-week high
    const distFrom52H = currentPrice - week52.high52Week;
    const pctFrom52H = (distFrom52H / week52.high52Week * 100);
    console.log('Distance from 52-Week High:');
    console.log(`  $${Math.abs(distFrom52H).toFixed(2)} (${pctFrom52H.toFixed(2)}%)`);
    
    if (pctFrom52H > -5) {
      console.log('  Status: 📈 AT OR NEAR 52-WEEK HIGH');
    } else if (pctFrom52H > -20) {
      console.log('  Status: ↗️  RELATIVELY CLOSE TO 52-WEEK HIGH');
    } else {
      console.log('  Status: ↘️  SIGNIFICANTLY BELOW 52-WEEK HIGH');
    }
    console.log('');
    
    // Distance from 52-week low
    const distFrom52L = currentPrice - week52.low52Week;
    const pctFrom52L = (distFrom52L / week52.low52Week * 100);
    console.log('Distance from 52-Week Low:');
    console.log(`  $${distFrom52L.toFixed(2)} (${pctFrom52L.toFixed(2)}%)`);
    
    if (pctFrom52L < 5) {
      console.log('  Status: 📉 AT OR NEAR 52-WEEK LOW');
    } else if (pctFrom52L < 20) {
      console.log('  Status: ↘️  RELATIVELY CLOSE TO 52-WEEK LOW');
    } else {
      console.log('  Status: ↗️  SIGNIFICANTLY ABOVE 52-WEEK LOW');
    }
    console.log('');
    
    // Position in 52-week range
    const positionIn52Range = (currentPrice - week52.low52Week) / (week52.high52Week - week52.low52Week) * 100;
    console.log(`Position in 52-Week Range: ${positionIn52Range.toFixed(1)}%`);
    
    if (positionIn52Range > 80) {
      console.log('  Upper 20% of range - Potential resistance ahead');
    } else if (positionIn52Range > 60) {
      console.log('  Upper middle range - Moderately strong');
    } else if (positionIn52Range > 40) {
      console.log('  Middle range - Neutral positioning');
    } else if (positionIn52Range > 20) {
      console.log('  Lower middle range - Moderately weak');
    } else {
      console.log('  Lower 20% of range - Potential support nearby');
    }
    console.log('');
  } catch (error) {
    console.error('Error in combined analysis:', error);
  }

  // Compare multiple symbols
  console.log('=== Comparing Multiple Symbols ===\n');
  
  const symbols = ['AAPL', 'MSFT', 'GOOGL', 'TSLA'];
  
  for (const symbol of symbols) {
    try {
      const week52 = await indicators.week52HighLow.calculate52WeekHighLow(symbol);
      const range = week52.high52Week - week52.low52Week;
      const rangePercent = (range / week52.low52Week * 100);
      
      console.log(`${symbol.padEnd(6)}:`);
      console.log(`  High: $${week52.high52Week.toFixed(2)} | Low: $${week52.low52Week.toFixed(2)}`);
      console.log(`  Range: ${rangePercent.toFixed(1)}%`);
      console.log('');
    } catch (error) {
      console.error(`Error for ${symbol}:`, error);
    }
  }

  // Forex example
  console.log('=== Forex High/Low Example ===\n');
  
  try {
    const week52 = await indicators.week52HighLow.calculate52WeekHighLow('EURUSD');
    
    console.log('EUR/USD 52-Week Records:');
    console.log(`  High: ${week52.high52Week.toFixed(5)} (${week52.high52WeekDate.toLocaleDateString()})`);
    console.log(`  Low: ${week52.low52Week.toFixed(5)} (${week52.low52WeekDate.toLocaleDateString()})`);
    
    const range = week52.high52Week - week52.low52Week;
    const pips = range * 10000;
    console.log(`  Range: ${pips.toFixed(0)} pips`);
  } catch (error) {
    console.error('Error calculating Forex high/low:', error);
  }

  console.log('\n=== Trading Insights ===\n');
  
  try {
    const symbol = 'AAPL';
    const allTime = await indicators.allTimeHighLow.calculateAllTimeHighLow(symbol);
    const week52 = await indicators.week52HighLow.calculate52WeekHighLow(symbol);
    
    console.log(`${symbol} Trading Insights:`);
    
    // Check if 52-week high equals all-time high
    if (Math.abs(week52.high52Week - allTime.allTimeHigh) < 0.01) {
      console.log('  🎯 Stock is at all-time high in the past year!');
      console.log('     → Strong bullish momentum');
      console.log('     → Consider waiting for pullback or use trailing stops');
    }
    
    // Check if 52-week low is recent
    const daysSinceLow = Math.floor(
      (new Date().getTime() - week52.low52WeekDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysSinceLow < 30) {
      console.log(`  ⚠️  52-week low was recent (${daysSinceLow} days ago)`);
      console.log('     → Stock may be recovering from weakness');
      console.log('     → Look for confirmation of trend reversal');
    }
    
    // Check volatility based on range
    const volatility = (week52.high52Week - week52.low52Week) / week52.low52Week * 100;
    console.log(`\n  Volatility Assessment (52-week range): ${volatility.toFixed(1)}%`);
    
    if (volatility > 50) {
      console.log('     → HIGH volatility stock');
      console.log('     → Wider stop losses recommended');
    } else if (volatility > 25) {
      console.log('     → MODERATE volatility stock');
      console.log('     → Standard risk management applies');
    } else {
      console.log('     → LOW volatility stock');
      console.log('     → May require longer holding periods');
    }
  } catch (error) {
    console.error('Error generating trading insights:', error);
  }
}

// Run the example
main().catch(console.error);
