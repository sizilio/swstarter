import '../../mocks/axios.mock';
import '../../mocks/redis.mock';
import '../../mocks/logger.mock';
import { axiosMock } from '../../mocks/axios.mock';
import { redisMock } from '../../mocks/redis.mock';
import {
  mockPersonSearchResponse,
  mockFilmSearchResponse,
  mockPersonDetailResponse,
  mockFilmDetailResponse,
} from '../../mocks/swapi.fixtures';
import SwapiService from '../../../services/swapiService';
import { ExternalApiError, ValidationError } from '../../../errors';

describe('SwapiService', () => {
  describe('searchPeople', () => {
    it('should return cached data when available', async () => {
      redisMock.get.mockResolvedValue(JSON.stringify(mockPersonSearchResponse));

      const result = await SwapiService.searchPeople('luke');

      expect(result).toEqual(mockPersonSearchResponse);
      expect(axiosMock.get).not.toHaveBeenCalled();
    });

    it('should fetch from API when cache miss', async () => {
      redisMock.get.mockResolvedValue(null);
      axiosMock.get.mockResolvedValue({ data: mockPersonSearchResponse });

      const result = await SwapiService.searchPeople('luke');

      expect(result).toEqual(mockPersonSearchResponse);
      expect(axiosMock.get).toHaveBeenCalledWith(
        'https://swapi.tech/api/people',
        { params: { name: 'luke', limit: 100 } }
      );
    });

    it('should save to cache after API fetch', async () => {
      redisMock.get.mockResolvedValue(null);
      axiosMock.get.mockResolvedValue({ data: mockPersonSearchResponse });

      await SwapiService.searchPeople('luke');

      expect(redisMock.setEx).toHaveBeenCalledWith(
        'swapi:people:search:luke',
        3600,
        JSON.stringify(mockPersonSearchResponse)
      );
    });

    it('should throw ExternalApiError on API failure', async () => {
      redisMock.get.mockResolvedValue(null);
      axiosMock.get.mockRejectedValue(new Error('Network error'));

      await expect(SwapiService.searchPeople('luke')).rejects.toThrow(ExternalApiError);
      await expect(SwapiService.searchPeople('luke')).rejects.toThrow(
        'Failed to communicate with SWAPI: Network error'
      );
    });
  });

  describe('searchMovies', () => {
    it('should return cached data when available', async () => {
      redisMock.get.mockResolvedValue(JSON.stringify(mockFilmSearchResponse));

      const result = await SwapiService.searchMovies('hope');

      expect(result).toEqual(mockFilmSearchResponse);
      expect(axiosMock.get).not.toHaveBeenCalled();
    });

    it('should fetch from API when cache miss', async () => {
      redisMock.get.mockResolvedValue(null);
      axiosMock.get.mockResolvedValue({ data: mockFilmSearchResponse });

      const result = await SwapiService.searchMovies('hope');

      expect(result).toEqual(mockFilmSearchResponse);
      expect(axiosMock.get).toHaveBeenCalledWith(
        'https://swapi.tech/api/films',
        { params: { title: 'hope', limit: 100 } }
      );
    });

    it('should save to cache with 24h TTL', async () => {
      redisMock.get.mockResolvedValue(null);
      axiosMock.get.mockResolvedValue({ data: mockFilmSearchResponse });

      await SwapiService.searchMovies('hope');

      expect(redisMock.setEx).toHaveBeenCalledWith(
        'swapi:movies:search:hope',
        86400,
        JSON.stringify(mockFilmSearchResponse)
      );
    });

    it('should throw ExternalApiError on API failure', async () => {
      redisMock.get.mockResolvedValue(null);
      axiosMock.get.mockRejectedValue(new Error('Timeout'));

      await expect(SwapiService.searchMovies('hope')).rejects.toThrow(ExternalApiError);
    });
  });

  describe('getPersonById', () => {
    const mockPersonResponse = {
      data: mockPersonDetailResponse,
    };

    const mockFilmResponse = {
      data: mockFilmDetailResponse,
    };

    it('should throw ValidationError for invalid ID (0)', async () => {
      await expect(SwapiService.getPersonById(0)).rejects.toThrow(ValidationError);
      await expect(SwapiService.getPersonById(0)).rejects.toThrow('Invalid person ID');
    });

    it('should throw ValidationError for negative ID', async () => {
      await expect(SwapiService.getPersonById(-1)).rejects.toThrow(ValidationError);
    });

    it('should return cached data when available', async () => {
      const cachedData = {
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
      redisMock.get.mockResolvedValue(JSON.stringify(cachedData));

      const result = await SwapiService.getPersonById('1');

      expect(result).toEqual(cachedData);
      expect(axiosMock.get).not.toHaveBeenCalled();
    });

    it('should fetch person and films from API when cache miss', async () => {
      redisMock.get.mockResolvedValue(null);
      axiosMock.get
        .mockResolvedValueOnce(mockPersonResponse)
        .mockResolvedValueOnce(mockFilmResponse);

      const result = await SwapiService.getPersonById('1');

      expect(result.result.properties.name).toBe('Luke Skywalker');
      expect(result.result.properties.filmsData).toHaveLength(1);
    });

    it('should handle film fetch failures gracefully', async () => {
      redisMock.get.mockResolvedValue(null);
      axiosMock.get
        .mockResolvedValueOnce(mockPersonResponse)
        .mockRejectedValueOnce(new Error('Film fetch failed'));

      const result = await SwapiService.getPersonById('1');

      expect(result.result.properties.name).toBe('Luke Skywalker');
      expect(result.result.properties.filmsData).toHaveLength(0);
    });

    it('should throw ExternalApiError when person fetch fails', async () => {
      redisMock.get.mockResolvedValue(null);
      axiosMock.get.mockRejectedValue(new Error('Person not found'));

      await expect(SwapiService.getPersonById('999')).rejects.toThrow(ExternalApiError);
    });
  });

  describe('getMovieById', () => {
    const mockMovieResponse = {
      data: mockFilmDetailResponse,
    };

    const mockCharacterResponse = {
      data: mockPersonDetailResponse,
    };

    it('should throw ValidationError for invalid ID (0)', async () => {
      await expect(SwapiService.getMovieById(0)).rejects.toThrow(ValidationError);
      await expect(SwapiService.getMovieById(0)).rejects.toThrow('Invalid movie ID');
    });

    it('should throw ValidationError for negative ID', async () => {
      await expect(SwapiService.getMovieById(-1)).rejects.toThrow(ValidationError);
    });

    it('should return cached data when available', async () => {
      const cachedData = {
        message: 'ok',
        result: {
          uid: '1',
          description: 'A film',
          properties: {
            ...mockFilmDetailResponse.result.properties,
            charactersData: [],
          },
        },
      };
      redisMock.get.mockResolvedValue(JSON.stringify(cachedData));

      const result = await SwapiService.getMovieById('1');

      expect(result).toEqual(cachedData);
      expect(axiosMock.get).not.toHaveBeenCalled();
    });

    it('should fetch movie and characters from API when cache miss', async () => {
      redisMock.get.mockResolvedValue(null);
      axiosMock.get
        .mockResolvedValueOnce(mockMovieResponse)
        .mockResolvedValueOnce(mockCharacterResponse);

      const result = await SwapiService.getMovieById('1');

      expect(result.result.properties.title).toBe('A New Hope');
      expect(result.result.properties.charactersData).toHaveLength(1);
    });

    it('should handle character fetch failures gracefully', async () => {
      redisMock.get.mockResolvedValue(null);
      axiosMock.get
        .mockResolvedValueOnce(mockMovieResponse)
        .mockRejectedValueOnce(new Error('Character fetch failed'));

      const result = await SwapiService.getMovieById('1');

      expect(result.result.properties.title).toBe('A New Hope');
      expect(result.result.properties.charactersData).toHaveLength(0);
    });

    it('should throw ExternalApiError when movie fetch fails', async () => {
      redisMock.get.mockResolvedValue(null);
      axiosMock.get.mockRejectedValue(new Error('Movie not found'));

      await expect(SwapiService.getMovieById('999')).rejects.toThrow(ExternalApiError);
    });
  });
});
