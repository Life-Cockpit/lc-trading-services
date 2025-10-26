import { EMAService } from './ema-service.js';
import type { TradingDataClient, OHLCVData } from '@lc-trading-services/trading-data-client';

describe('EMAService', () => {
  let mockDataClient: jest.Mocked<TradingDataClient>;
  let emaService: EMAService;

  beforeEach(() => {
    mockDataClient = {
      getHistoricalData: jest.fn(),
      getQuote: jest.fn(),
    } as unknown as jest.Mocked<TradingDataClient>;

    emaService = new EMAService(mockDataClient);
  });

  describe('calculateEMA', () => {
    it('should calculate EMA 9', async () => {
      const mockData: OHLCVData[] = Array.from({ length: 30 }, (_, i) => ({
        date: new Date(2024, 0, i + 1),
        open: 100,
        high: 105,
        low: 95,
        close: 100 + i * 0.5,
        volume: 1000000,
      }));

      mockDataClient.getHistoricalData.mockResolvedValue(mockData);

      const result = await emaService.calculateEMA('AAPL', 9);

      expect(result).toBeDefined();
      expect(result.symbol).toBe('AAPL');
      expect(result.period).toBe(9);
      expect(result.ema).toBeGreaterThan(0);
      expect(result.timestamp).toBeInstanceOf(Date);
    });

    it('should calculate EMA 20', async () => {
      const mockData: OHLCVData[] = Array.from({ length: 50 }, (_, i) => ({
        date: new Date(2024, 0, i + 1),
        open: 100,
        high: 105,
        low: 95,
        close: 100 + i * 0.5,
        volume: 1000000,
      }));

      mockDataClient.getHistoricalData.mockResolvedValue(mockData);

      const result = await emaService.calculateEMA('AAPL', 20);

      expect(result).toBeDefined();
      expect(result.period).toBe(20);
      expect(result.ema).toBeGreaterThan(0);
    });

    it('should calculate EMA 50', async () => {
      const mockData: OHLCVData[] = Array.from({ length: 100 }, (_, i) => ({
        date: new Date(2024, 0, i + 1),
        open: 100,
        high: 105,
        low: 95,
        close: 100 + Math.sin(i / 10) * 5,
        volume: 1000000,
      }));

      mockDataClient.getHistoricalData.mockResolvedValue(mockData);

      const result = await emaService.calculateEMA('EURUSD', 50);

      expect(result).toBeDefined();
      expect(result.period).toBe(50);
      expect(result.ema).toBeGreaterThan(0);
    });

    it('should calculate EMA 200', async () => {
      const mockData: OHLCVData[] = Array.from({ length: 300 }, (_, i) => ({
        date: new Date(2024, 0, i + 1),
        open: 100,
        high: 105,
        low: 95,
        close: 100 + Math.sin(i / 20) * 10,
        volume: 1000000,
      }));

      mockDataClient.getHistoricalData.mockResolvedValue(mockData);

      const result = await emaService.calculateEMA('AAPL', 200);

      expect(result).toBeDefined();
      expect(result.period).toBe(200);
      expect(result.ema).toBeGreaterThan(0);
    });

    it('should throw error with insufficient data', async () => {
      const mockData: OHLCVData[] = Array.from({ length: 5 }, (_, i) => ({
        date: new Date(2024, 0, i + 1),
        open: 100,
        high: 105,
        low: 95,
        close: 102,
        volume: 1000000,
      }));

      mockDataClient.getHistoricalData.mockResolvedValue(mockData);

      await expect(emaService.calculateEMA('AAPL', 20)).rejects.toThrow(
        /Insufficient data for EMA calculation/
      );
    });

    it('should calculate EMA with custom interval', async () => {
      const mockData: OHLCVData[] = Array.from({ length: 50 }, (_, i) => ({
        date: new Date(2024, 0, 1, i),
        open: 100,
        high: 105,
        low: 95,
        close: 100 + i * 0.1,
        volume: 100000,
      }));

      mockDataClient.getHistoricalData.mockResolvedValue(mockData);

      const result = await emaService.calculateEMA('EURUSD', 9, '1h');

      expect(result).toBeDefined();
      expect(result.symbol).toBe('EURUSD');
      expect(result.period).toBe(9);
      expect(mockDataClient.getHistoricalData).toHaveBeenCalledWith(
        expect.objectContaining({
          interval: '1h',
        })
      );
    });
  });

  describe('calculateMultipleEMAs', () => {
    it('should calculate multiple EMAs efficiently', async () => {
      const mockData: OHLCVData[] = Array.from({ length: 300 }, (_, i) => ({
        date: new Date(2024, 0, i + 1),
        open: 100,
        high: 105,
        low: 95,
        close: 100 + i * 0.1,
        volume: 1000000,
      }));

      mockDataClient.getHistoricalData.mockResolvedValue(mockData);

      const results = await emaService.calculateMultipleEMAs('AAPL', [9, 20, 50, 200]);

      expect(results).toHaveLength(4);
      expect(results[0].period).toBe(9);
      expect(results[1].period).toBe(20);
      expect(results[2].period).toBe(50);
      expect(results[3].period).toBe(200);
      
      // All should have the same symbol and timestamp
      expect(results.every(r => r.symbol === 'AAPL')).toBe(true);
      
      // All EMAs should be positive
      expect(results.every(r => r.ema > 0)).toBe(true);
      
      // Should only call getHistoricalData once
      expect(mockDataClient.getHistoricalData).toHaveBeenCalledTimes(1);
    });

    it('should handle custom interval for multiple EMAs', async () => {
      const mockData: OHLCVData[] = Array.from({ length: 100 }, (_, i) => ({
        date: new Date(2024, 0, 1, i),
        open: 100,
        high: 105,
        low: 95,
        close: 100 + i * 0.1,
        volume: 100000,
      }));

      mockDataClient.getHistoricalData.mockResolvedValue(mockData);

      const results = await emaService.calculateMultipleEMAs('EURUSD', [9, 20], '1h');

      expect(results).toHaveLength(2);
      expect(mockDataClient.getHistoricalData).toHaveBeenCalledWith(
        expect.objectContaining({
          interval: '1h',
        })
      );
    });

    it('should throw error when insufficient data for max period', async () => {
      const mockData: OHLCVData[] = Array.from({ length: 30 }, (_, i) => ({
        date: new Date(2024, 0, i + 1),
        open: 100,
        high: 105,
        low: 95,
        close: 102,
        volume: 1000000,
      }));

      mockDataClient.getHistoricalData.mockResolvedValue(mockData);

      await expect(
        emaService.calculateMultipleEMAs('AAPL', [9, 20, 50, 200])
      ).rejects.toThrow(/Insufficient data for EMA calculation/);
    });
  });

  describe('EMA calculation accuracy', () => {
    it('should calculate EMA correctly with known values', async () => {
      // Simple test case with constant prices
      const mockData: OHLCVData[] = Array.from({ length: 20 }, (_, i) => ({
        date: new Date(2024, 0, i + 1),
        open: 100,
        high: 100,
        low: 100,
        close: 100,
        volume: 1000,
      }));

      mockDataClient.getHistoricalData.mockResolvedValue(mockData);

      const result = await emaService.calculateEMA('TEST', 9);

      // EMA of constant values should equal the constant
      expect(result.ema).toBeCloseTo(100, 1);
    });

    it('should give more weight to recent prices', async () => {
      // Price increases over time
      const mockData: OHLCVData[] = Array.from({ length: 30 }, (_, i) => ({
        date: new Date(2024, 0, i + 1),
        open: 100,
        high: 105,
        low: 95,
        close: 100 + i,
        volume: 1000,
      }));

      mockDataClient.getHistoricalData.mockResolvedValue(mockData);

      const result = await emaService.calculateEMA('TEST', 9);

      // EMA should be closer to recent higher prices
      expect(result.ema).toBeGreaterThan(115);
    });
  });
});
