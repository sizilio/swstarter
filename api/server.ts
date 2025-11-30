import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cron from 'node-cron';
import { Worker } from 'bullmq';
import 'dotenv/config';

import prisma from './lib/prisma';
import redisClient from './lib/redis';
import logger from './lib/logger';
import searchRoutes from './routes/search';
import statisticsRoutes from './routes/statistics';
import {
  scheduleStatisticsJob,
  closeStatisticsQueue,
} from './jobs/queues/statistics.queue';
import { createStatisticsWorker } from './jobs/workers/statistics.worker';
import { requestLogger } from './middlewares/requestLogger';
import { errorHandler } from './middlewares/errorHandler';

const PORT: number = parseInt(process.env.PORT || '3000');

async function bootstrap() {
  // Connect to Redis
  logger.info('Connecting to Redis...');
  await redisClient.connect();
  logger.info('Redis connected');

  // Connect to Database
  logger.info('Connecting to Database...');
  await prisma.$connect();
  logger.info('Database connected');

  // Import rate limiters (they depend on Redis being connected)
  const { apiLimiter, searchLimiter } = await import('./middlewares/rateLimiter');

  // Create Express app
  const app: Application = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(requestLogger);

  // Routes with specific rate limiters
  app.use('/api/search', searchLimiter, searchRoutes);
  app.use('/api/statistics', apiLimiter, statisticsRoutes);

  // Error handler (must be after routes)
  app.use(errorHandler);

  // Health check with database and Redis connection test
  app.get('/api/health', async (req: Request, res: Response) => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      await redisClient.ping();
      res.json({
        status: 'OK',
        message: 'Server is running',
        database: 'connected',
        redis: 'connected',
      });
    } catch (error) {
      res.status(503).json({ status: 'ERROR', message: 'Service unavailable' });
    }
  });

  // Initialize BullMQ worker for statistics
  const statisticsWorker = createStatisticsWorker();
  logger.info('Statistics worker started');

  // Schedule statistics computation every 5 minutes via queue
  cron.schedule('*/5 * * * *', async () => {
    logger.info('Scheduling statistics computation...');
    try {
      await scheduleStatisticsJob();
    } catch (error: any) {
      logger.error({ error: error.message }, 'Error scheduling statistics job');
    }
  });

  // Graceful shutdown
  async function gracefulShutdown() {
    logger.info('Shutting down gracefully...');
    await statisticsWorker.close();
    await closeStatisticsQueue();
    await redisClient.quit();
    await prisma.$disconnect();
    process.exit(0);
  }

  process.on('SIGTERM', gracefulShutdown);
  process.on('SIGINT', gracefulShutdown);

  // Start server
  app.listen(PORT, async () => {
    logger.info({ port: PORT }, 'Server running');

    try {
      // Schedule initial statistics job via queue
      await scheduleStatisticsJob();
      logger.info('Initial statistics job scheduled');
    } catch (error: any) {
      logger.error({ error: error.message }, 'Error scheduling initial statistics job');
    }
  });

  return app;
}

// Start the application
bootstrap().catch((error) => {
  logger.fatal({ error: error.message }, 'Failed to start server');
  process.exit(1);
});

export default bootstrap;
