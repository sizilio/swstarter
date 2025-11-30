import { AppError } from '../../../errors/AppError';
import { ValidationError } from '../../../errors/ValidationError';
import { NotFoundError } from '../../../errors/NotFoundError';
import { ExternalApiError } from '../../../errors/ExternalApiError';

describe('Error Classes', () => {
  describe('ValidationError', () => {
    it('should create error with correct message', () => {
      const error = new ValidationError('Invalid input');

      expect(error.message).toBe('Invalid input');
    });

    it('should have statusCode 400', () => {
      const error = new ValidationError('Test');

      expect(error.statusCode).toBe(400);
    });

    it('should have code VALIDATION_ERROR', () => {
      const error = new ValidationError('Test');

      expect(error.code).toBe('VALIDATION_ERROR');
    });

    it('should be an instance of AppError', () => {
      const error = new ValidationError('Test');

      expect(error).toBeInstanceOf(AppError);
    });

    it('should be operational', () => {
      const error = new ValidationError('Test');

      expect(error.isOperational).toBe(true);
    });

    it('should serialize to JSON correctly', () => {
      const error = new ValidationError('Invalid email format');

      expect(error.toJSON()).toEqual({
        code: 'VALIDATION_ERROR',
        message: 'Invalid email format',
      });
    });

    it('should have a stack trace', () => {
      const error = new ValidationError('Test');

      expect(error.stack).toBeDefined();
    });
  });

  describe('NotFoundError', () => {
    it('should create error with resource name only', () => {
      const error = new NotFoundError('User');

      expect(error.message).toBe('User not found');
    });

    it('should create error with resource name and ID', () => {
      const error = new NotFoundError('User', 123);

      expect(error.message).toBe('User with ID 123 not found');
    });

    it('should create error with resource name and string ID', () => {
      const error = new NotFoundError('Film', 'abc-123');

      expect(error.message).toBe('Film with ID abc-123 not found');
    });

    it('should have statusCode 404', () => {
      const error = new NotFoundError('Resource');

      expect(error.statusCode).toBe(404);
    });

    it('should have code NOT_FOUND', () => {
      const error = new NotFoundError('Resource');

      expect(error.code).toBe('NOT_FOUND');
    });

    it('should be an instance of AppError', () => {
      const error = new NotFoundError('Resource');

      expect(error).toBeInstanceOf(AppError);
    });

    it('should be operational', () => {
      const error = new NotFoundError('Resource');

      expect(error.isOperational).toBe(true);
    });

    it('should serialize to JSON correctly', () => {
      const error = new NotFoundError('Person', 1);

      expect(error.toJSON()).toEqual({
        code: 'NOT_FOUND',
        message: 'Person with ID 1 not found',
      });
    });
  });

  describe('ExternalApiError', () => {
    it('should create error with service name only', () => {
      const error = new ExternalApiError('SWAPI');

      expect(error.message).toBe('Failed to communicate with SWAPI');
    });

    it('should create error with service name and original message', () => {
      const error = new ExternalApiError('SWAPI', 'Connection timeout');

      expect(error.message).toBe('Failed to communicate with SWAPI: Connection timeout');
    });

    it('should have statusCode 502', () => {
      const error = new ExternalApiError('SWAPI');

      expect(error.statusCode).toBe(502);
    });

    it('should have code EXTERNAL_API_ERROR', () => {
      const error = new ExternalApiError('SWAPI');

      expect(error.code).toBe('EXTERNAL_API_ERROR');
    });

    it('should be an instance of AppError', () => {
      const error = new ExternalApiError('SWAPI');

      expect(error).toBeInstanceOf(AppError);
    });

    it('should be operational', () => {
      const error = new ExternalApiError('SWAPI');

      expect(error.isOperational).toBe(true);
    });

    it('should serialize to JSON correctly', () => {
      const error = new ExternalApiError('Redis', 'Connection refused');

      expect(error.toJSON()).toEqual({
        code: 'EXTERNAL_API_ERROR',
        message: 'Failed to communicate with Redis: Connection refused',
      });
    });
  });
});
