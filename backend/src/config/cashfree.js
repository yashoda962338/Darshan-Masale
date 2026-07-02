const { Cashfree, CFEnvironment } = require("cashfree-pg");

Cashfree.XClientId = process.env.CASHFREE_CLIENT_ID;

Cashfree.XClientSecret = process.env.CASHFREE_CLIENT_SECRET;

Cashfree.XEnvironment =
    process.env.CASHFREE_ENV === "PRODUCTION"
        ? CFEnvironment.PRODUCTION
        : CFEnvironment.SANDBOX;

module.exports = Cashfree;