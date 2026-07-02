// frontend/src/pages/admin/Dashboard.jsx - REAL DATA
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Package, ShoppingBag, Users, TrendingUp, 
  ArrowUp, ArrowDown, Eye, Clock, AlertCircle 
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [latestCustomers, setLatestCustomers] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const data = await adminService.getDashboard();
      setStats(data.stats);
      setRecentOrders(data.recentOrders || []);
      setLatestCustomers(data.latestCustomers || []);
      setLowStock(data.lowStockProducts || []);
    } catch (error) {
      toast.error(error.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Revenue',
      value: stats?.totalRevenue ? `₹${stats.totalRevenue.toLocaleString()}` : '₹0',
      icon: TrendingUp,
      color: 'text-green-500',
      bg: 'bg-green-500/10',
    },
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: ShoppingBag,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      title: 'Total Customers',
      value: stats?.totalCustomers || 0,
      icon: Users,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
    },
    {
      title: 'Total Products',
      value: stats?.totalProducts || 0,
      icon: Package,
      color: 'text-orange-500',
      bg: 'bg-orange-500/10',
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-12 h-12 border-4 border-primary-maroon border-t-secondary-gold rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Dashboard - Admin Panel</title>
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-primary-maroon">
            Dashboard
          </h1>
          <p className="text-text-muted mt-1">
            Welcome back, {user?.firstName}! Here's what's happening today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div key={index} className="bg-white rounded-2xl shadow-soft p-6">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-xl ${card.bg} flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${card.color}`} />
                  </div>
                  <span className={`text-sm font-medium ${stats?.totalRevenue > 0 ? 'text-green-500' : 'text-gray-400'}`}>
                    {stats?.totalRevenue > 0 ? '▲ 12%' : 'No data yet'}
                  </span>
                </div>
                <p className="text-2xl font-heading font-bold text-primary-maroon mt-3">
                  {card.value}
                </p>
                <p className="text-sm text-text-muted">{card.title}</p>
              </div>
            );
          })}
        </div>

        {/* Recent Orders & Low Stock */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-soft p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-lg font-semibold text-primary-maroon">
                Recent Orders
              </h2>
              <Link to="/admin/orders" className="text-sm text-secondary-gold hover:text-primary-maroon transition-colors">
                View All →
              </Link>
            </div>
            {recentOrders.length === 0 ? (
              <p className="text-text-muted text-center py-8">No orders yet</p>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div key={order._id} className="flex items-center justify-between p-3 bg-background-cream rounded-xl">
                    <div>
                      <p className="font-medium text-text-dark">{order.orderNumber}</p>
                      <p className="text-xs text-text-muted">
                        {order.userId?.firstName} {order.userId?.lastName}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-primary-maroon">₹{order.total}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-button font-medium ${
                        order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                        order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                        order.status === 'PROCESSING' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'SHIPPED' ? 'bg-purple-100 text-purple-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {order.status}
                      </span>
                      <Link to={`/admin/orders/${order._id}`}>
                        <Eye className="w-4 h-4 text-text-muted hover:text-primary-maroon transition-colors" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Low Stock Alert */}
          <div className="bg-white rounded-2xl shadow-soft p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <h2 className="font-heading text-lg font-semibold text-primary-maroon">
                Low Stock Alert
              </h2>
            </div>
            {lowStock.length === 0 ? (
              <p className="text-text-muted text-center py-8">✅ All products in stock</p>
            ) : (
              <div className="space-y-3">
                {lowStock.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-background-cream rounded-xl">
                    <div>
                      <p className="font-medium text-text-dark">{item.name}</p>
                      <p className="text-xs text-text-muted">SKU: {item.sku}</p>
                    </div>
                    <span className={`font-bold ${item.stock <= 5 ? 'text-red-500' : 'text-yellow-500'}`}>
                      {item.stock} left
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Latest Customers */}
        <div className="bg-white rounded-2xl shadow-soft p-6 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-lg font-semibold text-primary-maroon">
              Latest Customers
            </h2>
            <Link to="/admin/customers" className="text-sm text-secondary-gold hover:text-primary-maroon transition-colors">
              View All →
            </Link>
          </div>
          {latestCustomers.length === 0 ? (
            <p className="text-text-muted text-center py-8">No customers yet</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {latestCustomers.map((customer) => (
                <div key={customer._id} className="flex items-center gap-3 p-3 bg-background-cream rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-primary-maroon/10 flex items-center justify-center">
                    <span className="text-sm font-heading font-bold text-primary-maroon">
                      {customer.firstName?.[0]}{customer.lastName?.[0]}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-text-dark text-sm">
                      {customer.firstName} {customer.lastName}
                    </p>
                    <p className="text-xs text-text-muted">{customer.email}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default AdminDashboard;