/**
 * Example: Fetching Forex data using the trading-data-client
 * 
 * This example demonstrates how to use the YahooFinanceClient to fetch
 * current quotes and historical data for Forex pairs.
 */

import { YahooFinanceClient } from '@lc-trading-services/trading-data-client';

async function main() {
  // Create a new client instance
  const client = new YahooFinanceClient();

  console.log('=== Forex Quote Example ===\n');

  // Fetch current quote for EUR/USD
  try {
    const eurUsdQuote = await client.getQuote('EURUSD=X');
    console.log('EUR/USD Current Quote:');
    console.log(`  Price: ${eurUsdQuote.price}`);
    console.log(`  Previous Close: ${eurUsdQuote.previousClose}`);
    console.log(`  Day High: ${eurUsdQuote.dayHigh}`);
    console.log(`  Day Low: ${eurUsdQuote.dayLow}`);
    console.log(`  Timestamp: ${eurUsdQuote.timestamp}`);
    console.log('');
  } catch (error) {
    console.error('Error fetching EUR/USD quote:', error);
  }

  console.log('=== Multiple Forex Pairs ===\n');

  // Fetch quotes for multiple Forex pairs
  const forexPairs = ['EURUSD=X', 'GBPUSD=X', 'USDJPY=X', 'AUDUSD=X'];
  
  for (const pair of forexPairs) {
    try {
      const quote = await client.getQuote(pair);
      console.log(`${pair}: ${quote.price}`);
    } catch (error) {
      console.error(`Error fetching ${pair}:`, error);
    }
  }

  console.log('\n=== Historical Data Example ===\n');

  // Fetch historical data for EUR/USD
  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30); // Last 30 days

    console.log('Fetching EUR/USD daily data for the last 30 days...');
    const historicalData = await client.getHistoricalData({
      symbol: 'EURUSD=X',
      startDate,
      endDate,
      interval: '1d',
    });

    console.log(`Retrieved ${historicalData.length} data points\n`);
    
    // Display the first 5 and last 5 data points
    console.log('First 5 data points:');
    historicalData.slice(0, 5).forEach((point) => {
      console.log(
        `  ${point.date.toISOString().split('T')[0]}: ` +
        `Open=${point.open.toFixed(4)}, ` +
        `High=${point.high.toFixed(4)}, ` +
        `Low=${point.low.toFixed(4)}, ` +
        `Close=${point.close.toFixed(4)}`
      );
    });

    console.log('\nLast 5 data points:');
    historicalData.slice(-5).forEach((point) => {
      console.log(
        `  ${point.date.toISOString().split('T')[0]}: ` +
        `Open=${point.open.toFixed(4)}, ` +
        `High=${point.high.toFixed(4)}, ` +
        `Low=${point.low.toFixed(4)}, ` +
        `Close=${point.close.toFixed(4)}`
      );
    });
  } catch (error) {
    console.error('Error fetching historical data:', error);
  }
}

// Run the example
main().catch(console.error);
