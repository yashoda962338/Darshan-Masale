// backend/src/routes/products.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// ============================================
// PUBLIC ROUTES
// ============================================

// Get all products with filters
router.get('/', productController.getProducts);

// Get featured products
router.get('/featured', productController.getFeaturedProducts);

// Get best sellers
router.get('/bestsellers', productController.getBestSellers);

// Get products by category
router.get('/category/:category', productController.getProductsByCategory);

// Get product by slug
router.get('/:slug', productController.getProductBySlug);

module.exports = router;