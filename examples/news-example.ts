/**
 * Example demonstrating how to use the TradingDataClient to fetch news articles
 */

import { TradingDataClient } from '../libs/trading-data-client/src/index.js';

async function fetchNewsExample() {
  const client = new TradingDataClient();

  try {
    console.log('Fetching news for AAPL (Apple Inc.)...\n');

    // Fetch news for Apple Inc.
    const appleNews = await client.getNews({
      query: 'AAPL',
      count: 5, // Limit to 5 articles
    });

    console.log(`Found ${appleNews.length} news articles:\n`);

    appleNews.forEach((article, index) => {
      console.log(`${index + 1}. ${article.title}`);
      console.log(`   Publisher: ${article.publisher}`);
      console.log(`   Published: ${article.providerPublishTime.toLocaleString()}`);
      console.log(`   Link: ${article.link}`);
      
      if (article.relatedTickers && article.relatedTickers.length > 0) {
        console.log(`   Related Tickers: ${article.relatedTickers.join(', ')}`);
      }
      
      if (article.thumbnail) {
        console.log(`   Thumbnail: ${article.thumbnail.resolutions[0]?.url}`);
      }
      console.log('');
    });

    // Fetch news for forex pair
    console.log('\nFetching news for EUR/USD...\n');
    const forexNews = await client.getNews({
      query: 'EUR/USD',
      count: 3,
    });

    console.log(`Found ${forexNews.length} forex news articles:\n`);

    forexNews.forEach((article, index) => {
      console.log(`${index + 1}. ${article.title}`);
      console.log(`   Publisher: ${article.publisher}`);
      console.log(`   Published: ${article.providerPublishTime.toLocaleString()}`);
      console.log('');
    });

  } catch (error) {
    console.error('Error fetching news:', error);
  }
}

// Run the example
fetchNewsExample();
