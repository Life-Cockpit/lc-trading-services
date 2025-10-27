/**
 * Example: Using Support and Resistance zones
 * 
 * This example demonstrates how to identify key support and resistance levels
 */

import { TradingIndicators } from '@lc-trading-services/trading-indicators';

async function main() {
  const indicators = new TradingIndicators();

  console.log('=== Support and Resistance Zones Example ===\n');

  // Calculate support and resistance zones for daily interval
  try {
    console.log('Identifying Support/Resistance zones for Apple (AAPL) - Daily:');
    const result = await indicators.supportResistance.calculateSupportResistance('AAPL', '1d');
    
    console.log(`\nFound ${result.zones.length} key zones:`);
    console.log('═'.repeat(70));
    
    result.zones.forEach((zone, index) => {
      console.log(`\nZone ${index + 1}: $${zone.level.toFixed(2)}`);
      console.log(`  Strength: ${(zone.strength * 100).toFixed(1)}% | Touches: ${zone.totalTouches}`);
      console.log(`  Support: ${zone.supportCount} times | Resistance: ${zone.resistanceCount} times`);
      
      // Determine zone type
      if (zone.supportCount > zone.resistanceCount * 1.5) {
        console.log(`  Type: 🟢 STRONG SUPPORT ZONE`);
      } else if (zone.resistanceCount > zone.supportCount * 1.5) {
        console.log(`  Type: 🔴 STRONG RESISTANCE ZONE`);
      } else {
        console.log(`  Type: 🟡 NEUTRAL/PIVOT ZONE`);
      }
    });
    
    console.log('\n' + '═'.repeat(70));
    console.log('');
  } catch (error) {
    console.error('Error calculating support/resistance zones:', error);
  }

  // Calculate for hourly interval
  try {
    console.log('Identifying Support/Resistance zones for EUR/USD - Hourly:');
    const result = await indicators.supportResistance.calculateSupportResistance('EURUSD', '1h');
    
    console.log(`\nFound ${result.zones.length} intraday zones:`);
    
    result.zones.slice(0, 5).forEach((zone, index) => {
      const pips = (zone.level * 10000).toFixed(0);
      console.log(`\n  ${index + 1}. Level: ${zone.level.toFixed(5)} (${pips} pips)`);
      console.log(`     Strength: ${(zone.strength * 100).toFixed(1)}% | S:${zone.supportCount} R:${zone.resistanceCount}`);
    });
    console.log('');
  } catch (error) {
    console.error('Error calculating hourly zones:', error);
  }

  // Trading strategy example
  console.log('=== Trading Strategy Using Support/Resistance ===\n');
  
  try {
    const symbol = 'AAPL';
    const result = await indicators.supportResistance.calculateSupportResistance(symbol, '1d');
    
    const currentPrice = 150; // Example current price
    
    console.log(`${symbol} Trading Analysis (Current Price: $${currentPrice}):`);
    console.log('');
    
    // Find nearest support zones
    const supportZones = result.zones
      .filter(z => z.level < currentPrice && z.supportCount > 0)
      .sort((a, b) => b.level - a.level);
    
    // Find nearest resistance zones
    const resistanceZones = result.zones
      .filter(z => z.level > currentPrice && z.resistanceCount > 0)
      .sort((a, b) => a.level - b.level);
    
    console.log('Key Support Levels Below:');
    supportZones.slice(0, 3).forEach((zone, index) => {
      const distance = currentPrice - zone.level;
      const pctDistance = (distance / currentPrice * 100);
      console.log(`  ${index + 1}. $${zone.level.toFixed(2)} (-${pctDistance.toFixed(2)}%, ${zone.supportCount} touches)`);
      console.log(`     Strength: ${(zone.strength * 100).toFixed(0)}%`);
    });
    
    console.log('\nKey Resistance Levels Above:');
    resistanceZones.slice(0, 3).forEach((zone, index) => {
      const distance = zone.level - currentPrice;
      const pctDistance = (distance / currentPrice * 100);
      console.log(`  ${index + 1}. $${zone.level.toFixed(2)} (+${pctDistance.toFixed(2)}%, ${zone.resistanceCount} touches)`);
      console.log(`     Strength: ${(zone.strength * 100).toFixed(0)}%`);
    });
    
    // Trading recommendations
    console.log('\nTrading Recommendations:');
    
    if (supportZones.length > 0 && resistanceZones.length > 0) {
      const nearestSupport = supportZones[0];
      const nearestResistance = resistanceZones[0];
      
      console.log(`\n  For Long Positions:`);
      console.log(`    Entry: Consider buying near $${nearestSupport.level.toFixed(2)} support`);
      console.log(`    Stop Loss: Below $${(nearestSupport.level * 0.98).toFixed(2)}`);
      console.log(`    Target: $${nearestResistance.level.toFixed(2)} resistance`);
      
      const riskReward = (nearestResistance.level - nearestSupport.level) / 
                         (nearestSupport.level * 0.02);
      console.log(`    Risk/Reward Ratio: ${riskReward.toFixed(2)}:1`);
      
      console.log(`\n  For Short Positions:`);
      console.log(`    Entry: Consider selling near $${nearestResistance.level.toFixed(2)} resistance`);
      console.log(`    Stop Loss: Above $${(nearestResistance.level * 1.02).toFixed(2)}`);
      console.log(`    Target: $${nearestSupport.level.toFixed(2)} support`);
    }
    
    console.log('');
  } catch (error) {
    console.error('Error in trading strategy example:', error);
  }

  // Compare zones across different symbols
  console.log('=== Comparing Zone Strength Across Symbols ===\n');
  
  const symbols = ['AAPL', 'MSFT', 'GOOGL'];
  
  for (const symbol of symbols) {
    try {
      const result = await indicators.supportResistance.calculateSupportResistance(symbol, '1d', 50);
      
      const avgStrength = result.zones.reduce((sum, z) => sum + z.strength, 0) / result.zones.length;
      const avgTouches = result.zones.reduce((sum, z) => sum + z.totalTouches, 0) / result.zones.length;
      
      console.log(`${symbol.padEnd(6)}:`);
      console.log(`  Zones Found: ${result.zones.length}`);
      console.log(`  Avg Strength: ${(avgStrength * 100).toFixed(1)}%`);
      console.log(`  Avg Touches: ${avgTouches.toFixed(1)}`);
      console.log('');
    } catch (error) {
      console.error(`Error for ${symbol}:`, error);
    }
  }

  // Advanced analysis: Zone clustering
  console.log('=== Zone Clustering Analysis ===\n');
  
  try {
    const result = await indicators.supportResistance.calculateSupportResistance('AAPL', '1d');
    
    // Group zones by proximity (within 5%)
    const clusters: Array<{ center: number; zones: typeof result.zones }> = [];
    
    result.zones.forEach(zone => {
      let addedToCluster = false;
      
      for (const cluster of clusters) {
        const pctDiff = Math.abs(zone.level - cluster.center) / cluster.center;
        if (pctDiff < 0.05) {
          cluster.zones.push(zone);
          addedToCluster = true;
          break;
        }
      }
      
      if (!addedToCluster) {
        clusters.push({ center: zone.level, zones: [zone] });
      }
    });
    
    console.log('Zone Clusters (zones within 5% of each other):');
    console.log('');
    
    clusters
      .filter(c => c.zones.length > 1)
      .forEach((cluster, index) => {
        const avgLevel = cluster.zones.reduce((sum, z) => sum + z.level, 0) / cluster.zones.length;
        const totalTouches = cluster.zones.reduce((sum, z) => sum + z.totalTouches, 0);
        const totalSupport = cluster.zones.reduce((sum, z) => sum + z.supportCount, 0);
        const totalResistance = cluster.zones.reduce((sum, z) => sum + z.resistanceCount, 0);
        
        console.log(`Cluster ${index + 1}: $${avgLevel.toFixed(2)}`);
        console.log(`  Contains ${cluster.zones.length} zones`);
        console.log(`  Total Touches: ${totalTouches}`);
        console.log(`  Support: ${totalSupport} | Resistance: ${totalResistance}`);
        console.log(`  → ${cluster.zones.length > 2 ? 'VERY STRONG' : 'STRONG'} level`);
        console.log('');
      });
  } catch (error) {
    console.error('Error in clustering analysis:', error);
  }

  // Custom parameters example
  console.log('=== Using Custom Parameters ===\n');
  
  try {
    console.log('Comparing different lookback periods for AAPL:');
    
    // Short-term analysis
    const shortTerm = await indicators.supportResistance.calculateSupportResistance('AAPL', '1d', 50);
    console.log(`\n  50-day lookback: ${shortTerm.zones.length} zones found`);
    
    // Long-term analysis
    const longTerm = await indicators.supportResistance.calculateSupportResistance('AAPL', '1d', 200);
    console.log(`  200-day lookback: ${longTerm.zones.length} zones found`);
    
    console.log('\n  → Long-term zones are typically more significant');
    console.log('  → Short-term zones are useful for day trading');
    console.log('');
  } catch (error) {
    console.error('Error with custom parameters:', error);
  }

  // Breakout detection
  console.log('=== Potential Breakout Detection ===\n');
  
  try {
    const result = await indicators.supportResistance.calculateSupportResistance('AAPL', '1d');
    const currentPrice = 150; // Example current price
    
    // Find zones very close to current price (within 2%)
    const nearbyZones = result.zones.filter(z => {
      const pctDiff = Math.abs(z.level - currentPrice) / currentPrice;
      return pctDiff < 0.02;
    });
    
    if (nearbyZones.length > 0) {
      console.log(`Price is near ${nearbyZones.length} key zone(s):`);
      console.log('');
      
      nearbyZones.forEach(zone => {
        const direction = zone.level > currentPrice ? 'above' : 'below';
        console.log(`  $${zone.level.toFixed(2)} (${direction})`);
        console.log(`    Strength: ${(zone.strength * 100).toFixed(0)}%`);
        
        if (zone.resistanceCount > zone.supportCount) {
          console.log(`    ⚠️  Strong resistance - potential breakout area`);
          console.log(`    Watch for: Price breaking above $${zone.level.toFixed(2)}`);
        } else {
          console.log(`    ⚠️  Strong support - potential breakdown area`);
          console.log(`    Watch for: Price breaking below $${zone.level.toFixed(2)}`);
        }
        console.log('');
      });
    } else {
      console.log('  No significant zones near current price');
      console.log('  → Price in "no man\'s land" between levels');
    }
  } catch (error) {
    console.error('Error in breakout detection:', error);
  }
}

// Run the example
main().catch(console.error);
