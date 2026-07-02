// backend/src/routes/settings.js
const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth');
const settingsController = require('../controllers/settingsController');

// All routes require authentication
router.use(authenticate);

router.get('/', settingsController.getSettings);
router.put('/', settingsController.updateSettings);

module.exports = router;