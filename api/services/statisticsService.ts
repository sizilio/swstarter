import prisma from '../lib/prisma';
import { statisticRepository } from '../repositories';
import { TopQuery, StatisticsData } from '../types';
import { Prisma } from '@prisma/client';
import logger from '../lib/logger';

interface TopQueryRaw {
  search_term: string;
  count: bigint;
  percentage: Prisma.Decimal;
}

interface PopularHourRaw {
  hour: number;
  count: bigint;
}

class StatisticsService {
  // Compute top 5 search terms with percentages
  static async computeTopQueries(): Promise<TopQuery[]> {
    try {
      const results = await prisma.$queryRaw<TopQueryRaw[]>`
        SELECT
          search_term,
          COUNT(*) as count,
          ROUND((COUNT(*) * 100.0 / NULLIF((SELECT COUNT(*) FROM queries), 0)), 2) as percentage
        FROM queries
        GROUP BY search_term
        ORDER BY count DESC
        LIMIT 5
      `;

      return results.map((row) => ({
        search_term: row.search_term,
        count: row.count.toString(),
        percentage: row.percentage?.toString() || '0',
      }));
    } catch (error: any) {
      logger.error({ error: error.message }, 'Error computing top queries');
      return [];
    }
  }

  // Compute average response time
  static async computeAvgResponseTime(): Promise<number> {
    try {
      const result = await prisma.query.aggregate({
        _avg: { responseTimeMs: true },
      });
      const avg = result._avg.responseTimeMs ?? 0;
      return Math.round(avg * 100) / 100;
    } catch (error: any) {
      logger.error({ error: error.message }, 'Error computing average response time');
      return 0;
    }
  }

  // Compute most popular hour of day
  static async computeMostPopularHour(): Promise<number> {
    try {
      const results = await prisma.$queryRaw<PopularHourRaw[]>`
        SELECT
          EXTRACT(HOUR FROM created_at)::integer as hour,
          COUNT(*) as count
        FROM queries
        GROUP BY hour
        ORDER BY count DESC
        LIMIT 1
      `;

      return results[0]?.hour ?? 0;
    } catch (error: any) {
      logger.error({ error: error.message }, 'Error computing most popular hour');
      return 0;
    }
  }

  // Get total number of queries
  static async getTotalQueries(): Promise<number> {
    try {
      return await prisma.query.count();
    } catch (error: any) {
      logger.error({ error: error.message }, 'Error getting total queries');
      return 0;
    }
  }

  // Compute all statistics and save to database
  static async computeAndSave(): Promise<StatisticsData> {
    try {
      const [topQueries, avgResponseTime, mostPopularHour, totalQueries] =
        await Promise.all([
          this.computeTopQueries(),
          this.computeAvgResponseTime(),
          this.computeMostPopularHour(),
          this.getTotalQueries(),
        ]);

      // Save to database using repository
      await statisticRepository.create({
        topQueries,
        avgResponseTime,
        mostPopularHour,
        totalQueries,
      });

      // Clean old statistics
      await statisticRepository.cleanOld();

      return {
        topQueries,
        avgResponseTime,
        mostPopularHour,
        totalQueries,
      };
    } catch (error: any) {
      logger.error({ error: error.message }, 'Error computing and saving statistics');
      throw error;
    }
  }
}

export default StatisticsService;
