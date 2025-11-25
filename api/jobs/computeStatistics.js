const StatisticsService = require('../services/statisticsService');

// Job to compute statistics (runs every 5 minutes)
async function computeStatistics() {
  try {
    console.log('Computing statistics...');
    const stats = await StatisticsService.computeAndSave();
    console.log('Statistics computed:', {
      totalQueries: stats.totalQueries,
      avgResponseTime: stats.avgResponseTime,
      topQueriesCount: stats.topQueries.length
    });
    return stats;
  } catch (error) {
    console.error('Error in computeStatistics job:', error);
    throw error;
  }
}

module.exports = { computeStatistics };