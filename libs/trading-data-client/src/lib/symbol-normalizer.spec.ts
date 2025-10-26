import { normalizeSymbol } from './symbol-normalizer';

describe('normalizeSymbol', () => {
  describe('Forex pairs', () => {
    it('should convert simple forex pair format to Yahoo Finance format', () => {
      expect(normalizeSymbol('EURUSD')).toBe('EURUSD=X');
      expect(normalizeSymbol('GBPUSD')).toBe('GBPUSD=X');
      expect(normalizeSymbol('USDJPY')).toBe('USDJPY=X');
    });

    it('should convert forex pair with slash to Yahoo Finance format', () => {
      expect(normalizeSymbol('EUR/USD')).toBe('EURUSD=X');
      expect(normalizeSymbol('GBP/USD')).toBe('GBPUSD=X');
      expect(normalizeSymbol('USD/JPY')).toBe('USDJPY=X');
    });

    it('should handle various forex pairs', () => {
      expect(normalizeSymbol('AUDUSD')).toBe('AUDUSD=X');
      expect(normalizeSymbol('USDCAD')).toBe('USDCAD=X');
      expect(normalizeSymbol('NZDUSD')).toBe('NZDUSD=X');
      expect(normalizeSymbol('AUD/USD')).toBe('AUDUSD=X');
      expect(normalizeSymbol('USD/CAD')).toBe('USDCAD=X');
    });

    it('should handle exotic forex pairs', () => {
      expect(normalizeSymbol('EURGBP')).toBe('EURGBP=X');
      expect(normalizeSymbol('EURJPY')).toBe('EURJPY=X');
      expect(normalizeSymbol('GBPJPY')).toBe('GBPJPY=X');
      expect(normalizeSymbol('EUR/GBP')).toBe('EURGBP=X');
    });

    it('should leave already formatted forex pairs unchanged', () => {
      expect(normalizeSymbol('EURUSD=X')).toBe('EURUSD=X');
      expect(normalizeSymbol('GBPUSD=X')).toBe('GBPUSD=X');
      expect(normalizeSymbol('USDJPY=X')).toBe('USDJPY=X');
    });
  });

  describe('Stock symbols', () => {
    it('should leave stock symbols unchanged', () => {
      expect(normalizeSymbol('AAPL')).toBe('AAPL');
      expect(normalizeSymbol('MSFT')).toBe('MSFT');
      expect(normalizeSymbol('GOOGL')).toBe('GOOGL');
      expect(normalizeSymbol('AMZN')).toBe('AMZN');
      expect(normalizeSymbol('TSLA')).toBe('TSLA');
    });

    it('should handle short ticker symbols', () => {
      expect(normalizeSymbol('F')).toBe('F');
      expect(normalizeSymbol('GM')).toBe('GM');
      expect(normalizeSymbol('IBM')).toBe('IBM');
    });

    it('should handle longer ticker symbols', () => {
      expect(normalizeSymbol('GOOGL')).toBe('GOOGL');
      expect(normalizeSymbol('ABNB')).toBe('ABNB');
    });
  });

  describe('Cryptocurrency symbols', () => {
    it('should leave crypto symbols unchanged', () => {
      expect(normalizeSymbol('BTC-USD')).toBe('BTC-USD');
      expect(normalizeSymbol('ETH-USD')).toBe('ETH-USD');
      expect(normalizeSymbol('BNB-USD')).toBe('BNB-USD');
      expect(normalizeSymbol('XRP-USD')).toBe('XRP-USD');
    });
  });

  describe('Edge cases', () => {
    it('should handle symbols with leading/trailing whitespace', () => {
      expect(normalizeSymbol(' EURUSD ')).toBe('EURUSD=X');
      expect(normalizeSymbol(' EUR/USD ')).toBe('EURUSD=X');
      expect(normalizeSymbol(' AAPL ')).toBe('AAPL');
      expect(normalizeSymbol(' BTC-USD ')).toBe('BTC-USD');
    });

    it('should not convert 6-letter stock symbols to forex', () => {
      // These are not common forex pairs, should be treated as stock symbols
      expect(normalizeSymbol('GOOGLA')).toBe('GOOGLA');
      expect(normalizeSymbol('TESTAB')).toBe('TESTAB');
    });

    it('should handle empty string', () => {
      expect(normalizeSymbol('')).toBe('');
    });

    it('should preserve case', () => {
      expect(normalizeSymbol('EURUSD')).toBe('EURUSD=X');
      expect(normalizeSymbol('aapl')).toBe('aapl');
    });
  });

  describe('Common currency pairs', () => {
    it('should recognize major currency pairs', () => {
      const majorPairs = [
        'EURUSD', 'GBPUSD', 'USDJPY', 'USDCHF', 'AUDUSD', 'USDCAD', 'NZDUSD'
      ];
      
      majorPairs.forEach(pair => {
        expect(normalizeSymbol(pair)).toBe(`${pair}=X`);
      });
    });

    it('should recognize cross currency pairs', () => {
      const crossPairs = [
        'EURGBP', 'EURJPY', 'EURCHF', 'EURCAD', 'EURAUD',
        'GBPJPY', 'GBPCHF', 'GBPCAD', 'GBPAUD'
      ];
      
      crossPairs.forEach(pair => {
        expect(normalizeSymbol(pair)).toBe(`${pair}=X`);
      });
    });

    it('should recognize emerging market currencies', () => {
      expect(normalizeSymbol('USDMXN')).toBe('USDMXN=X');
      expect(normalizeSymbol('USDINR')).toBe('USDINR=X');
      expect(normalizeSymbol('USDBRL')).toBe('USDBRL=X');
      expect(normalizeSymbol('USDZAR')).toBe('USDZAR=X');
    });
  });
});
