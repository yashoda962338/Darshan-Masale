// backend/src/models/Settings.js
const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  // Store Information
  storeName: {
    type: String,
    default: 'Darshan Masale',
  },
  storeNameMr: {
    type: String,
    default: 'दर्शन मसाले',
  },
  phone: {
    type: String,
    default: '',
  },
  email: {
    type: String,
    default: '',
  },
  address: {
    type: String,
    default: '',
  },
  addressMr: {
    type: String,
    default: '',
  },
  website: {
    type: String,
    default: '',
  },
  currency: {
    type: String,
    default: '₹',
  },

  // Branding
  logo: {
    type: String,
    default: '',
  },
  logoId: {
    type: String,
    default: '',
  },
  favicon: {
    type: String,
    default: '',
  },
  faviconId: {
    type: String,
    default: '',
  },

  // SEO
  metaTitle: {
    type: String,
    default: 'Darshan Masale - Premium Indian Spices',
  },
  metaDescription: {
    type: String,
    default: 'Discover authentic Indian spices at Darshan Masale. Premium quality masalas, spices, and powders delivered to your doorstep.',
  },
  metaKeywords: {
    type: String,
    default: 'spices, masala, indian spices, premium spices, darshan masale',
  },

  // Social Media
  facebookUrl: {
    type: String,
    default: '',
  },
  instagramUrl: {
    type: String,
    default: '',
  },
  youtubeUrl: {
    type: String,
    default: '',
  },
  twitterUrl: {
    type: String,
    default: '',
  },

  // Store Hours
  workingHours: {
    type: String,
    default: '10:00 AM - 8:00 PM',
  },
  workingDays: {
    type: String,
    default: 'Monday - Saturday',
  },

  // Shipping & Tax
  deliveryCharges: {
    type: Number,
    default: 0,
  },
  freeDeliveryThreshold: {
    type: Number,
    default: 500,
  },
  taxRate: {
    type: Number,
    default: 18,
  },

  // Other Settings
  maintenanceMode: {
    type: Boolean,
    default: false,
  },
  maintenanceMessage: {
    type: String,
    default: 'We are currently under maintenance. Please check back soon!',
  },
  allowGuestCheckout: {
    type: Boolean,
    default: true,
  },
  allowReviews: {
    type: Boolean,
    default: true,
  },

  // Last Updated
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

// Ensure only one settings document exists
settingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

module.exports = mongoose.model('Settings', settingsSchema);