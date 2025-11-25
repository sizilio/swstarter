const pool = require('../config/database');
const Statistic = require('../models/Statistic');

class StatisticsService {
  
  // Compute top 5 search terms with percentages
  static async computeTopQueries() {
    try {
      const result = await pool.query(`
        SELECT
          search_term,
          COUNT(*) as count,
          ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM queries)), 2) as percentage
        FROM queries
        GROUP BY search_term
        ORDER BY count DESC
        LIMIT 5
      `);
      return result.rows;
    } catch (error) {
      console.error('Error computing top queries:', error);
      return [];
    }
  }

  // Compute average response time
  static async computeAvgResponseTime() {
    try {
      const result = await pool.query(`
        SELECT AVG(response_time_ms) as avg_time
        FROM queries
      `);
      return parseFloat(result.rows[0]?.avg_time || 0).toFixed(2);
    } catch (error) {
      console.error('Error computing average response time:', error);
      return 0;
    }
  }

  // Compute most popular hour of day
  static async computeMostPopularHour() {
    try {
      const result = await pool.query(`
        SELECT
          EXTRACT(HOUR FROM created_at) as hour,
          COUNT(*) as count
        FROM queries
        GROUP BY hour
        ORDER BY count DESC
        LIMIT 1
      `);
      return result.rows[0]?.hour || 0;
    } catch (error) {
      console.error('Error computing most popular hour:', error);
      return 0;
    }
  }

  // Get total number of queries
  static async getTotalQueries() {
    try {
      const result = await pool.query('SELECT COUNT(*) as total FROM queries');
      return parseInt(result.rows[0]?.total || 0);
    } catch (error) {
      console.error('Error getting total queries:', error);
      return 0;
    }
  }

  // Compute all statistics and save to database
  static async computeAndSave() {
    try {
      const [topQueries, avgResponseTime, mostPopularHour, totalQueries] = await Promise.all([
        this.computeTopQueries(),
        this.computeAvgResponseTime(),
        this.computeMostPopularHour(),
        this.getTotalQueries()
      ]);

      // Save to database
      await Statistic.create(topQueries, avgResponseTime, mostPopularHour, totalQueries);

      // Clean old statistics
      await Statistic.cleanOld();

      return {
        topQueries,
        avgResponseTime,
        mostPopularHour,
        totalQueries
      };
    } catch (error) {
      console.error('Error computing and saving statistics:', error);
      throw error;
    }
  }
}

module.exports = StatisticsService;
