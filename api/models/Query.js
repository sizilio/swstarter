const pool = require('../config/database');

class Query {
  
  // Save a new search query to database
  static async create(searchTerm, searchType, resultsCount, responseTime) {
    try {
      const result = await pool.query(
        `INSERT INTO queries (search_term, search_type, results_count, response_time_ms)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [searchTerm, searchType, resultsCount, responseTime]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error creating query record:', error);
      throw error;
    }
  }

  // Get all queries
  static async findAll() {
    try {
      const result = await pool.query('SELECT * FROM queries ORDER BY created_at DESC');
      return result.rows;
    } catch (error) {
      console.error('Error fetching queries:', error);
      throw error;
    }
  }

  // Get queries within a time range
  static async findByDateRange(startDate, endDate) {
    try {
      const result = await pool.query(
        'SELECT * FROM queries WHERE created_at BETWEEN $1 AND $2',
        [startDate, endDate]
      );
      return result.rows;
    } catch (error) {
      console.error('Error fetching queries by date:', error);
      throw error;
    }
  }

}

module.exports = Query;