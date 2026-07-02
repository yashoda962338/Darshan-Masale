const express = require('express');
const router = express.Router();
const healthController = require('../controllers/healthController');

router.get('/', healthController.check);
router.get('/ping', healthController.ping);
router.get('/version', healthController.version);

module.exports = router;