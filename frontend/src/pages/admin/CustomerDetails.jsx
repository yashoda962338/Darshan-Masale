// frontend/src/pages/admin/CustomerDetails.jsx - FULLY CONNECTED TO API
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, ShoppingBag, Loader2 } from 'lucide-react';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';

const CustomerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({ totalOrders: 0, totalSpent: 0 });

  useEffect(() => {
    fetchCustomer();
  }, [id]);

  const fetchCustomer = async () => {
    setLoading(true);
    try {
      const data = await adminService.getCustomer(id);
      setCustomer(data.customer || null);
      setOrders(data.orders || []);
      setStats({
        totalOrders: data.totalOrders || 0,
        totalSpent: data.totalSpent || 0,
      });
    } catch (error) {
      toast.error(error.message || 'Failed to fetch customer details');
      navigate('/admin/customers');
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-12 h-12 text-primary-maroon animate-spin" />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="text-center py-16">
        <h2 className="font-heading text-2xl text-primary-maroon">Customer not found</h2>
        <button
          onClick={() => navigate('/admin/customers')}
          className="mt-4 text-secondary-gold hover:underline"
        >
          Back to Customers
        </button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{customer.firstName} {customer.lastName} - Admin Dashboard</title>
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={() => navigate('/admin/customers')}
              className="flex items-center gap-2 text-text-muted hover:text-primary-maroon transition-colors mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Customers
            </button>
            <h1 className="font-heading text-3xl font-bold text-primary-maroon">
              {customer.firstName} {customer.lastName}
            </h1>
            <p className="text-text-muted mt-1">
              Customer since {new Date(customer.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-4 py-2 rounded-full text-sm font-button font-medium ${
              customer.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 
              customer.status === 'BLOCKED' ? 'bg-red-100 text-red-700' : 
              'bg-gray-100 text-gray-700'
            }`}>
              {customer.status || 'ACTIVE'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Customer Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-soft p-6">
              <h3 className="font-heading text-lg font-semibold text-primary-maroon mb-4">
                Contact Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-maroon/10 flex items-center justify-center">
                    <Mail className="w-4 h-4 text-primary-maroon" />
                  </div>
                  <div>
                    <p className="text-xs text-text-muted">Email</p>
                    <p className="font-medium text-sm">{customer.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-maroon/10 flex items-center justify-center">
                    <Phone className="w-4 h-4 text-primary-maroon" />
                  </div>
                  <div>
                    <p className="text-xs text-text-muted">Phone</p>
                    <p className="font-medium text-sm">{customer.phone || 'N/A'}</p>
                  </div>
                </div>
                {customer.addresses && customer.addresses.length > 0 && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-maroon/10 flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-primary-maroon" />
                    </div>
                    <div>
                      <p className="text-xs text-text-muted">Default Address</p>
                      <p className="font-medium text-sm">
                        {customer.addresses.find(a => a.isDefault)?.addressLine1 || 'N/A'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-soft p-6">
              <h3 className="font-heading text-lg font-semibold text-primary-maroon mb-4">
                Stats
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-background-cream rounded-xl">
                  <p className="text-2xl font-heading font-bold text-primary-maroon">{stats.totalOrders}</p>
                  <p className="text-xs text-text-muted">Total Orders</p>
                </div>
                <div className="text-center p-4 bg-background-cream rounded-xl">
                  <p className="text-2xl font-heading font-bold text-primary-maroon">₹{stats.totalSpent.toLocaleString()}</p>
                  <p className="text-xs text-text-muted">Total Spent</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order History */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-soft p-6">
              <h3 className="font-heading text-lg font-semibold text-primary-maroon mb-4">
                Order History
              </h3>
              {orders.length === 0 ? (
                <p className="text-text-muted text-center py-8">No orders yet</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-xs font-button font-medium text-text-muted uppercase tracking-wider">
                        <th className="pb-3">Order ID</th>
                        <th className="pb-3">Date</th>
                        <th className="pb-3">Total</th>
                        <th className="pb-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-secondary-gold/10">
                      {orders.map((order) => (
                        <tr key={order._id} className="hover:bg-background-cream/50 transition-colors cursor-pointer" onClick={() => navigate(`/admin/orders/${order._id}`)}>
                          <td className="py-3 font-medium text-text-dark">{order.orderNumber}</td>
                          <td className="py-3 text-sm text-text-muted">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 font-medium text-primary-maroon">₹{order.total}</td>
                          <td className="py-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-button font-medium ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default CustomerDetails;