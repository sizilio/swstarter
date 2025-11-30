import { Worker, Job } from 'bullmq';
import { queueConnection } from '../../lib/queue';
import { STATISTICS_QUEUE_NAME } from '../queues/statistics.queue';
import StatisticsService from '../../services/statisticsService';
import logger from '../../lib/logger';

export function createStatisticsWorker(): Worker {
  const worker = new Worker(
    STATISTICS_QUEUE_NAME,
    async (job: Job) => {
      logger.info({ jobId: job.id }, 'Processing statistics job');

      const stats = await StatisticsService.computeAndSave();

      logger.info(
        {
          jobId: job.id,
          totalQueries: stats.totalQueries,
          avgResponseTime: stats.avgResponseTime,
        },
        'Statistics job completed'
      );

      return {
        success: true,
        computedAt: new Date().toISOString(),
        stats,
      };
    },
    {
      connection: queueConnection,
      concurrency: 1, // Only 1 job at a time
    }
  );

  // Event listeners
  worker.on('completed', (job) => {
    logger.info({ jobId: job.id }, 'Job completed successfully');
  });

  worker.on('failed', (job, err) => {
    logger.error({ jobId: job?.id, error: err.message }, 'Job failed');
  });

  worker.on('error', (err) => {
    logger.error({ error: err.message }, 'Worker error');
  });

  return worker;
}
