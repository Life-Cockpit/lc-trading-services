import { TrendlineService } from './trendline-service.js';
import type { TradingDataClient, OHLCVData } from '@lc-trading-services/trading-data-client';

describe('TrendlineService', () => {
  let mockDataClient: jest.Mocked<TradingDataClient>;
  let trendlineService: TrendlineService;

  beforeEach(() => {
    mockDataClient = {
      getHistoricalData: jest.fn(),
      getQuote: jest.fn(),
    } as unknown as jest.Mocked<TradingDataClient>;

    trendlineService = new TrendlineService(mockDataClient);
  });

  describe('calculateTrendlines', () => {
    it('should calculate trendlines for daily interval', async () => {
      const mockData: OHLCVData[] = [
        { date: new Date(2024, 0, 1), open: 100, high: 110, low: 90, close: 105, volume: 1000 },
        { date: new Date(2024, 0, 2), open: 105, high: 108, low: 95, close: 100, volume: 1000 },
        { date: new Date(2024, 0, 3), open: 100, high: 115, low: 98, close: 110, volume: 1000 },
        { date: new Date(2024, 0, 4), open: 110, high: 112, low: 102, close: 107, volume: 1000 },
        { date: new Date(2024, 0, 5), open: 107, high: 120, low: 105, close: 115, volume: 1000 },
        { date: new Date(2024, 0, 6), open: 115, high: 118, low: 110, close: 113, volume: 1000 },
        { date: new Date(2024, 0, 7), open: 113, high: 125, low: 112, close: 120, volume: 1000 },
        { date: new Date(2024, 0, 8), open: 120, high: 123, low: 115, close: 118, volume: 1000 },
        { date: new Date(2024, 0, 9), open: 118, high: 130, low: 117, close: 125, volume: 1000 },
        { date: new Date(2024, 0, 10), open: 125, high: 128, low: 120, close: 123, volume: 1000 },
        { date: new Date(2024, 0, 11), open: 123, high: 135, low: 122, close: 130, volume: 1000 },
        { date: new Date(2024, 0, 12), open: 130, high: 133, low: 125, close: 128, volume: 1000 },
        { date: new Date(2024, 0, 13), open: 128, high: 140, low: 127, close: 135, volume: 1000 },
        { date: new Date(2024, 0, 14), open: 135, high: 138, low: 130, close: 133, volume: 1000 },
        { date: new Date(2024, 0, 15), open: 133, high: 145, low: 132, close: 140, volume: 1000 },
        { date: new Date(2024, 0, 16), open: 140, high: 143, low: 135, close: 138, volume: 1000 },
        { date: new Date(2024, 0, 17), open: 138, high: 150, low: 137, close: 145, volume: 1000 },
        { date: new Date(2024, 0, 18), open: 145, high: 148, low: 140, close: 143, volume: 1000 },
        { date: new Date(2024, 0, 19), open: 143, high: 155, low: 142, close: 150, volume: 1000 },
        { date: new Date(2024, 0, 20), open: 150, high: 153, low: 145, close: 148, volume: 1000 },
        { date: new Date(2024, 0, 21), open: 148, high: 160, low: 147, close: 155, volume: 1000 },
        { date: new Date(2024, 0, 22), open: 155, high: 158, low: 150, close: 153, volume: 1000 },
        { date: new Date(2024, 0, 23), open: 153, high: 165, low: 152, close: 160, volume: 1000 },
        { date: new Date(2024, 0, 24), open: 160, high: 163, low: 155, close: 158, volume: 1000 },
        { date: new Date(2024, 0, 25), open: 158, high: 170, low: 157, close: 165, volume: 1000 },
      ];

      mockDataClient.getHistoricalData.mockResolvedValue(mockData);

      const result = await trendlineService.calculateTrendlines('AAPL', '1d', 100, 10);

      expect(result).toBeDefined();
      expect(result.symbol).toBe('AAPL');
      expect(result.interval).toBe('1d');
      expect(result.supportTrendlines).toBeDefined();
      expect(result.resistanceTrendlines).toBeDefined();
      expect(Array.isArray(result.supportTrendlines)).toBe(true);
      expect(Array.isArray(result.resistanceTrendlines)).toBe(true);
      expect(result.timestamp).toBeInstanceOf(Date);
      expect(mockDataClient.getHistoricalData).toHaveBeenCalledWith(
        expect.objectContaining({
          symbol: 'AAPL',
          interval: '1d',
        })
      );
    });

    it('should calculate trendlines for hourly interval', async () => {
      const mockData: OHLCVData[] = Array.from({ length: 30 }, (_, i) => ({
        date: new Date(2024, 0, 1, i),
        open: 100 + i,
        high: 105 + i,
        low: 95 + i,
        close: 102 + i,
        volume: 1000,
      }));

      mockDataClient.getHistoricalData.mockResolvedValue(mockData);

      const result = await trendlineService.calculateTrendlines('EURUSD', '1h', 50, 5);

      expect(result).toBeDefined();
      expect(result.symbol).toBe('EURUSD');
      expect(result.interval).toBe('1h');
      expect(result.supportTrendlines).toBeDefined();
      expect(result.resistanceTrendlines).toBeDefined();
    });

    it('should throw error with insufficient data', async () => {
      const mockData: OHLCVData[] = Array.from({ length: 10 }, (_, i) => ({
        date: new Date(2024, 0, i + 1),
        open: 100,
        high: 105,
        low: 95,
        close: 102,
        volume: 1000,
      }));

      mockDataClient.getHistoricalData.mockResolvedValue(mockData);

      await expect(trendlineService.calculateTrendlines('AAPL', '1d')).rejects.toThrow(
        /Insufficient data for trendline calculation/
      );
    });

    it('should throw error for unsupported interval', async () => {
      await expect(
        trendlineService.calculateTrendlines('AAPL', '1m' as any)
      ).rejects.toThrow(/only supports 1d and 1h intervals/);
    });

    it('should identify trendlines with exactly 2 points', async () => {
      const mockData: OHLCVData[] = [
        { date: new Date(2024, 0, 1), open: 100, high: 110, low: 90, close: 105, volume: 1000 },
        { date: new Date(2024, 0, 2), open: 105, high: 108, low: 92, close: 100, volume: 1000 },
        { date: new Date(2024, 0, 3), open: 100, high: 115, low: 95, close: 110, volume: 1000 },
        { date: new Date(2024, 0, 4), open: 110, high: 112, low: 98, close: 107, volume: 1000 },
        { date: new Date(2024, 0, 5), open: 107, high: 120, low: 100, close: 115, volume: 1000 },
        { date: new Date(2024, 0, 6), open: 115, high: 118, low: 105, close: 113, volume: 1000 },
        { date: new Date(2024, 0, 7), open: 113, high: 125, low: 108, close: 120, volume: 1000 },
        { date: new Date(2024, 0, 8), open: 120, high: 123, low: 112, close: 118, volume: 1000 },
        { date: new Date(2024, 0, 9), open: 118, high: 130, low: 115, close: 125, volume: 1000 },
        { date: new Date(2024, 0, 10), open: 125, high: 128, low: 118, close: 123, volume: 1000 },
        { date: new Date(2024, 0, 11), open: 123, high: 135, low: 120, close: 130, volume: 1000 },
        { date: new Date(2024, 0, 12), open: 130, high: 133, low: 122, close: 128, volume: 1000 },
        { date: new Date(2024, 0, 13), open: 128, high: 140, low: 125, close: 135, volume: 1000 },
        { date: new Date(2024, 0, 14), open: 135, high: 138, low: 128, close: 133, volume: 1000 },
        { date: new Date(2024, 0, 15), open: 133, high: 145, low: 130, close: 140, volume: 1000 },
        { date: new Date(2024, 0, 16), open: 140, high: 143, low: 132, close: 138, volume: 1000 },
        { date: new Date(2024, 0, 17), open: 138, high: 150, low: 135, close: 145, volume: 1000 },
        { date: new Date(2024, 0, 18), open: 145, high: 148, low: 138, close: 143, volume: 1000 },
        { date: new Date(2024, 0, 19), open: 143, high: 155, low: 140, close: 150, volume: 1000 },
        { date: new Date(2024, 0, 20), open: 150, high: 153, low: 142, close: 148, volume: 1000 },
      ];

      mockDataClient.getHistoricalData.mockResolvedValue(mockData);

      const result = await trendlineService.calculateTrendlines('AAPL', '1d');

      // Verify that each trendline has exactly 2 points
      result.supportTrendlines.forEach(trendline => {
        expect(trendline.point1).toBeDefined();
        expect(trendline.point2).toBeDefined();
        expect(trendline.point1.price).toBeDefined();
        expect(trendline.point2.price).toBeDefined();
        expect(trendline.point1.date).toBeInstanceOf(Date);
        expect(trendline.point2.date).toBeInstanceOf(Date);
        expect(trendline.slope).toBeDefined();
        expect(trendline.intercept).toBeDefined();
        expect(trendline.strength).toBeGreaterThanOrEqual(0);
        expect(trendline.strength).toBeLessThanOrEqual(1);
      });

      result.resistanceTrendlines.forEach(trendline => {
        expect(trendline.point1).toBeDefined();
        expect(trendline.point2).toBeDefined();
        expect(trendline.point1.price).toBeDefined();
        expect(trendline.point2.price).toBeDefined();
        expect(trendline.point1.date).toBeInstanceOf(Date);
        expect(trendline.point2.date).toBeInstanceOf(Date);
        expect(trendline.slope).toBeDefined();
        expect(trendline.intercept).toBeDefined();
        expect(trendline.strength).toBeGreaterThanOrEqual(0);
        expect(trendline.strength).toBeLessThanOrEqual(1);
      });
    });

    it('should return trendlines sorted by strength', async () => {
      const mockData: OHLCVData[] = Array.from({ length: 50 }, (_, i) => ({
        date: new Date(2024, 0, i + 1),
        open: 100 + Math.sin(i / 3) * 10,
        high: 105 + Math.sin(i / 3) * 10,
        low: 95 + Math.sin(i / 3) * 10,
        close: 102 + Math.sin(i / 3) * 10,
        volume: 1000,
      }));

      mockDataClient.getHistoricalData.mockResolvedValue(mockData);

      const result = await trendlineService.calculateTrendlines('AAPL', '1d', 100, 5);

      // Verify trendlines are sorted by strength (descending)
      for (let i = 0; i < result.supportTrendlines.length - 1; i++) {
        expect(result.supportTrendlines[i].strength).toBeGreaterThanOrEqual(
          result.supportTrendlines[i + 1].strength
        );
      }

      for (let i = 0; i < result.resistanceTrendlines.length - 1; i++) {
        expect(result.resistanceTrendlines[i].strength).toBeGreaterThanOrEqual(
          result.resistanceTrendlines[i + 1].strength
        );
      }
    });

    it('should limit number of trendlines to maxTrendlines parameter', async () => {
      const mockData: OHLCVData[] = Array.from({ length: 50 }, (_, i) => ({
        date: new Date(2024, 0, i + 1),
        open: 100 + Math.sin(i / 2) * 20,
        high: 105 + Math.sin(i / 2) * 20,
        low: 95 + Math.sin(i / 2) * 20,
        close: 102 + Math.sin(i / 2) * 20,
        volume: 1000,
      }));

      mockDataClient.getHistoricalData.mockResolvedValue(mockData);

      const maxTrendlines = 3;
      const result = await trendlineService.calculateTrendlines('AAPL', '1d', 100, maxTrendlines);

      expect(result.supportTrendlines.length).toBeLessThanOrEqual(maxTrendlines);
      expect(result.resistanceTrendlines.length).toBeLessThanOrEqual(maxTrendlines);
    });

    it('should calculate correct slope and intercept for trendlines', async () => {
      const mockData: OHLCVData[] = [
        { date: new Date(2024, 0, 1), open: 100, high: 110, low: 90, close: 105, volume: 1000 },
        { date: new Date(2024, 0, 2), open: 105, high: 108, low: 92, close: 100, volume: 1000 },
        { date: new Date(2024, 0, 3), open: 100, high: 115, low: 95, close: 110, volume: 1000 },
        { date: new Date(2024, 0, 4), open: 110, high: 112, low: 98, close: 107, volume: 1000 },
        { date: new Date(2024, 0, 5), open: 107, high: 120, low: 100, close: 115, volume: 1000 },
        { date: new Date(2024, 0, 6), open: 115, high: 118, low: 105, close: 113, volume: 1000 },
        { date: new Date(2024, 0, 7), open: 113, high: 125, low: 108, close: 120, volume: 1000 },
        { date: new Date(2024, 0, 8), open: 120, high: 123, low: 112, close: 118, volume: 1000 },
        { date: new Date(2024, 0, 9), open: 118, high: 130, low: 115, close: 125, volume: 1000 },
        { date: new Date(2024, 0, 10), open: 125, high: 128, low: 118, close: 123, volume: 1000 },
        { date: new Date(2024, 0, 11), open: 123, high: 135, low: 120, close: 130, volume: 1000 },
        { date: new Date(2024, 0, 12), open: 130, high: 133, low: 122, close: 128, volume: 1000 },
        { date: new Date(2024, 0, 13), open: 128, high: 140, low: 125, close: 135, volume: 1000 },
        { date: new Date(2024, 0, 14), open: 135, high: 138, low: 128, close: 133, volume: 1000 },
        { date: new Date(2024, 0, 15), open: 133, high: 145, low: 130, close: 140, volume: 1000 },
        { date: new Date(2024, 0, 16), open: 140, high: 143, low: 132, close: 138, volume: 1000 },
        { date: new Date(2024, 0, 17), open: 138, high: 150, low: 135, close: 145, volume: 1000 },
        { date: new Date(2024, 0, 18), open: 145, high: 148, low: 138, close: 143, volume: 1000 },
        { date: new Date(2024, 0, 19), open: 143, high: 155, low: 140, close: 150, volume: 1000 },
        { date: new Date(2024, 0, 20), open: 150, high: 153, low: 142, close: 148, volume: 1000 },
      ];

      mockDataClient.getHistoricalData.mockResolvedValue(mockData);

      const result = await trendlineService.calculateTrendlines('AAPL', '1d');

      // Verify that all trendlines have valid slope and intercept
      [...result.supportTrendlines, ...result.resistanceTrendlines].forEach(trendline => {
        expect(typeof trendline.slope).toBe('number');
        expect(typeof trendline.intercept).toBe('number');
        expect(isFinite(trendline.slope)).toBe(true);
        expect(isFinite(trendline.intercept)).toBe(true);
        
        // Verify the line equation: price = slope * index + intercept
        const calculatedPrice1 = trendline.slope * trendline.point1.index + trendline.intercept;
        const calculatedPrice2 = trendline.slope * trendline.point2.index + trendline.intercept;
        
        // Allow small floating point differences
        expect(Math.abs(calculatedPrice1 - trendline.point1.price)).toBeLessThan(0.01);
        expect(Math.abs(calculatedPrice2 - trendline.point2.price)).toBeLessThan(0.01);
      });
    });

    it('should calculate trendline strength correctly', async () => {
      const mockData: OHLCVData[] = Array.from({ length: 30 }, (_, i) => ({
        date: new Date(2024, 0, i + 1),
        open: 100 + i,
        high: 105 + i,
        low: 95 + i,
        close: 102 + i,
        volume: 1000,
      }));

      mockDataClient.getHistoricalData.mockResolvedValue(mockData);

      const result = await trendlineService.calculateTrendlines('AAPL', '1d');

      // All trendlines should have strength between 0 and 1
      [...result.supportTrendlines, ...result.resistanceTrendlines].forEach(trendline => {
        expect(trendline.strength).toBeGreaterThanOrEqual(0);
        expect(trendline.strength).toBeLessThanOrEqual(1);
      });
    });

    it('should distinguish between support and resistance trendlines', async () => {
      const mockData: OHLCVData[] = Array.from({ length: 30 }, (_, i) => ({
        date: new Date(2024, 0, i + 1),
        open: 100 + Math.sin(i / 5) * 15,
        high: 110 + Math.sin(i / 5) * 15,
        low: 90 + Math.sin(i / 5) * 15,
        close: 105 + Math.sin(i / 5) * 15,
        volume: 1000,
      }));

      mockDataClient.getHistoricalData.mockResolvedValue(mockData);

      const result = await trendlineService.calculateTrendlines('AAPL', '1d');

      // Verify all support trendlines have type 'support'
      result.supportTrendlines.forEach(trendline => {
        expect(trendline.type).toBe('support');
      });

      // Verify all resistance trendlines have type 'resistance'
      result.resistanceTrendlines.forEach(trendline => {
        expect(trendline.type).toBe('resistance');
      });
    });
  });
});
