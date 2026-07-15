// backend/src/controllers/authController.js
const User = require('../models/User');
const OTP = require('../models/OTP');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { generateOTP, isValidOTP, getOTPExpiry } = require('../utils/otpGenerator');
const { sendOTPEmail } = require('../services/emailService');
const logger = require('../config/logger');

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user._id, 
      email: user.email, 
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName
    },
    process.env.JWT_SECRET || 'darshan_masale_secret',
    { expiresIn: '7d' }
  );
};

// ============================================
// REGISTER FLOW
// ============================================

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email or phone',
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user with PENDING status
    const user = await User.create({
      firstName,
      lastName,
      email,
      phone,
      passwordHash,
      status: 'PENDING_VERIFICATION',
      emailVerified: false,
      phoneVerified: false,
      role: 'CUSTOMER',
    });

    // Generate OTP
    const otpCode = generateOTP();
    const expiresAt = getOTPExpiry(5);

    // Save OTP to database
    await OTP.create({
      email: email,
      phone: phone,
      otp: otpCode,
      purpose: 'REGISTRATION',
      expiresAt: expiresAt,
      userId: user._id,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.headers['user-agent'],
    });

    // Send OTP via email
    const emailSent = await sendOTPEmail(email, otpCode, 'REGISTRATION', firstName);

    if (!emailSent) {
      // Log error but don't fail registration
      logger.error(`Failed to send OTP email to ${email}`);
    }

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please check your email for OTP.',
      data: {
        userId: user._id,
        email: user.email,
        phone: user.phone,
        emailSent: emailSent,
      },
    });
  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Verify Registration OTP
// @route   POST /api/auth/verify-registration-otp
// @access  Public
exports.verifyRegistrationOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required',
      });
    }

    if (!isValidOTP(otp)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP format. Please enter a 6-digit code.',
      });
    }

    // Find OTP
    const otpRecord = await OTP.findOne({
      email: email.toLowerCase(),
      purpose: 'REGISTRATION',
      verified: false,
    }).select('+otp');

    if (!otpRecord) {
      return res.status(404).json({
        success: false,
        message: 'No OTP found. Please request a new one.',
      });
    }

    // Check expiry
    if (otpRecord.isExpired()) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({
        success: false,
        message: 'OTP expired. Please request a new one.',
      });
    }

    // Check attempts
    if (otpRecord.attempts >= otpRecord.maxAttempts) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({
        success: false,
        message: 'Too many failed attempts. Please request a new OTP.',
      });
    }

    // Verify OTP
    if (otpRecord.otp !== otp) {
      await otpRecord.incrementAttempts();
      const remaining = otpRecord.maxAttempts - otpRecord.attempts;
      return res.status(400).json({
        success: false,
        message: `Invalid OTP. ${remaining} attempts remaining.`,
      });
    }

    // Mark OTP as verified
    otpRecord.verified = true;
    await otpRecord.save();

    // Activate user
    const user = await User.findById(otpRecord.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    user.status = 'ACTIVE';
    user.emailVerified = true;
    if (user.phone) {
      user.phoneVerified = true;
    }
    await user.save();

    res.json({
      success: true,
      message: 'OTP verified successfully. Account activated!',
    });
  } catch (error) {
    logger.error('OTP verification error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public
exports.resendOTP = async (req, res) => {
  try {
    const { email, purpose = 'REGISTRATION' } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Delete old OTPs
    await OTP.deleteMany({
      email: email.toLowerCase(),
      purpose: purpose,
    });

    // Generate new OTP
    const otpCode = generateOTP();
    const expiresAt = getOTPExpiry(5);

    // Save new OTP
    await OTP.create({
      email: email.toLowerCase(),
      phone: user.phone,
      otp: otpCode,
      purpose: purpose,
      expiresAt: expiresAt,
      userId: user._id,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.headers['user-agent'],
    });

    // Send OTP via email
    const emailSent = await sendOTPEmail(email, otpCode, purpose, user.firstName);

    res.json({
      success: true,
      message: 'OTP resent successfully. Please check your email.',
      data: {
        emailSent: emailSent,
      },
    });
  } catch (error) {
    logger.error('Resend OTP error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================
// FORGOT PASSWORD FLOW
// ============================================

// @desc    Forgot Password - Send OTP
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found with this email',
      });
    }

    // Delete old OTPs
    await OTP.deleteMany({
      email: email.toLowerCase(),
      purpose: 'FORGOT_PASSWORD',
    });

    // Generate OTP
    const otpCode = generateOTP();
    const expiresAt = getOTPExpiry(5);

    // Save OTP
    await OTP.create({
      email: email.toLowerCase(),
      phone: user.phone,
      otp: otpCode,
      purpose: 'FORGOT_PASSWORD',
      expiresAt: expiresAt,
      userId: user._id,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.headers['user-agent'],
    });

    // Send OTP
    const emailSent = await sendOTPEmail(email, otpCode, 'FORGOT_PASSWORD', user.firstName);

    res.json({
      success: true,
      message: 'OTP sent to your email. Please check and verify.',
      data: {
        userId: user._id,
        email: user.email,
        emailSent: emailSent,
      },
    });
  } catch (error) {
    logger.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Verify Forgot Password OTP
// @route   POST /api/auth/verify-forgot-password-otp
// @access  Public
exports.verifyForgotPasswordOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required',
      });
    }

    if (!isValidOTP(otp)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP format',
      });
    }

    // Find OTP
    const otpRecord = await OTP.findOne({
      email: email.toLowerCase(),
      purpose: 'FORGOT_PASSWORD',
      verified: false,
    }).select('+otp');

    if (!otpRecord) {
      return res.status(404).json({
        success: false,
        message: 'No OTP found. Please request a new one.',
      });
    }

    // Check expiry
    if (otpRecord.isExpired()) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({
        success: false,
        message: 'OTP expired. Please request a new one.',
      });
    }

    // Check attempts
    if (otpRecord.attempts >= otpRecord.maxAttempts) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({
        success: false,
        message: 'Too many failed attempts. Please request a new OTP.',
      });
    }

    // Verify OTP
    if (otpRecord.otp !== otp) {
      await otpRecord.incrementAttempts();
      const remaining = otpRecord.maxAttempts - otpRecord.attempts;
      return res.status(400).json({
        success: false,
        message: `Invalid OTP. ${remaining} attempts remaining.`,
      });
    }

    // Mark OTP as verified
    otpRecord.verified = true;
    await otpRecord.save();

    res.json({
      success: true,
      message: 'OTP verified successfully. You can now reset your password.',
      data: {
        userId: otpRecord.userId,
        email: otpRecord.email,
      },
    });
  } catch (error) {
    logger.error('Verify forgot password OTP error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password
// @access  Public
exports.resetPassword = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      });
    }

    // Check if OTP was verified
    const otpRecord = await OTP.findOne({
      email: email.toLowerCase(),
      purpose: 'FORGOT_PASSWORD',
      verified: true,
    });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'OTP not verified. Please verify OTP first.',
      });
    }

    // Find user
    const user = await User.findById(otpRecord.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(password, salt);
    await user.save();

    // Delete used OTP
    await OTP.deleteMany({
      email: email.toLowerCase(),
      purpose: 'FORGOT_PASSWORD',
    });

    res.json({
      success: true,
      message: 'Password reset successfully. Please login with your new password.',
    });
  } catch (error) {
    logger.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================
// LOGIN
// ============================================

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    const user = await User.findOne({
      $or: [{ email }, { phone }]
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'No account found with these details. Please register first.',
      });
    }

    if (user.status !== 'ACTIVE') {
      return res.status(401).json({
        success: false,
        message: 'Your account is not verified yet. Please check your email for the OTP.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect password. Please try again.',
      });
    }

    user.lastLoginAt = new Date();
    await user.save();

    const token = generateToken(user);
    const userData = user.toObject();
    delete userData.passwordHash;

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: userData,
      },
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================
// PROFILE
// ============================================

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    logger.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, email, phone } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (phone) user.phone = phone;

    await user.save();

    const userData = user.toObject();
    delete userData.passwordHash;

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: userData,
    });
  } catch (error) {
    logger.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Logout
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    logger.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};