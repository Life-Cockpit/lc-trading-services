/**
 * Normalizes trading symbols to Yahoo Finance format
 * Supports multiple input formats for better user experience
 */

/**
 * Normalize a trading symbol to Yahoo Finance format
 * 
 * Supported input formats:
 * - Forex pairs: "EURUSD", "EUR/USD" -> "EURUSD=X"
 * - Stocks: "AAPL" -> "AAPL" (unchanged)
 * - Crypto: "BTC-USD" -> "BTC-USD" (unchanged)
 * - Already formatted: "EURUSD=X" -> "EURUSD=X" (unchanged)
 * 
 * @param symbol - The trading symbol in any supported format
 * @returns The symbol in Yahoo Finance format
 */
export function normalizeSymbol(symbol: string): string {
  // Remove any whitespace
  const trimmedSymbol = symbol.trim();
  
  // If already in Yahoo Finance format (contains =X or -), return as is
  if (trimmedSymbol.includes('=X') || trimmedSymbol.includes('-')) {
    return trimmedSymbol;
  }
  
  // Handle forex pairs with slash (e.g., "EUR/USD")
  if (trimmedSymbol.includes('/')) {
    const withoutSlash = trimmedSymbol.replaceAll('/', '');
    return `${withoutSlash}=X`;
  }
  
  // Check if it's a forex pair (6 uppercase letters, common currency codes)
  // Common forex pattern: XXXYYY where XXX and YYY are 3-letter currency codes
  // Only process uppercase symbols to avoid false positives with stock tickers
  const forexPattern = /^[A-Z]{6}$/;
  if (forexPattern.test(trimmedSymbol)) {
    // Verify it looks like a forex pair by checking common currency codes
    const baseCurrency = trimmedSymbol.substring(0, 3);
    const quoteCurrency = trimmedSymbol.substring(3, 6);
    
    // List of common currency codes
    const commonCurrencies = new Set([
      'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'SEK', 'NZD',
      'MXN', 'SGD', 'HKD', 'NOK', 'KRW', 'TRY', 'INR', 'RUB', 'BRL', 'ZAR'
    ]);
    
    if (commonCurrencies.has(baseCurrency) && commonCurrencies.has(quoteCurrency)) {
      return `${trimmedSymbol}=X`;
    }
  }
  
  // For everything else (stocks, ETFs, etc.), return as is
  return trimmedSymbol;
}
