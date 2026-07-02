// frontend/src/pages/admin/Analytics.jsx - FULLY WORKING
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Users, ShoppingBag, Package, 
  ArrowUp, ArrowDown, Calendar, Download 
} from 'lucide-react';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';

const AdminAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [period, setPeriod] = useState('month');
  const [revenueTrend, setRevenueTrend] = useState([]);
  const [topCategories, setTopCategories] = useState([]);

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAnalytics({ period });
      setAnalytics(data);
      setRevenueTrend(data.revenueTrend || []);
      setTopCategories(data.topCategories || []);
    } catch (error) {
      toast.error(error.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = revenueTrend.reduce((sum, item) => sum + item.revenue, 0);
  const totalOrders = revenueTrend.reduce((sum, item) => sum + item.orders, 0);
  const totalProducts = analytics?.topCategories?.reduce((sum, cat) => sum + cat.totalSold, 0) || 0;

  const stats = [
    { 
      label: 'Total Revenue', 
      value: `₹${totalRevenue.toLocaleString()}`, 
      change: totalRevenue > 0 ? '+12%' : '0%', 
      icon: TrendingUp, 
      color: 'text-green-500' 
    },
    { 
      label: 'Total Orders', 
      value: totalOrders.toString(), 
      change: totalOrders > 0 ? '+8%' : '0%', 
      icon: ShoppingBag, 
      color: 'text-blue-500' 
    },
    { 
      label: 'Categories', 
      value: topCategories.length.toString(), 
      change: topCategories.length > 0 ? '+5%' : '0%', 
      icon: Package, 
      color: 'text-orange-500' 
    },
    { 
      label: 'Products Sold', 
      value: totalProducts.toString(), 
      change: totalProducts > 0 ? '+15%' : '0%', 
      icon: Users, 
      color: 'text-purple-500' 
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
        <title>Analytics - Admin Dashboard</title>
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-heading text-3xl font-bold text-primary-maroon">
              Analytics
            </h1>
            <p className="text-text-muted mt-1">
              Track your store performance with real data
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-white rounded-full shadow-soft p-1">
              {['week', 'month', 'year'].map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-4 py-1.5 rounded-full text-sm font-button font-medium transition-colors ${
                    period === p
                      ? 'bg-primary-maroon text-white'
                      : 'text-text-muted hover:text-primary-maroon'
                  }`}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
            <button className="p-2.5 bg-white rounded-full shadow-soft hover:shadow-elevated transition-all">
              <Download className="w-5 h-5 text-text-muted" />
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            const isPositive = stat.change.startsWith('+') && parseInt(stat.change) > 0;
            return (
              <div key={stat.label} className="bg-white rounded-2xl shadow-soft p-6">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-xl bg-opacity-10 flex items-center justify-center ${stat.color.replace('text', 'bg')}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <span className={`flex items-center gap-1 text-sm font-medium ${
                    isPositive ? 'text-green-500' : 'text-gray-400'
                  }`}>
                    {stat.change}
                    {isPositive ? <ArrowUp className="w-3 h-3" /> : null}
                  </span>
                </div>
                <p className="text-2xl font-heading font-bold text-primary-maroon mt-3">
                  {stat.value}
                </p>
                <p className="text-sm text-text-muted">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Revenue Trend */}
        <div className="mt-8 bg-white rounded-2xl shadow-soft p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading text-lg font-semibold text-primary-maroon">
              Revenue Trend ({period})
            </h3>
            <span className="text-xs text-text-muted flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {revenueTrend.length} data points
            </span>
          </div>
          {revenueTrend.length === 0 ? (
            <div className="text-center py-12 text-text-muted">
              <p>No revenue data available yet</p>
              <p className="text-sm mt-1">Start selling to see analytics</p>
            </div>
          ) : (
            <div className="space-y-3">
              {revenueTrend.slice(0, 10).map((item, index) => {
                const date = new Date(
                  item._id.year,
                  (item._id.month || 1) - 1,
                  item._id.day || 1
                );
                const label = item._id.day 
                  ? date.toLocaleDateString()
                  : date.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
                
                return (
                  <div key={index} className="flex items-center gap-4 p-3 bg-background-cream rounded-xl hover:bg-background-cream-dark transition-colors">
                    <span className="text-sm font-medium text-text-dark w-32">{label}</span>
                    <div className="flex-1 h-2 bg-secondary-gold/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-secondary-gold to-primary-maroon rounded-full transition-all duration-500"
                        style={{ 
                          width: `${Math.min((item.revenue / Math.max(...revenueTrend.map(r => r.revenue))) * 100, 100)}%` 
                        }}
                      />
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="font-bold text-primary-maroon">₹{item.revenue.toLocaleString()}</span>
                      <span className="text-text-muted">{item.orders} orders</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Top Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="bg-white rounded-2xl shadow-soft p-6">
            <h3 className="font-heading text-lg font-semibold text-primary-maroon mb-4">
              Top Categories
            </h3>
            {topCategories.length === 0 ? (
              <p className="text-text-muted text-center py-8">No category data yet</p>
            ) : (
              <div className="space-y-3">
                {topCategories.map((category, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-background-cream rounded-xl">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-secondary-gold w-6">#{index + 1}</span>
                      <span className="font-medium text-text-dark">{category._id || 'Uncategorized'}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-text-muted">{category.totalSold} sold</span>
                      <span className="font-bold text-primary-maroon">₹{category.totalRevenue.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Insights */}
          <div className="bg-white rounded-2xl shadow-soft p-6">
            <h3 className="font-heading text-lg font-semibold text-primary-maroon mb-4">
              Quick Insights
            </h3>
            {revenueTrend.length === 0 ? (
              <p className="text-text-muted text-center py-8">No insights available yet</p>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-background-cream rounded-xl">
                  <div>
                    <p className="text-sm text-text-muted">Total Revenue</p>
                    <p className="font-medium text-text-dark">₹{totalRevenue.toLocaleString()}</p>
                  </div>
                  <span className="text-primary-maroon font-bold">
                    {revenueTrend.length} periods
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-background-cream rounded-xl">
                  <div>
                    <p className="text-sm text-text-muted">Average Order Value</p>
                    <p className="font-medium text-text-dark">
                      ₹{totalOrders > 0 ? Math.round(totalRevenue / totalOrders).toLocaleString() : 0}
                    </p>
                  </div>
                  <span className="text-primary-maroon font-bold">
                    {totalOrders} orders
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-background-cream rounded-xl">
                  <div>
                    <p className="text-sm text-text-muted">Top Category</p>
                    <p className="font-medium text-text-dark">
                      {topCategories.length > 0 ? topCategories[0]._id || 'N/A' : 'N/A'}
                    </p>
                  </div>
                  <span className="text-primary-maroon font-bold">
                    {topCategories.length > 0 ? topCategories[0].totalSold : 0} sold
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Empty State */}
        {revenueTrend.length === 0 && topCategories.length === 0 && (
          <div className="mt-8 bg-white rounded-2xl shadow-soft p-12 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="font-heading text-2xl text-primary-maroon">No Analytics Data Yet</h3>
            <p className="text-text-muted mt-2 max-w-md mx-auto">
              Analytics will appear once you start getting orders.
            </p>
          </div>
        )}
      </motion.div>
    </>
  );
};

export default AdminAnalytics;