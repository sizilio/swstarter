const pool = require('../config/database');

class Statistic {
  
  // Save computed statistics
  static async create(topQueries, avgResponseTime, mostPopularHour, totalQueries) {
    try {
      const result = await pool.query(
        `INSERT INTO statistics (top_queries, avg_response_time, most_popular_hour, total_queries)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [JSON.stringify(topQueries), avgResponseTime, mostPopularHour, totalQueries]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error creating statistics:', error);
      throw error;
    }
  }

  // Get latest statistics
  static async getLatest() {
    try {
      const result = await pool.query(
        'SELECT * FROM statistics ORDER BY computed_at DESC LIMIT 1'
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error fetching latest statistics:', error);
      throw error;
    }
  }

  // Delete old statistics (keep only last 10)
  static async cleanOld() {
    try {
      await pool.query(
        `DELETE FROM statistics
         WHERE id NOT IN (
           SELECT id FROM statistics
           ORDER BY computed_at DESC
           LIMIT 10
         )`
      );
    } catch (error) {
      console.error('Error cleaning old statistics:', error);
      throw error;
    }
  }

}

module.exports = Statistic;