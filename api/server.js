const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
require('dotenv').config();

const pool = require('./config/database');
const searchRoutes = require('./routes/search');
const statisticsRoutes = require('./routes/statistics');
const { computeStatistics } = require('./jobs/computeStatistics');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/search', searchRoutes);
app.use('/api/statistics', statisticsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Schedule statistics computation every 5 minutes
cron.schedule('*/5 * * * *', async () => {
  console.log('Running scheduled statistics computation...');
  try {
    await computeStatistics();
    console.log('✓ Statistics computed successfully');
  } catch (error) {
    console.error('Error computing statistics:', error);
  }
});

// Start server
app.listen(PORT, async () => {
  console.log(`✓ Server running on port ${PORT}`);

  // Test database connection
  try {
    await pool.query('SELECT NOW()');
    console.log('✓ Database connection verified');

    // Compute initial statistics
    await computeStatistics();
    console.log('✓ Initial statistics computed');
  } catch (error) {
    console.error('Database connection error:', error);
  }
});

module.exports = app;