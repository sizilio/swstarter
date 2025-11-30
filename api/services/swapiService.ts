import axios, { AxiosResponse } from 'axios';
import {
  SwapiPerson,
  SwapiFilm,
  SwapiSearchResponse,
  SwapiDetailResponse,
  SwapiPersonWithFilms,
  SwapiFilmWithCharacters,
} from '../types';
import {
  cacheProvider,
  CACHE_KEYS,
  CACHE_TTL,
} from '../providers/cache.provider';
import { ExternalApiError, ValidationError } from '../errors';
import logger from '../lib/logger';

const SWAPI_BASE_URL = 'https://swapi.tech/api';
const SWAPI_REQUEST_DELAY = 100; // 100ms delay between requests to avoid rate limiting

// Helper to delay execution
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Fetch with retry and delay to handle SWAPI rate limiting
const fetchWithRetry = async <T>(
  url: string,
  retries = 2
): Promise<T | null> => {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await axios.get<T>(url, { timeout: 10000 });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 429 && attempt < retries) {
        // Rate limited - wait and retry
        const waitTime = SWAPI_REQUEST_DELAY * (attempt + 2);
        logger.debug({ url, attempt, waitTime }, 'Rate limited, retrying...');
        await delay(waitTime);
        continue;
      }
      logger.warn({ url, error: error.message }, 'Failed to fetch resource');
      return null;
    }
  }
  return null;
};

class SwapiService {
  // Search for people by name
  static async searchPeople(
    name: string
  ): Promise<SwapiSearchResponse<SwapiPerson>> {
    const cacheKey = CACHE_KEYS.searchPeople(name);

    // Check cache first
    const cached =
      await cacheProvider.get<SwapiSearchResponse<SwapiPerson>>(cacheKey);
    if (cached) {
      logger.debug({ cacheKey }, 'Cache HIT');
      return cached;
    }

    logger.debug({ cacheKey }, 'Cache MISS');

    try {
      const response: AxiosResponse<SwapiSearchResponse<SwapiPerson>> =
        await axios.get(`${SWAPI_BASE_URL}/people`, {
          params: { name, limit: 100 },
        });

      // Save to cache (raw response)
      await cacheProvider.set(cacheKey, response.data, CACHE_TTL.SEARCH_PEOPLE);

      return response.data;
    } catch (error: any) {
      logger.error({ error: error.message }, 'Error fetching people from SWAPI');
      throw new ExternalApiError('SWAPI', error.message);
    }
  }

  // Search for movies by title
  static async searchMovies(
    title: string
  ): Promise<SwapiSearchResponse<SwapiFilm>> {
    const cacheKey = CACHE_KEYS.searchMovies(title);

    // Check cache first
    const cached =
      await cacheProvider.get<SwapiSearchResponse<SwapiFilm>>(cacheKey);
    if (cached) {
      logger.debug({ cacheKey }, 'Cache HIT');
      return cached;
    }

    logger.debug({ cacheKey }, 'Cache MISS');

    try {
      const response: AxiosResponse<SwapiSearchResponse<SwapiFilm>> =
        await axios.get(`${SWAPI_BASE_URL}/films`, {
          params: { title, limit: 100 },
        });

      // Save to cache (raw response)
      await cacheProvider.set(cacheKey, response.data, CACHE_TTL.SEARCH_MOVIES);

      return response.data;
    } catch (error: any) {
      logger.error({ error: error.message }, 'Error fetching movies from SWAPI');
      throw new ExternalApiError('SWAPI', error.message);
    }
  }

  // Get person by ID with all films details
  static async getPersonById(
    id: string | number
  ): Promise<SwapiDetailResponse<SwapiPersonWithFilms>> {
    if (!id || (typeof id === 'number' && id <= 0)) {
      throw new ValidationError('Invalid person ID');
    }

    const cacheKey = CACHE_KEYS.detailPeople(String(id));

    // Check cache first
    const cached =
      await cacheProvider.get<SwapiDetailResponse<SwapiPersonWithFilms>>(cacheKey);
    if (cached) {
      logger.debug({ cacheKey }, 'Cache HIT');
      return cached;
    }

    logger.debug({ cacheKey }, 'Cache MISS');

    try {
      const personResponse: AxiosResponse<SwapiDetailResponse<SwapiPerson>> =
        await axios.get(`${SWAPI_BASE_URL}/people/${id}`, { timeout: 10000 });

      const person = personResponse.data.result.properties;

      // Fetch all characters in parallel with graceful failure
      const filmsData: SwapiFilm[] = [];
      if (person.films?.length > 0) {
        const filmsResults = await Promise.allSettled(
          person.films.map((filmUrl: string) =>
            axios.get<SwapiDetailResponse<SwapiFilm>>(filmUrl, {
              timeout: 10000,
            })
          )
        );

        filmsResults.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            filmsData.push(result.value.data.result.properties);
          } else {
            logger.warn(
              { url: person.films[index], error: result.reason?.message },
              'Failed to fetch movie'
            );
          }
        });
      }

      // Return in swapi.tech format with expanded films
      const response: SwapiDetailResponse<SwapiPersonWithFilms> = {
        message: personResponse.data.message,
        result: {
          uid: personResponse.data.result.uid,
          description: personResponse.data.result.description,
          properties: {
            ...person,
            filmsData,
          },
        },
      };

      // Save to cache
      await cacheProvider.set(cacheKey, response, CACHE_TTL.DETAIL_PEOPLE);

      return response;
    } catch (error: any) {
      logger.error({ id, error: error.message }, 'Error fetching person from SWAPI');
      throw new ExternalApiError('SWAPI', error.message);
    }
  }

  // Get movie by ID with all characters details
  static async getMovieById(
    id: string | number
  ): Promise<SwapiDetailResponse<SwapiFilmWithCharacters>> {
    if (!id || (typeof id === 'number' && id <= 0)) {
      throw new ValidationError('Invalid movie ID');
    }

    const cacheKey = CACHE_KEYS.detailMovies(String(id));

    // Check cache first
    const cached =
      await cacheProvider.get<SwapiDetailResponse<SwapiFilmWithCharacters>>(cacheKey);
    if (cached) {
      logger.debug({ cacheKey }, 'Cache HIT');
      return cached;
    }

    logger.debug({ cacheKey }, 'Cache MISS');

    try {
      const movieResponse: AxiosResponse<SwapiDetailResponse<SwapiFilm>> =
        await axios.get(`${SWAPI_BASE_URL}/films/${id}`, { timeout: 10000 });

      const movie = movieResponse.data.result.properties;

      // Fetch all characters in parallel with graceful failure
      const charactersData: SwapiPerson[] = [];
      if (movie.characters?.length > 0) {
        const charactersResults = await Promise.allSettled(
          movie.characters.map((characterUrl: string) =>
            axios.get<SwapiDetailResponse<SwapiPerson>>(characterUrl, {
              timeout: 10000,
            })
          )
        );

        charactersResults.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            charactersData.push(result.value.data.result.properties);
          } else {
            logger.warn(
              { url: movie.characters[index], error: result.reason?.message },
              'Failed to fetch character'
            );
          }
        });
      }

      // Return in swapi.tech format with expanded characters
      const response: SwapiDetailResponse<SwapiFilmWithCharacters> = {
        message: movieResponse.data.message,
        result: {
          uid: movieResponse.data.result.uid,
          description: movieResponse.data.result.description,
          properties: {
            ...movie,
            charactersData,
          },
        },
      };

      // Save to cache
      await cacheProvider.set(cacheKey, response, CACHE_TTL.DETAIL_MOVIES);

      return response;
    } catch (error: any) {
      logger.error({ id, error: error.message }, 'Error fetching movie from SWAPI');
      throw new ExternalApiError('SWAPI', error.message);
    }
  }
}

export default SwapiService;
