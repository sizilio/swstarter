const express = require('express');
const router = express.Router();
const StatisticsController = require('../controllers/statisticsController');

// Statistics route
router.get('/', StatisticsController.getStatistics);

module.exports = router;