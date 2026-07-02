// backend/src/routes/admin.js - COMPLETE WITH ALL ROUTES
const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth');
const adminController = require('../controllers/adminController');
const productController = require('../controllers/productController');
const categoryController = require('../controllers/categoryController');
const uploadController = require('../controllers/uploadController');
const { upload, handleUploadError } = require('../middlewares/upload');

// All routes require authentication
router.use(authenticate);

// ============================================
// DASHBOARD
// ============================================
router.get('/dashboard', adminController.getDashboard);

// ============================================
// PRODUCT MANAGEMENT
// ============================================
router.get('/products', productController.getAdminProducts);
router.get('/products/:id', productController.getAdminProduct);
router.post('/products', productController.createProduct);
router.put('/products/:id', productController.updateProduct);
router.delete('/products/:id', productController.deleteProduct);
router.patch('/products/:id/status', productController.updateProductStatus);

// ============================================
// CATEGORY MANAGEMENT
// ============================================
router.get('/categories', categoryController.getCategories);
router.get('/categories/:id', categoryController.getCategory);
router.post('/categories', categoryController.createCategory);
router.put('/categories/:id', categoryController.updateCategory);
router.delete('/categories/:id', categoryController.deleteCategory);
router.patch('/categories/:id/status', categoryController.toggleCategoryStatus);

// ============================================
// IMAGE UPLOAD
// ============================================
router.post('/upload/:folder', upload.single('image'), handleUploadError, uploadController.uploadImage);
router.delete('/upload/:folder/:filename', uploadController.deleteImage);

// ============================================
// ORDERS
// ============================================
router.get('/orders', adminController.getOrders);
router.get('/orders/:id', adminController.getOrder);
router.put('/orders/:id/status', adminController.updateOrderStatus);

// ============================================
// CUSTOMERS
// ============================================
router.get('/customers', adminController.getCustomers);
router.get('/customers/:id', adminController.getCustomer);
router.put('/customers/:id/block', adminController.blockCustomer);
router.put('/customers/:id/unblock', adminController.unblockCustomer);
router.delete('/customers/:id', adminController.deleteCustomer);

// ============================================
// COUPONS
// ============================================
router.get('/coupons', adminController.getCoupons);
router.post('/coupons', adminController.createCoupon);
router.put('/coupons/:id', adminController.updateCoupon);
router.delete('/coupons/:id', adminController.deleteCoupon);

// ============================================
// GALLERY
// ============================================
router.get('/gallery', adminController.getGalleryImages);
router.post('/gallery', adminController.createGalleryImage);
router.delete('/gallery/:id', adminController.deleteGalleryImage);

// ============================================
// REVIEWS
// ============================================
router.get('/reviews', adminController.getReviews);
router.put('/reviews/:id', adminController.updateReviewStatus);
router.delete('/reviews/:id', adminController.deleteReview);

// ============================================
// HERO BANNERS
// ============================================
router.get('/banners', adminController.getHeroBanners);
router.post('/banners', adminController.createHeroBanner);
router.put('/banners/:id', adminController.updateHeroBanner);
router.delete('/banners/:id', adminController.deleteHeroBanner);

// ============================================
// REPORTS
// ============================================
router.get('/reports/sales', adminController.getSalesReport);
router.get('/reports/products', adminController.getProductReport);

// ============================================
// ANALYTICS
// ============================================
router.get('/analytics', adminController.getAnalytics);

// ============================================
// USERS (Super Admin Only)
// ============================================
router.get('/users', adminController.getUsers);
router.put('/users/:id/role', adminController.updateUserRole);

// Add to admin.js - Settings routes
// ============================================
// SETTINGS
// ============================================
router.get('/settings', adminController.getSettings);
router.put('/settings', adminController.updateSettings);

module.exports = router;