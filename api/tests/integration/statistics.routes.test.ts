import '../mocks/prisma.mock';
import '../mocks/logger.mock';
import request from 'supertest';
import { prismaMock } from '../mocks/prisma.mock';
import { Prisma } from '@prisma/client';
import { createTestApp } from './app';

const app = createTestApp();

describe('Statistics Routes Integration Tests', () => {
  describe('GET /api/statistics', () => {
    it('should return default statistics when no data exists', async () => {
      prismaMock.statistic.findFirst.mockResolvedValue(null);

      const response = await request(app)
        .get('/api/statistics')
        .expect(200);

      expect(response.body).toEqual({
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

      const response = await request(app)
        .get('/api/statistics')
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        data: {
          topQueries: [
            { search_term: 'luke', count: '10', percentage: '50' },
            { search_term: 'vader', count: '6', percentage: '30' },
          ],
          avgResponseTime: 150.5,
          mostPopularHour: 14,
          totalQueries: 20,
          computedAt: '2024-01-01T12:00:00.000Z',
        },
      });
    });

    it('should return 500 when database error occurs', async () => {
      prismaMock.statistic.findFirst.mockRejectedValue(new Error('DB connection failed'));

      const response = await request(app)
        .get('/api/statistics')
        .expect(500);

      expect(response.body).toEqual({
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
      });
    });
  });
});
