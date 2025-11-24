import { RSIService } from './rsi-service.js';
import type { TradingDataClient, OHLCVData } from '@lc-trading-services/trading-data-client';

describe('RSIService', () => {
  let mockDataClient: jest.Mocked<TradingDataClient>;
  let rsiService: RSIService;

  beforeEach(() => {
    mockDataClient = {
      getHistoricalData: jest.fn(),
      getQuote: jest.fn(),
    } as unknown as jest.Mocked<TradingDataClient>;

    rsiService = new RSIService(mockDataClient);
  });

  describe('calculateRSI', () => {
    it('should calculate RSI with default period of 14', async () => {
      // Create mock data with upward trend
      const mockData: OHLCVData[] = Array.from({ length: 50 }, (_, i) => ({
        date: new Date(2024, 0, i + 1),
        open: 100,
        high: 105,
        low: 95,
        close: 100 + i * 0.5, // Gradually increasing
        volume: 1000000,
      }));

      mockDataClient.getHistoricalData.mockResolvedValue(mockData);

      const result = await rsiService.calculateRSI('AAPL');

      expect(result).toBeDefined();
      expect(result.symbol).toBe('AAPL');
      expect(result.period).toBe(14);
      expect(result.rsi).toBeGreaterThan(0);
      expect(result.rsi).toBeLessThanOrEqual(100);
      expect(result.signal).toBeDefined();
      expect(['overbought', 'oversold', 'neutral']).toContain(result.signal);
      expect(result.timestamp).toBeInstanceOf(Date);
    });

    it('should calculate RSI with custom period', async () => {
      const mockData: OHLCVData[] = Array.from({ length: 50 }, (_, i) => ({
        date: new Date(2024, 0, i + 1),
        open: 100,
        high: 105,
        low: 95,
        close: 100 + i * 0.5,
        volume: 1000000,
      }));

      mockDataClient.getHistoricalData.mockResolvedValue(mockData);

      const result = await rsiService.calculateRSI('AAPL', 20);

      expect(result).toBeDefined();
      expect(result.period).toBe(20);
      expect(result.rsi).toBeGreaterThan(0);
      expect(result.rsi).toBeLessThanOrEqual(100);
    });

    it('should return overbought signal when RSI >= 70', async () => {
      // Create strongly upward trending data
      const mockData: OHLCVData[] = Array.from({ length: 50 }, (_, i) => ({
        date: new Date(2024, 0, i + 1),
        open: 100,
        high: 105,
        low: 95,
        close: 100 + i * 2, // Strong upward trend
        volume: 1000000,
      }));

      mockDataClient.getHistoricalData.mockResolvedValue(mockData);

      const result = await rsiService.calculateRSI('AAPL');

      expect(result.rsi).toBeGreaterThanOrEqual(70);
      expect(result.signal).toBe('overbought');
    });

    it('should return oversold signal when RSI <= 30', async () => {
      // Create strongly downward trending data
      const mockData: OHLCVData[] = Array.from({ length: 50 }, (_, i) => ({
        date: new Date(2024, 0, i + 1),
        open: 100,
        high: 105,
        low: 95,
        close: 100 - i * 2, // Strong downward trend
        volume: 1000000,
      }));

      mockDataClient.getHistoricalData.mockResolvedValue(mockData);

      const result = await rsiService.calculateRSI('AAPL');

      expect(result.rsi).toBeLessThanOrEqual(30);
      expect(result.signal).toBe('oversold');
    });

    it('should return neutral signal when RSI is between 30 and 70', async () => {
      // Create sideways/neutral data
      const mockData: OHLCVData[] = Array.from({ length: 50 }, (_, i) => ({
        date: new Date(2024, 0, i + 1),
        open: 100,
        high: 105,
        low: 95,
        close: 100 + (i % 2 === 0 ? 0.5 : -0.5), // Oscillating
        volume: 1000000,
      }));

      mockDataClient.getHistoricalData.mockResolvedValue(mockData);

      const result = await rsiService.calculateRSI('AAPL');

      expect(result.rsi).toBeGreaterThan(30);
      expect(result.rsi).toBeLessThan(70);
      expect(result.signal).toBe('neutral');
    });

    it('should work with different time intervals', async () => {
      const mockData: OHLCVData[] = Array.from({ length: 50 }, (_, i) => ({
        date: new Date(2024, 0, i + 1),
        open: 100,
        high: 105,
        low: 95,
        close: 100 + i * 0.5,
        volume: 1000000,
      }));

      mockDataClient.getHistoricalData.mockResolvedValue(mockData);

      const result = await rsiService.calculateRSI('AAPL', 14, '1h');

      expect(result).toBeDefined();
      expect(result.rsi).toBeGreaterThan(0);
      expect(result.rsi).toBeLessThanOrEqual(100);
    });

    it('should handle forex symbols', async () => {
      const mockData: OHLCVData[] = Array.from({ length: 50 }, (_, i) => ({
        date: new Date(2024, 0, i + 1),
        open: 1.1,
        high: 1.15,
        low: 1.05,
        close: 1.1 + i * 0.001,
        volume: 1000000,
      }));

      mockDataClient.getHistoricalData.mockResolvedValue(mockData);

      const result = await rsiService.calculateRSI('EURUSD');

      expect(result).toBeDefined();
      expect(result.symbol).toBe('EURUSD');
      expect(result.rsi).toBeGreaterThan(0);
      expect(result.rsi).toBeLessThanOrEqual(100);
    });

    it('should throw error when insufficient data', async () => {
      const mockData: OHLCVData[] = Array.from({ length: 10 }, (_, i) => ({
        date: new Date(2024, 0, i + 1),
        open: 100,
        high: 105,
        low: 95,
        close: 100,
        volume: 1000000,
      }));

      mockDataClient.getHistoricalData.mockResolvedValue(mockData);

      await expect(rsiService.calculateRSI('AAPL', 14)).rejects.toThrow(
        'Insufficient data for RSI calculation'
      );
    });

    it('should return RSI of 100 when there are only gains', async () => {
      // Create data with only gains (no losses)
      const mockData: OHLCVData[] = Array.from({ length: 50 }, (_, i) => ({
        date: new Date(2024, 0, i + 1),
        open: 100,
        high: 105,
        low: 95,
        close: 100 + i, // Consistent gains
        volume: 1000000,
      }));

      mockDataClient.getHistoricalData.mockResolvedValue(mockData);

      const result = await rsiService.calculateRSI('AAPL');

      expect(result.rsi).toBe(100);
      expect(result.signal).toBe('overbought');
    });

    it('should round RSI to 2 decimal places', async () => {
      const mockData: OHLCVData[] = Array.from({ length: 50 }, (_, i) => ({
        date: new Date(2024, 0, i + 1),
        open: 100,
        high: 105,
        low: 95,
        close: 100 + Math.sin(i / 5) * 2, // Oscillating prices
        volume: 1000000,
      }));

      mockDataClient.getHistoricalData.mockResolvedValue(mockData);

      const result = await rsiService.calculateRSI('AAPL');

      // Check that RSI has at most 2 decimal places
      const decimalPlaces = (result.rsi.toString().split('.')[1] || '').length;
      expect(decimalPlaces).toBeLessThanOrEqual(2);
    });
  });
});
