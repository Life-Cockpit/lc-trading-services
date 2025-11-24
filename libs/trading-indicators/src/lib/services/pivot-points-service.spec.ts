import { PivotPointsService } from './pivot-points-service.js';
import type { TradingDataClient, OHLCVData } from '@lc-trading-services/trading-data-client';

describe('PivotPointsService', () => {
  let mockDataClient: jest.Mocked<TradingDataClient>;
  let pivotPointsService: PivotPointsService;

  beforeEach(() => {
    mockDataClient = {
      getHistoricalData: jest.fn(),
      getQuote: jest.fn(),
    } as unknown as jest.Mocked<TradingDataClient>;

    pivotPointsService = new PivotPointsService(mockDataClient);
  });

  describe('calculatePivotPoints', () => {
    it('should calculate pivot points with default daily interval', async () => {
      const mockData: OHLCVData[] = [
        {
          date: new Date(2024, 0, 1),
          open: 100,
          high: 110,
          low: 90,
          close: 105,
          volume: 1000000,
        },
        {
          date: new Date(2024, 0, 2),
          open: 105,
          high: 115,
          low: 100,
          close: 110,
          volume: 1000000,
        },
      ];

      mockDataClient.getHistoricalData.mockResolvedValue(mockData);

      const result = await pivotPointsService.calculatePivotPoints('AAPL');

      // Pivot Point = (High + Low + Close) / 3 = (110 + 90 + 105) / 3 = 101.666667
      // R1 = (2 * PP) - Low = (2 * 101.666667) - 90 = 113.333333
      // S1 = (2 * PP) - High = (2 * 101.666667) - 110 = 93.333333
      // R2 = PP + (High - Low) = 101.666667 + (110 - 90) = 121.666667
      // S2 = PP - (High - Low) = 101.666667 - (110 - 90) = 81.666667
      // R3 = High + 2 * (PP - Low) = 110 + 2 * (101.666667 - 90) = 133.333333
      // S3 = Low - 2 * (High - PP) = 90 - 2 * (110 - 101.666667) = 73.333333

      expect(result).toBeDefined();
      expect(result.symbol).toBe('AAPL');
      expect(result.interval).toBe('1d');
      expect(result.pivotPoint).toBeCloseTo(101.666667, 4);
      expect(result.r1).toBeCloseTo(113.333333, 4);
      expect(result.r2).toBeCloseTo(121.666667, 4);
      expect(result.r3).toBeCloseTo(133.333333, 4);
      expect(result.s1).toBeCloseTo(93.333333, 4);
      expect(result.s2).toBeCloseTo(81.666667, 4);
      expect(result.s3).toBeCloseTo(73.333333, 4);
      expect(result.previousHigh).toBe(110);
      expect(result.previousLow).toBe(90);
      expect(result.previousClose).toBe(105);
      expect(result.timestamp).toBeInstanceOf(Date);
      expect(mockDataClient.getHistoricalData).toHaveBeenCalledWith(
        expect.objectContaining({
          symbol: 'AAPL',
          interval: '1d',
        })
      );
    });

    it('should calculate pivot points for hourly interval', async () => {
      const mockData: OHLCVData[] = [
        {
          date: new Date(2024, 0, 1, 9),
          open: 1.0500,
          high: 1.0550,
          low: 1.0450,
          close: 1.0520,
          volume: 100000,
        },
        {
          date: new Date(2024, 0, 1, 10),
          open: 1.0520,
          high: 1.0580,
          low: 1.0500,
          close: 1.0560,
          volume: 100000,
        },
      ];

      mockDataClient.getHistoricalData.mockResolvedValue(mockData);

      const result = await pivotPointsService.calculatePivotPoints('EURUSD', '1h');

      // Using first period: High=1.0550, Low=1.0450, Close=1.0520
      // PP = (1.0550 + 1.0450 + 1.0520) / 3 = 1.0506667
      
      expect(result).toBeDefined();
      expect(result.symbol).toBe('EURUSD');
      expect(result.interval).toBe('1h');
      expect(result.pivotPoint).toBeCloseTo(1.050667, 4);
      expect(result.previousHigh).toBeCloseTo(1.0550, 4);
      expect(result.previousLow).toBeCloseTo(1.0450, 4);
      expect(result.previousClose).toBeCloseTo(1.0520, 4);
    });

    it('should calculate pivot points with symmetric support and resistance', async () => {
      // Create a symmetric price range for easier testing
      const mockData: OHLCVData[] = [
        {
          date: new Date(2024, 0, 1),
          open: 100,
          high: 120,
          low: 80,
          close: 100,
          volume: 1000000,
        },
        {
          date: new Date(2024, 0, 2),
          open: 100,
          high: 125,
          low: 85,
          close: 105,
          volume: 1000000,
        },
      ];

      mockDataClient.getHistoricalData.mockResolvedValue(mockData);

      const result = await pivotPointsService.calculatePivotPoints('AAPL');

      // Using first period: High=120, Low=80, Close=100
      // PP = (120 + 80 + 100) / 3 = 100
      // R1 = (2 * 100) - 80 = 120
      // S1 = (2 * 100) - 120 = 80
      // R2 = 100 + (120 - 80) = 140
      // S2 = 100 - (120 - 80) = 60
      // R3 = 120 + 2 * (100 - 80) = 160
      // S3 = 80 - 2 * (120 - 100) = 40

      expect(result.pivotPoint).toBe(100);
      expect(result.r1).toBe(120);
      expect(result.s1).toBe(80);
      expect(result.r2).toBe(140);
      expect(result.s2).toBe(60);
      expect(result.r3).toBe(160);
      expect(result.s3).toBe(40);
    });

    it('should handle forex symbols correctly', async () => {
      const mockData: OHLCVData[] = [
        {
          date: new Date(2024, 0, 1),
          open: 1.2000,
          high: 1.2100,
          low: 1.1900,
          close: 1.2050,
          volume: 1000000,
        },
        {
          date: new Date(2024, 0, 2),
          open: 1.2050,
          high: 1.2150,
          low: 1.2000,
          close: 1.2100,
          volume: 1000000,
        },
      ];

      mockDataClient.getHistoricalData.mockResolvedValue(mockData);

      const result = await pivotPointsService.calculatePivotPoints('GBPUSD');

      // Using first period: High=1.2100, Low=1.1900, Close=1.2050
      // PP = (1.2100 + 1.1900 + 1.2050) / 3 = 1.201667
      expect(result).toBeDefined();
      expect(result.symbol).toBe('GBPUSD');
      expect(result.pivotPoint).toBeCloseTo(1.201667, 4);
    });

    it('should handle cryptocurrency symbols correctly', async () => {
      const mockData: OHLCVData[] = [
        {
          date: new Date(2024, 0, 1),
          open: 40000,
          high: 42000,
          low: 38000,
          close: 41000,
          volume: 1000000,
        },
        {
          date: new Date(2024, 0, 2),
          open: 41000,
          high: 43000,
          low: 39000,
          close: 42000,
          volume: 1000000,
        },
      ];

      mockDataClient.getHistoricalData.mockResolvedValue(mockData);

      const result = await pivotPointsService.calculatePivotPoints('BTC-USD');

      expect(result).toBeDefined();
      expect(result.symbol).toBe('BTC-USD');
      expect(result.pivotPoint).toBeCloseTo(40333.333333, 4);
    });

    it('should throw error with insufficient data', async () => {
      const mockData: OHLCVData[] = [
        {
          date: new Date(2024, 0, 1),
          open: 100,
          high: 110,
          low: 90,
          close: 105,
          volume: 1000000,
        },
      ];

      mockDataClient.getHistoricalData.mockResolvedValue(mockData);

      await expect(pivotPointsService.calculatePivotPoints('AAPL')).rejects.toThrow(
        /Insufficient data for Pivot Points calculation/
      );
    });

    it('should use second to last period for calculations', async () => {
      // Test that we use the completed period (second to last)
      const mockData: OHLCVData[] = [
        {
          date: new Date(2024, 0, 1),
          open: 100,
          high: 110,
          low: 90,
          close: 105,
          volume: 1000000,
        },
        {
          date: new Date(2024, 0, 2),
          open: 105,
          high: 115,
          low: 95,
          close: 110,
          volume: 1000000,
        },
        {
          date: new Date(2024, 0, 3),
          open: 110,
          high: 120,
          low: 105,
          close: 115,
          volume: 1000000,
        },
      ];

      mockDataClient.getHistoricalData.mockResolvedValue(mockData);

      const result = await pivotPointsService.calculatePivotPoints('AAPL');

      // Should use second period (index 1): High=115, Low=95, Close=110
      expect(result.previousHigh).toBe(115);
      expect(result.previousLow).toBe(95);
      expect(result.previousClose).toBe(110);
    });

    it('should format all values to 6 decimal places', async () => {
      const mockData: OHLCVData[] = [
        {
          date: new Date(2024, 0, 1),
          open: 1.123456789,
          high: 1.234567890,
          low: 1.012345678,
          close: 1.123456789,
          volume: 1000000,
        },
        {
          date: new Date(2024, 0, 2),
          open: 1.123456789,
          high: 1.234567890,
          low: 1.012345678,
          close: 1.123456789,
          volume: 1000000,
        },
      ];

      mockDataClient.getHistoricalData.mockResolvedValue(mockData);

      const result = await pivotPointsService.calculatePivotPoints('EURUSD');

      // Check that all numeric values have at most 6 decimal places
      const checkDecimalPlaces = (value: number) => {
        const str = value.toString();
        const decimalIndex = str.indexOf('.');
        if (decimalIndex === -1) return true;
        return str.length - decimalIndex - 1 <= 6;
      };

      expect(checkDecimalPlaces(result.pivotPoint)).toBe(true);
      expect(checkDecimalPlaces(result.r1)).toBe(true);
      expect(checkDecimalPlaces(result.r2)).toBe(true);
      expect(checkDecimalPlaces(result.r3)).toBe(true);
      expect(checkDecimalPlaces(result.s1)).toBe(true);
      expect(checkDecimalPlaces(result.s2)).toBe(true);
      expect(checkDecimalPlaces(result.s3)).toBe(true);
    });
  });
});
