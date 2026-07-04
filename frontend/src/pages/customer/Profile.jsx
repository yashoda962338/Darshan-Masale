// frontend/src/pages/customer/Profile.jsx - FULLY CONNECTED
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, Edit, Save, X, Loader2, MapPin, Trash2, Plus,Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import userService from '../../services/userService';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [submittingAddress, setSubmittingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
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
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
    loadAddresses();
  }, [user]);

  const loadAddresses = async () => {
    setLoadingAddresses(true);
    try {
      const data = await userService.getAddresses();
      setAddresses(data || []);
    } catch (error) {
      console.error('Failed to load addresses:', error);
    } finally {
      setLoadingAddresses(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await updateProfile(formData);
    setIsLoading(false);
    if (result.success) {
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    if (!addressForm.addressLine1 || !addressForm.city || !addressForm.state || !addressForm.pincode || !addressForm.phone) {
      toast.error('Please fill all required fields');
      return;
    }

    setSubmittingAddress(true);
    try {
      if (editingAddress) {
        await userService.updateAddress(editingAddress._id, addressForm);
        toast.success('Address updated successfully');
      } else {
        await userService.createAddress(addressForm);
        toast.success('Address added successfully');
      }
      setShowAddressModal(false);
      resetAddressForm();
      loadAddresses();
    } catch (error) {
      toast.error(error.message || 'Failed to save address');
    } finally {
      setSubmittingAddress(false);
    }
  };

  const handleDeleteAddress = async (id, label) => {
    if (!confirm(`Delete "${label}" address?`)) return;
    try {
      await userService.deleteAddress(id);
      toast.success('Address deleted successfully');
      loadAddresses();
    } catch (error) {
      toast.error(error.message || 'Failed to delete address');
    }
  };

  const handleSetDefaultAddress = async (id) => {
    try {
      await userService.updateAddress(id, { isDefault: true });
      toast.success('Default address updated');
      loadAddresses();
    } catch (error) {
      toast.error(error.message || 'Failed to set default address');
    }
  };

  const openEditAddress = (address) => {
    setEditingAddress(address);
    setAddressForm({
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
    setShowAddressModal(true);
  };

  const resetAddressForm = () => {
    setEditingAddress(null);
    setAddressForm({
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

  return (
    <>
      <Helmet>
        <title>My Profile - Darshan Masale</title>
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-3xl font-bold text-primary-maroon">
              My Profile
            </h1>
            <p className="text-text-muted mt-1">
              Manage your account information
            </p>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-secondary-gold text-text-dark rounded-full text-sm font-button font-medium hover:bg-secondary-gold-dark transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit Profile
            </button>
          )}
        </div>

        {/* Profile Form */}
        <div className="bg-white rounded-2xl shadow-soft p-6 mb-8">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1.5">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1.5">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-dark mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-dark mb-1.5">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
                />
              </div>
              <div className="flex gap-3">
                <Button type="submit" variant="primary" disabled={isLoading}>
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button type="button" variant="secondary" onClick={() => setIsEditing(false)}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-background-cream rounded-xl">
                <div className="w-16 h-16 rounded-full bg-primary-maroon/10 flex items-center justify-center">
                  <span className="text-2xl font-heading font-bold text-primary-maroon">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </span>
                </div>
                <div>
                  <h3 className="font-heading text-xl font-semibold text-primary-maroon">
                    {user?.firstName} {user?.lastName}
                  </h3>
                  <p className="text-text-muted text-sm">{user?.email}</p>
                  <p className="text-text-muted text-sm">{user?.phone || 'No phone number'}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-background-cream rounded-xl">
                  <p className="text-xs text-text-muted">First Name</p>
                  <p className="font-medium">{user?.firstName}</p>
                </div>
                <div className="p-4 bg-background-cream rounded-xl">
                  <p className="text-xs text-text-muted">Last Name</p>
                  <p className="font-medium">{user?.lastName}</p>
                </div>
                <div className="p-4 bg-background-cream rounded-xl">
                  <p className="text-xs text-text-muted">Email</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
                <div className="p-4 bg-background-cream rounded-xl">
                  <p className="text-xs text-text-muted">Phone</p>
                  <p className="font-medium">{user?.phone || 'N/A'}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Addresses Section */}
        <div className="bg-white rounded-2xl shadow-soft p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-xl font-semibold text-primary-maroon">
              Saved Addresses
            </h2>
            <button
              onClick={() => { resetAddressForm(); setShowAddressModal(true); }}
              className="flex items-center gap-1 text-sm text-secondary-gold hover:text-primary-maroon transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add New Address
            </button>
          </div>

          {loadingAddresses ? (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 border-2 border-primary-maroon border-t-secondary-gold rounded-full animate-spin mx-auto" />
            </div>
          ) : addresses.length === 0 ? (
            <div className="text-center py-8 text-text-muted">
              <MapPin className="w-12 h-12 text-text-muted/30 mx-auto mb-2" />
              <p>No addresses saved yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {addresses.map((address) => (
                <div key={address._id} className="flex items-center justify-between p-4 bg-background-cream rounded-xl">
                  <div>
                    <p className="font-medium text-text-dark">
                      {address.label}
                      {address.isDefault && (
                        <span className="ml-2 text-xs bg-secondary-gold/20 text-secondary-gold px-2 py-0.5 rounded-full font-button font-medium">
                          Default
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-text-muted">{address.addressLine1}</p>
                    <p className="text-sm text-text-muted">{address.city}, {address.state} - {address.pincode}</p>
                  </div>
                  <div className="flex gap-2">
                    {!address.isDefault && (
                      <button
                        onClick={() => handleSetDefaultAddress(address._id)}
                        className="p-1.5 text-xs text-secondary-gold hover:bg-secondary-gold/10 rounded transition-colors"
                        title="Set as Default"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => openEditAddress(address)}
                      className="p-1.5 text-text-muted hover:text-secondary-gold transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteAddress(address._id, address.label)}
                      className="p-1.5 text-text-muted hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Address Modal */}
      <AnimatePresence>
        {showAddressModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setShowAddressModal(false)}
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
                  onClick={() => setShowAddressModal(false)}
                  className="p-1 hover:bg-background-cream rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddressSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1">Label</label>
                  <select
                    value={addressForm.label}
                    onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
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
                    value={addressForm.addressLine1}
                    onChange={(e) => setAddressForm({ ...addressForm, addressLine1: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1">Address Line 2</label>
                  <input
                    type="text"
                    value={addressForm.addressLine2}
                    onChange={(e) => setAddressForm({ ...addressForm, addressLine2: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1">Landmark</label>
                  <input
                    type="text"
                    value={addressForm.landmark}
                    onChange={(e) => setAddressForm({ ...addressForm, landmark: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-1">City *</label>
                    <input
                      type="text"
                      value={addressForm.city}
                      onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-1">State *</label>
                    <input
                      type="text"
                      value={addressForm.state}
                      onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
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
                      value={addressForm.pincode}
                      onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-1">Phone *</label>
                    <input
                      type="tel"
                      value={addressForm.phone}
                      onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={addressForm.isDefault}
                    onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                    className="w-5 h-5 accent-primary-maroon"
                  />
                  <label className="text-sm font-medium text-text-dark">Set as default address</label>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={submittingAddress}
                    className="flex-1 px-6 py-3 bg-primary-maroon text-white rounded-xl hover:bg-primary-maroon/90 transition-colors disabled:opacity-50"
                  >
                    {submittingAddress ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : (editingAddress ? 'Update' : 'Add')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddressModal(false)}
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
    </>
  );
};

export default Profile;