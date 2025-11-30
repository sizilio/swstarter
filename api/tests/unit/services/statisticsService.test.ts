import '../../mocks/prisma.mock';
import '../../mocks/logger.mock';
import { prismaMock } from '../../mocks/prisma.mock';
import { loggerMock } from '../../mocks/logger.mock';
import StatisticsService from '../../../services/statisticsService';
import { Prisma } from '@prisma/client';

// Mock the statisticRepository
jest.mock('../../../repositories', () => ({
  statisticRepository: {
    create: jest.fn(),
    cleanOld: jest.fn(),
  },
}));

import { statisticRepository } from '../../../repositories';

const mockedStatisticRepository = statisticRepository as jest.Mocked<typeof statisticRepository>;

describe('StatisticsService', () => {
  describe('computeTopQueries', () => {
    it('should return formatted top queries', async () => {
      const mockRawResults = [
        { search_term: 'luke', count: BigInt(10), percentage: new Prisma.Decimal(50) },
        { search_term: 'vader', count: BigInt(6), percentage: new Prisma.Decimal(30) },
      ];
      prismaMock.$queryRaw.mockResolvedValue(mockRawResults);

      const result = await StatisticsService.computeTopQueries();

      expect(result).toEqual([
        { search_term: 'luke', count: '10', percentage: '50' },
        { search_term: 'vader', count: '6', percentage: '30' },
      ]);
    });

    it('should return empty array on error', async () => {
      prismaMock.$queryRaw.mockRejectedValue(new Error('DB error'));

      const result = await StatisticsService.computeTopQueries();

      expect(result).toEqual([]);
      expect(loggerMock.error).toHaveBeenCalled();
    });

    it('should handle null percentage', async () => {
      const mockRawResults = [
        { search_term: 'luke', count: BigInt(10), percentage: null },
      ];
      prismaMock.$queryRaw.mockResolvedValue(mockRawResults);

      const result = await StatisticsService.computeTopQueries();

      expect(result[0].percentage).toBe('0');
    });
  });

  describe('computeAvgResponseTime', () => {
    it('should return rounded average response time', async () => {
      prismaMock.query.aggregate.mockResolvedValue({
        _avg: { responseTimeMs: 150.567 },
        _count: {},
        _sum: {},
        _min: {},
        _max: {},
      });

      const result = await StatisticsService.computeAvgResponseTime();

      expect(result).toBe(150.57);
    });

    it('should return 0 when no queries exist', async () => {
      prismaMock.query.aggregate.mockResolvedValue({
        _avg: { responseTimeMs: null },
        _count: {},
        _sum: {},
        _min: {},
        _max: {},
      });

      const result = await StatisticsService.computeAvgResponseTime();

      expect(result).toBe(0);
    });

    it('should return 0 on error', async () => {
      prismaMock.query.aggregate.mockRejectedValue(new Error('DB error'));

      const result = await StatisticsService.computeAvgResponseTime();

      expect(result).toBe(0);
      expect(loggerMock.error).toHaveBeenCalled();
    });
  });

  describe('computeMostPopularHour', () => {
    it('should return most popular hour', async () => {
      const mockRawResults = [{ hour: 14, count: BigInt(100) }];
      prismaMock.$queryRaw.mockResolvedValue(mockRawResults);

      const result = await StatisticsService.computeMostPopularHour();

      expect(result).toBe(14);
    });

    it('should return 0 when no queries exist', async () => {
      prismaMock.$queryRaw.mockResolvedValue([]);

      const result = await StatisticsService.computeMostPopularHour();

      expect(result).toBe(0);
    });

    it('should return 0 on error', async () => {
      prismaMock.$queryRaw.mockRejectedValue(new Error('DB error'));

      const result = await StatisticsService.computeMostPopularHour();

      expect(result).toBe(0);
      expect(loggerMock.error).toHaveBeenCalled();
    });
  });

  describe('getTotalQueries', () => {
    it('should return total query count', async () => {
      prismaMock.query.count.mockResolvedValue(100);

      const result = await StatisticsService.getTotalQueries();

      expect(result).toBe(100);
    });

    it('should return 0 on error', async () => {
      prismaMock.query.count.mockRejectedValue(new Error('DB error'));

      const result = await StatisticsService.getTotalQueries();

      expect(result).toBe(0);
      expect(loggerMock.error).toHaveBeenCalled();
    });
  });

  describe('computeAndSave', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should compute all statistics and save', async () => {
      const mockTopQueries = [
        { search_term: 'luke', count: BigInt(10), percentage: new Prisma.Decimal(50) },
      ];

      prismaMock.$queryRaw
        .mockResolvedValueOnce(mockTopQueries)
        .mockResolvedValueOnce([{ hour: 14, count: BigInt(100) }]);

      prismaMock.query.aggregate.mockResolvedValue({
        _avg: { responseTimeMs: 150.5 },
        _count: {},
        _sum: {},
        _min: {},
        _max: {},
      });

      prismaMock.query.count.mockResolvedValue(20);

      mockedStatisticRepository.create.mockResolvedValue({} as any);
      mockedStatisticRepository.cleanOld.mockResolvedValue();

      const result = await StatisticsService.computeAndSave();

      expect(result).toEqual({
        topQueries: [{ search_term: 'luke', count: '10', percentage: '50' }],
        avgResponseTime: 150.5,
        mostPopularHour: 14,
        totalQueries: 20,
      });

      expect(mockedStatisticRepository.create).toHaveBeenCalledWith({
        topQueries: [{ search_term: 'luke', count: '10', percentage: '50' }],
        avgResponseTime: 150.5,
        mostPopularHour: 14,
        totalQueries: 20,
      });

      expect(mockedStatisticRepository.cleanOld).toHaveBeenCalled();
    });

    it('should throw error on repository create failure', async () => {
      const mockTopQueries = [
        { search_term: 'luke', count: BigInt(10), percentage: new Prisma.Decimal(50) },
      ];

      prismaMock.$queryRaw
        .mockResolvedValueOnce(mockTopQueries)
        .mockResolvedValueOnce([{ hour: 14, count: BigInt(100) }]);

      prismaMock.query.aggregate.mockResolvedValue({
        _avg: { responseTimeMs: 150.5 },
        _count: {},
        _sum: {},
        _min: {},
        _max: {},
      });

      prismaMock.query.count.mockResolvedValue(20);

      mockedStatisticRepository.create.mockRejectedValue(new Error('DB write failed'));

      await expect(StatisticsService.computeAndSave()).rejects.toThrow('DB write failed');
      expect(loggerMock.error).toHaveBeenCalled();
    });
  });
});
