import { AllTimeHighLowService } from './all-time-high-low-service.js';
import type { TradingDataClient, OHLCVData } from '@lc-trading-services/trading-data-client';

describe('AllTimeHighLowService', () => {
  let mockDataClient: jest.Mocked<TradingDataClient>;
  let service: AllTimeHighLowService;

  beforeEach(() => {
    mockDataClient = {
      getHistoricalData: jest.fn(),
      getQuote: jest.fn(),
    } as unknown as jest.Mocked<TradingDataClient>;

    service = new AllTimeHighLowService(mockDataClient);
  });

  describe('calculateAllTimeHighLow', () => {
    it('should calculate all-time high and low', async () => {
      const mockData: OHLCVData[] = [
        { date: new Date(2020, 0, 1), open: 100, high: 110, low: 90, close: 105, volume: 1000 },
        { date: new Date(2020, 6, 1), open: 105, high: 150, low: 100, close: 140, volume: 1000 }, // ATH
        { date: new Date(2021, 0, 1), open: 140, high: 145, low: 130, close: 135, volume: 1000 },
        { date: new Date(2021, 6, 1), open: 135, high: 140, low: 80, close: 85, volume: 1000 }, // ATL
        { date: new Date(2022, 0, 1), open: 85, high: 120, low: 85, close: 115, volume: 1000 },
      ];

      mockDataClient.getHistoricalData.mockResolvedValue(mockData);

      const result = await service.calculateAllTimeHighLow('AAPL');

      expect(result).toBeDefined();
      expect(result.symbol).toBe('AAPL');
      expect(result.allTimeHigh).toBe(150);
      expect(result.allTimeHighDate).toEqual(new Date(2020, 6, 1));
      expect(result.allTimeLow).toBe(80);
      expect(result.allTimeLowDate).toEqual(new Date(2021, 6, 1));
      expect(result.timestamp).toBeInstanceOf(Date);
    });

    it('should handle custom lookback period', async () => {
      const mockData: OHLCVData[] = Array.from({ length: 100 }, (_, i) => ({
        date: new Date(2020, 0, i + 1),
        open: 100,
        high: 100 + i,
        low: 90 - i * 0.1,
        close: 100,
        volume: 1000,
      }));

      mockDataClient.getHistoricalData.mockResolvedValue(mockData);

      const result = await service.calculateAllTimeHighLow('AAPL', 10);

      expect(result).toBeDefined();
      expect(mockDataClient.getHistoricalData).toHaveBeenCalledWith(
        expect.objectContaining({
          symbol: 'AAPL',
          interval: '1d',
        })
      );
    });

    it('should throw error with no data', async () => {
      mockDataClient.getHistoricalData.mockResolvedValue([]);

      await expect(service.calculateAllTimeHighLow('INVALID')).rejects.toThrow(
        /No historical data found/
      );
    });

    it('should handle single data point', async () => {
      const mockData: OHLCVData[] = [
        { date: new Date(2024, 0, 1), open: 100, high: 105, low: 95, close: 102, volume: 1000 },
      ];

      mockDataClient.getHistoricalData.mockResolvedValue(mockData);

      const result = await service.calculateAllTimeHighLow('AAPL');

      expect(result.allTimeHigh).toBe(105);
      expect(result.allTimeLow).toBe(95);
      expect(result.allTimeHighDate).toEqual(mockData[0].date);
      expect(result.allTimeLowDate).toEqual(mockData[0].date);
    });

    it('should identify correct dates for highs and lows', async () => {
      const highDate = new Date(2023, 5, 15);
      const lowDate = new Date(2023, 2, 10);

      const mockData: OHLCVData[] = [
        { date: new Date(2023, 0, 1), open: 100, high: 110, low: 95, close: 105, volume: 1000 },
        { date: lowDate, open: 90, high: 95, low: 80, close: 85, volume: 1000 },
        { date: new Date(2023, 4, 1), open: 100, high: 120, low: 100, close: 115, volume: 1000 },
        { date: highDate, open: 130, high: 160, low: 125, close: 155, volume: 1000 },
        { date: new Date(2023, 11, 1), open: 140, high: 145, low: 135, close: 140, volume: 1000 },
      ];

      mockDataClient.getHistoricalData.mockResolvedValue(mockData);

      const result = await service.calculateAllTimeHighLow('AAPL');

      expect(result.allTimeHighDate).toEqual(highDate);
      expect(result.allTimeLowDate).toEqual(lowDate);
    });

    it('should handle multiple occurrences of same high', async () => {
      const mockData: OHLCVData[] = [
        { date: new Date(2023, 0, 1), open: 100, high: 150, low: 95, close: 105, volume: 1000 },
        { date: new Date(2023, 6, 1), open: 100, high: 150, low: 95, close: 105, volume: 1000 },
      ];

      mockDataClient.getHistoricalData.mockResolvedValue(mockData);

      const result = await service.calculateAllTimeHighLow('AAPL');

      // Should use first occurrence
      expect(result.allTimeHigh).toBe(150);
      expect(result.allTimeHighDate).toEqual(new Date(2023, 0, 1));
    });
  });
});
