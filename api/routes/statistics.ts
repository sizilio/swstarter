import express, { Router } from 'express';
import StatisticsController from '../controllers/statisticsController';

const router: Router = express.Router();

// Statistics route
router.get('/', StatisticsController.getStatistics);

export default router;
