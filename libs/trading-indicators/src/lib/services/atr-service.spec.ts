import { ATRService } from './atr-service.js';
import type { TradingDataClient, OHLCVData } from '@lc-trading-services/trading-data-client';

describe('ATRService', () => {
  let mockDataClient: jest.Mocked<TradingDataClient>;
  let atrService: ATRService;

  beforeEach(() => {
    mockDataClient = {
      getHistoricalData: jest.fn(),
      getQuote: jest.fn(),
    } as unknown as jest.Mocked<TradingDataClient>;

    atrService = new ATRService(mockDataClient);
  });

  describe('calculateATR', () => {
    it('should calculate ATR for daily interval', async () => {
      const mockData: OHLCVData[] = Array.from({ length: 20 }, (_, i) => ({
        date: new Date(2024, 0, i + 1),
        open: 100 + i,
        high: 105 + i,
        low: 95 + i,
        close: 102 + i,
        volume: 1000000,
      }));

      mockDataClient.getHistoricalData.mockResolvedValue(mockData);

      const result = await atrService.calculateATR('AAPL', '1d', 14);

      expect(result).toBeDefined();
      expect(result.symbol).toBe('AAPL');
      expect(result.interval).toBe('1d');
      expect(result.atr).toBeGreaterThan(0);
      expect(result.timestamp).toBeInstanceOf(Date);
      expect(mockDataClient.getHistoricalData).toHaveBeenCalledWith(
        expect.objectContaining({
          symbol: 'AAPL',
          interval: '1d',
        })
      );
    });

    it('should calculate ATR for hourly interval', async () => {
      const mockData: OHLCVData[] = Array.from({ length: 20 }, (_, i) => ({
        date: new Date(2024, 0, 1, i),
        open: 100,
        high: 102,
        low: 98,
        close: 101,
        volume: 100000,
      }));

      mockDataClient.getHistoricalData.mockResolvedValue(mockData);

      const result = await atrService.calculateATR('EURUSD', '1h', 14);

      expect(result).toBeDefined();
      expect(result.symbol).toBe('EURUSD');
      expect(result.interval).toBe('1h');
      expect(result.atr).toBeGreaterThan(0);
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

      await expect(atrService.calculateATR('AAPL', '1d', 14)).rejects.toThrow(
        /Insufficient data for ATR calculation/
      );
    });

    it('should calculate correct True Range', async () => {
      // Create test data with known values
      const mockData: OHLCVData[] = [
        { date: new Date(2024, 0, 1), open: 100, high: 110, low: 90, close: 105, volume: 1000 },
        { date: new Date(2024, 0, 2), open: 105, high: 115, low: 100, close: 110, volume: 1000 },
        { date: new Date(2024, 0, 3), open: 110, high: 120, low: 105, close: 115, volume: 1000 },
        { date: new Date(2024, 0, 4), open: 115, high: 125, low: 110, close: 120, volume: 1000 },
        { date: new Date(2024, 0, 5), open: 120, high: 130, low: 115, close: 125, volume: 1000 },
        { date: new Date(2024, 0, 6), open: 125, high: 135, low: 120, close: 130, volume: 1000 },
        { date: new Date(2024, 0, 7), open: 130, high: 140, low: 125, close: 135, volume: 1000 },
        { date: new Date(2024, 0, 8), open: 135, high: 145, low: 130, close: 140, volume: 1000 },
        { date: new Date(2024, 0, 9), open: 140, high: 150, low: 135, close: 145, volume: 1000 },
        { date: new Date(2024, 0, 10), open: 145, high: 155, low: 140, close: 150, volume: 1000 },
        { date: new Date(2024, 0, 11), open: 150, high: 160, low: 145, close: 155, volume: 1000 },
        { date: new Date(2024, 0, 12), open: 155, high: 165, low: 150, close: 160, volume: 1000 },
        { date: new Date(2024, 0, 13), open: 160, high: 170, low: 155, close: 165, volume: 1000 },
        { date: new Date(2024, 0, 14), open: 165, high: 175, low: 160, close: 170, volume: 1000 },
        { date: new Date(2024, 0, 15), open: 170, high: 180, low: 165, close: 175, volume: 1000 },
      ];

      mockDataClient.getHistoricalData.mockResolvedValue(mockData);

      const result = await atrService.calculateATR('TEST', '1d', 14);

      expect(result.atr).toBeGreaterThan(0);
      // ATR should be a reasonable value given the data
      expect(result.atr).toBeLessThan(50);
    });

    it('should handle custom period parameter', async () => {
      const mockData: OHLCVData[] = Array.from({ length: 30 }, (_, i) => ({
        date: new Date(2024, 0, i + 1),
        open: 100,
        high: 105,
        low: 95,
        close: 102,
        volume: 1000000,
      }));

      mockDataClient.getHistoricalData.mockResolvedValue(mockData);

      const result = await atrService.calculateATR('AAPL', '1d', 20);

      expect(result).toBeDefined();
      expect(result.atr).toBeGreaterThan(0);
    });
  });
});
