/**
 * Example: Fetching 4-hour interval data using the trading-data-client
 * 
 * This example demonstrates how to use the TradingDataClient to fetch
 * 4-hour candle data. Since Yahoo Finance doesn't natively support 4-hour
 * intervals, the library automatically fetches 1-hour data and aggregates
 * it into 4-hour candles.
 */

import { TradingDataClient } from '@lc-trading-services/trading-data-client';

async function main() {
  // Create a new client instance
  const client = new TradingDataClient();

  console.log('=== 4-Hour Interval Example for Stocks ===\n');

  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30); // Last 30 days

    console.log('Fetching Apple (AAPL) 4-hour data for the last 30 days...');
    const data4h = await client.getHistoricalData({
      symbol: 'AAPL',
      startDate,
      endDate,
      interval: '4h',
    });

    console.log(`Retrieved ${data4h.length} 4-hour candles\n`);
    
    // Show the last 10 data points
    console.log('Last 10 4-hour candles:');
    data4h.slice(-10).forEach((point) => {
      const time = point.date.toISOString().split('T')[1].substring(0, 5);
      const date = point.date.toISOString().split('T')[0];
      console.log(
        `  ${date} ${time}: ` +
        `O=$${point.open.toFixed(2)}, ` +
        `H=$${point.high.toFixed(2)}, ` +
        `L=$${point.low.toFixed(2)}, ` +
        `C=$${point.close.toFixed(2)}, ` +
        `Vol=${(point.volume / 1000000).toFixed(2)}M`
      );
    });
  } catch (error) {
    console.error('Error fetching 4-hour data for AAPL:', error);
  }

  console.log('\n=== 4-Hour Interval Example for Forex ===\n');

  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 14); // Last 14 days

    console.log('Fetching EUR/USD 4-hour data for the last 14 days...');
    const data4h = await client.getHistoricalData({
      symbol: 'EUR/USD',
      startDate,
      endDate,
      interval: '4h',
    });

    console.log(`Retrieved ${data4h.length} 4-hour candles\n`);
    
    // Show the last 10 data points
    console.log('Last 10 4-hour candles:');
    data4h.slice(-10).forEach((point) => {
      const time = point.date.toISOString().split('T')[1].substring(0, 5);
      const date = point.date.toISOString().split('T')[0];
      console.log(
        `  ${date} ${time}: ` +
        `O=${point.open.toFixed(5)}, ` +
        `H=${point.high.toFixed(5)}, ` +
        `L=${point.low.toFixed(5)}, ` +
        `C=${point.close.toFixed(5)}`
      );
    });
  } catch (error) {
    console.error('Error fetching 4-hour data for EUR/USD:', error);
  }

  console.log('\n=== Comparing 1h vs 4h Intervals ===\n');

  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7); // Last 7 days

    console.log('Fetching Microsoft (MSFT) data for the last 7 days...\n');

    // Fetch 1-hour data
    const data1h = await client.getHistoricalData({
      symbol: 'MSFT',
      startDate,
      endDate,
      interval: '1h',
    });

    // Fetch 4-hour data
    const data4h = await client.getHistoricalData({
      symbol: 'MSFT',
      startDate,
      endDate,
      interval: '4h',
    });

    console.log(`1h interval: ${String(data1h.length).padStart(4)} candles`);
    console.log(`4h interval: ${String(data4h.length).padStart(4)} candles`);
    console.log(`\nRatio: ~${(data1h.length / data4h.length).toFixed(1)}:1`);
    console.log('(4h candles aggregate 4 hours of 1h data)\n');

    // Show how data is aggregated
    if (data4h.length > 0) {
      const latestCandle = data4h[data4h.length - 1];
      console.log('Latest 4-hour candle details:');
      console.log(`  Date: ${latestCandle.date.toISOString()}`);
      console.log(`  Open: $${latestCandle.open.toFixed(2)}`);
      console.log(`  High: $${latestCandle.high.toFixed(2)}`);
      console.log(`  Low: $${latestCandle.low.toFixed(2)}`);
      console.log(`  Close: $${latestCandle.close.toFixed(2)}`);
      console.log(`  Volume: ${(latestCandle.volume / 1000000).toFixed(2)}M`);
    }
  } catch (error) {
    console.error('Error comparing intervals:', error);
  }

  console.log('\n=== 4-Hour Candle Analysis ===\n');

  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 5); // Last 5 days

    console.log('Analyzing Bitcoin (BTC-USD) 4-hour candles...');
    const data = await client.getHistoricalData({
      symbol: 'BTC-USD',
      startDate,
      endDate,
      interval: '4h',
    });

    console.log(`Retrieved ${data.length} 4-hour candles\n`);

    if (data.length > 0) {
      // Calculate some basic statistics
      const prices = data.map(d => d.close);
      const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
      const maxPrice = Math.max(...prices);
      const minPrice = Math.min(...prices);
      
      // Calculate price ranges for each candle
      const ranges = data.map(d => d.high - d.low);
      const avgRange = ranges.reduce((a, b) => a + b, 0) / ranges.length;
      const maxRange = Math.max(...ranges);
      
      console.log('4-Hour Candle Statistics:');
      console.log(`  Average Close: $${avgPrice.toFixed(2)}`);
      console.log(`  High: $${maxPrice.toFixed(2)}`);
      console.log(`  Low: $${minPrice.toFixed(2)}`);
      console.log(`  Price Range: $${(maxPrice - minPrice).toFixed(2)}`);
      console.log(`  Average Candle Range: $${avgRange.toFixed(2)}`);
      console.log(`  Maximum Candle Range: $${maxRange.toFixed(2)}`);
      
      console.log(`\nFirst 3 candles:`);
      data.slice(0, 3).forEach((point) => {
        const time = point.date.toISOString().split('T')[1].substring(0, 5);
        const date = point.date.toISOString().split('T')[0];
        const range = point.high - point.low;
        console.log(
          `  ${date} ${time}: $${point.close.toFixed(2)} (range: $${range.toFixed(2)})`
        );
      });
    }
  } catch (error) {
    console.error('Error analyzing 4-hour data:', error);
  }
}

// Run the example
main().catch(console.error);
