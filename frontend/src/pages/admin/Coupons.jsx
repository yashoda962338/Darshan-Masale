// frontend/src/pages/admin/Coupons.jsx - FULLY WORKING
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Copy, X, Check, AlertCircle } from 'lucide-react';
import adminService from '../../services/adminService';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    type: 'PERCENTAGE',
    value: '',
    minOrderValue: '',
    maxDiscount: '',
    usageLimit: '100',
    perUserLimit: '1',
    startDate: '',
    endDate: '',
    status: 'ACTIVE',
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const data = await adminService.getCoupons();
      setCoupons(data || []);
    } catch (error) {
      toast.error(error.message || 'Failed to fetch coupons');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.code || !formData.value) {
      toast.error('Code and value are required');
      return;
    }

    try {
      if (editingCoupon) {
        await adminService.updateCoupon(editingCoupon._id, formData);
        toast.success('Coupon updated successfully');
      } else {
        await adminService.createCoupon(formData);
        toast.success('Coupon created successfully');
      }
      setShowModal(false);
      setEditingCoupon(null);
      setFormData({ code: '', type: 'PERCENTAGE', value: '', minOrderValue: '', maxDiscount: '', usageLimit: '100', perUserLimit: '1', startDate: '', endDate: '', status: 'ACTIVE' });
      fetchCoupons();
    } catch (error) {
      toast.error(error.message || 'Failed to save coupon');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;
    try {
      await adminService.deleteCoupon(id);
      toast.success('Coupon deleted successfully');
      fetchCoupons();
    } catch (error) {
      toast.error(error.message || 'Failed to delete coupon');
    }
  };

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code || '',
      type: coupon.type || 'PERCENTAGE',
      value: coupon.value || '',
      minOrderValue: coupon.minOrderValue || '',
      maxDiscount: coupon.maxDiscount || '',
      usageLimit: coupon.usageLimit || '100',
      perUserLimit: coupon.perUserLimit || '1',
      startDate: coupon.startDate ? coupon.startDate.split('T')[0] : '',
      endDate: coupon.endDate ? coupon.endDate.split('T')[0] : '',
      status: coupon.status || 'ACTIVE',
    });
    setShowModal(true);
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success('Coupon code copied!');
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'ACTIVE': return 'bg-green-100 text-green-700';
      case 'INACTIVE': return 'bg-yellow-100 text-yellow-700';
      case 'EXPIRED': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

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
        <title>Coupons - Admin Dashboard</title>
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-3xl font-bold text-primary-maroon">
              Coupons
            </h1>
            <p className="text-text-muted mt-1">
              {coupons.length} coupons in system
            </p>
          </div>
          <button
            onClick={() => {
              setEditingCoupon(null);
              setFormData({ code: '', type: 'PERCENTAGE', value: '', minOrderValue: '', maxDiscount: '', usageLimit: '100', perUserLimit: '1', startDate: '', endDate: '', status: 'ACTIVE' });
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary-maroon text-white rounded-full font-button font-medium hover:bg-primary-maroon-dark transition-colors shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            Add Coupon
          </button>
        </div>

        {coupons.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-soft">
            <div className="text-6xl mb-4">🏷️</div>
            <h3 className="font-heading text-2xl text-primary-maroon">No coupons yet</h3>
            <p className="text-text-muted mt-2">Create your first discount coupon</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {coupons.map((coupon) => (
              <div key={coupon._id} className="bg-white rounded-2xl shadow-soft p-6 border-l-4 border-secondary-gold hover:shadow-elevated transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading text-xl font-bold text-primary-maroon">{coupon.code}</h3>
                      <button
                        onClick={() => copyCode(coupon.code)}
                        className="p-1 text-text-muted hover:text-secondary-gold transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm text-text-muted mt-1">
                      {coupon.type} {coupon.value > 0 ? `- ${coupon.value}%` : ''}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                      <span className="text-xs text-text-muted">Min: ₹{coupon.minOrderValue || 0}</span>
                      <span className="text-xs text-text-muted">Uses: {coupon.usageCount || 0}/{coupon.usageLimit || 0}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-button font-medium ${getStatusColor(coupon.status)}`}>
                        {coupon.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-xs text-text-muted">
                      <span>Valid: {coupon.startDate ? new Date(coupon.startDate).toLocaleDateString() : 'N/A'}</span>
                      <span>→</span>
                      <span>{coupon.endDate ? new Date(coupon.endDate).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => handleEdit(coupon)}
                      className="p-1.5 text-text-muted hover:text-secondary-gold transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(coupon._id)}
                      className="p-1.5 text-text-muted hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading text-xl font-bold text-primary-maroon">
                  {editingCoupon ? 'Edit Coupon' : 'Create Coupon'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1 hover:bg-background-cream rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-1">
                      Coupon Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      className="w-full px-4 py-2 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors uppercase"
                      placeholder="SUMMER10"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-1">
                      Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
                    >
                      <option value="PERCENTAGE">Percentage</option>
                      <option value="FIXED">Fixed Amount</option>
                      <option value="FREE_SHIPPING">Free Shipping</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-1">
                      Value *
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.value}
                      onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
                      placeholder="10"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-1">
                      Min Order Value
                    </label>
                    <input
                      type="number"
                      value={formData.minOrderValue}
                      onChange={(e) => setFormData({ ...formData, minOrderValue: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
                      placeholder="200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-1">
                      Max Discount
                    </label>
                    <input
                      type="number"
                      value={formData.maxDiscount}
                      onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
                      placeholder="500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-1">
                      Usage Limit
                    </label>
                    <input
                      type="number"
                      value={formData.usageLimit}
                      onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
                      placeholder="100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button type="submit" variant="primary">
                    {editingCoupon ? 'Update' : 'Create'}
                  </Button>
                  <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </motion.div>
    </>
  );
};

export default AdminCoupons;