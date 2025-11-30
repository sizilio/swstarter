import rateLimit, { Options, MemoryStore } from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import redisClient from '../lib/redis';
import logger from '../lib/logger';

// Memory store fallback for when Redis is unavailable
const memoryStore = new MemoryStore();

// Create Redis store with graceful fallback
const createResilientStore = () => {
  // Check if Redis is ready before creating the store
  if (!redisClient.isReady) {
    logger.debug('Redis not ready at store creation, using memory store');
    return memoryStore;
  }

  return new RedisStore({
    sendCommand: async (...args: string[]) => {
      // Check again at command time
      if (!redisClient.isReady) {
        logger.debug('Redis not ready, skipping rate limit command');
        // Return a fake response that won't trigger rate limiting
        return null;
      }
      try {
        return await redisClient.sendCommand(args);
      } catch (error: any) {
        logger.warn({ error: error.message }, 'Redis rate limit command failed');
        return null;
      }
    },
  });
};

// Common rate limit options
const createRateLimitOptions = (
  windowMs: number,
  max: number,
  message: string
): Partial<Options> => ({
  windowMs,
  max,
  message: { error: message },
  standardHeaders: true,
  legacyHeaders: false,
  store: createResilientStore(),
  // Skip if store fails to prevent blocking requests
  skip: () => !redisClient.isReady,
});

// Rate limit geral da API: 100 requests por 15 minutos
export const apiLimiter = rateLimit({
  ...createRateLimitOptions(
    15 * 60 * 1000, // 15 minutos
    100,
    'Too many requests, please try again later.'
  ),
});

// Rate limit para buscas: 30 requests por minuto
export const searchLimiter = rateLimit({
  ...createRateLimitOptions(
    60 * 1000, // 1 minuto
    30,
    'Search rate limit exceeded. Please wait a moment.'
  ),
});
