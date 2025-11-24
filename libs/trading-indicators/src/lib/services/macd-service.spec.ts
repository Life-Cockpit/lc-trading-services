import { MACDService } from './macd-service.js';
import type { TradingDataClient, OHLCVData } from '@lc-trading-services/trading-data-client';

describe('MACDService', () => {
  let mockDataClient: jest.Mocked<TradingDataClient>;
  let macdService: MACDService;

  beforeEach(() => {
    mockDataClient = {
      getHistoricalData: jest.fn(),
      getQuote: jest.fn(),
    } as unknown as jest.Mocked<TradingDataClient>;

    macdService = new MACDService(mockDataClient);
  });

  describe('calculateMACD', () => {
    it('should calculate MACD with default parameters (12, 26, 9)', async () => {
      const mockData: OHLCVData[] = Array.from({ length: 150 }, (_, i) => ({
        date: new Date(2024, 0, i + 1),
        open: 100,
        high: 105,
        low: 95,
        close: 100 + i * 0.5,
        volume: 1000000,
      }));

      mockDataClient.getHistoricalData.mockResolvedValue(mockData);

      const result = await macdService.calculateMACD('AAPL');

      expect(result).toBeDefined();
      expect(result.symbol).toBe('AAPL');
      expect(result.fastPeriod).toBe(12);
      expect(result.slowPeriod).toBe(26);
      expect(result.signalPeriod).toBe(9);
      expect(typeof result.macd).toBe('number');
      expect(typeof result.signal).toBe('number');
      expect(typeof result.histogram).toBe('number');
      expect(result.timestamp).toBeInstanceOf(Date);
    });

    it('should calculate MACD with custom parameters', async () => {
      const mockData: OHLCVData[] = Array.from({ length: 200 }, (_, i) => ({
        date: new Date(2024, 0, i + 1),
        open: 100,
        high: 105,
        low: 95,
        close: 100 + Math.sin(i / 10) * 10,
        volume: 1000000,
      }));

      mockDataClient.getHistoricalData.mockResolvedValue(mockData);

      const result = await macdService.calculateMACD('EURUSD', 8, 17, 9);

      expect(result).toBeDefined();
      expect(result.symbol).toBe('EURUSD');
      expect(result.fastPeriod).toBe(8);
      expect(result.slowPeriod).toBe(17);
      expect(result.signalPeriod).toBe(9);
      expect(typeof result.macd).toBe('number');
      expect(typeof result.signal).toBe('number');
      expect(typeof result.histogram).toBe('number');
    });

    it('should calculate MACD for different intervals', async () => {
      const mockData: OHLCVData[] = Array.from({ length: 150 }, (_, i) => ({
        date: new Date(2024, 0, 1, i),
        open: 100,
        high: 105,
        low: 95,
        close: 100 + i * 0.1,
        volume: 100000,
      }));

      mockDataClient.getHistoricalData.mockResolvedValue(mockData);

      const result = await macdService.calculateMACD('BTC-USD', 12, 26, 9, '1h');

      expect(result).toBeDefined();
      expect(result.symbol).toBe('BTC-USD');
      expect(mockDataClient.getHistoricalData).toHaveBeenCalledWith(
        expect.objectContaining({
          interval: '1h',
        })
      );
    });

    it('should calculate histogram as MACD minus signal', async () => {
      const mockData: OHLCVData[] = Array.from({ length: 100 }, (_, i) => ({
        date: new Date(2024, 0, i + 1),
        open: 100,
        high: 105,
        low: 95,
        close: 100 + i * 0.3,
        volume: 1000000,
      }));

      mockDataClient.getHistoricalData.mockResolvedValue(mockData);

      const result = await macdService.calculateMACD('AAPL');

      // Histogram should equal MACD - Signal (within floating point precision)
      const expectedHistogram = result.macd - result.signal;
      expect(result.histogram).toBeCloseTo(expectedHistogram, 5);
    });

    it('should throw error when fast period >= slow period', async () => {
      const mockData: OHLCVData[] = Array.from({ length: 100 }, (_, i) => ({
        date: new Date(2024, 0, i + 1),
        open: 100,
        high: 105,
        low: 95,
        close: 102,
        volume: 1000000,
      }));

      mockDataClient.getHistoricalData.mockResolvedValue(mockData);

      await expect(macdService.calculateMACD('AAPL', 26, 12, 9)).rejects.toThrow(
        'Fast period must be less than slow period'
      );
    });

    it('should throw error when fast period equals slow period', async () => {
      const mockData: OHLCVData[] = Array.from({ length: 100 }, (_, i) => ({
        date: new Date(2024, 0, i + 1),
        open: 100,
        high: 105,
        low: 95,
        close: 102,
        volume: 1000000,
      }));

      mockDataClient.getHistoricalData.mockResolvedValue(mockData);

      await expect(macdService.calculateMACD('AAPL', 12, 12, 9)).rejects.toThrow(
        'Fast period must be less than slow period'
      );
    });

    it('should throw error with insufficient data', async () => {
      const mockData: OHLCVData[] = Array.from({ length: 20 }, (_, i) => ({
        date: new Date(2024, 0, i + 1),
        open: 100,
        high: 105,
        low: 95,
        close: 102,
        volume: 1000000,
      }));

      mockDataClient.getHistoricalData.mockResolvedValue(mockData);

      await expect(macdService.calculateMACD('AAPL')).rejects.toThrow(
        /Insufficient data for MACD calculation/
      );
    });

    it('should handle uptrend correctly', async () => {
      // Create data with clear uptrend
      const mockData: OHLCVData[] = Array.from({ length: 150 }, (_, i) => ({
        date: new Date(2024, 0, i + 1),
        open: 100 + i,
        high: 105 + i,
        low: 95 + i,
        close: 100 + i,
        volume: 1000000,
      }));

      mockDataClient.getHistoricalData.mockResolvedValue(mockData);

      const result = await macdService.calculateMACD('AAPL');

      // In an uptrend, MACD should typically be positive
      expect(result.macd).toBeGreaterThan(0);
      // Histogram provides signal strength
      expect(typeof result.histogram).toBe('number');
    });

    it('should handle downtrend correctly', async () => {
      // Create data with clear downtrend
      const mockData: OHLCVData[] = Array.from({ length: 150 }, (_, i) => ({
        date: new Date(2024, 0, i + 1),
        open: 200 - i,
        high: 205 - i,
        low: 195 - i,
        close: 200 - i,
        volume: 1000000,
      }));

      mockDataClient.getHistoricalData.mockResolvedValue(mockData);

      const result = await macdService.calculateMACD('AAPL');

      // In a downtrend, MACD should typically be negative
      expect(result.macd).toBeLessThan(0);
    });

    it('should handle flat/sideways market', async () => {
      // Create data with flat prices
      const mockData: OHLCVData[] = Array.from({ length: 150 }, (_, i) => ({
        date: new Date(2024, 0, i + 1),
        open: 100,
        high: 101,
        low: 99,
        close: 100,
        volume: 1000000,
      }));

      mockDataClient.getHistoricalData.mockResolvedValue(mockData);

      const result = await macdService.calculateMACD('AAPL');

      // In a flat market, MACD should be close to zero
      expect(Math.abs(result.macd)).toBeLessThan(1);
      expect(Math.abs(result.signal)).toBeLessThan(1);
      expect(Math.abs(result.histogram)).toBeLessThan(1);
    });

    it('should return consistent values for same input data', async () => {
      const mockData: OHLCVData[] = Array.from({ length: 100 }, (_, i) => ({
        date: new Date(2024, 0, i + 1),
        open: 100,
        high: 105,
        low: 95,
        close: 100 + Math.sin(i / 5) * 3,
        volume: 1000000,
      }));

      mockDataClient.getHistoricalData.mockResolvedValue(mockData);

      const result1 = await macdService.calculateMACD('AAPL');
      
      // Reset mock and call again
      mockDataClient.getHistoricalData.mockResolvedValue(mockData);
      const result2 = await macdService.calculateMACD('AAPL');

      expect(result1.macd).toBe(result2.macd);
      expect(result1.signal).toBe(result2.signal);
      expect(result1.histogram).toBe(result2.histogram);
    });

    it('should format values to 6 decimal places', async () => {
      const mockData: OHLCVData[] = Array.from({ length: 150 }, (_, i) => ({
        date: new Date(2024, 0, i + 1),
        open: 100,
        high: 105,
        low: 95,
        close: 100.123456789 + i * 0.1,
        volume: 1000000,
      }));

      mockDataClient.getHistoricalData.mockResolvedValue(mockData);

      const result = await macdService.calculateMACD('AAPL');

      // Check that values are formatted correctly
      const macdDecimalPlaces = (result.macd.toString().split('.')[1] || '').length;
      const signalDecimalPlaces = (result.signal.toString().split('.')[1] || '').length;
      const histogramDecimalPlaces = (result.histogram.toString().split('.')[1] || '').length;
      
      expect(macdDecimalPlaces).toBeLessThanOrEqual(6);
      expect(signalDecimalPlaces).toBeLessThanOrEqual(6);
      expect(histogramDecimalPlaces).toBeLessThanOrEqual(6);
    });
  });

  describe('MACD calculation accuracy', () => {
    it('should calculate MACD components that sum correctly', async () => {
      const mockData: OHLCVData[] = Array.from({ length: 150 }, (_, i) => ({
        date: new Date(2024, 0, i + 1),
        open: 100,
        high: 105,
        low: 95,
        close: 100 + i * 0.2,
        volume: 1000000,
      }));

      mockDataClient.getHistoricalData.mockResolvedValue(mockData);

      const result = await macdService.calculateMACD('TEST', 12, 26, 9);

      // Verify the mathematical relationship
      const calculatedHistogram = result.macd - result.signal;
      expect(result.histogram).toBeCloseTo(calculatedHistogram, 5);
    });

    it('should handle oscillating prices correctly', async () => {
      // Create oscillating price pattern
      const mockData: OHLCVData[] = Array.from({ length: 150 }, (_, i) => ({
        date: new Date(2024, 0, i + 1),
        open: 100,
        high: 105,
        low: 95,
        close: 100 + Math.sin(i / 10) * 5,
        volume: 1000000,
      }));

      mockDataClient.getHistoricalData.mockResolvedValue(mockData);

      const result = await macdService.calculateMACD('TEST');

      // MACD should oscillate around zero for cyclical data
      expect(result).toBeDefined();
      expect(typeof result.macd).toBe('number');
      expect(typeof result.signal).toBe('number');
      expect(typeof result.histogram).toBe('number');
    });
  });
});
