// backend/src/routes/categories.js
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authenticate } = require('../middlewares/auth');

// ============================================
// PUBLIC ROUTES
// ============================================
router.get('/', categoryController.getPublicCategories);

// ============================================
// ADMIN ROUTES (Protected)
// ============================================
router.get('/admin/categories', authenticate, categoryController.getCategories);
router.get('/admin/categories/:id', authenticate, categoryController.getCategory);
router.post('/admin/categories', authenticate, categoryController.createCategory);
router.put('/admin/categories/:id', authenticate, categoryController.updateCategory);
router.delete('/admin/categories/:id', authenticate, categoryController.deleteCategory);
router.patch('/admin/categories/:id/status', authenticate, categoryController.toggleCategoryStatus);

module.exports = router;