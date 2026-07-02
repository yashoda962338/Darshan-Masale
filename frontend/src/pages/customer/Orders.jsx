// frontend/src/pages/customer/Orders.jsx - CONNECTED TO API
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Package, Clock, CheckCircle, XCircle, Truck, Eye, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import orderService from '../../services/orderService';
import paymentService from "../../services/paymentService";
import { initializeCashfree } from "../../utils/cashfree";
import toast from 'react-hot-toast';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 0, limit: 10 });
   
    useEffect(() => {

        fetchOrders();

    }, []);

    useEffect(() => {

        const interval = setInterval(fetchOrders, 3000);

        return () => clearInterval(interval);

    }, []);


    const handleRetryPayment = async (orderId) => {

        try {

            const res = await paymentService.retryPayment(orderId);

            const cashfree = await initializeCashfree();

            await cashfree.checkout({

                paymentSessionId: res.paymentSessionId,

                redirectTarget: "_self"

            });

        }

        catch (err) {

            console.log(err);

            toast.error(

                err?.response?.data?.message ||

                "Unable to retry payment"

            );

        }

    };
    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await orderService.getOrders();

            setOrders(res.data.orders || []);

            setPagination(res.data.pagination || {
                page: 1,
                total: 0,
                pages: 0,
                limit: 10
            });
        } catch (error) {
            toast.error(error.message || 'Failed to fetch orders');
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'DELIVERED': return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'PROCESSING':
            case 'PENDING':
            case 'CONFIRMED': return <Clock className="w-5 h-5 text-yellow-500" />;
            case 'SHIPPED':
            case 'OUT_FOR_DELIVERY': return <Truck className="w-5 h-5 text-blue-500" />;
            case 'CANCELLED': return <XCircle className="w-5 h-5 text-red-500" />;
            default: return <Package className="w-5 h-5 text-text-muted" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'DELIVERED': return 'bg-green-100 text-green-700';
            case 'PROCESSING':
            case 'PENDING':
            case 'CONFIRMED': return 'bg-yellow-100 text-yellow-700';
            case 'SHIPPED':
            case 'OUT_FOR_DELIVERY': return 'bg-blue-100 text-blue-700';
            case 'CANCELLED': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    if (loading && orders.length === 0) {
        return (
            <div className="flex justify-center py-16">
                <Loader2 className="w-12 h-12 text-primary-maroon animate-spin" />
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>My Orders - Darshan Masale</title>
            </Helmet>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="mb-8">
                    <h1 className="font-heading text-3xl font-bold text-primary-maroon">
                        My Orders
                    </h1>
                    <p className="text-text-muted mt-1">
                        {pagination.total} orders total
                    </p>
                </div>

                {orders.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl shadow-soft">
                        <Package className="w-16 h-16 text-text-muted/30 mx-auto" />
                        <h3 className="font-heading text-xl text-primary-maroon mt-4">
                            No Orders Yet
                        </h3>
                        <p className="text-text-muted mt-2">
                            Start shopping to see your orders here
                        </p>
                        <Link
                            to="/shop"
                            className="mt-4 inline-block px-6 py-2 bg-primary-maroon text-white rounded-full hover:bg-primary-maroon-dark transition-colors"
                        >
                            Browse Products
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (


                            <div
                                key={order._id}
                                className="bg-white rounded-2xl shadow-soft p-6 hover:shadow-elevated transition-all duration-300"
                            >
                                <div className="flex flex-wrap items-center justify-between gap-4">
                                    <div>
                                        <p className="font-heading text-lg font-semibold text-primary-maroon">
                                            Order #{order.orderNumber}
                                        </p>
                                        <p className="text-sm text-text-muted">
                                            {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-button font-medium ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                        {getStatusIcon(order.status)}
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-4 border-t border-secondary-gold/10">
                                    <div className="flex items-center gap-6">
                                        <div>
                                            <p className="text-xs text-text-muted">Items</p>
                                            <p className="font-medium text-text-dark">{order.items?.length || 0}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-text-muted">Total</p>
                                            <p className="font-heading text-lg font-bold text-primary-maroon">
                                                ₹{order.total}
                                            </p>
                                        </div>
                                    </div>

                                    {
                                        order.paymentMethod === "CASHFREE" &&
                                        order.paymentStatus !== "COMPLETED" && (

                                            <button
                                                onClick={() => handleRetryPayment(order._id)}
                                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                                            >
                                                Complete Payment
                                            </button>

                                        )
                                    }
                                    <Link
                                        to={`/customer/orders/${order._id}`}
                                        className="flex items-center gap-2 text-sm font-button font-medium text-secondary-gold hover:text-primary-maroon transition-colors"
                                    >
                                        View Details
                                        <Eye className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {pagination.pages > 1 && (
                    <div className="flex items-center justify-between mt-6">
                        <p className="text-sm text-text-muted">
                            Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                            {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} orders
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                                disabled={pagination.page === 1}
                                className="p-2 rounded-full border border-secondary-gold/20 hover:bg-primary-maroon hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <span className="px-4 py-2 text-sm font-medium">
                                Page {pagination.page} of {pagination.pages}
                            </span>
                            <button
                                onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                                disabled={pagination.page === pagination.pages}
                                className="p-2 rounded-full border border-secondary-gold/20 hover:bg-primary-maroon hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </motion.div>
        </>
    );
};

export default Orders;