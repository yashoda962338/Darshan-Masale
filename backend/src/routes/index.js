const express = require('express');
const router = express.Router();
const healthRoutes = require('./healthRoutes');

// Health check routes
router.use('/health', healthRoutes);

// Root route
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Darshan Masale API',
    version: '1.0.0',
    endpoints: {
      health: '/api/v1/health',
      ping: '/api/v1/health/ping',
      version: '/api/v1/health/version',
    },
  });
});

module.exports = router;