// backend/src/routes/users.js
const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth');
const userController = require('../controllers/userController');

// All user routes require authentication
router.use(authenticate);

// Profile
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);
router.put('/change-password', userController.changePassword);

// Addresses
router.get('/addresses', userController.getAddresses);
router.post('/addresses', userController.createAddress);
router.put('/addresses/:id', userController.updateAddress);
router.patch('/addresses/default/:id', userController.makeDefaultAddress);
router.delete('/addresses/:id', userController.deleteAddress);


module.exports = router;