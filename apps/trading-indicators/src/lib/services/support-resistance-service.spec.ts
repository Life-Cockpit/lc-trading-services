import { SupportResistanceService } from './support-resistance-service.js';
import type { TradingDataClient, OHLCVData } from '@lc-trading-services/trading-data-client';

describe('SupportResistanceService', () => {
  let mockDataClient: jest.Mocked<TradingDataClient>;
  let service: SupportResistanceService;

  beforeEach(() => {
    mockDataClient = {
      getHistoricalData: jest.fn(),
      getQuote: jest.fn(),
    } as unknown as jest.Mocked<TradingDataClient>;

    service = new SupportResistanceService(mockDataClient);
  });

  describe('calculateSupportResistance', () => {
    it('should calculate support and resistance zones for daily interval', async () => {
      // Create mock data with clear support and resistance levels
      const mockData: OHLCVData[] = Array.from({ length: 100 }, (_, i) => {
        const basePrice = 100;
        // Create oscillating price with clear support at 95 and resistance at 110
        const price = basePrice + Math.sin(i / 10) * 10;
        return {
          date: new Date(2024, 0, i + 1),
          open: price,
          high: price + 2,
          low: price - 2,
          close: price,
          volume: 1000000,
        };
      });

      mockDataClient.getHistoricalData.mockResolvedValue(mockData);

      const result = await service.calculateSupportResistance('AAPL', '1d');

      expect(result).toBeDefined();
      expect(result.symbol).toBe('AAPL');
      expect(result.interval).toBe('1d');
      expect(result.zones).toBeDefined();
      expect(Array.isArray(result.zones)).toBe(true);
      expect(result.zones.length).toBeGreaterThan(0);
      expect(result.zones.length).toBeLessThanOrEqual(10);
      expect(result.timestamp).toBeInstanceOf(Date);
    });

    it('should calculate support and resistance zones for hourly interval', async () => {
      const mockData: OHLCVData[] = Array.from({ length: 100 }, (_, i) => {
        const price = 100 + Math.sin(i / 10) * 5;
        return {
          date: new Date(2024, 0, 1, i),
          open: price,
          high: price + 1,
          low: price - 1,
          close: price,
          volume: 100000,
        };
      });

      mockDataClient.getHistoricalData.mockResolvedValue(mockData);

      const result = await service.calculateSupportResistance('EURUSD', '1h');

      expect(result).toBeDefined();
      expect(result.interval).toBe('1h');
      expect(result.zones).toBeDefined();
    });

    it('should identify zones with support and resistance counts', async () => {
      const mockData: OHLCVData[] = Array.from({ length: 100 }, (_, i) => {
        const price = 100 + Math.sin(i / 10) * 10;
        return {
          date: new Date(2024, 0, i + 1),
          open: price,
          high: price + 2,
          low: price - 2,
          close: price,
          volume: 1000000,
        };
      });

      mockDataClient.getHistoricalData.mockResolvedValue(mockData);

      const result = await service.calculateSupportResistance('AAPL', '1d');

      // Check zone structure
      expect(result.zones.length).toBeGreaterThan(0);
      
      result.zones.forEach((zone) => {
        expect(zone.level).toBeGreaterThan(0);
        expect(zone.supportCount).toBeGreaterThanOrEqual(0);
        expect(zone.resistanceCount).toBeGreaterThanOrEqual(0);
        expect(zone.totalTouches).toBe(zone.supportCount + zone.resistanceCount);
        expect(zone.strength).toBeGreaterThanOrEqual(0);
        expect(zone.strength).toBeLessThanOrEqual(1);
      });
    });

    it('should sort zones by strength', async () => {
      const mockData: OHLCVData[] = Array.from({ length: 100 }, (_, i) => {
        const price = 100 + Math.sin(i / 10) * 10;
        return {
          date: new Date(2024, 0, i + 1),
          open: price,
          high: price + 2,
          low: price - 2,
          close: price,
          volume: 1000000,
        };
      });

      mockDataClient.getHistoricalData.mockResolvedValue(mockData);

      const result = await service.calculateSupportResistance('AAPL', '1d');

      // Zones should be sorted by strength in descending order
      for (let i = 0; i < result.zones.length - 1; i++) {
        expect(result.zones[i].strength).toBeGreaterThanOrEqual(result.zones[i + 1].strength);
      }
    });

    it('should throw error for unsupported interval', async () => {
      await expect(
        service.calculateSupportResistance('AAPL', '5m' as any)
      ).rejects.toThrow(/Support\/Resistance calculation only supports 1d and 1h intervals/);
    });

    it('should throw error with insufficient data', async () => {
      const mockData: OHLCVData[] = Array.from({ length: 10 }, (_, i) => ({
        date: new Date(2024, 0, i + 1),
        open: 100,
        high: 105,
        low: 95,
        close: 100,
        volume: 1000000,
      }));

      mockDataClient.getHistoricalData.mockResolvedValue(mockData);

      await expect(service.calculateSupportResistance('AAPL', '1d')).rejects.toThrow(
        /Insufficient data for support\/resistance calculation/
      );
    });

    it('should handle custom lookback periods', async () => {
      const mockData: OHLCVData[] = Array.from({ length: 200 }, (_, i) => {
        const price = 100 + Math.sin(i / 10) * 10;
        return {
          date: new Date(2024, 0, i + 1),
          open: price,
          high: price + 2,
          low: price - 2,
          close: price,
          volume: 1000000,
        };
      });

      mockDataClient.getHistoricalData.mockResolvedValue(mockData);

      const result = await service.calculateSupportResistance('AAPL', '1d', 150);

      expect(result).toBeDefined();
      expect(result.zones.length).toBeGreaterThan(0);
    });

    it('should handle custom tolerance', async () => {
      const mockData: OHLCVData[] = Array.from({ length: 100 }, (_, i) => {
        const price = 100 + Math.sin(i / 10) * 10;
        return {
          date: new Date(2024, 0, i + 1),
          open: price,
          high: price + 2,
          low: price - 2,
          close: price,
          volume: 1000000,
        };
      });

      mockDataClient.getHistoricalData.mockResolvedValue(mockData);

      // Test with tighter tolerance
      const result1 = await service.calculateSupportResistance('AAPL', '1d', 100, 0.001);
      
      // Test with looser tolerance
      const result2 = await service.calculateSupportResistance('AAPL', '1d', 100, 0.02);

      expect(result1).toBeDefined();
      expect(result2).toBeDefined();
      // Looser tolerance should generally result in fewer zones (more clustering)
      // but this depends on the data
    });

    it('should return at most 10 zones', async () => {
      // Create data with many potential zones
      const mockData: OHLCVData[] = Array.from({ length: 200 }, (_, i) => {
        const price = 100 + Math.sin(i / 5) * 20 + Math.cos(i / 7) * 15;
        return {
          date: new Date(2024, 0, i + 1),
          open: price,
          high: price + 3,
          low: price - 3,
          close: price,
          volume: 1000000,
        };
      });

      mockDataClient.getHistoricalData.mockResolvedValue(mockData);

      const result = await service.calculateSupportResistance('AAPL', '1d');

      expect(result.zones.length).toBeLessThanOrEqual(10);
    });

    it('should identify pivot highs and lows', async () => {
      // Create data with clear pivot points
      const mockData: OHLCVData[] = [
        { date: new Date(2024, 0, 1), open: 100, high: 102, low: 98, close: 100, volume: 1000 },
        { date: new Date(2024, 0, 2), open: 100, high: 103, low: 99, close: 101, volume: 1000 },
        { date: new Date(2024, 0, 3), open: 101, high: 104, low: 100, close: 102, volume: 1000 },
        { date: new Date(2024, 0, 4), open: 102, high: 105, low: 101, close: 103, volume: 1000 },
        { date: new Date(2024, 0, 5), open: 103, high: 106, low: 102, close: 104, volume: 1000 },
        { date: new Date(2024, 0, 6), open: 104, high: 110, low: 103, close: 109, volume: 1000 }, // Pivot high
        { date: new Date(2024, 0, 7), open: 109, high: 109, low: 104, close: 105, volume: 1000 },
        { date: new Date(2024, 0, 8), open: 105, high: 106, low: 103, close: 104, volume: 1000 },
        { date: new Date(2024, 0, 9), open: 104, high: 105, low: 102, close: 103, volume: 1000 },
        { date: new Date(2024, 0, 10), open: 103, high: 104, low: 101, close: 102, volume: 1000 },
        { date: new Date(2024, 0, 11), open: 102, high: 103, low: 95, close: 96, volume: 1000 }, // Pivot low
        { date: new Date(2024, 0, 12), open: 96, high: 97, low: 96, close: 97, volume: 1000 },
        { date: new Date(2024, 0, 13), open: 97, high: 98, low: 97, close: 98, volume: 1000 },
        { date: new Date(2024, 0, 14), open: 98, high: 99, low: 98, close: 99, volume: 1000 },
        { date: new Date(2024, 0, 15), open: 99, high: 100, low: 99, close: 100, volume: 1000 },
        ...Array.from({ length: 30 }, (_, i) => ({
          date: new Date(2024, 0, 16 + i),
          open: 100,
          high: 102,
          low: 98,
          close: 100,
          volume: 1000,
        })),
      ];

      mockDataClient.getHistoricalData.mockResolvedValue(mockData);

      const result = await service.calculateSupportResistance('AAPL', '1d');

      expect(result.zones.length).toBeGreaterThan(0);
    });
  });
});
