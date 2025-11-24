import { TradingIndicators, PivotPointsService } from '@lc-trading-services/trading-indicators';

/**
 * Example: Pivot Points Calculation
 * 
 * This example demonstrates how to use the Pivot Points indicator to identify
 * potential support and resistance levels based on the previous period's price action.
 * 
 * Pivot Points are calculated using:
 * - Pivot Point (PP) = (High + Low + Close) / 3
 * - Resistance levels (R1, R2, R3) above the pivot
 * - Support levels (S1, S2, S3) below the pivot
 * 
 * Traders use these levels to:
 * - Identify potential reversal points
 * - Set profit targets
 * - Place stop-loss orders
 * - Gauge market sentiment
 */

async function main() {
  console.log('=== Pivot Points Calculation Examples ===\n');

  // Create trading indicators instance
  const indicators = new TradingIndicators();

  // Example 1: Calculate daily pivot points for a stock
  console.log('Example 1: Calculate Daily Pivot Points for Apple (AAPL)');
  try {
    const applePivots = await indicators.pivotPoints.calculatePivotPoints('AAPL');
    console.log('Apple (AAPL) Pivot Points:');
    console.log(`  Pivot Point: ${applePivots.pivotPoint}`);
    console.log(`  Resistance 1 (R1): ${applePivots.r1}`);
    console.log(`  Resistance 2 (R2): ${applePivots.r2}`);
    console.log(`  Resistance 3 (R3): ${applePivots.r3}`);
    console.log(`  Support 1 (S1): ${applePivots.s1}`);
    console.log(`  Support 2 (S2): ${applePivots.s2}`);
    console.log(`  Support 3 (S3): ${applePivots.s3}`);
    console.log(`  Previous High: ${applePivots.previousHigh}`);
    console.log(`  Previous Low: ${applePivots.previousLow}`);
    console.log(`  Previous Close: ${applePivots.previousClose}`);
    console.log(`  Timestamp: ${applePivots.timestamp.toISOString()}`);
  } catch (error) {
    console.error('Error calculating pivot points for AAPL:', error);
  }

  console.log('\n---\n');

  // Example 2: Calculate hourly pivot points for Forex
  console.log('Example 2: Calculate Hourly Pivot Points for EUR/USD');
  try {
    const eurusdPivots = await indicators.pivotPoints.calculatePivotPoints('EURUSD', '1h');
    console.log('EUR/USD Pivot Points (Hourly):');
    console.log(`  Pivot Point: ${eurusdPivots.pivotPoint}`);
    console.log(`  R1: ${eurusdPivots.r1} | R2: ${eurusdPivots.r2} | R3: ${eurusdPivots.r3}`);
    console.log(`  S1: ${eurusdPivots.s1} | S2: ${eurusdPivots.s2} | S3: ${eurusdPivots.s3}`);
  } catch (error) {
    console.error('Error calculating pivot points for EURUSD:', error);
  }

  console.log('\n---\n');

  // Example 3: Calculate pivot points for cryptocurrency
  console.log('Example 3: Calculate Pivot Points for Bitcoin');
  try {
    const btcPivots = await indicators.pivotPoints.calculatePivotPoints('BTC-USD');
    console.log('Bitcoin (BTC-USD) Pivot Points:');
    console.log(`  Pivot Point: ${btcPivots.pivotPoint}`);
    console.log(`  R1: ${btcPivots.r1} | R2: ${btcPivots.r2} | R3: ${btcPivots.r3}`);
    console.log(`  S1: ${btcPivots.s1} | S2: ${btcPivots.s2} | S3: ${btcPivots.s3}`);
  } catch (error) {
    console.error('Error calculating pivot points for BTC-USD:', error);
  }

  console.log('\n---\n');

  // Example 4: Using PivotPointsService directly with TradingDataClient
  console.log('Example 4: Using PivotPointsService directly with TradingDataClient');
  try {
    const { TradingDataClient } = await import('@lc-trading-services/trading-data-client');
    const dataClient = new TradingDataClient();
    const pivotPointsService = new PivotPointsService(dataClient);
    const msftPivots = await pivotPointsService.calculatePivotPoints('MSFT');
    console.log('Microsoft (MSFT) Pivot Points:');
    console.log(`  Pivot Point: ${msftPivots.pivotPoint}`);
    console.log(`  R1: ${msftPivots.r1} | S1: ${msftPivots.s1}`);
  } catch (error) {
    console.error('Error calculating pivot points for MSFT:', error);
  }

  console.log('\n---\n');

  // Example 5: Trading strategy demonstration
  console.log('Example 5: Pivot Points Trading Strategy Example');
  try {
    const pivots = await indicators.pivotPoints.calculatePivotPoints('AAPL');
    
    // Simulate current price (in real scenario, get from getQuote)
    const currentPrice = pivots.previousClose * 1.01; // Simulate 1% price increase
    
    console.log(`Current Price: ${currentPrice.toFixed(2)}`);
    console.log(`Pivot Point: ${pivots.pivotPoint}`);
    
    // Determine market bias
    if (currentPrice > pivots.pivotPoint) {
      console.log('\n💹 Market Bias: BULLISH (Price above Pivot Point)');
      console.log('Trading Strategy:');
      console.log('  - Look for buying opportunities on dips to the pivot point');
      console.log(`  - First target: R1 at ${pivots.r1}`);
      console.log(`  - Second target: R2 at ${pivots.r2}`);
      console.log(`  - Third target: R3 at ${pivots.r3}`);
      console.log(`  - Stop-loss: Below ${pivots.s1}`);
    } else {
      console.log('\n📉 Market Bias: BEARISH (Price below Pivot Point)');
      console.log('Trading Strategy:');
      console.log('  - Look for selling opportunities on rallies to the pivot point');
      console.log(`  - First target: S1 at ${pivots.s1}`);
      console.log(`  - Second target: S2 at ${pivots.s2}`);
      console.log(`  - Third target: S3 at ${pivots.s3}`);
      console.log(`  - Stop-loss: Above ${pivots.r1}`);
    }
    
    // Calculate distance from pivot point
    const distanceFromPivot = ((currentPrice - pivots.pivotPoint) / pivots.pivotPoint * 100).toFixed(2);
    console.log(`\n📊 Price is ${distanceFromPivot}% from Pivot Point`);
    
  } catch (error) {
    console.error('Error in trading strategy example:', error);
  }

  console.log('\n---\n');

  // Example 6: Compare pivot points for multiple stocks
  console.log('Example 6: Compare Pivot Points for Multiple Tech Stocks');
  const symbols = ['AAPL', 'MSFT', 'GOOGL'];
  
  console.log('Tech Stocks Pivot Points Comparison:');
  console.log('Symbol | Pivot Point | R1      | S1      | Range');
  console.log('-------|-------------|---------|---------|-------');
  
  for (const symbol of symbols) {
    try {
      const pivots = await indicators.pivotPoints.calculatePivotPoints(symbol);
      const range = (pivots.previousHigh - pivots.previousLow).toFixed(2);
      console.log(
        `${symbol.padEnd(6)} | ${pivots.pivotPoint.toString().padEnd(11)} | ` +
        `${pivots.r1.toString().padEnd(7)} | ${pivots.s1.toString().padEnd(7)} | ${range}`
      );
    } catch (error) {
      console.log(`${symbol.padEnd(6)} | Error       | Error   | Error   | Error`);
    }
  }

  console.log('\n---\n');

  // Example 7: Pivot points trading concepts
  console.log('Example 7: Pivot Points Trading Concepts');
  console.log('\nKey Pivot Points Trading Strategies:');
  console.log('1. Pivot Point Bounce: Buy near support levels, sell near resistance levels');
  console.log('2. Pivot Point Break: Trade breakouts above resistance or below support');
  console.log('3. Pivot Point Range: Trade within S1-R1 range in sideways markets');
  console.log('4. Multi-Timeframe: Use daily pivots for direction, hourly for entry/exit');
  console.log('\nPivot Level Strength:');
  console.log('- R3/S3: Strong resistance/support, rarely reached');
  console.log('- R2/S2: Moderate resistance/support');
  console.log('- R1/S1: First targets, frequently tested');
  console.log('- PP: Central level, indicates market sentiment');
  console.log('\nBest Practices:');
  console.log('✓ Combine with other indicators (RSI, MACD) for confirmation');
  console.log('✓ Use volume analysis to validate breakouts');
  console.log('✓ Consider market conditions (trending vs ranging)');
  console.log('✓ Adjust timeframes based on trading style (day vs swing trading)');
  console.log('✓ Always use proper risk management and stop-losses');

  console.log('\n=== Examples Complete ===\n');
}

// Run the examples
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
