// frontend/src/pages/admin/Orders.jsx - FULLY WORKING
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 0, limit: 10 });

  useEffect(() => {
    fetchOrders();
  }, [pagination.page, searchTerm, statusFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm,
        status: statusFilter,
      };
      const data = await adminService.getOrders(params);
      setOrders(data.orders || []);
      setPagination(data.pagination || { page: 1, total: 0, pages: 0, limit: 10 });
    } catch (error) {
      toast.error(error.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await adminService.updateOrderStatus(id, status);
      toast.success(`Order status updated to ${status}`);
      fetchOrders();
    } catch (error) {
      toast.error(error.message || 'Failed to update order status');
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

  const statusOptions = ['', 'PENDING', 'CONFIRMED', 'PROCESSING', 'PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];

  if (loading && orders.length === 0) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-12 h-12 border-4 border-primary-maroon border-t-secondary-gold rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Orders - Admin Dashboard</title>
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-primary-maroon">
            Orders
          </h1>
          <p className="text-text-muted mt-1">
            {pagination.total} orders total
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search by order ID or customer..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPagination({ ...pagination, page: 1 });
              }}
              className="w-full pl-10 pr-4 py-2 rounded-full bg-white border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors text-sm"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPagination({ ...pagination, page: 1 });
            }}
            className="px-4 py-2 rounded-full bg-white border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors text-sm"
          >
            <option value="">All Status</option>
            {statusOptions.filter(s => s).map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-soft">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="font-heading text-2xl text-primary-maroon">No orders yet</h3>
            <p className="text-text-muted mt-2">Orders will appear here once customers place them</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-background-cream">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-button font-medium text-text-muted uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-button font-medium text-text-muted uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-button font-medium text-text-muted uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-button font-medium text-text-muted uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-button font-medium text-text-muted uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-button font-medium text-text-muted uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary-gold/10">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-background-cream/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-text-dark">{order.orderNumber}</td>
                      <td className="px-6 py-4 text-sm text-text-muted">
                        {order.userId?.firstName} {order.userId?.lastName}
                      </td>
                      <td className="px-6 py-4 text-sm text-text-muted">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-primary-maroon">₹{order.total}</td>
                      <td className="px-6 py-4">
                        <select
                          value={order.status}
                          onChange={(e) => updateStatus(order._id, e.target.value)}
                          className={`px-3 py-1 rounded-full text-xs font-button font-medium border-0 ${getStatusColor(order.status)}`}
                        >
                          {statusOptions.filter(s => s).map((status) => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/orders/${order._id}`}
                            className="p-1.5 text-text-muted hover:text-primary-maroon transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-secondary-gold/10">
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
          </div>
        )}
      </motion.div>
    </>
  );
};

export default AdminOrders;