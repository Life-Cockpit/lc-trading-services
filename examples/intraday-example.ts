/**
 * Example: Fetching Intraday data using the trading-data-client
 * 
 * This example demonstrates how to use the TradingDataClient to fetch
 * intraday data at various time intervals (1m, 5m, 15m, 30m, 1h).
 */

import { TradingDataClient } from '@lc-trading-services/trading-data-client';

async function main() {
  // Create a new client instance
  const client = new TradingDataClient();

  console.log('=== 5-Minute Interval Example ===\n');

  // Fetch 5-minute interval data for Apple for the last 7 days
  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7); // Last 7 days

    console.log('Fetching Apple (AAPL) 5-minute data for the last 7 days...');
    const data5m = await client.getHistoricalData({
      symbol: 'AAPL',
      startDate,
      endDate,
      interval: '5m',
    });

    console.log(`Retrieved ${data5m.length} 5-minute candles\n`);
    
    // Show the last 10 data points
    console.log('Last 10 5-minute candles:');
    data5m.slice(-10).forEach((point) => {
      const time = point.date.toISOString().split('T')[1].substring(0, 5);
      const date = point.date.toISOString().split('T')[0];
      console.log(
        `  ${date} ${time}: ` +
        `O=$${point.open.toFixed(2)}, ` +
        `H=$${point.high.toFixed(2)}, ` +
        `L=$${point.low.toFixed(2)}, ` +
        `C=$${point.close.toFixed(2)}`
      );
    });
  } catch (error) {
    console.error('Error fetching 5-minute data:', error);
  }

  console.log('\n=== 1-Hour Interval Example ===\n');

  // Fetch 1-hour interval data for EUR/USD for the last 30 days
  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30); // Last 30 days

    console.log('Fetching EUR/USD 1-hour data for the last 30 days...');
    const data1h = await client.getHistoricalData({
      symbol: 'EURUSD=X',
      startDate,
      endDate,
      interval: '1h',
    });

    console.log(`Retrieved ${data1h.length} 1-hour candles\n`);
    
    // Show the last 10 data points
    console.log('Last 10 1-hour candles:');
    data1h.slice(-10).forEach((point) => {
      const time = point.date.toISOString().split('T')[1].substring(0, 5);
      const date = point.date.toISOString().split('T')[0];
      console.log(
        `  ${date} ${time}: ` +
        `O=${point.open.toFixed(4)}, ` +
        `H=${point.high.toFixed(4)}, ` +
        `L=${point.low.toFixed(4)}, ` +
        `C=${point.close.toFixed(4)}`
      );
    });
  } catch (error) {
    console.error('Error fetching 1-hour data:', error);
  }

  console.log('\n=== Comparing Different Intervals ===\n');

  // Compare data points retrieved for different intervals
  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 5); // Last 5 days

    console.log('Fetching Microsoft (MSFT) data for the last 5 days at different intervals...\n');

    const intervals = ['1m', '5m', '15m', '30m', '1h'] as const;
    
    for (const interval of intervals) {
      const data = await client.getHistoricalData({
        symbol: 'MSFT',
        startDate,
        endDate,
        interval,
      });
      
      console.log(`${interval.padEnd(4)} interval: ${data.length.toString().padStart(4)} candles`);
    }
  } catch (error) {
    console.error('Error comparing intervals:', error);
  }

  console.log('\n=== Intraday Volatility Analysis ===\n');

  // Calculate intraday volatility for a stock
  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 1); // Last 1 day

    console.log('Analyzing Tesla (TSLA) intraday volatility (15-minute data)...');
    const data = await client.getHistoricalData({
      symbol: 'TSLA',
      startDate,
      endDate,
      interval: '15m',
    });

    console.log(`Retrieved ${data.length} 15-minute candles\n`);

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
      
      console.log('Intraday Statistics:');
      console.log(`  Average Close: $${avgPrice.toFixed(2)}`);
      console.log(`  High: $${maxPrice.toFixed(2)}`);
      console.log(`  Low: $${minPrice.toFixed(2)}`);
      console.log(`  Intraday Range: $${(maxPrice - minPrice).toFixed(2)}`);
      console.log(`  Average Candle Range: $${avgRange.toFixed(2)}`);
      console.log(`  Maximum Candle Range: $${maxRange.toFixed(2)}`);
      
      console.log(`\nFirst 5 candles:`);
      data.slice(0, 5).forEach((point) => {
        const time = point.date.toISOString().split('T')[1].substring(0, 5);
        const range = point.high - point.low;
        console.log(
          `  ${time}: $${point.close.toFixed(2)} (range: $${range.toFixed(2)})`
        );
      });
    }
  } catch (error) {
    console.error('Error fetching intraday data:', error);
  }
}

// Run the example
main().catch(console.error);
