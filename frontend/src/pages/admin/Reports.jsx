// frontend/src/pages/admin/Reports.jsx - FULLY WORKING
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  FileText, Download, Calendar, TrendingUp, 
  Users, ShoppingBag, Package, Filter, X 
} from 'lucide-react';
import adminService from '../../services/adminService';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

const AdminReports = () => {
  const [loading, setLoading] = useState(false);
  const [salesReport, setSalesReport] = useState(null);
  const [productReport, setProductReport] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    period: 'monthly',
  });

  useEffect(() => {
    fetchSalesReport();
    fetchProductReport();
  }, [filters]);

  const fetchSalesReport = async () => {
    setLoading(true);
    try {
      const data = await adminService.getSalesReport(filters);
      setSalesReport(data);
    } catch (error) {
      toast.error(error.message || 'Failed to fetch sales report');
    } finally {
      setLoading(false);
    }
  };

  const fetchProductReport = async () => {
    try {
      const data = await adminService.getProductReport();
      setProductReport(data);
    } catch (error) {
      console.error('Failed to fetch product report:', error);
    }
  };

const exportReport = (type) => {
  if (!reportData || reportData.length === 0) {
    toast.error('No data available to export');
    return;
  }

  const rows = reportData.map((item) => {
    let label = '';
    if (filters.period === 'daily') {
      label = `${item._id.day}/${item._id.month}/${item._id.year}`;
    } else if (filters.period === 'weekly') {
      label = `Week ${item._id.week}, ${item._id.year}`;
    } else {
      const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      label = `${monthNames[item._id.month - 1]} ${item._id.year}`;
    }
    const avgOrder = item.orders > 0 ? (item.revenue / item.orders).toFixed(0) : 0;
    return [label, item.revenue, item.orders, avgOrder];
  });

  const header = ['Period', 'Revenue', 'Orders', 'Avg Order Value'];
  const csvContent = [header, ...rows]
    .map((row) => row.map((val) => `"${val}"`).join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${type}-report-${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  toast.success(`${type} report exported successfully!`);
};

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-12 h-12 border-4 border-primary-maroon border-t-secondary-gold rounded-full animate-spin" />
      </div>
    );
  }

  const summary = salesReport?.summary || {};
  const reportData = salesReport?.report || [];

  return (
    <>
      <Helmet>
        <title>Reports - Admin Dashboard</title>
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-heading text-3xl font-bold text-primary-maroon">
              Reports
            </h1>
            <p className="text-text-muted mt-1">
              Generate and export real data reports
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-soft hover:shadow-elevated transition-all"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
            <button
              onClick={() => exportReport('Sales')}
              className="flex items-center gap-2 px-4 py-2 bg-primary-maroon text-white rounded-full hover:bg-primary-maroon-dark transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white rounded-2xl shadow-soft p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-lg font-semibold text-primary-maroon">Filter Reports</h3>
              <button onClick={() => setShowFilters(false)} className="text-text-muted hover:text-primary-maroon">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-dark mb-1">Start Date</label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-dark mb-1">End Date</label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-dark mb-1">Period</label>
                <select
                  value={filters.period}
                  onChange={(e) => setFilters({ ...filters, period: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl shadow-soft p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-text-muted">Total Revenue</p>
                <p className="text-xl font-heading font-bold text-primary-maroon">
                  ₹{summary.totalRevenue?.toLocaleString() || 0}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-soft p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-text-muted">Total Orders</p>
                <p className="text-xl font-heading font-bold text-primary-maroon">
                  {summary.totalOrders || 0}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-soft p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                <Package className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-text-muted">Avg Order Value</p>
                <p className="text-xl font-heading font-bold text-primary-maroon">
                  ₹{summary.avgOrderValue?.toFixed(0) || 0}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-soft p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-text-muted">Period</p>
                <p className="text-xl font-heading font-bold text-primary-maroon">
                  {reportData.length} entries
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sales Report Table */}
        <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
          <div className="px-6 py-4 border-b border-secondary-gold/10">
            <h3 className="font-heading text-lg font-semibold text-primary-maroon">
              Sales Report ({filters.period})
            </h3>
          </div>
          {reportData.length === 0 ? (
            <div className="text-center py-12 text-text-muted">
              <p>No sales data available for the selected period</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-background-cream">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-button font-medium text-text-muted uppercase tracking-wider">Period</th>
                    <th className="px-6 py-3 text-left text-xs font-button font-medium text-text-muted uppercase tracking-wider">Revenue</th>
                    <th className="px-6 py-3 text-left text-xs font-button font-medium text-text-muted uppercase tracking-wider">Orders</th>
                    <th className="px-6 py-3 text-left text-xs font-button font-medium text-text-muted uppercase tracking-wider">Avg Order</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary-gold/10">
                  {reportData.map((item, index) => {
                    let label = '';
                    if (filters.period === 'daily') {
                      label = `${item._id.day}/${item._id.month}/${item._id.year}`;
                    } else if (filters.period === 'weekly') {
                      label = `Week ${item._id.week}, ${item._id.year}`;
                    } else {
                      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                      label = `${monthNames[item._id.month - 1]} ${item._id.year}`;
                    }
                    return (
                      <tr key={index} className="hover:bg-background-cream/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-text-dark">{label}</td>
                        <td className="px-6 py-4 font-bold text-primary-maroon">₹{item.revenue.toLocaleString()}</td>
                        <td className="px-6 py-4 text-text-muted">{item.orders}</td>
                        <td className="px-6 py-4 text-text-muted">₹{(item.revenue / item.orders).toFixed(0)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Top Products */}
        <div className="mt-6 bg-white rounded-2xl shadow-soft p-6">
          <h3 className="font-heading text-lg font-semibold text-primary-maroon mb-4">
            Top Selling Products
          </h3>
          {!productReport?.topProducts || productReport.topProducts.length === 0 ? (
            <p className="text-text-muted text-center py-8">No product data available</p>
          ) : (
            <div className="space-y-3">
              {productReport.topProducts.slice(0, 5).map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-background-cream rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-secondary-gold w-6">#{index + 1}</span>
                    <span className="font-medium text-text-dark">{item.product?.name || 'Unknown'}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-text-muted">{item.totalSold} sold</span>
                    <span className="font-bold text-primary-maroon">₹{item.totalRevenue.toLocaleString()}</span>
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

export default AdminReports;