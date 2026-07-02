// backend/src/controllers/orderController.js - FIXED (No ProductVariant)
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Address = require('../models/Address');
const Cart = require('../models/Cart');
const CartItem = require('../models/CartItem');
const Product = require('../models/Product');
const Review = require("../models/Review");
const Coupon = require('../models/Coupon');
const PDFDocument = require("pdfkit");
const Payment = require("../models/Payment");

// Generate unique order number
const generateOrderNumber = () => {
    const prefix = 'ORD';
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}-${timestamp}-${random}`;
};

// ============================================
// USER ORDER APIs
// ============================================

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
exports.getOrders = async (req, res) => {
    try {
        const { page = 1, limit = 10, status } = req.query;
        const filter = {
            userId: req.user.id,
            deletedAt: null
        };

        if (status) filter.status = status;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const orders = await Order.find(filter)
            .populate('addressId')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        // Get order items for each order
        const ordersWithItems = await Promise.all(orders.map(async (order) => {
            const items = await OrderItem.find({ orderId: order._id });

            // Populate product details for each item
            const populatedItems = await Promise.all(items.map(async (item) => {
                const product = await Product.findById(item.productId);

                let variant = null;

                if (product && item.variantId) {
                    variant = product.variants.find(
                        v => v._id.toString() === item.variantId.toString()
                    );
                }

                return {
                    ...item.toObject(),
                    productId: product || null,
                    variantId: variant || null
                };
            }));

            return {
                ...order.toObject(),
                items: populatedItems
            };
        }));

        const total = await Order.countDocuments(filter);

        res.json({
            success: true,
            data: {
                orders: ordersWithItems,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / parseInt(limit))
                }
            }
        });
    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await Order.findOne({
            _id: id,
            userId: req.user.id,
            deletedAt: null
        })
            .populate('addressId')
            .populate('userId', 'firstName lastName email phone');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        const items = await OrderItem.find({ orderId: order._id });

        // Populate product details for each item
        const populatedItems = await Promise.all(

            items.map(async (item) => {

                const product = await Product.findById(item.productId);

                let variant = null;

                if (product && item.variantId) {

                    variant = product.variants.find(

                        v => v._id.toString() === item.variantId.toString()

                    );

                }

                // CHECK REVIEW
                const review = await Review.findOne({

                    orderId: order._id,

                    productId: item.productId,

                    userId: req.user.id

                });

                return {

                    ...item.toObject(),

                    productId: product || null,

                    variantId: variant || null,

                    reviewGiven: !!review

                };

            })

        );
        res.json({
            success: true,
            data: {
                ...order.toObject(),
                items: populatedItems
            }
        });
    } catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Create order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {

    try {

        const {
            addressId,
            paymentMethod,
            customerNotes,
            couponCode,
            buyNow,
            productId,
            variantId,
            quantity
        } = req.body;

        //------------------------------------------------
        // ADDRESS
        //------------------------------------------------

        const address = await Address.findOne({

            _id: addressId,

            userId: req.user.id,

            deletedAt: null

        });

        if (!address) {

            return res.status(404).json({

                success: false,

                message: "Address not found"

            });

        }

        //------------------------------------------------
        // CART
        //------------------------------------------------
        //------------------------------------------------
        // CART / BUY NOW
        //------------------------------------------------

        let cart = null;
        let cartItems = [];

        if (buyNow) {

            const product = await Product.findById(productId);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: "Product not found"
                });
            }

            const variant = product.variants.id(variantId);

            if (!variant) {
                return res.status(404).json({
                    success: false,
                    message: "Variant not found"
                });
            }

            cartItems.push({

                variantId,

                quantity

            });

        }
        else {

            cart = await Cart.findOne({

                userId: req.user.id

            });

            console.log("Cart =", cart);

            cartItems = await CartItem.find({

                cartId: cart?._id

            });

            console.log("Cart Items =", cartItems);

        }

        //------------------------------------------------
        // CALCULATE
        //------------------------------------------------

        let subtotal = 0;

        let totalItems = 0;

        const orderItems = [];

        //------------------------------------------------

        for (const item of cartItems) {

            const variantIdToFind = item.variantId;
            const qty = Number(item.quantity);

            const product = await Product.findOne({
                "variants._id": variantIdToFind,
                deletedAt: null
            });

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: "Product not found"
                });
            }

            const variant = product.variants.id(variantIdToFind);

            if (!variant) {
                return res.status(404).json({
                    success: false,
                    message: "Variant not found"
                });
            }

            if (variant.stock < qty) {
                return res.status(400).json({
                    success: false,
                    message: `${product.name} stock unavailable`
                });
            }

            // Reduce Stock
            variant.stock -= qty;
            await product.save();

            const lineTotal = variant.sellingPrice * qty;

            subtotal += lineTotal;
            totalItems += qty;

            orderItems.push({
                product,
                variant,
                quantity: qty,
                total: lineTotal
            });

        }
        //------------------------------------------------
        // SHIPPING
        //------------------------------------------------

        const shippingCost = subtotal >= 500 ? 0 : 50;

        const tax = 0;

        let discount = 0;

        let couponDiscount = 0;

        let appliedCoupon = null;

        // Apply Coupon
        if (couponCode) {

            appliedCoupon = await Coupon.findOne({

                code: couponCode.toUpperCase(),

                status: "ACTIVE"

            });

            // Check Per User Limit

            const userCouponUsage = await Order.countDocuments({

                userId: req.user.id,

                couponCode: appliedCoupon.code

            });

            if (userCouponUsage >= appliedCoupon.perUserLimit) {

                return res.status(400).json({

                    success: false,

                    message: `You can use this coupon only ${appliedCoupon.perUserLimit} time(s).`

                });

            }

            if (appliedCoupon.usageCount >= appliedCoupon.usageLimit) {

                return res.status(400).json({

                    success: false,

                    message: "Coupon usage limit exceeded"

                });

            }

            if (subtotal < appliedCoupon.minOrderValue) {

                return res.status(400).json({

                    success: false,

                    message: `Minimum order ₹${appliedCoupon.minOrderValue} required`

                });

            }

            if (appliedCoupon.type === "PERCENTAGE") {

                couponDiscount = subtotal * appliedCoupon.value / 100;

                if (

                    appliedCoupon.maxDiscount > 0 &&

                    couponDiscount > appliedCoupon.maxDiscount

                ) {

                    couponDiscount = appliedCoupon.maxDiscount;

                }

            } else {

                couponDiscount = appliedCoupon.value;

            }

        }

        const total =

            subtotal +

            shippingCost +

            tax -

            discount -

            couponDiscount;



        //------------------------------------------------
        // CREATE ORDER
        //------------------------------------------------

        const order = await Order.create({

            orderNumber: generateOrderNumber(),

            userId: req.user.id,

            addressId: address._id,

            shippingAddress: {

                fullName: address.fullName,

                phone: address.phone,

                addressLine1: address.addressLine1,

                addressLine2: address.addressLine2,

                city: address.city,

                state: address.state,

                country: address.country,

                pincode: address.pincode,

                addressType: address.addressType,

            },

            subtotal,

            shippingCost,

            tax,

            discount,

            couponDiscount,

            couponCode: appliedCoupon ? appliedCoupon.code : null,

            total,

            totalItems,

            paymentMethod,

            paymentStatus:
                paymentMethod === "COD"
                    ? "PENDING"
                    : "PROCESSING",

            customerNotes,

        });

        //------------------------------------------------
        // ORDER ITEMS
        //------------------------------------------------

        for (const item of orderItems) {

            await OrderItem.create({

                orderId: order._id,

                productId: item.product._id,

                variantId: item.variant._id,

                productName: item.product.name,

                productNameMr: item.product.nameMr,

                variantName:

                    item.variant.name ||

                    `${item.variant.weight}${item.variant.unit}`,

                variantNameMr:

                    item.variant.nameMr || "",

                sku: item.variant.sku || "",

                image:

                    item.product.images?.[0]?.url ||

                    "",

                weight: item.variant.weight,

                unit: item.variant.unit,

                quantity: item.quantity,

                mrp: item.variant.mrp,

                sellingPrice: item.variant.sellingPrice,

                discount: 0,

                gst: 0,

                totalPrice: item.total,

            });

        }

        //------------------------------------------------
        // UPDATE COUPON USAGE
        //------------------------------------------------

        if (appliedCoupon) {

            appliedCoupon.usageCount =
                (appliedCoupon.usageCount || 0) + 1;

            await appliedCoupon.save();

        }
        //------------------------------------------------
        // CLEAR CART
        //------------------------------------------------

        // CLEAR CART ONLY IF NORMAL CART ORDER
        if (!buyNow && cart) {

            await CartItem.deleteMany({
                cartId: cart._id
            });

            cart.items = [];
            await cart.save();
        }

        //------------------------------------------------

        res.status(201).json({

            success: true,

            message: "Order placed successfully",

            data: {

                _id: order._id,

                orderNumber: order.orderNumber,

                total: order.total

            }

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        const order = await Order.findOne({
            _id: id,
            userId: req.user.id,
            deletedAt: null
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Check if order can be cancelled
        const cancellableStatuses = ['PENDING', 'CONFIRMED', 'PROCESSING'];
        if (!cancellableStatuses.includes(order.status)) {
            return res.status(400).json({
                success: false,
                message: `Order cannot be cancelled in ${order.status} status`
            });
        }

        // Restore stock from embedded variants
        const orderItems = await OrderItem.find({ orderId: order._id });
        for (const item of orderItems) {
            const product = await Product.findOne({
                'variants._id': item.variantId,
                deletedAt: null
            });

            if (product) {
                const variant = product.variants.id(item.variantId);
                if (variant) {
                    variant.stock += item.quantity;
                    await product.save();
                }
            }
        }

        order.status = 'CANCELLED';
        order.paymentStatus = 'CANCELLED';
        order.cancellationReason = reason || 'Cancelled by customer';
        await order.save();

        res.json({
            success: true,
            message: 'Order cancelled successfully',
            data: order
        });
    } catch (error) {
        console.error('Cancel order error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get order status
// @route   GET /api/orders/:id/status
// @access  Private
exports.getOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await Order.findOne({
            _id: id,
            userId: req.user.id,
            deletedAt: null
        }).select('status paymentStatus shippingStatus trackingNumber trackingUrl estimatedDelivery');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.json({
            success: true,
            data: order
        });
    } catch (error) {
        console.error('Get order status error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.applyCoupon = async (req, res) => {

    try {

        const { code, subtotal } = req.body;

        const coupon = await Coupon.findOne({
            code: code.toUpperCase(),
            status: "ACTIVE"
        });

        if (!coupon) {

            return res.status(404).json({
                success: false,
                message: "Invalid Coupon"
            });

        }
        // Check Per User Limit

        const userCouponUsage = await Order.countDocuments({

            userId: req.user.id,

            couponCode: coupon.code

        });

        if (userCouponUsage >= coupon.perUserLimit) {

            return res.status(400).json({

                success: false,

                message: `You can use this coupon only ${coupon.perUserLimit} time(s).`

            });

        }
        if (coupon.usageCount >= coupon.usageLimit) {

            return res.status(400).json({

                success: false,

                message: "Coupon usage limit exceeded"

            });

        }

        const today = new Date();

        if (today < coupon.startDate || today > coupon.endDate) {

            return res.status(400).json({
                success: false,
                message: "Coupon Expired"
            });

        }

        if (subtotal < coupon.minOrderValue) {

            return res.status(400).json({
                success: false,
                message: `Minimum order ₹${coupon.minOrderValue}`
            });

        }

        let discount = 0;

        if (coupon.type === "FIXED") {

            discount = coupon.value;

        } else {

            discount = subtotal * coupon.value / 100;

            if (coupon.maxDiscount > 0) {

                discount = Math.min(discount, coupon.maxDiscount);

            }

        }

        res.json({

            success: true,

            data: {

                coupon,

                discount

            }

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// @desc    Download Invoice
// @route   GET /api/orders/:id/invoice
// @access  Private

exports.getInvoice = async (req, res) => {

    try {

        const order = await Order.findOne({
            _id: req.params.id,
            userId: req.user.id,
            deletedAt: null
        });

        if (!order) {

            return res.status(404).json({
                success: false,
                message: "Order not found"
            });

        }

        const items = await OrderItem.find({
            orderId: order._id
        });

        const doc = new PDFDocument({
            margin: 50
        });

        res.setHeader(
            "Content-Type",
            "application/pdf"
        );

        res.setHeader(
            "Content-Disposition",
            `attachment; filename=Invoice-${order.orderNumber}.pdf`
        );

        doc.pipe(res);

        //------------------------------------
        // HEADER
        //------------------------------------

        doc
            .fontSize(22)
            .text("DARSHAN MASALE", {
                align: "center"
            });

        doc
            .fontSize(12)
            .text("Premium Spices & Masala", {
                align: "center"
            });

        doc.moveDown();

        //------------------------------------

        doc.fontSize(14);

        doc.text(`Invoice : ${order.orderNumber}`);

        doc.text(`Date : ${new Date(order.createdAt).toLocaleDateString()}`);

        doc.moveDown();

        //------------------------------------
        // CUSTOMER
        //------------------------------------

        doc.fontSize(16).text("Customer");

        doc.fontSize(12);

        doc.text(order.shippingAddress.fullName || "");

        doc.text(order.shippingAddress.phone || "");

        doc.text(order.shippingAddress.addressLine1 || "");

        doc.text(order.shippingAddress.city || "");

        doc.text(order.shippingAddress.state || "");

        doc.text(order.shippingAddress.pincode || "");

        doc.moveDown();

        //------------------------------------
        // ITEMS
        //------------------------------------

        doc.fontSize(16).text("Items");

        doc.moveDown(0.5);

        items.forEach(item => {

            doc.text(
                `${item.productName} (${item.variantName})`
            );

            doc.text(
                `${item.quantity} × ₹${item.sellingPrice} = ₹${item.totalPrice}`
            );

            doc.moveDown();

        });

        //------------------------------------
        // TOTAL
        //------------------------------------

        doc.moveDown();

        doc.text(`Subtotal : ₹${order.subtotal}`);

        doc.text(`Shipping : ₹${order.shippingCost}`);

        doc.text(`Tax : ₹${order.tax}`);

        doc.moveDown();

        doc.fontSize(16);

        doc.text(`Grand Total : ₹${order.total}`);

        doc.moveDown();

        doc.fontSize(12);

        doc.text(`Payment : ${order.paymentMethod}`);

        doc.text(`Payment Status : ${order.paymentStatus}`);

        doc.moveDown(2);

        doc.text(
            "Thank You For Shopping With Darshan Masale ❤️",
            {
                align: "center"
            }
        );

        doc.end();

    }

    catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

exports.getCoupons = async (req, res) => {

    try {

        const coupons = await Coupon.find({

            status: "ACTIVE",

            endDate: { $gte: new Date() }

        });

        const data = [];

        for (const coupon of coupons) {

            const used = await Order.countDocuments({

                userId: req.user.id,

                couponCode: coupon.code

            });

            data.push({

                _id: coupon._id,

                code: coupon.code,

                type: coupon.type,

                value: coupon.value,

                minOrderValue: coupon.minOrderValue,

                maxDiscount: coupon.maxDiscount,

                endDate: coupon.endDate,

                remainingUses: coupon.perUserLimit - used

            });

        }

        res.json({

            success: true,

            data

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};