import '../../mocks/prisma.mock';
import '../../mocks/redis.mock';
import '../../mocks/axios.mock';
import '../../mocks/logger.mock';
import { Request, Response, NextFunction } from 'express';
import { prismaMock } from '../../mocks/prisma.mock';
import { axiosMock } from '../../mocks/axios.mock';
import { redisMock } from '../../mocks/redis.mock';
import {
  mockPersonSearchResponse,
  mockFilmSearchResponse,
  mockPersonDetailResponse,
  mockFilmDetailResponse,
} from '../../mocks/swapi.fixtures';
import SearchController from '../../../controllers/searchController';
import { ValidationError } from '../../../errors';

describe('SearchController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {
      query: {},
      params: {},
    };
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  describe('searchPeople', () => {
    it('should call next with ValidationError when name is missing', async () => {
      mockRequest.query = {};

      await SearchController.searchPeople(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(expect.any(ValidationError));
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Name parameter is required' })
      );
    });

    it('should return search results on success', async () => {
      mockRequest.query = { name: 'luke' };
      redisMock.get.mockResolvedValue(null);
      axiosMock.get.mockResolvedValue({ data: mockPersonSearchResponse });
      prismaMock.query.create.mockResolvedValue({} as any);

      await SearchController.searchPeople(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockPersonSearchResponse,
        count: 1,
        responseTime: expect.any(Number),
      });
    });

    it('should save query to database', async () => {
      mockRequest.query = { name: 'luke' };
      redisMock.get.mockResolvedValue(null);
      axiosMock.get.mockResolvedValue({ data: mockPersonSearchResponse });
      prismaMock.query.create.mockResolvedValue({} as any);

      await SearchController.searchPeople(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(prismaMock.query.create).toHaveBeenCalledWith({
        data: {
          searchTerm: 'luke',
          searchType: 'people',
          resultsCount: 1,
          responseTimeMs: expect.any(Number),
        },
      });
    });

    it('should call next with error on service failure', async () => {
      mockRequest.query = { name: 'luke' };
      redisMock.get.mockResolvedValue(null);
      axiosMock.get.mockRejectedValue(new Error('Service error'));

      await SearchController.searchPeople(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('searchMovies', () => {
    it('should call next with ValidationError when title is missing', async () => {
      mockRequest.query = {};

      await SearchController.searchMovies(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(expect.any(ValidationError));
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Title parameter is required' })
      );
    });

    it('should return search results on success', async () => {
      mockRequest.query = { title: 'hope' };
      redisMock.get.mockResolvedValue(null);
      axiosMock.get.mockResolvedValue({ data: mockFilmSearchResponse });
      prismaMock.query.create.mockResolvedValue({} as any);

      await SearchController.searchMovies(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockFilmSearchResponse,
        count: 1,
        responseTime: expect.any(Number),
      });
    });

    it('should save query to database with searchType movies', async () => {
      mockRequest.query = { title: 'hope' };
      redisMock.get.mockResolvedValue(null);
      axiosMock.get.mockResolvedValue({ data: mockFilmSearchResponse });
      prismaMock.query.create.mockResolvedValue({} as any);

      await SearchController.searchMovies(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(prismaMock.query.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          searchType: 'movies',
        }),
      });
    });

    it('should call next with error on service failure', async () => {
      mockRequest.query = { title: 'hope' };
      redisMock.get.mockResolvedValue(null);
      axiosMock.get.mockRejectedValue(new Error('Service error'));

      await SearchController.searchMovies(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('getPersonDetails', () => {
    it('should call next with ValidationError when id is missing', async () => {
      mockRequest.params = {};

      await SearchController.getPersonDetails(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(expect.any(ValidationError));
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'ID parameter is required' })
      );
    });

    it('should return person details on success', async () => {
      mockRequest.params = { id: '1' };
      const mockDetailWithFilms = {
        message: 'ok',
        result: {
          uid: '1',
          description: 'A person',
          properties: {
            ...mockPersonDetailResponse.result.properties,
            filmsData: [],
          },
        },
      };
      redisMock.get.mockResolvedValue(null);
      axiosMock.get.mockResolvedValue({ data: mockPersonDetailResponse });

      await SearchController.getPersonDetails(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({
          message: 'ok',
          result: expect.objectContaining({
            uid: '1',
          }),
        }),
      });
    });

    it('should call next with error on service failure', async () => {
      mockRequest.params = { id: '1' };
      redisMock.get.mockResolvedValue(null);
      axiosMock.get.mockRejectedValue(new Error('Not found'));

      await SearchController.getPersonDetails(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('getMovieDetails', () => {
    it('should call next with ValidationError when id is missing', async () => {
      mockRequest.params = {};

      await SearchController.getMovieDetails(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(expect.any(ValidationError));
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'ID parameter is required' })
      );
    });

    it('should return movie details on success', async () => {
      mockRequest.params = { id: '1' };
      redisMock.get.mockResolvedValue(null);
      axiosMock.get.mockResolvedValue({ data: mockFilmDetailResponse });

      await SearchController.getMovieDetails(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({
          message: 'ok',
          result: expect.objectContaining({
            uid: '1',
          }),
        }),
      });
    });

    it('should call next with error on service failure', async () => {
      mockRequest.params = { id: '1' };
      redisMock.get.mockResolvedValue(null);
      axiosMock.get.mockRejectedValue(new Error('Not found'));

      await SearchController.getMovieDetails(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalled();
    });
  });
});
