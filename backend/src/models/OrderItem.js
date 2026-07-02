const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
{
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true,
    },

    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },

    variantId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },

    productName: {
        type: String,
        required: true,
    },

    productNameMr: {
        type: String,
        default: "",
    },

    variantName: {
        type: String,
        default: "",
    },

    variantNameMr: {
        type: String,
        default: "",
    },

    sku: {
        type: String,
        default: "",
    },

    image: {
        type: String,
        default: "",
    },

    weight: Number,

    unit: String,

    quantity: {
        type: Number,
        required: true,
    },

    mrp: {
        type: Number,
        required: true,
    },

    sellingPrice: {
        type: Number,
        required: true,
    },

    discount: {
        type: Number,
        default: 0,
    },

    gst: {
        type: Number,
        default: 0,
    },

    totalPrice: {
        type: Number,
        required: true,
    },
},
{
    timestamps: true,
}
);

orderItemSchema.index({ orderId: 1 });

module.exports = mongoose.model("OrderItem", orderItemSchema);