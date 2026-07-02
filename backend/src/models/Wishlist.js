// backend/src/models/Wishlist.js
const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  items: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WishlistItem',
  }],
}, {
  timestamps: true,
});

wishlistSchema.index({ userId: 1 });

module.exports = mongoose.model('Wishlist', wishlistSchema);