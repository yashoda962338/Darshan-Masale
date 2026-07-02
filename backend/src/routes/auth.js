// backend/src/routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middlewares/auth');

// ============================================
// PUBLIC ROUTES
// ============================================

// Registration Flow
router.post('/register', authController.register);
router.post('/verify-registration-otp', authController.verifyRegistrationOTP);
router.post('/resend-otp', authController.resendOTP);

// Login
router.post('/login', authController.login);

// Forgot Password Flow
router.post('/forgot-password', authController.forgotPassword);
router.post('/verify-forgot-password-otp', authController.verifyForgotPasswordOTP);
router.post('/reset-password', authController.resetPassword);

// ============================================
// PROTECTED ROUTES
// ============================================

router.get('/profile', authenticate, authController.getProfile);
router.put('/profile', authenticate, authController.updateProfile);
router.post('/logout', authenticate, authController.logout);

module.exports = router;