const { apiSuccess } = require('../utils/apiResponse');
const config = require('../config/environment');
const database = require('../config/database');
const logger = require('../config/logger');

class HealthController {
  async check(req, res) {
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: config.env,
      version: '1.0.0',
    };

    // Check database
    try {
      const db = database.getConnection();
      await db.query('SELECT 1');
      healthData.database = 'connected';
    } catch (error) {
      healthData.database = 'disconnected';
      healthData.status = 'degraded';
      logger.warn('Health check - Database disconnected');
    }

    res.json(apiSuccess('Server is healthy', healthData));
  }

  async ping(req, res) {
    res.json(apiSuccess('Pong!'));
  }

  async version(req, res) {
    res.json(apiSuccess('API Version', {
      version: '1.0.0',
      node: process.version,
      environment: config.env,
    }));
  }
}

module.exports = new HealthController();