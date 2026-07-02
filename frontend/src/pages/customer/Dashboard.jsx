// frontend/src/pages/customer/Dashboard.jsx - FIXED
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, MapPin, Eye, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import orderService from '../../services/orderService';
import userService from '../../services/userService';
import wishlistService from '../../services/wishlistService';
import toast from 'react-hot-toast';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white rounded-2xl shadow-soft p-6 hover:shadow-elevated transition-all duration-300">
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl bg-${color}-500/10 flex items-center justify-center`}>
        <Icon className={`w-6 h-6 text-${color}-500`} />
      </div>
      <div>
        <p className="text-sm text-text-muted">{label}</p>
        <p className="text-2xl font-heading font-bold text-primary-maroon">{value}</p>
      </div>
    </div>
  </div>
);

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    wishlistCount: 0,
    addressCount: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch orders
      const ordersResponse = await orderService.getOrders();
      let orders = [];
      if (Array.isArray(ordersResponse)) {
        orders = ordersResponse;
      } else if (ordersResponse && Array.isArray(ordersResponse.orders)) {
        orders = ordersResponse.orders;
      } else if (ordersResponse && Array.isArray(ordersResponse.data)) {
        orders = ordersResponse.data;
      }
      setRecentOrders(orders.slice(0, 5));
      setStats(prev => ({ ...prev, totalOrders: orders.length }));

      // Fetch addresses
      const addresses = await userService.getAddresses();
      const addressCount = Array.isArray(addresses) ? addresses.length : 0;
      setStats(prev => ({ ...prev, addressCount }));

      // Fetch wishlist - FIXED: correctly handle the response
      const wishlist = await wishlistService.getWishlist();
      const wishlistArray = Array.isArray(wishlist) ? wishlist : [];
      console.log('Dashboard wishlist:', wishlistArray);
      setWishlistItems(wishlistArray.slice(0, 4));
      setStats(prev => ({ ...prev, wishlistCount: wishlistArray.length }));
    } catch (error) {
      console.error('Dashboard error:', error);
      toast.error(error.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-12 h-12 text-primary-maroon animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Dashboard - Darshan Masale</title>
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-primary-maroon">
            Welcome back, {user?.firstName || 'Guest'}!
          </h1>
          <p className="text-text-muted mt-1">
            Here's what's happening with your account
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard icon={ShoppingBag} label="Total Orders" value={stats.totalOrders} color="blue" />
          <StatCard icon={Heart} label="Wishlist Items" value={stats.wishlistCount} color="red" />
          <StatCard icon={MapPin} label="Saved Addresses" value={stats.addressCount} color="green" />
        </div>

        {/* Recent Orders */}
        <div className="mt-6 bg-white rounded-2xl shadow-soft p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-lg font-semibold text-primary-maroon">Recent Orders</h2>
            <Link to="/customer/orders" className="text-sm text-secondary-gold hover:underline">View All →</Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-text-muted text-center py-4">No orders yet</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order._id || order.id} className="flex items-center justify-between p-4 bg-background-cream rounded-xl">
                  <div>
                    <p className="font-medium text-text-dark">#{order.orderNumber || order.id}</p>
                    <p className="text-sm text-text-muted">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-primary-maroon">₹{order.total || 0}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-button font-medium ${
                      order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                      order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {order.status || 'PENDING'}
                    </span>
                    <Link to={`/customer/orders/${order._id || order.id}`} className="text-secondary-gold hover:text-primary-maroon transition-colors">
                      <Eye className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Wishlist Preview - FIXED: Shows real data */}
        <div className="mt-6 bg-white rounded-2xl shadow-soft p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-lg font-semibold text-primary-maroon">Wishlist</h2>
            <Link to="/customer/wishlist" className="text-sm text-secondary-gold hover:underline">View All →</Link>
          </div>
          {wishlistItems.length === 0 ? (
            <p className="text-text-muted text-center py-4">Wishlist is empty</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {wishlistItems.map((item) => {
                const product = item.productId || {};
                const image = product?.images?.[0]?.url || '/placeholder-image.jpg';
                const price = product?.variants?.[0]?.sellingPrice || 0;
                return (
                  <div key={item._id} className="bg-background-cream rounded-xl p-3 text-center">
                    <img
                      src={image}
                      alt={product?.name || 'Product'}
                      className="w-full h-24 object-cover rounded-lg"
                      onError={(e) => { e.target.src = '/placeholder-image.jpg'; }}
                    />
                    <p className="text-sm font-medium text-text-dark mt-2 truncate">
                      {product?.name || 'Product'}
                    </p>
                    <p className="text-xs text-text-muted">₹{price}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default CustomerDashboard;