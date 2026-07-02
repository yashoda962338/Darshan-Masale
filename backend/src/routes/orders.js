// backend/src/routes/orders.js - COMPLETE
const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth');
const orderController = require('../controllers/orderController');

// All order routes require authentication
router.use(authenticate);

// ============================================
// USER ORDER ROUTES
// ============================================

router.use(authenticate);

router.get("/", orderController.getOrders);

router.post("/", orderController.createOrder);

router.get("/coupons", orderController.getCoupons);

router.post("/coupons/apply", orderController.applyCoupon);

router.get("/:id/invoice", orderController.getInvoice);

router.get("/:id", orderController.getOrder);

router.put("/:id/cancel", orderController.cancelOrder);

router.get("/:id/status", orderController.getOrderStatus);

module.exports = router;