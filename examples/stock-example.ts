/**
 * Example: Fetching Stock data using the trading-data-client
 * 
 * This example demonstrates how to use the TradingDataClient to fetch
 * current quotes and historical data for stocks.
 */

import { TradingDataClient } from '@lc-trading-services/trading-data-client';

async function main() {
  // Create a new client instance
  const client = new TradingDataClient();

  console.log('=== Stock Quote Example ===\n');

  // Fetch current quote for Apple
  try {
    const appleQuote = await client.getQuote('AAPL');
    console.log('Apple (AAPL) Current Quote:');
    console.log(`  Price: $${appleQuote.price}`);
    console.log(`  Previous Close: $${appleQuote.previousClose}`);
    console.log(`  Open: $${appleQuote.open}`);
    console.log(`  Day High: $${appleQuote.dayHigh}`);
    console.log(`  Day Low: $${appleQuote.dayLow}`);
    console.log(`  Volume: ${appleQuote.volume?.toLocaleString()}`);
    console.log(`  Market Cap: $${appleQuote.marketCap?.toLocaleString()}`);
    console.log(`  Timestamp: ${appleQuote.timestamp}`);
    console.log('');
  } catch (error) {
    console.error('Error fetching Apple quote:', error);
  }

  console.log('=== Multiple Stocks ===\n');

  // Fetch quotes for multiple stocks
  const stocks = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA'];
  
  for (const symbol of stocks) {
    try {
      const quote = await client.getQuote(symbol);
      console.log(`${symbol.padEnd(6)}: $${quote.price.toFixed(2)}`);
    } catch (error) {
      console.error(`Error fetching ${symbol}:`, error);
    }
  }

  console.log('\n=== Historical Data Example ===\n');

  // Fetch historical data for Microsoft
  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30); // Last 30 days

    console.log('Fetching Microsoft (MSFT) daily data for the last 30 days...');
    const historicalData = await client.getHistoricalData({
      symbol: 'MSFT',
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
        `Open=$${point.open.toFixed(2)}, ` +
        `High=$${point.high.toFixed(2)}, ` +
        `Low=$${point.low.toFixed(2)}, ` +
        `Close=$${point.close.toFixed(2)}, ` +
        `Volume=${point.volume.toLocaleString()}`
      );
    });

    console.log('\nLast 5 data points:');
    historicalData.slice(-5).forEach((point) => {
      console.log(
        `  ${point.date.toISOString().split('T')[0]}: ` +
        `Open=$${point.open.toFixed(2)}, ` +
        `High=$${point.high.toFixed(2)}, ` +
        `Low=$${point.low.toFixed(2)}, ` +
        `Close=$${point.close.toFixed(2)}, ` +
        `Volume=${point.volume.toLocaleString()}`
      );
    });
  } catch (error) {
    console.error('Error fetching historical data:', error);
  }

  console.log('\n=== Weekly Data Example ===\n');

  // Fetch weekly data for Tesla for the last 90 days
  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 90); // Last 90 days

    console.log('Fetching Tesla (TSLA) weekly data for the last 90 days...');
    const weeklyData = await client.getHistoricalData({
      symbol: 'TSLA',
      startDate,
      endDate,
      interval: '1wk',
    });

    console.log(`Retrieved ${weeklyData.length} weekly data points\n`);
    
    weeklyData.forEach((point) => {
      console.log(
        `  ${point.date.toISOString().split('T')[0]}: ` +
        `Open=$${point.open.toFixed(2)}, ` +
        `Close=$${point.close.toFixed(2)}`
      );
    });
  } catch (error) {
    console.error('Error fetching weekly data:', error);
  }
}

// Run the example
main().catch(console.error);
