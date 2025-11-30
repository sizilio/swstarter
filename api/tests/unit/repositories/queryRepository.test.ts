import '../../mocks/prisma.mock';
import { prismaMock } from '../../mocks/prisma.mock';
import { queryRepository } from '../../../repositories/queryRepository';

describe('Query Repository', () => {
  const mockQuery = {
    id: 1,
    searchTerm: 'luke',
    searchType: 'people',
    resultsCount: 1,
    responseTimeMs: 150,
    createdAt: new Date('2024-01-01T12:00:00Z'),
  };

  describe('create', () => {
    it('should create a new query record', async () => {
      prismaMock.query.create.mockResolvedValue(mockQuery);

      const data = {
        searchTerm: 'luke',
        searchType: 'people',
        resultsCount: 1,
        responseTimeMs: 150,
      };

      const result = await queryRepository.create(data);

      expect(result).toEqual(mockQuery);
      expect(prismaMock.query.create).toHaveBeenCalledWith({ data });
    });
  });

  describe('findAll', () => {
    it('should return all queries ordered by createdAt desc', async () => {
      const mockQueries = [mockQuery, { ...mockQuery, id: 2 }];
      prismaMock.query.findMany.mockResolvedValue(mockQueries);

      const result = await queryRepository.findAll();

      expect(result).toEqual(mockQueries);
      expect(prismaMock.query.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should return empty array when no queries exist', async () => {
      prismaMock.query.findMany.mockResolvedValue([]);

      const result = await queryRepository.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findByDateRange', () => {
    it('should return queries within date range', async () => {
      const mockQueries = [mockQuery];
      prismaMock.query.findMany.mockResolvedValue(mockQueries);

      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');

      const result = await queryRepository.findByDateRange(startDate, endDate);

      expect(result).toEqual(mockQueries);
      expect(prismaMock.query.findMany).toHaveBeenCalledWith({
        where: {
          createdAt: { gte: startDate, lte: endDate },
        },
      });
    });
  });

  describe('count', () => {
    it('should return total query count', async () => {
      prismaMock.query.count.mockResolvedValue(100);

      const result = await queryRepository.count();

      expect(result).toBe(100);
      expect(prismaMock.query.count).toHaveBeenCalled();
    });
  });

  describe('getAverageResponseTime', () => {
    it('should return average response time', async () => {
      prismaMock.query.aggregate.mockResolvedValue({
        _avg: { responseTimeMs: 150.5 },
        _count: {},
        _sum: {},
        _min: {},
        _max: {},
      });

      const result = await queryRepository.getAverageResponseTime();

      expect(result).toBe(150.5);
      expect(prismaMock.query.aggregate).toHaveBeenCalledWith({
        _avg: { responseTimeMs: true },
      });
    });

    it('should return 0 when no queries exist', async () => {
      prismaMock.query.aggregate.mockResolvedValue({
        _avg: { responseTimeMs: null },
        _count: {},
        _sum: {},
        _min: {},
        _max: {},
      });

      const result = await queryRepository.getAverageResponseTime();

      expect(result).toBe(0);
    });
  });
});
