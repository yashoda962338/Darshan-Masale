// backend/src/models/Gallery.js
const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  titleMr: String,
  description: String,
  descriptionMr: String,
  image: {
    type: String,
    required: true,
  },
  imageId: String,
  category: {
    type: String,
    enum: ['SHOP', 'PRODUCT', 'OWNER', 'CUSTOMER', 'EVENT', 'FACTORY', 'OTHER'],
    default: 'OTHER',
  },
  displayOrder: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  deletedAt: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
});

gallerySchema.index({ category: 1 });
gallerySchema.index({ isActive: 1 });

module.exports = mongoose.model('Gallery', gallerySchema);