import '../mocks/prisma.mock';
import '../mocks/redis.mock';
import '../mocks/axios.mock';
import '../mocks/logger.mock';
import request from 'supertest';
import { axiosMock } from '../mocks/axios.mock';
import { redisMock } from '../mocks/redis.mock';
import { prismaMock } from '../mocks/prisma.mock';
import {
  mockPersonSearchResponse,
  mockFilmSearchResponse,
  mockPersonDetailResponse,
  mockFilmDetailResponse,
} from '../mocks/swapi.fixtures';
import { createTestApp } from './app';

const app = createTestApp();

describe('Search Routes Integration Tests', () => {
  describe('GET /api/search/people', () => {
    beforeEach(() => {
      redisMock.get.mockResolvedValue(null);
      prismaMock.query.create.mockResolvedValue({} as any);
    });

    it('should return 400 when name parameter is missing', async () => {
      const response = await request(app)
        .get('/api/search/people')
        .expect(400);

      expect(response.body).toEqual({
        code: 'VALIDATION_ERROR',
        message: 'Name parameter is required',
      });
    });

    it('should return search results when name is provided', async () => {
      axiosMock.get.mockResolvedValue({ data: mockPersonSearchResponse });

      const response = await request(app)
        .get('/api/search/people')
        .query({ name: 'luke' })
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        data: mockPersonSearchResponse,
        count: 1,
        responseTime: expect.any(Number),
      });
    });

    it('should return cached results when available', async () => {
      redisMock.get.mockResolvedValue(JSON.stringify(mockPersonSearchResponse));

      const response = await request(app)
        .get('/api/search/people')
        .query({ name: 'luke' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(axiosMock.get).not.toHaveBeenCalled();
    });

    it('should return 502 when external API fails', async () => {
      axiosMock.get.mockRejectedValue(new Error('SWAPI is down'));

      const response = await request(app)
        .get('/api/search/people')
        .query({ name: 'luke' })
        .expect(502);

      expect(response.body.code).toBe('EXTERNAL_API_ERROR');
    });
  });

  describe('GET /api/search/movies', () => {
    beforeEach(() => {
      redisMock.get.mockResolvedValue(null);
      prismaMock.query.create.mockResolvedValue({} as any);
    });

    it('should return 400 when title parameter is missing', async () => {
      const response = await request(app)
        .get('/api/search/movies')
        .expect(400);

      expect(response.body).toEqual({
        code: 'VALIDATION_ERROR',
        message: 'Title parameter is required',
      });
    });

    it('should return search results when title is provided', async () => {
      axiosMock.get.mockResolvedValue({ data: mockFilmSearchResponse });

      const response = await request(app)
        .get('/api/search/movies')
        .query({ title: 'hope' })
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        data: mockFilmSearchResponse,
        count: 1,
        responseTime: expect.any(Number),
      });
    });
  });

  describe('GET /api/search/people/:id', () => {
    beforeEach(() => {
      redisMock.get.mockResolvedValue(null);
    });

    it('should return person details', async () => {
      axiosMock.get.mockResolvedValue({ data: mockPersonDetailResponse });

      const response = await request(app)
        .get('/api/search/people/1')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.result.properties.name).toBe('Luke Skywalker');
    });

    it('should handle ID "0" as a valid string param (SWAPI will reject)', async () => {
      axiosMock.get.mockRejectedValue(new Error('Resource not found'));

      const response = await request(app)
        .get('/api/search/people/0')
        .expect(502);

      expect(response.body.code).toBe('EXTERNAL_API_ERROR');
    });
  });

  describe('GET /api/search/movies/:id', () => {
    beforeEach(() => {
      redisMock.get.mockResolvedValue(null);
    });

    it('should return movie details', async () => {
      axiosMock.get.mockResolvedValue({ data: mockFilmDetailResponse });

      const response = await request(app)
        .get('/api/search/movies/1')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.result.properties.title).toBe('A New Hope');
    });

    it('should handle ID "0" as a valid string param (SWAPI will reject)', async () => {
      axiosMock.get.mockRejectedValue(new Error('Resource not found'));

      const response = await request(app)
        .get('/api/search/movies/0')
        .expect(502);

      expect(response.body.code).toBe('EXTERNAL_API_ERROR');
    });
  });
});
