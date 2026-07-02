// backend/src/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  displayName: String,
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    unique: true,
    sparse: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'SUPPORT', 'CUSTOMER'],
    default: 'CUSTOMER',
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE', 'BLOCKED', 'SUSPENDED', 'PENDING_VERIFICATION'],
    default: 'PENDING_VERIFICATION',
  },
  gender: {
    type: String,
    enum: ['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY'],
  },
  dob: Date,
  profileImage: String,
  profileImageId: String,
  emailVerified: {
    type: Boolean,
    default: false,
  },
  phoneVerified: {
    type: Boolean,
    default: false,
  },
  lastLoginAt: Date,
  loginAttempts: {
    type: Number,
    default: 0,
  },
  lockedUntil: Date,
  twoFactorEnabled: {
    type: Boolean,
    default: false,
  },
  twoFactorSecret: String,
  preferredLanguage: {
    type: String,
    default: 'en',
  },
  timezone: {
    type: String,
    default: 'Asia/Kolkata',
  },
  deletedAt: Date,
}, {
  timestamps: true,
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ role: 1 });
userSchema.index({ status: 1 });

module.exports = mongoose.model('User', userSchema);