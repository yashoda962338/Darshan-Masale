// backend/src/routes/wishlist.js - COMPLETE
const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth');
const wishlistController = require('../controllers/wishlistController');

console.log('💜 Wishlist routes loading...');

// All wishlist routes require authentication
router.use(authenticate);

// ============================================
// WISHLIST ROUTES
// ============================================

// Get wishlist
router.get('/', wishlistController.getWishlist);

// Add to wishlist
router.post('/', wishlistController.addToWishlist);

// Clear wishlist
router.delete('/', wishlistController.clearWishlist);

// Check if product is in wishlist
router.get('/check/:productId', wishlistController.checkWishlist);

// Move to cart
router.post('/:id/move-to-cart', wishlistController.moveToCart);

// Remove from wishlist - ✅ THIS IS THE ROUTE THAT'S 404
router.delete('/:id', wishlistController.removeFromWishlist);

console.log('✅ Wishlist routes registered:');
console.log('  - GET    /api/wishlist');
console.log('  - POST   /api/wishlist');
console.log('  - DELETE /api/wishlist');
console.log('  - GET    /api/wishlist/check/:productId');
console.log('  - POST   /api/wishlist/:id/move-to-cart');
console.log('  - DELETE /api/wishlist/:id');

module.exports = router;