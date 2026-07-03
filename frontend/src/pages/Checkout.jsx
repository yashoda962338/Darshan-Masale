import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import orderService from "../services/orderService";
import AddressSection from "../components/checkout/AddressSection";
import { useCart } from "../context/CartContext";
import paymentService from "../services/paymentService";
import { initializeCashfree } from "../utils/cashfree";

const Checkout = () => {

    const location = useLocation();
    const navigate = useNavigate();

    const {
        cart,
        getTotalItems,
        getTotalPrice
    } = useCart();

    //---------------------------------------
    // STATES
    //---------------------------------------

    const [paymentMethod, setPaymentMethod] = useState("COD");
    const [placingOrder, setPlacingOrder] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);

    // Coupon
    const [couponCode, setCouponCode] = useState("");
    const [coupons, setCoupons] = useState([]);
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [appliedCoupon, setAppliedCoupon] = useState(null);

    //---------------------------------------
    // BUY NOW
    //---------------------------------------

    const isBuyNow = location.state?.buyNow || false;

    const buyNowProduct = location.state?.product;
    const buyNowVariant = location.state?.variant;
    const buyNowQty = location.state?.quantity || 1;

    //---------------------------------------
    // ITEMS
    //---------------------------------------

    const items = useMemo(() => {

        if (isBuyNow) {

            return [

                {
                    product: buyNowProduct,
                    variant: buyNowVariant,
                    quantity: buyNowQty
                }

            ];

        }

        return cart?.items || [];

    }, [

        isBuyNow,
        buyNowProduct,
        buyNowVariant,
        buyNowQty,
        cart

    ]);

    //---------------------------------------
    // PRICE
    //---------------------------------------

    const subtotal = useMemo(() => {

        if (isBuyNow) {

            return (
                (buyNowVariant?.sellingPrice || 0) *
                buyNowQty
            );

        }

        return getTotalPrice();

    }, [

        isBuyNow,
        buyNowVariant,
        buyNowQty,
        getTotalPrice

    ]);

    const shipping = subtotal >= 500 ? 0 : 49;

    const total = subtotal + shipping - couponDiscount;


    //---------------------------------------
    // LOAD COUPONS
    //---------------------------------------

    useEffect(() => {

        loadCoupons();

    }, []);

    const loadCoupons = async () => {

        try {

            const res = await orderService.getCoupons();

            setCoupons(res.data);

        }

        catch (err) {

            console.log(err);

        }

    };
    //---------------------------------------
    // APPLY COUPON
    //---------------------------------------
    const applyCoupon = async (code = couponCode) => {

        if (!code || typeof code !== "string") {

            toast.error("Enter Coupon Code");

            return;

        }

        try {

            const res = await orderService.applyCoupon({

                code: code.trim().toUpperCase(),

                subtotal

            });

            setCouponCode(code.trim().toUpperCase());

            setCouponDiscount(res.data.discount);

            setAppliedCoupon(res.data.coupon);

            toast.success("Coupon Applied Successfully");

        }

        catch (err) {

            console.log(err);

            toast.error(

                err?.response?.data?.message ||

                "Invalid Coupon"

            );

        }

    };


    //---------------------------------------
    // PLACE ORDER
    //---------------------------------------

    const handlePlaceOrder = async () => {

        try {

            if (!selectedAddress?._id) {

                toast.error("Please Select Delivery Address");

                return;

            }

            setPlacingOrder(true);

            const payload = {

                addressId: selectedAddress._id,

                paymentMethod,

                couponCode: appliedCoupon?.code || ""

            };


            //---------------------------------------
            // BUY NOW
            //---------------------------------------

            if (isBuyNow) {

                payload.buyNow = true;

                payload.productId = buyNowProduct._id;

                payload.variantId = buyNowVariant._id;

                payload.quantity = buyNowQty;

            }

            const response = await orderService.placeOrder(payload);

            console.log("ORDER RESPONSE =", response);

            if (paymentMethod === "CASHFREE") {

                const payment = await paymentService.createOrder(

                    response.data._id

                );

                const cashfree = await initializeCashfree();

                await cashfree.checkout({

                    paymentSessionId: payment.paymentSessionId,

                    redirectTarget: "_self"

                });

                return;

            }

            toast.success(response.message);

            navigate("/customer/orders");
        }

        catch (error) {

            console.log(error);

            console.log(error.response?.data);

            toast.error("Payment Error");

        }

        finally {

            setPlacingOrder(false);

        }

    };

    return (
        <>
            <Helmet>
                <title>Checkout | Darshan Masale</title>
            </Helmet>

            <section className="max-w-7xl mx-auto px-4 py-10">

                <h1 className="text-4xl font-bold text-primary-maroon mb-8">
                    Checkout
                </h1>

                <div className="grid lg:grid-cols-3 gap-8">

                    {/* LEFT */}

                    <div className="lg:col-span-2 space-y-6">

                        {/* ADDRESS */}

                        <AddressSection
                            selectedAddress={selectedAddress}
                            setSelectedAddress={setSelectedAddress}
                        />

                        {/* ORDER ITEMS */}

                        <div className="bg-white rounded-xl shadow p-6">

                            <h2 className="text-xl font-semibold mb-5">
                                Order Items
                            </h2>

                            {

                                items.length === 0 ?

                                    (

                                        <div className="text-center py-10">

                                            <p className="text-gray-500">

                                                No Items Found

                                            </p>

                                        </div>

                                    )

                                    :

                                    items.map((item, index) => {

                                        const product =

                                            isBuyNow

                                                ?

                                                item.product

                                                :

                                                item.variantId?.productId;

                                        const variant =

                                            isBuyNow

                                                ?

                                                item.variant

                                                :

                                                item.variantId;

                                        const image =

                                            product?.images?.[0]?.url ||

                                            "/placeholder-image.jpg";

                                        const price =

                                            isBuyNow

                                                ?

                                                variant?.sellingPrice

                                                :

                                                item.price;

                                        return (

                                            <div

                                                key={index}

                                                className="flex gap-5 border-b pb-5 mb-5 last:border-none"

                                            >

                                                <img

                                                    src={image}

                                                    alt={product?.name}

                                                    className="w-24 h-24 rounded-lg object-cover"

                                                />

                                                <div className="flex-1">

                                                    <h3 className="font-semibold text-lg">

                                                        {product?.name}

                                                    </h3>

                                                    <p className="text-gray-500 mt-1">

                                                        {variant?.weight} {variant?.unit}

                                                    </p>

                                                    <p className="mt-2">

                                                        Quantity :

                                                        <strong className="ml-2">

                                                            {item.quantity}

                                                        </strong>

                                                    </p>

                                                </div>

                                                <div className="font-bold text-lg text-primary-maroon">

                                                    ₹{price * item.quantity}

                                                </div>

                                            </div>

                                        );

                                    })

                            }

                        </div>

                        {/* PAYMENT */}

                        <div className="bg-white rounded-xl shadow p-6">

                            <h2 className="text-xl font-semibold mb-5">

                                Payment Method

                            </h2>

                            <label className="flex items-center gap-3 mb-4 cursor-pointer">

                                <input

                                    type="radio"

                                    checked={paymentMethod === "COD"}

                                    onChange={() => setPaymentMethod("COD")}

                                />

                                Cash On Delivery

                            </label>
                            <label className="flex items-center gap-3 mb-4 cursor-pointer">

                                <input

                                    type="radio"

                                    checked={paymentMethod === "CASHFREE"}

                                    onChange={() => setPaymentMethod("CASHFREE")}

                                />

                                Cashfree Online Payment

                            </label>

                            <label className="flex items-center gap-3 mb-4 cursor-pointer">

                                <input

                                    type="radio"

                                    checked={paymentMethod === "UPI"}

                                    onChange={() => setPaymentMethod("UPI")}

                                />

                                UPI Payment

                            </label>

                            <label className="flex items-center gap-3 cursor-pointer">

                                <input

                                    type="radio"

                                    checked={paymentMethod === "CARD"}

                                    onChange={() => setPaymentMethod("CARD")}

                                />

                                Card / Net Banking

                            </label>

                        </div>

                    </div>

                    {/* RIGHT */}
                    {/* RIGHT */}

                    <div>

                        <div className="bg-white rounded-xl shadow p-6 sticky top-24">

                            <h2 className="text-2xl font-bold text-primary-maroon mb-6">

                                Order Summary

                            </h2>

                            <div className="space-y-4">

                                {/* Total Items */}

                                <div className="flex justify-between">

                                    <span>Total Items</span>

                                    <span className="font-semibold">

                                        {

                                            isBuyNow

                                                ?

                                                buyNowQty

                                                :

                                                getTotalItems()

                                        }

                                    </span>

                                </div>

                                {/* Subtotal */}

                                <div className="flex justify-between">

                                    <span>Subtotal</span>

                                    <span className="font-semibold">

                                        ₹{subtotal}

                                    </span>

                                </div>

                                {/* AVAILABLE COUPONS */}

                                <div className="border rounded-xl p-4">

                                    <h3 className="font-bold mb-4">

                                        🎁 Available Offers

                                    </h3>

                                    {

                                        coupons.length === 0 ?

                                            (

                                                <p className="text-gray-500">

                                                    No Coupons Available

                                                </p>

                                            )

                                            :

                                            coupons.map(coupon => (

                                                <div

                                                    key={coupon._id}

                                                    className="border rounded-lg p-3 mb-3"

                                                >

                                                    <div className="flex justify-between items-center">

                                                        <div>

                                                            <h4 className="font-bold">

                                                                {coupon.code}

                                                            </h4>

                                                            <p className="text-sm text-gray-500">

                                                                {

                                                                    coupon.type === "PERCENTAGE"

                                                                        ?

                                                                        `${coupon.value}% OFF`

                                                                        :

                                                                        `₹${coupon.value} OFF`

                                                                }

                                                            </p>

                                                            <p className="text-xs text-gray-400">

                                                                Minimum Order ₹{coupon.minOrderValue}

                                                            </p>
                                                            <p className="text-xs text-blue-600">

                                                                Remaining Uses : {coupon.remainingUses}

                                                            </p>

                                                        </div>

                                                        <button

                                                            type="button"

                                                            disabled={coupon.remainingUses <= 0}

                                                            onClick={() => {

                                                                setCouponCode(coupon.code);

                                                                applyCoupon(coupon.code);

                                                            }}

                                                            className={`px-4 py-2 rounded-lg text-white ${coupon.remainingUses <= 0
                                                                ? "bg-gray-400 cursor-not-allowed"
                                                                : "bg-green-600 hover:bg-green-700"
                                                                }`}
                                                        >

                                                            {

                                                                coupon.remainingUses <= 0

                                                                    ? "Used"

                                                                    : "Apply"

                                                            }

                                                        </button>
                                                    </div>

                                                </div>

                                            ))

                                    }

                                </div>

                                {/* Coupon */}

                                <div className="border rounded-xl p-4">

                                    <h3 className="font-semibold mb-3">

                                        Apply Coupon

                                    </h3>

                                    <div className="flex gap-2">

                                        <input

                                            type="text"

                                            value={couponCode}

                                            onChange={(e) =>

                                                setCouponCode(

                                                    e.target.value.toUpperCase()

                                                )

                                            }

                                            placeholder="Enter Coupon Code"

                                            className="flex-1 border rounded-lg px-3 py-2"

                                        />

                                        <button

                                            type="button"

                                            onClick={() => applyCoupon()}

                                        >

                                            Apply

                                        </button>

                                    </div>

                                    {

                                        appliedCoupon && (

                                            <div className="mt-3 text-green-600 font-semibold">

                                                ✅ Coupon Applied :

                                                {" "}

                                                {appliedCoupon.code}

                                            </div>

                                        )

                                    }

                                </div>

                                {/* Shipping */}

                                <div className="flex justify-between">

                                    <span>Shipping</span>

                                    <span className="font-semibold">

                                        {

                                            shipping === 0

                                                ?

                                                "FREE"

                                                :

                                                `₹${shipping}`

                                        }

                                    </span>

                                </div>

                                {

                                    shipping === 0 && (

                                        <div className="text-green-600 text-sm">

                                            🎉 Congratulations!

                                            You got FREE Shipping.

                                        </div>

                                    )

                                }

                                {/* Coupon Discount */}

                                {

                                    couponDiscount > 0 && (

                                        <div className="flex justify-between text-green-600 font-semibold">

                                            <span>

                                                Coupon Discount

                                            </span>

                                            <span>

                                                - ₹{couponDiscount}

                                            </span>

                                        </div>

                                    )

                                }

                                <hr />

                                {/* Grand Total */}

                                <div className="flex justify-between text-2xl font-bold text-primary-maroon">

                                    <span>

                                        Total

                                    </span>

                                    <span>

                                        ₹{total}

                                    </span>

                                </div>

                            </div>
                            <button

                                onClick={handlePlaceOrder}

                                disabled={placingOrder}

                                className="mt-8 w-full bg-primary-maroon text-white py-4 rounded-xl hover:bg-primary-maroon/90 disabled:opacity-50"

                            >

                                {

                                    placingOrder

                                        ?

                                        "Placing Order..."

                                        :

                                        "Place Order"

                                }

                            </button>

                            <Link

                                to="/cart"

                                className="block text-center mt-4 text-primary-maroon hover:underline"

                            >

                                ← Back To Cart

                            </Link>

                        </div>

                    </div>

                </div>

            </section>

        </>

    );

};

export default Checkout;