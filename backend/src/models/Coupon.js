// backend/src/models/Coupon.js
const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ['PERCENTAGE', 'FIXED', 'FREE_SHIPPING'],
    default: 'PERCENTAGE',
  },
  value: {
    type: Number,
    required: true,
  },
  minOrderValue: {
    type: Number,
    default: 0,
  },
  maxDiscount: {
    type: Number,
    default: 0,
  },
  usageLimit: {
    type: Number,
    default: 100,
  },
  usageCount: {
    type: Number,
    default: 0,
  },
  perUserLimit: {
    type: Number,
    default: 1,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE', 'EXPIRED'],
    default: 'ACTIVE',
  },
  deletedAt: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
});

couponSchema.index({ code: 1 });
couponSchema.index({ status: 1 });
couponSchema.index({ endDate: 1 });

module.exports = mongoose.model('Coupon', couponSchema);