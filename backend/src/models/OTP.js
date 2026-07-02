// backend/src/models/OTP.js
const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  phone: {
    type: String,
    trim: true,
    sparse: true,
    index: true,
  },
  otp: {
    type: String,
    required: true,
    select: false, // Never return OTP in queries
  },
  purpose: {
    type: String,
    enum: ['REGISTRATION', 'FORGOT_PASSWORD', 'LOGIN', 'VERIFY_PHONE'],
    required: true,
    index: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: true,
  },
  verified: {
    type: Boolean,
    default: false,
    index: true,
  },
  attempts: {
    type: Number,
    default: 0,
    max: 3,
  },
  maxAttempts: {
    type: Number,
    default: 3,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    sparse: true,
  },
  ipAddress: String,
  userAgent: String,
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, // Auto-delete after 5 minutes (TTL index)
  },
});

// Compound indexes
otpSchema.index({ email: 1, purpose: 1, createdAt: -1 });
otpSchema.index({ phone: 1, purpose: 1, createdAt: -1 });

// Pre-save hook to set expiresAt if not provided
otpSchema.pre('save', function(next) {
  if (!this.expiresAt) {
    this.expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
  }
  next();
});

// Instance method to check if OTP is expired
otpSchema.methods.isExpired = function() {
  return Date.now() > this.expiresAt.getTime();
};

// Instance method to increment attempts
otpSchema.methods.incrementAttempts = async function() {
  this.attempts += 1;
  await this.save();
  return this.attempts;
};

// Static method to clean up expired OTPs
otpSchema.statics.cleanup = async function() {
  const result = await this.deleteMany({
    expiresAt: { $lt: new Date() },
  });
  return result.deletedCount;
};

module.exports = mongoose.model('OTP', otpSchema);