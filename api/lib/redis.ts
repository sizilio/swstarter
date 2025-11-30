import { createClient } from 'redis';
import logger from './logger';

const REDIS_CONNECT_TIMEOUT = 2000; // 2 seconds
const REDIS_MAX_RETRIES = 3;

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  socket: {
    connectTimeout: REDIS_CONNECT_TIMEOUT,
    reconnectStrategy: (retries) => {
      if (retries >= REDIS_MAX_RETRIES) {
        logger.warn({ retries }, 'Redis max retries reached, giving up');
        return false; // Stop reconnecting
      }
      const delay = Math.min(retries * 500, 2000); // 500ms, 1000ms, 2000ms
      logger.info({ retries, delay }, 'Redis reconnecting...');
      return delay;
    },
  },
});

redisClient.on('error', (err) => logger.error({ error: err.message }, 'Redis Client Error'));
redisClient.on('connect', () => logger.info('Redis connected'));
redisClient.on('ready', () => logger.info('Redis ready'));
redisClient.on('end', () => logger.warn('Redis connection closed'));

export default redisClient;
