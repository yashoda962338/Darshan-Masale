const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(

    {

        orderNumber: {
            type: String,
            required: true,
            unique: true
        },

        invoiceNumber: {
            type: String
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        addressId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Address",
            required: true
        },

        // Snapshot Address
        shippingAddress: {
            fullName: String,
            phone: String,
            addressLine1: String,
            addressLine2: String,
            city: String,
            state: String,
            country: String,
            pincode: String,
            addressType: String
        },

        subtotal: {
            type: Number,
            required: true
        },

        discount: {
            type: Number,
            default: 0
        },

        couponCode: {
            type: String,
            default: null
        },

        couponDiscount: {
            type: Number,
            default: 0
        },

        shippingCost: {
            type: Number,
            default: 0
        },

        tax: {
            type: Number,
            default: 0
        },

        roundingAdjustment: {
            type: Number,
            default: 0
        },

        total: {
            type: Number,
            required: true
        },

        totalItems: {
            type: Number,
            default: 0
        },

        currency: {
            type: String,
            default: "INR"
        },

        status: {
            type: String,
            enum: [
                "PENDING",
                "CONFIRMED",
                "PROCESSING",
                "PACKED",
                "SHIPPED",
                "OUT_FOR_DELIVERY",
                "DELIVERED",
                "CANCELLED",
                "RETURN_REQUESTED",
                "RETURNED",
                "REFUNDED",
                "FAILED"
            ],
            default: "PENDING"
        },

        paymentMethod:{
type:String,
enum:[
"COD",
"CASHFREE",
"UPI",
"CARD",
"NET_BANKING",
"WALLET"
],
default:"COD"
},

paymentStatus:{
type:String,
enum:[
"PENDING",
"PROCESSING",
"SUCCESS",
"FAILED",
"REFUNDED",
"CANCELLED"
],
default:"PENDING"
},

paymentGateway:{
type:String,
default:null
},

paymentId:{
type:mongoose.Schema.Types.ObjectId,
ref:"Payment"
},

cashfreeOrderId:{
type:String,
default:null
},

paymentSessionId:{
type:String,
default:null
},

transactionId:{
type:String,
default:null
},

paymentTime:{
type:Date,
default:null
},

paymentDetails:{
type:mongoose.Schema.Types.Mixed,
default:{}
},
        deliveredAt: Date,
        paymentTime: {
            type: Date,
            default: null
        },

        deletedAt: {
            type: Date,
            default: null
        }

    },

    {
        timestamps: true
    }

);

orderSchema.index({ orderNumber: 1 });
orderSchema.index({ userId: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Order", orderSchema);