import StatisticsService from '../services/statisticsService';
import { StatisticsData } from '../types';
import logger from '../lib/logger';

// Job to compute statistics (runs every 5 minutes)
async function computeStatistics(): Promise<StatisticsData> {
  try {
    logger.info('Computing statistics...');
    const stats = await StatisticsService.computeAndSave();
    logger.info(
      {
        totalQueries: stats.totalQueries,
        avgResponseTime: stats.avgResponseTime,
        topQueriesCount: stats.topQueries.length,
      },
      'Statistics computed'
    );
    return stats;
  } catch (error: any) {
    logger.error({ error: error.message }, 'Error in computeStatistics job');
    throw error;
  }
}

export { computeStatistics };
