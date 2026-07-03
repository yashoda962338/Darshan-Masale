const { v4: uuid } = require("uuid");

const cashfree = require("../utils/cashfree");

const Order = require("../models/Order");
const Payment = require("../models/Payment");
const User = require("../models/User");

const {
    sendOrderSuccessEmail
} = require("../services/emailService");


exports.createCashfreeOrder = async (req, res) => {

    try {

        const { orderId } = req.body;

        const order = await Order.findById(orderId);

        if (!order) {

            return res.status(404).json({
                success: false,
                message: "Order not found"
            });

        }

        const user = await User.findById(order.userId);

        if (order.paymentMethod === "COD") {

            return res.status(400).json({
                success: false,
                message: "COD order"
            });

        }

        //--------------------------------------------------

        const cashfreeOrderId = "DM" + Date.now();

        //--------------------------------------------------

        const request = {

            order_id: cashfreeOrderId,

            order_amount: order.total,

            order_currency: "INR",

            customer_details: {

                customer_id: order.userId.toString(),

                customer_name: order.shippingAddress.fullName,

                customer_phone: order.shippingAddress.phone,

                customer_email: user.email

            },

            order_meta: {

                return_url:
                    `${process.env.FRONTEND_URL}/payment-success?order_id=${order._id}`

            }

        };

        //--------------------------------------------------

        const response = await cashfree.PGCreateOrder("2022-09-01", request);
        //--------------------------------------------------

        order.cashfreeOrderId = response.data.order_id;

        order.paymentSessionId = response.data.payment_session_id;

        order.paymentGateway = "CASHFREE";

        order.paymentStatus = "PENDING";

        await order.save();

        //--------------------------------------------------

        await Payment.create({

            orderId: order._id,

            userId: order.userId,

            paymentGateway: "CASHFREE",

            cashfreeOrderId: response.data.order_id,

            paymentSessionId: response.data.payment_session_id,

            amount: order.total,

            paymentStatus: "PENDING"

        });

        //--------------------------------------------------

        res.json({

            success: true,

            paymentSessionId: response.data.payment_session_id,

            cashfreeOrderId: response.data.order_id

        });

    }

    catch (err) {

        console.log(err.response?.data || err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

//=========================================
// VERIFY PAYMENT
//=========================================
exports.verifyPayment = async (req, res) => {

    try {

        const { orderId } = req.params;

        //------------------------------------------
        // FIND ORDER
        //------------------------------------------

        const order = await Order.findById(orderId);

        if (!order) {

            return res.status(404).json({

                success: false,

                message: "Order not found"

            });

        }
        const user = await User.findById(order.userId);

        //------------------------------------------
        // FETCH CASHFREE ORDER
        //------------------------------------------

        const response = await cashfree.PGFetchOrder("2022-09-01", order.cashfreeOrderId);

        console.log("============== CASHFREE RESPONSE ==============");

        console.log(response.data);

        console.log("===============================================");

        //------------------------------------------
        // PAYMENT SUCCESS
        //------------------------------------------

        if (response.data.order_status === "PAID") {

            //--------------------------------------
            // UPDATE ORDER
            //--------------------------------------

            order.paymentStatus = "SUCCESS";

            order.status = "CONFIRMED";

            order.paymentTime = new Date();

            order.transactionId = response.data.cf_order_id;

            order.paymentDetails = response.data;

            await order.save();

            //--------------------------------------
            // UPDATE PAYMENT
            //--------------------------------------

            const payment = await Payment.findOne({

                orderId: order._id

            });

            if (payment) {

                payment.paymentStatus = "SUCCESS";

                payment.cfPaymentId = response.data.cf_order_id;

                payment.gatewayResponse = response.data;

                await payment.save();

            }

        }

        //------------------------------------------
        // PAYMENT FAILED
        //------------------------------------------

        else {

            order.paymentStatus = "FAILED";

            order.status = "FAILED";

            order.paymentDetails = response.data;

            await order.save();

            const payment = await Payment.findOne({

                orderId: order._id

            });

            if (payment) {

                payment.paymentStatus = "FAILED";

                payment.gatewayResponse = response.data;

                await payment.save();

            }

        }
        //------------------------------------------
        // RETURN UPDATED ORDER
        //------------------------------------------

        const updatedOrder = await Order.findById(order._id);

        res.json({

            success: true,

            payment: response.data,

            order: updatedOrder

        });

    }

    catch (err) {

        console.log(err.response?.data || err);

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

//=========================================
// RETRY PAYMENT
//=========================================

exports.retryPayment = async (req, res) => {

    try {

        const { orderId } = req.params;

        //----------------------------------------
        // FIND ORDER
        //----------------------------------------

        const order = await Order.findById(orderId);

        if (!order) {

            return res.status(404).json({

                success: false,

                message: "Order not found"

            });

        }
        const user = await User.findById(order.userId);

        //----------------------------------------
        // PAYMENT ALREADY SUCCESS
        //----------------------------------------

        if (order.paymentStatus === "SUCCESS") {

            return res.status(400).json({

                success: false,

                message: "Payment already completed"

            });

        }

        //----------------------------------------
        // CREATE NEW CASHFREE ORDER
        //----------------------------------------

        const cashfreeOrderId = "DM" + Date.now();

        const request = {

            order_id: cashfreeOrderId,

            order_amount: order.total,

            order_currency: "INR",

            customer_details: {

                customer_id: order.userId.toString(),

                customer_name: order.shippingAddress.fullName,

                customer_phone: order.shippingAddress.phone,

                customer_email: user.email

            },

            order_meta: {

                return_url:
                    `${process.env.FRONTEND_URL}/payment-success?order_id=${order._id}`

            }

        };

        //----------------------------------------
        // CASHFREE API
        //----------------------------------------

        console.log("========== CASHFREE OBJECT ==========");
        console.log(cashfree);
        console.log("PGCreateOrder =", cashfree.PGCreateOrder);
        console.log("Keys =", Object.keys(cashfree));
        console.log("====================================");

        const response = await cashfree.PGCreateOrder("2022-09-01", request);

        console.log("====================================");
        console.log("FULL CASHFREE RESPONSE");
        console.log(JSON.stringify(response.data, null, 2));
        console.log("====================================");

        //----------------------------------------
        // UPDATE ORDER
        //----------------------------------------

        order.cashfreeOrderId = response.data.order_id;

        order.paymentSessionId = response.data.payment_session_id;

        order.paymentStatus = "PENDING";

        order.paymentGateway = "CASHFREE";

        await order.save();

        //----------------------------------------
        // UPDATE PAYMENT TABLE
        //----------------------------------------

        let payment = await Payment.findOne({

            orderId: order._id

        });

        if (payment) {

            payment.cashfreeOrderId = response.data.order_id;

            payment.paymentSessionId = response.data.payment_session_id;

            payment.paymentStatus = "PENDING";

            payment.gatewayResponse = {};

            payment.cfPaymentId = null;

            await payment.save();

        }
        else {

            await Payment.create({

                orderId: order._id,

                userId: order.userId,

                paymentGateway: "CASHFREE",

                cashfreeOrderId: response.data.order_id,

                paymentSessionId: response.data.payment_session_id,

                amount: order.total,

                paymentStatus: "PENDING"

            });

        }

        //----------------------------------------

        return res.json({

            success: true,

            paymentSessionId: response.data.payment_session_id,

            cashfreeOrderId: response.data.order_id

        });

    }

    catch (err) {

        console.log(err.response?.data || err);

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

//=========================================
// CASHFREE WEBHOOK
//=========================================

exports.cashfreeWebhook = async (req, res) => {

    try {

        console.log("============= WEBHOOK RECEIVED =============");
        console.log(req.body);

        const data = req.body.data;

        if (!data) {

            return res.sendStatus(200);

        }

        //-----------------------------------------
        // Find Order
        //-----------------------------------------

        const order = await Order.findOne({

            cashfreeOrderId: data.order.order_id

        });

        if (!order) {

            console.log("Order Not Found");

            return res.sendStatus(200);

        }

        //-----------------------------------------
        // Find Payment
        //-----------------------------------------

        const payment = await Payment.findOne({

            orderId: order._id

        });

        //-----------------------------------------
        // SUCCESS
        //-----------------------------------------

        if (data.payment.payment_status === "SUCCESS") {

            order.paymentStatus = "SUCCESS";

            order.status = "CONFIRMED";

            order.transactionId = data.payment.cf_payment_id;

            order.paymentTime = new Date();

            order.paymentDetails = data;

            await order.save();

            if (payment) {

                payment.paymentStatus = "SUCCESS";

                payment.cfPaymentId = data.payment.cf_payment_id;

                payment.gatewayResponse = data;

                payment.paymentMethod = data.payment.payment_method;

                await payment.save();

            }
            //---------------------------------------------------------
            // SEND ORDER SUCCESS EMAIL
            //---------------------------------------------------------

            const user = await User.findById(order.userId);

            if (user && user.email) {

                await sendOrderSuccessEmail(

                    user.email,

                    order

                );

                console.log("📧 Order confirmation email sent.");

            }

            console.log("Payment Success");

        }

        //-----------------------------------------
        // FAILED
        //-----------------------------------------

        else {

            order.paymentStatus = "FAILED";

            order.status = "FAILED";

            order.paymentDetails = data;

            await order.save();

            if (payment) {

                payment.paymentStatus = "FAILED";

                payment.gatewayResponse = data;

                await payment.save();

            }

            console.log("Payment Failed");

        }

        return res.sendStatus(200);

    }

    catch (err) {

        console.log(err);

        return res.sendStatus(500);

    }

};