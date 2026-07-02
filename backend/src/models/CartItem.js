// backend/src/models/CartItem.js - VERIFIED
const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    cartId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart',
        required: true,
    },
    variantId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1,
    },
    price: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true,
});

cartItemSchema.index({ cartId: 1 });
cartItemSchema.index({ variantId: 1 });
cartItemSchema.index({ cartId: 1, variantId: 1 }, { unique: true });

module.exports = mongoose.model('CartItem', cartItemSchema);

console.log("CartItem Collection =", mongoose.model("CartItem").collection.name);