const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({

    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    paymentGateway: {
        type: String,
        default: "CASHFREE"
    },

    cashfreeOrderId: String,

    paymentSessionId: String,

    cfPaymentId: String,

    amount: {
        type: Number,
        required: true
    },

    currency: {
        type: String,
        default: "INR"
    },

    paymentStatus: {
        type: String,
        enum: [
            "PENDING",
            "SUCCESS",
            "FAILED",
            "CANCELLED",
            "REFUNDED"
        ],
        default: "PENDING"
    },

    paymentMethod: String,

    gatewayResponse: {
        type: mongoose.Schema.Types.Mixed
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Payment", paymentSchema);