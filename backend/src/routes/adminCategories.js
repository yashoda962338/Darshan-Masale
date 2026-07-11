// backend/src/routes/adminCategories.js
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authenticate } = require('../middlewares/auth');

// ============================================
// ADMIN ROUTES (mounted at /api/admin/categories)
// ============================================
router.get('/', authenticate, categoryController.getCategories);
router.get('/:id', authenticate, categoryController.getCategory);
router.post('/', authenticate, categoryController.createCategory);
router.put('/:id', authenticate, categoryController.updateCategory);
router.delete('/:id', authenticate, categoryController.deleteCategory);
router.patch('/:id/status', authenticate, categoryController.toggleCategoryStatus);

module.exports = router;