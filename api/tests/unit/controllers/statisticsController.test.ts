import '../../mocks/prisma.mock';
import { Request, Response, NextFunction } from 'express';
import { prismaMock } from '../../mocks/prisma.mock';
import StatisticsController from '../../../controllers/statisticsController';
import { Prisma } from '@prisma/client';

describe('StatisticsController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  describe('getStatistics', () => {
    it('should return default statistics when no data exists', async () => {
      prismaMock.statistic.findFirst.mockResolvedValue(null);

      await StatisticsController.getStatistics(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'No statistics available yet',
        data: {
          topQueries: [],
          avgResponseTime: 0,
          mostPopularHour: 0,
          totalQueries: 0,
        },
      });
    });

    it('should return formatted statistics when data exists', async () => {
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

      prismaMock.statistic.findFirst.mockResolvedValue(mockStatistic);

      await StatisticsController.getStatistics(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: {
          topQueries: mockStatistic.topQueries,
          avgResponseTime: 150.5,
          mostPopularHour: 14,
          totalQueries: 20,
          computedAt: mockStatistic.computedAt,
        },
      });
    });

    it('should call next with error on database failure', async () => {
      prismaMock.statistic.findFirst.mockRejectedValue(new Error('DB error'));

      await StatisticsController.getStatistics(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
