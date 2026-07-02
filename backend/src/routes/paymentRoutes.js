const express = require("express");

const router = express.Router();

const {

    authenticate

} = require("../middlewares/auth");

const paymentController = require("../controllers/paymentController");

router.post(
"/create-order",
authenticate,
paymentController.createCashfreeOrder
);

router.get(
"/verify/:orderId",
authenticate,
paymentController.verifyPayment
);

router.post(
"/retry/:orderId",
authenticate,
paymentController.retryPayment
);

router.post(
"/webhook",
paymentController.cashfreeWebhook
);

module.exports = router;