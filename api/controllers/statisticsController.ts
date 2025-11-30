import { Request, Response, NextFunction } from 'express';
import { statisticRepository } from '../repositories';
import { TopQuery } from '../types';

class StatisticsController {
  // Get latest statistics
  static async getStatistics(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const stats = await statisticRepository.getLatest();

      if (!stats) {
        res.json({
          success: true,
          message: 'No statistics available yet',
          data: {
            topQueries: [],
            avgResponseTime: 0,
            mostPopularHour: 0,
            totalQueries: 0,
          },
        });
        return;
      }

      // Prisma handles JSON natively - no parsing needed
      res.json({
        success: true,
        data: {
          topQueries: stats.topQueries as unknown as TopQuery[],
          avgResponseTime: Number(stats.avgResponseTime),
          mostPopularHour: stats.mostPopularHour,
          totalQueries: stats.totalQueries,
          computedAt: stats.computedAt,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default StatisticsController;
