// frontend/src/pages/customer/Addresses.jsx - CONNECTED TO API
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Edit, Trash2, Plus, X, Loader2, Check } from 'lucide-react';
import userService from '../../services/userService';
import toast from 'react-hot-toast';

const Addresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    label: 'Home',
    addressLine1: '',
    addressLine2: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
    isDefault: false,
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const data = await userService.getAddresses();
      setAddresses(data || []);
    } catch (error) {
      toast.error(error.message || 'Failed to load addresses');
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.addressLine1 || !formData.city || !formData.state || !formData.pincode || !formData.phone) {
      toast.error('Please fill all required fields');
      return;
    }

    setSubmitting(true);
    try {
      if (editingAddress) {
        await userService.updateAddress(editingAddress._id, formData);
        toast.success('Address updated successfully');
      } else {
        await userService.createAddress(formData);
        toast.success('Address added successfully');
      }
      setShowModal(false);
      resetForm();
      fetchAddresses();
    } catch (error) {
      toast.error(error.message || 'Failed to save address');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, label) => {
    if (!confirm(`Delete "${label}" address?`)) return;

    try {
      await userService.deleteAddress(id);
      toast.success('Address deleted');
      fetchAddresses();
    } catch (error) {
      toast.error(error.message || 'Failed to delete address');
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await userService.updateAddress(id, { isDefault: true });
      toast.success('Default address updated');
      fetchAddresses();
    } catch (error) {
      toast.error(error.message || 'Failed to set default address');
    }
  };

  const openEditModal = (address) => {
    setEditingAddress(address);
    setFormData({
      label: address.label || 'Home',
      addressLine1: address.addressLine1 || '',
      addressLine2: address.addressLine2 || '',
      landmark: address.landmark || '',
      city: address.city || '',
      state: address.state || '',
      pincode: address.pincode || '',
      phone: address.phone || '',
      isDefault: address.isDefault || false,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingAddress(null);
    setFormData({
      label: 'Home',
      addressLine1: '',
      addressLine2: '',
      landmark: '',
      city: '',
      state: '',
      pincode: '',
      phone: '',
      isDefault: false,
    });
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
        <title>My Addresses - Darshan Masale</title>
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-3xl font-bold text-primary-maroon">
              My Addresses
            </h1>
            <p className="text-text-muted mt-1">
              {addresses.length} addresses saved
            </p>
          </div>
          <button
            onClick={() => { resetForm(); setShowModal(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-primary-maroon text-white rounded-full text-sm font-button font-medium hover:bg-primary-maroon-dark transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add New Address
          </button>
        </div>

        {addresses.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-soft">
            <MapPin className="w-16 h-16 text-text-muted/30 mx-auto" />
            <h3 className="font-heading text-xl text-primary-maroon mt-4">
              No Addresses Saved
            </h3>
            <p className="text-text-muted mt-2">
              Add your first shipping address
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((address) => (
              <div
                key={address._id}
                className={`bg-white rounded-2xl shadow-soft p-6 hover:shadow-elevated transition-all duration-300 ${
                  address.isDefault ? 'border-2 border-secondary-gold' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-secondary-gold mt-1" />
                    <div>
                      <h4 className="font-heading font-semibold text-primary-maroon">
                        {address.label}
                        {address.isDefault && (
                          <span className="ml-2 text-xs bg-secondary-gold/20 text-secondary-gold px-2 py-0.5 rounded-full font-button font-medium">
                            Default
                          </span>
                        )}
                      </h4>
                      <p className="text-sm text-text-muted mt-1">{address.addressLine1}</p>
                      {address.addressLine2 && (
                        <p className="text-sm text-text-muted">{address.addressLine2}</p>
                      )}
                      <p className="text-sm text-text-muted">{address.city}, {address.state} - {address.pincode}</p>
                      <p className="text-sm text-text-muted">Phone: {address.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!address.isDefault && (
                      <button
                        onClick={() => handleSetDefault(address._id)}
                        className="p-1.5 text-xs text-secondary-gold hover:bg-secondary-gold/10 rounded transition-colors"
                        title="Set as Default"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => openEditModal(address)}
                      className="p-1.5 text-text-muted hover:text-primary-maroon transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(address._id, address.label)}
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

        {/* Add/Edit Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
              onClick={() => setShowModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-heading text-xl font-bold text-primary-maroon">
                    {editingAddress ? 'Edit Address' : 'Add New Address'}
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-1 hover:bg-background-cream rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-1">Label</label>
                    <select
                      value={formData.label}
                      onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
                    >
                      <option value="Home">Home</option>
                      <option value="Work">Work</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-1">Address Line 1 *</label>
                    <input
                      type="text"
                      value={formData.addressLine1}
                      onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-1">Address Line 2</label>
                    <input
                      type="text"
                      value={formData.addressLine2}
                      onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-1">Landmark</label>
                    <input
                      type="text"
                      value={formData.landmark}
                      onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-dark mb-1">City *</label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-dark mb-1">State *</label>
                      <input
                        type="text"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-dark mb-1">Pincode *</label>
                      <input
                        type="text"
                        value={formData.pincode}
                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-dark mb-1">Phone *</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={formData.isDefault}
                      onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                      className="w-5 h-5 accent-primary-maroon"
                    />
                    <label className="text-sm font-medium text-text-dark">Set as default address</label>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 px-6 py-3 bg-primary-maroon text-white rounded-xl hover:bg-primary-maroon/90 transition-colors disabled:opacity-50"
                    >
                      {submitting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : (editingAddress ? 'Update' : 'Add')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-6 py-3 bg-background-cream text-text-dark rounded-xl hover:bg-background-cream/70 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default Addresses;