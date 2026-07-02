const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({

    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true
    },

    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },

    comment: {
        type: String,
        trim: true
    },

    isApproved: {
        type: Boolean,
        default: false
    },

    // ✅ ADD THIS
    deletedAt: {
        type: Date,
        default: null
    }

},{
    timestamps:true
});

module.exports = mongoose.model("Review", reviewSchema);