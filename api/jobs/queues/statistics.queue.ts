import { Queue } from 'bullmq';
import { queueConnection, defaultJobOptions } from '../../lib/queue';
import logger from '../../lib/logger';

export const STATISTICS_QUEUE_NAME = 'statistics';

export const statisticsQueue = new Queue(STATISTICS_QUEUE_NAME, {
  connection: queueConnection,
  defaultJobOptions,
});

// Add statistics computation job to queue
export async function scheduleStatisticsJob(): Promise<void> {
  await statisticsQueue.add('compute-stats', {
    triggeredAt: new Date().toISOString(),
  });
  logger.info('Statistics job added to queue');
}

// Close queue connection (for graceful shutdown)
export async function closeStatisticsQueue(): Promise<void> {
  await statisticsQueue.close();
}
