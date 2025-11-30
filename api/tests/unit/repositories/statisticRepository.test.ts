import '../../mocks/prisma.mock';
import { prismaMock } from '../../mocks/prisma.mock';
import { statisticRepository } from '../../../repositories/statisticRepository';
import { Prisma } from '@prisma/client';

describe('Statistic Repository', () => {
  const mockStatistic = {
    id: 1,
    topQueries: [
      { search_term: 'luke', count: '10', percentage: '50' },
      { search_term: 'vader', count: '6', percentage: '30' },
    ],
    avgResponseTime: new Prisma.Decimal(150.5),
    mostPopularHour: 14,
    totalQueries: 20,
    computedAt: new Date('2024-01-01T12:00:00Z'),
  };

  describe('create', () => {
    it('should create a new statistic record', async () => {
      prismaMock.statistic.create.mockResolvedValue(mockStatistic);

      const data = {
        topQueries: [
          { search_term: 'luke', count: '10', percentage: '50' },
        ],
        avgResponseTime: 150.5,
        mostPopularHour: 14,
        totalQueries: 20,
      };

      const result = await statisticRepository.create(data);

      expect(result).toEqual(mockStatistic);
      expect(prismaMock.statistic.create).toHaveBeenCalledWith({
        data: {
          topQueries: data.topQueries,
          avgResponseTime: expect.any(Prisma.Decimal),
          mostPopularHour: 14,
          totalQueries: 20,
        },
      });
    });
  });

  describe('getLatest', () => {
    it('should return the most recent statistic', async () => {
      prismaMock.statistic.findFirst.mockResolvedValue(mockStatistic);

      const result = await statisticRepository.getLatest();

      expect(result).toEqual(mockStatistic);
      expect(prismaMock.statistic.findFirst).toHaveBeenCalledWith({
        orderBy: { computedAt: 'desc' },
      });
    });

    it('should return null when no statistics exist', async () => {
      prismaMock.statistic.findFirst.mockResolvedValue(null);

      const result = await statisticRepository.getLatest();

      expect(result).toBeNull();
    });
  });

  describe('cleanOld', () => {
    it('should keep only the specified number of recent statistics', async () => {
      const latestIds = [{ id: 1 }, { id: 2 }, { id: 3 }];
      prismaMock.statistic.findMany.mockResolvedValue(latestIds as any);
      prismaMock.statistic.deleteMany.mockResolvedValue({ count: 5 });

      await statisticRepository.cleanOld(3);

      expect(prismaMock.statistic.findMany).toHaveBeenCalledWith({
        select: { id: true },
        orderBy: { computedAt: 'desc' },
        take: 3,
      });
      expect(prismaMock.statistic.deleteMany).toHaveBeenCalledWith({
        where: { id: { notIn: [1, 2, 3] } },
      });
    });

    it('should use default keepCount of 10', async () => {
      const latestIds = Array.from({ length: 10 }, (_, i) => ({ id: i + 1 }));
      prismaMock.statistic.findMany.mockResolvedValue(latestIds as any);
      prismaMock.statistic.deleteMany.mockResolvedValue({ count: 0 });

      await statisticRepository.cleanOld();

      expect(prismaMock.statistic.findMany).toHaveBeenCalledWith({
        select: { id: true },
        orderBy: { computedAt: 'desc' },
        take: 10,
      });
    });

    it('should not delete if no statistics to keep', async () => {
      prismaMock.statistic.findMany.mockResolvedValue([]);

      await statisticRepository.cleanOld(5);

      expect(prismaMock.statistic.deleteMany).not.toHaveBeenCalled();
    });
  });
});
