// backend/src/routes/categories.js
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// ============================================
// PUBLIC ROUTES ONLY (mounted at /api/categories)
// ============================================
router.get('/', categoryController.getPublicCategories);

module.exports = router;