import { Request, Response, NextFunction } from 'express';
import SwapiService from '../services/swapiService';
import { queryRepository } from '../repositories';
import { ValidationError } from '../errors';
import logger from '../lib/logger';

class SearchController {

  // Search people
  static async searchPeople(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const startTime = Date.now();
    const { name } = req.query;

    if (!name) {
      next(new ValidationError('Name parameter is required'));
      return;
    }

    try {
      const data = await SwapiService.searchPeople(name as string);
      const responseTime = Date.now() - startTime;
      const count = data.result.length;

      logger.info(
        { name, count, responseTime },
        'Search people completed'
      );

      // Save query to database
      await queryRepository.create({
        searchTerm: name as string,
        searchType: 'people',
        resultsCount: count,
        responseTimeMs: responseTime,
      });

      res.json({
        success: true,
        data,
        count,
        responseTime,
      });
    } catch (error) {
      next(error);
    }
  }

  // Search movies
  static async searchMovies(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const startTime = Date.now();
    const { title } = req.query;

    if (!title) {
      next(new ValidationError('Title parameter is required'));
      return;
    }

    try {
      const data = await SwapiService.searchMovies(title as string);
      const responseTime = Date.now() - startTime;
      const count = data.result.length;

      logger.info(
        { title, count, responseTime },
        'Search movies completed'
      );

      // Save query to database
      await queryRepository.create({
        searchTerm: title as string,
        searchType: 'movies',
        resultsCount: count,
        responseTimeMs: responseTime,
      });

      res.json({
        success: true,
        data,
        count,
        responseTime,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get person details by ID
  static async getPersonDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { id } = req.params;

    if (!id) {
      next(new ValidationError('ID parameter is required'));
      return;
    }

    try {
      const data = await SwapiService.getPersonById(id);

      logger.info(
        { id, filmsCount: data.result.properties.filmsData?.length || 0 },
        'Get person details completed'
      );

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get movie details by ID
  static async getMovieDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { id } = req.params;

    if (!id) {
      next(new ValidationError('ID parameter is required'));
      return;
    }

    try {
      const data = await SwapiService.getMovieById(id);

      logger.info(
        { id, charactersCount: data.result.properties.charactersData?.length || 0 },
        'Get movie details completed'
      );

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default SearchController;
