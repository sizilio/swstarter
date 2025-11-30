import '../../mocks/logger.mock';
import { Request, Response, NextFunction } from 'express';
import { loggerMock } from '../../mocks/logger.mock';
import { errorHandler } from '../../../middlewares/errorHandler';
import { ValidationError, NotFoundError, ExternalApiError } from '../../../errors';

describe('errorHandler Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {
      path: '/api/search',
      method: 'GET',
    };
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  describe('AppError handling', () => {
    it('should handle ValidationError with status 400', () => {
      const error = new ValidationError('Invalid input');

      errorHandler(
        error,
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        code: 'VALIDATION_ERROR',
        message: 'Invalid input',
      });
    });

    it('should handle NotFoundError with status 404', () => {
      const error = new NotFoundError('Person', 123);

      errorHandler(
        error,
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        code: 'NOT_FOUND',
        message: 'Person with ID 123 not found',
      });
    });

    it('should handle ExternalApiError with status 502', () => {
      const error = new ExternalApiError('SWAPI', 'Connection timeout');

      errorHandler(
        error,
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(502);
      expect(mockResponse.json).toHaveBeenCalledWith({
        code: 'EXTERNAL_API_ERROR',
        message: 'Failed to communicate with SWAPI: Connection timeout',
      });
    });

    it('should log operational errors with warn level', () => {
      const error = new ValidationError('Invalid input');

      errorHandler(
        error,
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(loggerMock.warn).toHaveBeenCalledWith(
        {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input',
          path: '/api/search',
          method: 'GET',
        },
        'Operational error'
      );
    });
  });

  describe('Unexpected error handling', () => {
    it('should handle unexpected errors with status 500', () => {
      const error = new Error('Something went wrong');

      errorHandler(
        error,
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
      });
    });

    it('should not expose unexpected error details to client', () => {
      const error = new Error('Database password exposed');

      errorHandler(
        error,
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.json).toHaveBeenCalledWith({
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
      });
      expect(mockResponse.json).not.toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Database password exposed' })
      );
    });

    it('should log unexpected errors with error level and stack trace', () => {
      const error = new Error('Database connection failed');

      errorHandler(
        error,
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(loggerMock.error).toHaveBeenCalledWith(
        {
          error: 'Database connection failed',
          stack: expect.any(String),
          path: '/api/search',
          method: 'GET',
        },
        'Unexpected error'
      );
    });
  });
});
