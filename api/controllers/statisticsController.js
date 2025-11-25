const Statistic = require('../models/Statistic');

class StatisticsController {
  
  // Get latest statistics
  static async getStatistics(req, res) {
    try {
      const stats = await Statistic.getLatest();

      if (!stats) {
        return res.json({
          success: true,
          message: 'No statistics available yet',
          data: {
            topQueries: [],
            avgResponseTime: 0,
            mostPopularHour: 0,
            totalQueries: 0
          }
        });
      }

      res.json({
        success: true,
        data: {
          topQueries: stats.top_queries,
          avgResponseTime: parseFloat(stats.avg_response_time),
          mostPopularHour: parseInt(stats.most_popular_hour),
          totalQueries: parseInt(stats.total_queries),
          computedAt: stats.computed_at
        }
      });
    } catch (error) {
      console.error('Get statistics error:', error);
      res.status(500).json({ error: 'Failed to fetch statistics' });
    }
  }

}

module.exports = StatisticsController;