// frontend/src/pages/admin/OrderDetails.jsx - FULLY CONNECTED TO API
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Printer, Truck, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Button from '../../components/ui/Button';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const data = await adminService.getOrder(id);
      setOrder(data);
      setItems(data.items || []);
    } catch (error) {
      toast.error(error.message || 'Failed to fetch order details');
      navigate('/admin/orders');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus) => {
    if (!window.confirm(`Are you sure you want to mark this order as ${newStatus}?`)) return;

    setUpdating(true);
    try {
      await adminService.updateOrderStatus(id, newStatus);
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrder();
    } catch (error) {
      toast.error(error.message || 'Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'PENDING': 'bg-yellow-100 text-yellow-700',
      'CONFIRMED': 'bg-blue-100 text-blue-700',
      'PROCESSING': 'bg-purple-100 text-purple-700',
      'PACKED': 'bg-indigo-100 text-indigo-700',
      'SHIPPED': 'bg-cyan-100 text-cyan-700',
      'OUT_FOR_DELIVERY': 'bg-teal-100 text-teal-700',
      'DELIVERED': 'bg-green-100 text-green-700',
      'CANCELLED': 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const statusOptions = ['PENDING', 'CONFIRMED', 'PROCESSING', 'PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-12 h-12 text-primary-maroon animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-16">
        <h2 className="font-heading text-2xl text-primary-maroon">Order not found</h2>
        <button
          onClick={() => navigate('/admin/orders')}
          className="mt-4 text-secondary-gold hover:underline"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Order #{order.orderNumber} - Admin Dashboard</title>
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={() => navigate('/admin/orders')}
              className="flex items-center gap-2 text-text-muted hover:text-primary-maroon transition-colors mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Orders
            </button>
            <h1 className="font-heading text-3xl font-bold text-primary-maroon">
              Order #{order.orderNumber}
            </h1>
            <p className="text-text-muted mt-1">
              Order placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" className="flex items-center gap-2" onClick={() => window.print()}>
              <Printer className="w-4 h-4" />
              Print
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status */}
            <div className="bg-white rounded-2xl shadow-soft p-6">
              <h3 className="font-heading text-lg font-semibold text-primary-maroon mb-4">
                Order Status
              </h3>
              <div className="flex flex-wrap items-center gap-4">
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(e.target.value)}
                  disabled={updating}
                  className={`px-4 py-2 rounded-full text-sm font-button font-medium border-2 ${getStatusColor(order.status)}`}
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                <span className="text-sm text-text-muted">
                  Last updated: {new Date(order.updatedAt).toLocaleString()}
                </span>
                {updating && <Loader2 className="w-5 h-5 text-primary-maroon animate-spin" />}
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-2xl shadow-soft p-6">
              <h3 className="font-heading text-lg font-semibold text-primary-maroon mb-4">
                Order Items
              </h3>
              {items.length === 0 ? (
                <p className="text-text-muted text-center py-4">No items in this order</p>
              ) : (
                <div className="divide-y divide-secondary-gold/10">
                  {items.map((item, index) => (
                    <div key={index} className="py-4 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-text-dark">{item.productName}</p>
                        <p className="text-sm text-text-muted">
                          Qty: {item.quantity} × ₹{item.sellingPrice}
                          {item.variantName && ` | ${item.variantName}`}
                        </p>
                      </div>
                      <p className="font-medium text-primary-maroon">₹{item.totalPrice}</p>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-4 pt-4 border-t border-secondary-gold/10 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Subtotal</span>
                  <span>₹{order.subtotal}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-text-muted">Discount</span>
                    <span className="text-red-500">-₹{order.discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Shipping</span>
                  <span>₹{order.shippingCost || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Tax</span>
                  <span>₹{order.tax || 0}</span>
                </div>
                <div className="flex justify-between font-heading text-lg font-bold text-primary-maroon pt-2 border-t border-secondary-gold/10">
                  <span>Total</span>
                  <span>₹{order.total}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-soft p-6">
              <h3 className="font-heading text-lg font-semibold text-primary-maroon mb-4">
                Customer Information
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-text-muted">Name</p>
                  <p className="font-medium">{order.userId?.firstName} {order.userId?.lastName}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">Email</p>
                  <p className="font-medium">{order.userId?.email}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">Phone</p>
                  <p className="font-medium">{order.userId?.phone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">Payment Method</p>
                  <p className="font-medium">{order.paymentMethod || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">Payment Status</p>
                  <p className="font-medium">{order.paymentStatus || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-soft p-6">
              <h3 className="font-heading text-lg font-semibold text-primary-maroon mb-4">
                Shipping Address
              </h3>
              <div className="space-y-1 text-sm">
                <p className="font-medium">{order.shippingAddress?.addressLine1}</p>
                {order.shippingAddress?.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                <p>{order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
                <p>Pincode: {order.shippingAddress?.pincode}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-soft p-6">
              <h3 className="font-heading text-lg font-semibold text-primary-maroon mb-4">
                Quick Actions
              </h3>
              <div className="space-y-2">
                {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                  <button
                    onClick={() => updateStatus('DELIVERED')}
                    disabled={updating}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-full text-sm font-button font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Mark as Delivered
                  </button>
                )}
                {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
                  <button
                    onClick={() => updateStatus('CANCELLED')}
                    disabled={updating}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-full text-sm font-button font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
                  >
                    <XCircle className="w-4 h-4" />
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default OrderDetails;