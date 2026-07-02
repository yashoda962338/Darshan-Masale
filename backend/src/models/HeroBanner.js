// backend/src/models/HeroBanner.js
const mongoose = require('mongoose');

const heroBannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  titleMr: String,
  subtitle: String,
  subtitleMr: String,
  buttonText: String,
  buttonTextMr: String,
  buttonLink: String,
  buttonType: {
    type: String,
    enum: ['primary', 'secondary', 'outline'],
    default: 'primary',
  },
  desktopImage: {
    type: String,
    required: true,
  },
  desktopImageId: String,
  mobileImage: String,
  mobileImageId: String,
  position: {
    type: String,
    enum: ['HERO', 'TOP', 'MIDDLE', 'BOTTOM', 'SIDEBAR', 'POPUP'],
    default: 'HERO',
  },
  priority: {
    type: Number,
    default: 0,
  },
  displayOrder: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  startDate: Date,
  endDate: Date,
  deletedAt: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
});

heroBannerSchema.index({ isActive: 1 });
heroBannerSchema.index({ position: 1 });
heroBannerSchema.index({ displayOrder: 1 });

module.exports = mongoose.model('HeroBanner', heroBannerSchema);