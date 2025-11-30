import redisClient from '../lib/redis';
import logger from '../lib/logger';

// TTLs em segundos
export const CACHE_TTL = {
  SEARCH_PEOPLE: 3600, // 1 hora
  SEARCH_MOVIES: 86400, // 24 horas
  DETAIL_PEOPLE: 3600, // 1 hora
  DETAIL_MOVIES: 86400, // 24 horas
};

// Prefixos de cache key
export const CACHE_KEYS = {
  searchPeople: (term: string) => `swapi:people:search:${term.toLowerCase()}`,
  searchMovies: (term: string) => `swapi:movies:search:${term.toLowerCase()}`,
  detailPeople: (id: string) => `swapi:people:detail:${id}`,
  detailMovies: (id: string) => `swapi:movies:detail:${id}`,
};

// Helper to check if Redis is available
const isRedisReady = (): boolean => {
  return redisClient.isReady;
};

export const cacheProvider = {
  async get<T>(key: string): Promise<T | null> {
    if (!isRedisReady()) {
      logger.debug({ key }, 'Redis not ready, skipping cache get');
      return null;
    }

    try {
      const data = await redisClient.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error: any) {
      logger.error({ key, error: error.message }, 'Cache get error');
      return null;
    }
  },

  async set<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
    if (!isRedisReady()) {
      logger.debug({ key }, 'Redis not ready, skipping cache set');
      return;
    }

    try {
      await redisClient.setEx(key, ttlSeconds, JSON.stringify(value));
    } catch (error: any) {
      logger.error({ key, error: error.message }, 'Cache set error');
    }
  },

  async del(key: string): Promise<void> {
    if (!isRedisReady()) {
      logger.debug({ key }, 'Redis not ready, skipping cache del');
      return;
    }

    try {
      await redisClient.del(key);
    } catch (error: any) {
      logger.error({ key, error: error.message }, 'Cache del error');
    }
  },

  async exists(key: string): Promise<boolean> {
    if (!isRedisReady()) {
      logger.debug({ key }, 'Redis not ready, skipping cache exists');
      return false;
    }

    try {
      const result = await redisClient.exists(key);
      return result === 1;
    } catch (error: any) {
      logger.error({ key, error: error.message }, 'Cache exists error');
      return false;
    }
  },
};
