/**
 * Example: Fetching Cryptocurrency data using the trading-data-client
 * 
 * This example demonstrates how to use the TradingDataClient to fetch
 * current quotes and historical data for cryptocurrencies.
 */

import { TradingDataClient } from '@lc-trading-services/trading-data-client';

async function main() {
  // Create a new client instance
  const client = new TradingDataClient();

  console.log('=== Cryptocurrency Quote Example ===\n');

  // Fetch current quote for Bitcoin
  try {
    const btcQuote = await client.getQuote('BTC-USD');
    console.log('Bitcoin (BTC-USD) Current Quote:');
    console.log(`  Price: $${btcQuote.price.toLocaleString()}`);
    console.log(`  Previous Close: $${btcQuote.previousClose?.toLocaleString()}`);
    console.log(`  Day High: $${btcQuote.dayHigh?.toLocaleString()}`);
    console.log(`  Day Low: $${btcQuote.dayLow?.toLocaleString()}`);
    console.log(`  Volume: ${btcQuote.volume?.toLocaleString()}`);
    console.log(`  Market Cap: $${btcQuote.marketCap?.toLocaleString()}`);
    console.log(`  Timestamp: ${btcQuote.timestamp}`);
    console.log('');
  } catch (error) {
    console.error('Error fetching Bitcoin quote:', error);
  }

  console.log('=== Multiple Cryptocurrencies ===\n');

  // Fetch quotes for multiple cryptocurrencies (all use -USD suffix)
  const cryptos = ['BTC-USD', 'ETH-USD', 'BNB-USD', 'XRP-USD', 'ADA-USD'];
  
  for (const symbol of cryptos) {
    try {
      const quote = await client.getQuote(symbol);
      const name = symbol.replace('-USD', '');
      console.log(`${name.padEnd(6)}: $${quote.price?.toLocaleString() ?? '0'}`);
    } catch (error) {
      console.error(`Error fetching ${symbol}:`, error);
    }
  }

  console.log('\n=== Historical Data Example ===\n');

  // Fetch historical data for Ethereum
  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30); // Last 30 days

    console.log('Fetching Ethereum (ETH-USD) daily data for the last 30 days...');
    const historicalData = await client.getHistoricalData({
      symbol: 'ETH-USD',
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

  console.log('\n=== Price Analysis Example ===\n');

  // Calculate simple price statistics for Bitcoin over the last 7 days
  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7); // Last 7 days

    console.log('Analyzing Bitcoin (BTC-USD) price for the last 7 days...');
    const data = await client.getHistoricalData({
      symbol: 'BTC-USD',
      startDate,
      endDate,
      interval: '1d',
    });

    if (data.length > 0) {
      const prices = data.map(d => d.close);
      const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
      const maxPrice = Math.max(...prices);
      const minPrice = Math.min(...prices);
      const priceChange = data[data.length - 1].close - data[0].close;
      const priceChangePercent = (priceChange / data[0].close) * 100;

      console.log(`\nPrice Statistics (${data.length} days):`);
      console.log(`  Average Price: $${avgPrice.toFixed(2)}`);
      console.log(`  Highest Price: $${maxPrice.toFixed(2)}`);
      console.log(`  Lowest Price: $${minPrice.toFixed(2)}`);
      console.log(`  Price Range: $${(maxPrice - minPrice).toFixed(2)}`);
      console.log(`  Price Change: $${priceChange.toFixed(2)} (${priceChangePercent.toFixed(2)}%)`);
    }
  } catch (error) {
    console.error('Error fetching data for analysis:', error);
  }
}

// Run the example
main().catch(console.error);
