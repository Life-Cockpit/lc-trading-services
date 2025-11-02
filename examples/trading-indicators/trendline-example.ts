/**
 * Example: Using Trendline Service to identify support and resistance lines
 * 
 * This example demonstrates how to calculate trendlines with exactly 2 hits
 * to identify key support and resistance lines in price data
 */

import { TradingIndicators } from '@lc-trading-services/trading-indicators';

async function main() {
  const indicators = new TradingIndicators();

  console.log('=== Trendline Analysis Example ===\n');

  // Calculate trendlines for Apple stock - Daily interval
  try {
    console.log('Calculating trendlines for Apple (AAPL) - Daily:');
    const result = await indicators.trendline.calculateTrendlines('AAPL', '1d', 100, 5);
    
    console.log(`\nFound ${result.supportTrendlines.length} support trendlines`);
    console.log(`Found ${result.resistanceTrendlines.length} resistance trendlines`);
    console.log('═'.repeat(70));
    
    // Display support trendlines
    if (result.supportTrendlines.length > 0) {
      console.log('\n🟢 Top Support Trendlines:\n');
      
      result.supportTrendlines.forEach((line, index) => {
        console.log(`Support Line ${index + 1}:`);
        console.log(`  Point 1: $${line.point1.price.toFixed(2)} on ${line.point1.date.toISOString().split('T')[0]}`);
        console.log(`  Point 2: $${line.point2.price.toFixed(2)} on ${line.point2.date.toISOString().split('T')[0]}`);
        console.log(`  Slope: ${line.slope > 0 ? '+' : ''}${line.slope.toFixed(4)} (${line.slope > 0 ? 'Rising' : 'Falling'})`);
        console.log(`  Strength: ${(line.strength * 100).toFixed(1)}%`);
        
        // Calculate where the line would be at the most recent point
        const projectedPrice = line.slope * line.point2.index + line.intercept;
        console.log(`  Current Projection: $${projectedPrice.toFixed(2)}`);
        console.log('');
      });
    }
    
    // Display resistance trendlines
    if (result.resistanceTrendlines.length > 0) {
      console.log('🔴 Top Resistance Trendlines:\n');
      
      result.resistanceTrendlines.forEach((line, index) => {
        console.log(`Resistance Line ${index + 1}:`);
        console.log(`  Point 1: $${line.point1.price.toFixed(2)} on ${line.point1.date.toISOString().split('T')[0]}`);
        console.log(`  Point 2: $${line.point2.price.toFixed(2)} on ${line.point2.date.toISOString().split('T')[0]}`);
        console.log(`  Slope: ${line.slope > 0 ? '+' : ''}${line.slope.toFixed(4)} (${line.slope > 0 ? 'Rising' : 'Falling'})`);
        console.log(`  Strength: ${(line.strength * 100).toFixed(1)}%`);
        
        // Calculate where the line would be at the most recent point
        const projectedPrice = line.slope * line.point2.index + line.intercept;
        console.log(`  Current Projection: $${projectedPrice.toFixed(2)}`);
        console.log('');
      });
    }
    
    console.log('═'.repeat(70));
    console.log('');
  } catch (error) {
    console.error('Error calculating trendlines:', error);
  }

  // Calculate trendlines for hourly interval (intraday trading)
  try {
    console.log('Calculating trendlines for EUR/USD - Hourly:');
    const result = await indicators.trendline.calculateTrendlines('EURUSD', '1h', 50, 3);
    
    console.log(`\nFound ${result.supportTrendlines.length} intraday support lines`);
    console.log(`Found ${result.resistanceTrendlines.length} intraday resistance lines`);
    
    // Show top support line
    if (result.supportTrendlines.length > 0) {
      const topLine = result.supportTrendlines[0];
      console.log(`\nStrongest Support Line:`);
      console.log(`  ${topLine.point1.price.toFixed(5)} → ${topLine.point2.price.toFixed(5)}`);
      console.log(`  Strength: ${(topLine.strength * 100).toFixed(1)}%`);
      console.log(`  Trend: ${topLine.slope > 0 ? '📈 Ascending' : '📉 Descending'}`);
    }
    
    // Show top resistance line
    if (result.resistanceTrendlines.length > 0) {
      const topLine = result.resistanceTrendlines[0];
      console.log(`\nStrongest Resistance Line:`);
      console.log(`  ${topLine.point1.price.toFixed(5)} → ${topLine.point2.price.toFixed(5)}`);
      console.log(`  Strength: ${(topLine.strength * 100).toFixed(1)}%`);
      console.log(`  Trend: ${topLine.slope > 0 ? '📈 Ascending' : '📉 Descending'}`);
    }
    console.log('');
  } catch (error) {
    console.error('Error calculating hourly trendlines:', error);
  }

  // Trading strategy example: Channel trading
  console.log('=== Channel Trading Strategy ===\n');
  
  try {
    const symbol = 'AAPL';
    const result = await indicators.trendline.calculateTrendlines(symbol, '1d', 100, 5);
    
    console.log(`${symbol} Channel Analysis:`);
    console.log('');
    
    // Find parallel channels (support and resistance lines with similar slopes)
    if (result.supportTrendlines.length > 0 && result.resistanceTrendlines.length > 0) {
      const supportLine = result.supportTrendlines[0];
      const resistanceLine = result.resistanceTrendlines[0];
      
      const slopeDifference = Math.abs(supportLine.slope - resistanceLine.slope);
      
      if (slopeDifference < 0.1) {
        console.log('📊 Parallel Channel Detected!');
        console.log('');
        console.log('Support Trendline:');
        console.log(`  Slope: ${supportLine.slope.toFixed(4)}`);
        console.log(`  Strength: ${(supportLine.strength * 100).toFixed(1)}%`);
        console.log('');
        console.log('Resistance Trendline:');
        console.log(`  Slope: ${resistanceLine.slope.toFixed(4)}`);
        console.log(`  Strength: ${(resistanceLine.strength * 100).toFixed(1)}%`);
        console.log('');
        
        // Calculate channel width
        const currentSupportPrice = supportLine.slope * supportLine.point2.index + supportLine.intercept;
        const currentResistancePrice = resistanceLine.slope * resistanceLine.point2.index + resistanceLine.intercept;
        const channelWidth = currentResistancePrice - currentSupportPrice;
        
        console.log('Trading Strategy:');
        console.log(`  Channel Width: $${channelWidth.toFixed(2)}`);
        console.log(`  Current Support: $${currentSupportPrice.toFixed(2)}`);
        console.log(`  Current Resistance: $${currentResistancePrice.toFixed(2)}`);
        console.log('');
        console.log('  Buy Signal: Price touches support line');
        console.log(`  Sell/Target: Price reaches resistance line`);
        console.log(`  Stop Loss: Below $${(currentSupportPrice * 0.98).toFixed(2)}`);
        console.log('');
      } else {
        console.log('No clear parallel channel detected');
        console.log(`Slope difference: ${slopeDifference.toFixed(4)}`);
        console.log('');
      }
    }
  } catch (error) {
    console.error('Error in channel trading analysis:', error);
  }

  // Trend identification
  console.log('=== Trend Identification ===\n');
  
  try {
    const result = await indicators.trendline.calculateTrendlines('AAPL', '1d', 100, 10);
    
    // Analyze slope patterns
    const supportSlopes = result.supportTrendlines.map(l => l.slope);
    const resistanceSlopes = result.resistanceTrendlines.map(l => l.slope);
    
    const avgSupportSlope = supportSlopes.length > 0 
      ? supportSlopes.reduce((a, b) => a + b, 0) / supportSlopes.length 
      : 0;
    const avgResistanceSlope = resistanceSlopes.length > 0 
      ? resistanceSlopes.reduce((a, b) => a + b, 0) / resistanceSlopes.length 
      : 0;
    
    console.log('Overall Trend Analysis:');
    console.log(`  Average Support Slope: ${avgSupportSlope.toFixed(4)}`);
    console.log(`  Average Resistance Slope: ${avgResistanceSlope.toFixed(4)}`);
    console.log('');
    
    if (avgSupportSlope > 0.1 && avgResistanceSlope > 0.1) {
      console.log('  📈 STRONG UPTREND');
      console.log('  → Both support and resistance lines are rising');
      console.log('  → Strategy: Look for buy opportunities on pullbacks');
    } else if (avgSupportSlope < -0.1 && avgResistanceSlope < -0.1) {
      console.log('  📉 STRONG DOWNTREND');
      console.log('  → Both support and resistance lines are falling');
      console.log('  → Strategy: Look for sell opportunities on rallies');
    } else if (Math.abs(avgSupportSlope) < 0.05 && Math.abs(avgResistanceSlope) < 0.05) {
      console.log('  ↔️  SIDEWAYS/RANGING');
      console.log('  → Lines are relatively flat');
      console.log('  → Strategy: Range trading, buy low/sell high');
    } else {
      console.log('  🔀 MIXED SIGNALS');
      console.log('  → Conflicting trends between support and resistance');
      console.log('  → Strategy: Wait for clearer direction');
    }
    console.log('');
  } catch (error) {
    console.error('Error in trend identification:', error);
  }

  // Breakout detection
  console.log('=== Breakout/Breakdown Detection ===\n');
  
  try {
    const result = await indicators.trendline.calculateTrendlines('AAPL', '1d', 100, 5);
    const currentPrice = 150; // Example current price
    
    console.log(`Current Price: $${currentPrice}`);
    console.log('');
    
    // Check resistance lines for potential breakouts
    const nearbyResistance = result.resistanceTrendlines.filter(line => {
      const projectedPrice = line.slope * line.point2.index + line.intercept;
      const pctDiff = Math.abs(projectedPrice - currentPrice) / currentPrice;
      return pctDiff < 0.03; // Within 3%
    });
    
    if (nearbyResistance.length > 0) {
      console.log('⚠️  Near Resistance Trendline(s):');
      nearbyResistance.forEach(line => {
        const projectedPrice = line.slope * line.point2.index + line.intercept;
        console.log(`  Line at $${projectedPrice.toFixed(2)} (Strength: ${(line.strength * 100).toFixed(0)}%)`);
        console.log(`  → Break above could signal bullish breakout`);
      });
      console.log('');
    }
    
    // Check support lines for potential breakdowns
    const nearbySupport = result.supportTrendlines.filter(line => {
      const projectedPrice = line.slope * line.point2.index + line.intercept;
      const pctDiff = Math.abs(projectedPrice - currentPrice) / currentPrice;
      return pctDiff < 0.03; // Within 3%
    });
    
    if (nearbySupport.length > 0) {
      console.log('⚠️  Near Support Trendline(s):');
      nearbySupport.forEach(line => {
        const projectedPrice = line.slope * line.point2.index + line.intercept;
        console.log(`  Line at $${projectedPrice.toFixed(2)} (Strength: ${(line.strength * 100).toFixed(0)}%)`);
        console.log(`  → Break below could signal bearish breakdown`);
      });
      console.log('');
    }
    
    if (nearbyResistance.length === 0 && nearbySupport.length === 0) {
      console.log('  No trendlines near current price');
      console.log('  → Price trading freely between trendlines');
      console.log('');
    }
  } catch (error) {
    console.error('Error in breakout detection:', error);
  }

  // Compare different lookback periods
  console.log('=== Comparing Different Lookback Periods ===\n');
  
  try {
    const periods = [50, 100, 200];
    
    console.log('Trendline analysis for AAPL with different timeframes:');
    console.log('');
    
    for (const period of periods) {
      const result = await indicators.trendline.calculateTrendlines('AAPL', '1d', period, 5);
      
      const avgSupportStrength = result.supportTrendlines.length > 0
        ? result.supportTrendlines.reduce((sum, l) => sum + l.strength, 0) / result.supportTrendlines.length
        : 0;
      
      const avgResistanceStrength = result.resistanceTrendlines.length > 0
        ? result.resistanceTrendlines.reduce((sum, l) => sum + l.strength, 0) / result.resistanceTrendlines.length
        : 0;
      
      console.log(`${period}-day lookback:`);
      console.log(`  Support lines: ${result.supportTrendlines.length} (avg strength: ${(avgSupportStrength * 100).toFixed(1)}%)`);
      console.log(`  Resistance lines: ${result.resistanceTrendlines.length} (avg strength: ${(avgResistanceStrength * 100).toFixed(1)}%)`);
      console.log('');
    }
    
    console.log('Note:');
    console.log('  → Shorter periods: More responsive, better for short-term trading');
    console.log('  → Longer periods: More stable, better for long-term trends');
    console.log('');
  } catch (error) {
    console.error('Error comparing lookback periods:', error);
  }

  // Multi-symbol comparison
  console.log('=== Multi-Symbol Trend Comparison ===\n');
  
  const symbols = ['AAPL', 'MSFT', 'GOOGL', 'TSLA'];
  
  console.log('Comparing trendline characteristics across symbols:');
  console.log('');
  
  for (const symbol of symbols) {
    try {
      const result = await indicators.trendline.calculateTrendlines(symbol, '1d', 100, 5);
      
      // Calculate average slopes
      const avgSupportSlope = result.supportTrendlines.length > 0
        ? result.supportTrendlines.reduce((sum, l) => sum + l.slope, 0) / result.supportTrendlines.length
        : 0;
      
      const avgResistanceSlope = result.resistanceTrendlines.length > 0
        ? result.resistanceTrendlines.reduce((sum, l) => sum + l.slope, 0) / result.resistanceTrendlines.length
        : 0;
      
      console.log(`${symbol.padEnd(6)}:`);
      console.log(`  Lines Found: ${result.supportTrendlines.length} support, ${result.resistanceTrendlines.length} resistance`);
      console.log(`  Avg Slopes: Support ${avgSupportSlope > 0 ? '+' : ''}${avgSupportSlope.toFixed(4)}, ` +
                  `Resistance ${avgResistanceSlope > 0 ? '+' : ''}${avgResistanceSlope.toFixed(4)}`);
      
      // Determine trend
      if (avgSupportSlope > 0.05 && avgResistanceSlope > 0.05) {
        console.log(`  Trend: 📈 Uptrend`);
      } else if (avgSupportSlope < -0.05 && avgResistanceSlope < -0.05) {
        console.log(`  Trend: 📉 Downtrend`);
      } else {
        console.log(`  Trend: ↔️  Sideways`);
      }
      console.log('');
    } catch (error) {
      console.error(`Error analyzing ${symbol}:`, error);
    }
  }

  // Advanced: Wedge pattern detection
  console.log('=== Wedge Pattern Detection ===\n');
  
  try {
    const result = await indicators.trendline.calculateTrendlines('AAPL', '1d', 100, 5);
    
    if (result.supportTrendlines.length > 0 && result.resistanceTrendlines.length > 0) {
      const supportLine = result.supportTrendlines[0];
      const resistanceLine = result.resistanceTrendlines[0];
      
      // Check if lines are converging (wedge pattern)
      const isRisingWedge = supportLine.slope > 0 && resistanceLine.slope > 0 && 
                           supportLine.slope > resistanceLine.slope;
      const isFallingWedge = supportLine.slope < 0 && resistanceLine.slope < 0 && 
                            supportLine.slope < resistanceLine.slope;
      
      if (isRisingWedge) {
        console.log('📐 RISING WEDGE PATTERN DETECTED');
        console.log('  → Support line rising faster than resistance');
        console.log('  → Typically bearish - price squeeze upward');
        console.log('  → Watch for breakdown below support');
        console.log(`  → Support slope: ${supportLine.slope.toFixed(4)}`);
        console.log(`  → Resistance slope: ${resistanceLine.slope.toFixed(4)}`);
      } else if (isFallingWedge) {
        console.log('📐 FALLING WEDGE PATTERN DETECTED');
        console.log('  → Support line falling faster than resistance');
        console.log('  → Typically bullish - price squeeze downward');
        console.log('  → Watch for breakout above resistance');
        console.log(`  → Support slope: ${supportLine.slope.toFixed(4)}`);
        console.log(`  → Resistance slope: ${resistanceLine.slope.toFixed(4)}`);
      } else {
        console.log('No clear wedge pattern detected');
        console.log('  → Lines are not converging significantly');
      }
      console.log('');
    }
  } catch (error) {
    console.error('Error in wedge detection:', error);
  }

  console.log('=== Example Complete ===');
}

// Run the example
main().catch(console.error);
