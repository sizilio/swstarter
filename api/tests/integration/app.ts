import express, { Application } from 'express';
import cors from 'cors';
import searchRoutes from '../../routes/search';
import statisticsRoutes from '../../routes/statistics';
import { errorHandler } from '../../middlewares/errorHandler';

// Create test app without rate limiters and database connections
export function createTestApp(): Application {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // Routes without rate limiters for testing
  app.use('/api/search', searchRoutes);
  app.use('/api/statistics', statisticsRoutes);

  // Error handler
  app.use(errorHandler);

  return app;
}
