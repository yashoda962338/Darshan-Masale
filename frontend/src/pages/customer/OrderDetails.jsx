import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import orderService from "../../services/orderService";
import { Download } from "lucide-react";

import {
    ArrowLeft,
    Package,
    MapPin,
    CreditCard,
    Calendar,
    XCircle,
    CheckCircle,
    Circle,
    Truck,
    ShoppingBag
} from "lucide-react";

const OrderDetails = () => {

    const { id } = useParams();

    const [loading, setLoading] = useState(true);

    const [order, setOrder] = useState(null);

    const [showReviewModal, setShowReviewModal] = useState(false);

    const [selectedItem, setSelectedItem] = useState(null);

    const [rating, setRating] = useState(5);

    const [comment, setComment] = useState("");

    useEffect(() => {

        loadOrder();

    }, [id]);

    const loadOrder = async () => {

        try {

            const res = await orderService.getOrder(id);

            setOrder(res.data);

        }

        catch (err) {

            console.log(err);

            toast.error("Unable to load order");

        }

        finally {

            setLoading(false);

        }

    };

    const cancelOrder = async () => {

        if (!window.confirm("Cancel this order?")) return;

        try {

            await orderService.cancelOrder(id);

            toast.success("Order cancelled");

            loadOrder();

        }

        catch (err) {

            toast.error(

                err?.response?.data?.message ||

                "Unable to cancel order"

            );

        }

    };

    if (loading) {

        return (

            <div className="text-center py-20">

                Loading...

            </div>

        );

    }

    if (!order) {

        return (

            <div className="text-center py-20">

                Order Not Found

            </div>

        );

    }

    const submitReview = async () => {

        try {

            await orderService.submitReview({

                orderId: order._id,

                productId: selectedItem.productId._id,

                rating,

                comment

            });

            toast.success("Review Submitted");

            setShowReviewModal(false);

            loadOrder();

        }

        catch (err) {

            toast.error(

                err?.response?.data?.message ||

                "Unable to submit review"

            );

        }

    };




    const canCancel =

        order.status === "PENDING" ||

        order.status === "CONFIRMED" ||

        order.status === "PROCESSING";



    const trackingSteps = [

        "PENDING",

        "CONFIRMED",

        "PROCESSING",

        "PACKED",

        "SHIPPED",

        "OUT_FOR_DELIVERY",

        "DELIVERED"

    ];


    return (

        <div className="max-w-6xl mx-auto">

            <Link

                to="/customer/orders"

                className="inline-flex items-center gap-2 text-primary-maroon hover:underline"

            >

                <ArrowLeft size={18} />

                Back to Orders

            </Link>

            <div className="bg-white rounded-2xl shadow mt-6 p-6">

                <div className="flex justify-between flex-wrap gap-5">
                    <div>

                        <h1 className="text-3xl font-bold">

                            Order #{order.orderNumber}

                        </h1>

                        {/* Invoice */}

                        {order.status === "DELIVERED" ? (

                            <button

                                onClick={() => orderService.downloadInvoice(order._id)}

                                className="mt-4 bg-primary-maroon text-white px-5 py-2 rounded-lg hover:bg-primary-maroon/90"

                            >

                                🧾 Download Invoice

                            </button>

                        ) : (

                            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-300 rounded-lg text-yellow-700">

                                🧾 Invoice will be available after your order is delivered.

                            </div>

                        )}

                        <div className="flex items-center gap-2 text-gray-500 mt-2">

                            <Calendar size={16} />

                            {new Date(order.createdAt).toLocaleString()}

                        </div>

                    </div>

                    <div>

                        <span className="px-4 py-2 rounded-full bg-yellow-100 text-yellow-700 font-semibold">

                            {order.status}

                        </span>

                    </div>

                </div>

            </div>
            {/* Order Tracking */}

            <div className="bg-white rounded-2xl shadow p-6 mb-6">

                <h2 className="text-2xl font-bold mb-8">

                    Order Tracking

                </h2>

                <div className="relative">

                    {trackingSteps.map((step, index) => {

                        const active =
                            trackingSteps.indexOf(order.status) >= index;

                        return (

                            <div
                                key={step}
                                className="relative flex items-start gap-5 pb-8 last:pb-0"
                            >

                                {/* Vertical Line */}

                                {index !== trackingSteps.length - 1 && (

                                    <div
                                        className={`absolute left-[10px] top-6 w-1 h-full rounded-full ${active
                                            ? "bg-green-500"
                                            : "bg-gray-200"
                                            }`}
                                    />

                                )}

                                {/* Icon */}

                                <div
                                    className={`z-10 w-6 h-6 rounded-full flex items-center justify-center ${active
                                        ? "bg-green-600"
                                        : "bg-gray-300"
                                        }`}
                                >

                                    <CheckCircle
                                        size={15}
                                        className="text-white"
                                    />

                                </div>

                                {/* Text */}

                                <div>

                                    <h4
                                        className={`font-semibold ${active
                                            ? "text-green-700"
                                            : "text-gray-400"
                                            }`}
                                    >
                                        {step.replaceAll("_", " ")}
                                    </h4>

                                    {active && (

                                        <p className="text-sm text-gray-500 mt-1">

                                            Completed

                                        </p>

                                    )}

                                </div>

                            </div>

                        );

                    })}

                </div>

            </div>
            {/* PRODUCTS */}

            <div className="bg-white rounded-2xl shadow mt-6 p-6">

                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">

                    <Package />

                    Ordered Products

                </h2>

                {order.items.map(item => (

                    <div
                        key={item._id}
                        className="flex items-center gap-6 border-b last:border-none py-6"
                    >

                        <div className="w-32 h-32 flex-shrink-0 rounded-xl overflow-hidden border bg-white">

                            <img
                                src={item.image}
                                alt={item.productName}
                                className="w-full h-full object-contain p-2"
                            />

                        </div>

                        <div className="flex-1 flex justify-between items-center">

                            <div>

                                <h3 className="text-2xl font-bold text-primary-maroon">
                                    {item.productName}
                                </h3>

                                <p className="text-gray-500 mt-2">
                                    {item.variantName}
                                </p>

                                <p className="mt-2">
                                    Qty : <strong>{item.quantity}</strong>
                                </p>

                            </div>
                            {
                                order.status === "DELIVERED" &&
                                !item.reviewGiven && (

                                    <button

                                        onClick={() => {

                                            console.log("CLICKED");

                                            setSelectedItem(item);

                                            setShowReviewModal(true);

                                        }}

                                        className="mt-4 bg-primary-maroon text-white px-5 py-2 rounded-lg hover:bg-primary-maroon/90"

                                    >

                                        ⭐ Write Review

                                    </button>

                                )
                            }

                            <div className="text-right">

                                <p className="text-3xl font-bold text-primary-maroon">
                                    ₹{item.totalPrice}
                                </p>

                            </div>
                        </div>

                    </div>

                ))}

            </div>

            {/* ADDRESS */}

            <div className="bg-white rounded-2xl shadow mt-6 p-6">

                <h2 className="text-2xl font-bold flex items-center gap-2 mb-5">

                    <MapPin />

                    Delivery Address

                </h2>

                <p className="font-semibold">

                    {order.shippingAddress.fullName}

                </p>

                <p>

                    {order.shippingAddress.phone}

                </p>

                <p className="mt-2">

                    {order.shippingAddress.addressLine1}

                </p>

                <p>

                    {order.shippingAddress.addressLine2}

                </p>

                <p>

                    {order.shippingAddress.city},

                    {" "}

                    {order.shippingAddress.state}

                </p>

                <p>

                    {order.shippingAddress.country}

                </p>

                <p>

                    {order.shippingAddress.pincode}

                </p>

            </div>
            {/* PAYMENT */}

            <div className="bg-white rounded-2xl shadow mt-6 p-6">

                <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">

                    <CreditCard />

                    Payment Summary

                </h2>

                <div className="space-y-4">

                    <div className="flex justify-between">

                        <span>Subtotal</span>

                        <span>₹{order.subtotal}</span>

                    </div>

                    <div className="flex justify-between">

                        <span>Shipping</span>

                        <span>

                            {

                                order.shippingCost === 0

                                    ?

                                    "FREE"

                                    :

                                    `₹${order.shippingCost}`

                            }

                        </span>

                    </div>

                    <div className="flex justify-between">

                        <span>Discount</span>

                        <span>

                            ₹{order.discount}

                        </span>

                    </div>

                    <div className="flex justify-between">

                        <span>Coupon Discount</span>

                        <span>

                            ₹{order.couponDiscount}

                        </span>

                    </div>

                    <hr />

                    <div className="flex justify-between text-2xl font-bold text-primary-maroon">

                        <span>

                            Grand Total

                        </span>

                        <span>

                            ₹{order.total}

                        </span>

                    </div>

                </div>

            </div>

            {/* PAYMENT INFO */}

            <div className="bg-white rounded-2xl shadow mt-6 p-6">

                <h2 className="text-2xl font-bold mb-6">

                    Payment Information

                </h2>

                <div className="grid md:grid-cols-2 gap-6">

                    <div>

                        <p className="text-gray-500">

                            Payment Method

                        </p>

                        <h3 className="font-bold text-lg">

                            {order.paymentMethod}

                        </h3>

                    </div>

                    <div>

                        <p className="text-gray-500">

                            Payment Status

                        </p>

                        <h3

                            className={`font-bold text-lg ${order.paymentStatus === "COMPLETED"

                                ?

                                "text-green-600"

                                :

                                "text-orange-500"

                                }`}

                        >

                            {order.paymentStatus}

                        </h3>

                    </div>

                </div>

            </div>

            {/* DELIVERY */}

            <div className="bg-white rounded-2xl shadow mt-6 p-6">

                <h2 className="text-2xl font-bold flex items-center gap-2 mb-5">

                    <Truck />

                    Delivery Information

                </h2>

                <div className="grid md:grid-cols-2 gap-6">

                    <div>

                        <p className="text-gray-500">

                            Order Status

                        </p>

                        <h3 className="font-bold text-lg">

                            {order.status}

                        </h3>

                    </div>

                    <div>

                        <p className="text-gray-500">

                            Tracking Number

                        </p>

                        <h3 className="font-bold">

                            {

                                order.trackingNumber ||

                                "Not Assigned"

                            }

                        </h3>

                    </div>

                </div>

            </div>

            {/* CANCEL BUTTON */}

            {
                canCancel && (

                    <div className="mt-8 flex justify-end">

                        <button
                            onClick={cancelOrder}
                            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl"
                        >

                            <XCircle size={18} />

                            Cancel Order

                        </button>

                    </div>

                )}

            {
                showReviewModal && (

                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

                        <div className="bg-white rounded-2xl p-6 w-full max-w-md">

                            <h2 className="text-2xl font-bold mb-5">
                                Write Review
                            </h2>

                            <label className="block mb-2">
                                Rating
                            </label>

                            <select
                                value={rating}
                                onChange={(e) => setRating(e.target.value)}
                                className="w-full border rounded-lg p-3"
                            >

                                <option value="5">⭐⭐⭐⭐⭐</option>
                                <option value="4">⭐⭐⭐⭐</option>
                                <option value="3">⭐⭐⭐</option>
                                <option value="2">⭐⭐</option>
                                <option value="1">⭐</option>

                            </select>

                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                rows={5}
                                placeholder="Write your experience..."
                                className="w-full border rounded-lg p-3 mt-4"
                            />

                            <div className="flex justify-end gap-3 mt-6">

                                <button
                                    onClick={() => setShowReviewModal(false)}
                                    className="px-5 py-2 border rounded-lg"
                                >

                                    Cancel

                                </button>

                                <button
                                    onClick={submitReview}
                                    className="bg-primary-maroon text-white px-5 py-2 rounded-lg"
                                >

                                    Submit Review

                                </button>

                            </div>

                        </div>

                    </div>

                )}

        </div>

    );

};

export default OrderDetails;