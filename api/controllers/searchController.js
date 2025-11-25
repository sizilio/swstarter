const SwapiService = require('../services/swapiService');
const Query = require('../models/Query');

class SearchController {
  
  // Search people
  static async searchPeople(req, res) {
    const startTime = Date.now();
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({ error: 'Name parameter is required' });
    }

    try {
      const data = await SwapiService.searchPeople(name);
      const responseTime = Date.now() - startTime;

      console.log(`Search peoples: Parameter "${name}" with ${data.count} results in ${responseTime}ms`);

      // Save query to database
      await Query.create(name, 'people', data.count, responseTime);

      res.json({
        success: true,
        results: data.results,
        count: data.count,
        responseTime
      });
    } catch (error) {
      console.error('Search people error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  // Search movies
  static async searchMovies(req, res) {
    const startTime = Date.now();
    const { title } = req.query;

    if (!title) {
      return res.status(400).json({ error: 'Title parameter is required' });
    }

    try {
      const data = await SwapiService.searchMovies(title);
      const responseTime = Date.now() - startTime;

      console.log(`Search movies: Parameter "${title}" with ${data.count} results in ${responseTime}ms`);

      // Save query to database
      await Query.create(title, 'movies', data.count, responseTime);

      res.json({
        success: true,
        results: data.results,
        count: data.count,
        responseTime
      });
    } catch (error) {
      console.error('Search movies error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  // Get person details by ID
  static async getPersonDetails(req, res) {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'ID parameter is required' });
    }

    try {
      const person = await SwapiService.getPersonById(id);

      console.log(`Get person details: ID ${id} with ${person.films?.length || 0} films`);

      res.json({
        success: true,
        data: person
      });
    } catch (error) {
      console.error('Get person details error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  // Get movie details by ID
  static async getMovieDetails(req, res) {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'ID parameter is required' });
    }

    try {
      const movie = await SwapiService.getMovieById(id);

      console.log(`Get movie details: ID ${id} with ${movie.characters?.length || 0} characters`);

      res.json({
        success: true,
        data: movie
      });
    } catch (error) {
      console.error('Get movie details error:', error);
      res.status(500).json({ error: error.message });
    }
  }

}

module.exports = SearchController;