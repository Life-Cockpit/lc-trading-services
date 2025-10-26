import { Week52HighLowService } from './week-52-high-low-service.js';
import type { TradingDataClient, OHLCVData } from '@lc-trading-services/trading-data-client';

describe('Week52HighLowService', () => {
  let mockDataClient: jest.Mocked<TradingDataClient>;
  let service: Week52HighLowService;

  beforeEach(() => {
    mockDataClient = {
      getHistoricalData: jest.fn(),
      getQuote: jest.fn(),
    } as unknown as jest.Mocked<TradingDataClient>;

    service = new Week52HighLowService(mockDataClient);
  });

  describe('calculate52WeekHighLow', () => {
    it('should calculate 52-week high and low', async () => {
      const mockData: OHLCVData[] = Array.from({ length: 260 }, (_, i) => {
        // Create data with a high around day 130 and low around day 65
        const basePrice = 100;
        const variation = Math.sin(i / 50) * 30;
        return {
          date: new Date(2023, 0, i + 1),
          open: basePrice,
          high: basePrice + variation + 10,
          low: basePrice + variation - 10,
          close: basePrice + variation,
          volume: 1000000,
        };
      });

      mockDataClient.getHistoricalData.mockResolvedValue(mockData);

      const result = await service.calculate52WeekHighLow('AAPL');

      expect(result).toBeDefined();
      expect(result.symbol).toBe('AAPL');
      expect(result.high52Week).toBeGreaterThan(100);
      expect(result.low52Week).toBeLessThan(100);
      expect(result.high52WeekDate).toBeInstanceOf(Date);
      expect(result.low52WeekDate).toBeInstanceOf(Date);
      expect(result.timestamp).toBeInstanceOf(Date);
    });

    it('should request data for 364 days', async () => {
      const mockData: OHLCVData[] = Array.from({ length: 260 }, (_, i) => ({
        date: new Date(2023, 0, i + 1),
        open: 100,
        high: 105,
        low: 95,
        close: 100,
        volume: 1000000,
      }));

      mockDataClient.getHistoricalData.mockResolvedValue(mockData);

      await service.calculate52WeekHighLow('AAPL');

      expect(mockDataClient.getHistoricalData).toHaveBeenCalledWith(
        expect.objectContaining({
          symbol: 'AAPL',
          interval: '1d',
        })
      );
    });

    it('should throw error with no data', async () => {
      mockDataClient.getHistoricalData.mockResolvedValue([]);

      await expect(service.calculate52WeekHighLow('INVALID')).rejects.toThrow(
        /No historical data found/
      );
    });

    it('should handle specific high and low values', async () => {
      const highDate = new Date(2023, 6, 15);
      const lowDate = new Date(2023, 2, 10);

      const mockData: OHLCVData[] = [
        { date: new Date(2023, 0, 1), open: 100, high: 110, low: 95, close: 105, volume: 1000 },
        { date: lowDate, open: 90, high: 95, low: 75, close: 85, volume: 1000 },
        { date: new Date(2023, 5, 1), open: 100, high: 120, low: 100, close: 115, volume: 1000 },
        { date: highDate, open: 130, high: 180, low: 125, close: 175, volume: 1000 },
        { date: new Date(2023, 11, 1), open: 140, high: 145, low: 135, close: 140, volume: 1000 },
      ];

      mockDataClient.getHistoricalData.mockResolvedValue(mockData);

      const result = await service.calculate52WeekHighLow('AAPL');

      expect(result.high52Week).toBe(180);
      expect(result.low52Week).toBe(75);
      expect(result.high52WeekDate).toEqual(highDate);
      expect(result.low52WeekDate).toEqual(lowDate);
    });

    it('should handle single data point', async () => {
      const mockData: OHLCVData[] = [
        { date: new Date(2024, 0, 1), open: 100, high: 105, low: 95, close: 102, volume: 1000 },
      ];

      mockDataClient.getHistoricalData.mockResolvedValue(mockData);

      const result = await service.calculate52WeekHighLow('AAPL');

      expect(result.high52Week).toBe(105);
      expect(result.low52Week).toBe(95);
      expect(result.high52WeekDate).toEqual(mockData[0].date);
      expect(result.low52WeekDate).toEqual(mockData[0].date);
    });

    it('should work with Forex symbols', async () => {
      const mockData: OHLCVData[] = Array.from({ length: 260 }, (_, i) => ({
        date: new Date(2023, 0, i + 1),
        open: 1.08,
        high: 1.09 + i * 0.0001,
        low: 1.07 - i * 0.0001,
        close: 1.08,
        volume: 1000000,
      }));

      mockDataClient.getHistoricalData.mockResolvedValue(mockData);

      const result = await service.calculate52WeekHighLow('EURUSD');

      expect(result).toBeDefined();
      expect(result.symbol).toBe('EURUSD');
      expect(result.high52Week).toBeGreaterThan(1.0);
      expect(result.low52Week).toBeLessThan(1.2);
    });

    it('should handle multiple occurrences of same high', async () => {
      const firstDate = new Date(2023, 0, 1);
      const mockData: OHLCVData[] = [
        { date: firstDate, open: 100, high: 150, low: 95, close: 105, volume: 1000 },
        { date: new Date(2023, 6, 1), open: 100, high: 150, low: 95, close: 105, volume: 1000 },
      ];

      mockDataClient.getHistoricalData.mockResolvedValue(mockData);

      const result = await service.calculate52WeekHighLow('AAPL');

      // Should use first occurrence
      expect(result.high52Week).toBe(150);
      expect(result.high52WeekDate).toEqual(firstDate);
    });
  });
});
