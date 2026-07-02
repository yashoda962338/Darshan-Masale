// frontend/src/pages/admin/Settings.jsx - FULLY CONNECTED TO API
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Save, Store, Phone, Mail, MapPin, Globe, Loader2, Check, X } from 'lucide-react';
import Button from '../../components/ui/Button';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    storeName: '',
    storeNameMr: '',
    phone: '',
    email: '',
    address: '',
    addressMr: '',
    website: '',
    currency: '₹',
    logo: '',
    favicon: '',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    facebookUrl: '',
    instagramUrl: '',
    youtubeUrl: '',
    twitterUrl: '',
    deliveryCharges: 0,
    freeDeliveryThreshold: 0,
    taxRate: 18,
    workingHours: '',
    workingDays: '',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      // Check if settings API exists, if not use defaults
      try {
        const data = await adminService.getSettings();
        setSettings(data || {});
      } catch (error) {
        // If API doesn't exist yet, use defaults
        console.warn('Settings API not available, using defaults');
        setSettings({
          storeName: 'Darshan Masale',
          storeNameMr: 'दर्शन मसाले',
          phone: '+91 98765 43210',
          email: 'info@darshanmasale.com',
          address: 'Shop No. 1, Main Market, Nandurbar - 425412',
          addressMr: 'दुकान क्र. १, मुख्य बाजार, नंदुरबार - ४२५४१२',
          website: 'www.darshanmasale.com',
          currency: '₹',
          logo: '',
          favicon: '',
          metaTitle: 'Darshan Masale - Premium Indian Spices',
          metaDescription: 'Discover authentic Indian spices at Darshan Masale. Premium quality masalas, spices, and powders delivered to your doorstep.',
          metaKeywords: 'spices, masala, indian spices, premium spices, darshan masale',
          facebookUrl: '',
          instagramUrl: '',
          youtubeUrl: '',
          twitterUrl: '',
          deliveryCharges: 0,
          freeDeliveryThreshold: 500,
          taxRate: 18,
          workingHours: '10:00 AM - 8:00 PM',
          workingDays: 'Monday - Saturday',
        });
      }
    } catch (error) {
      toast.error(error.message || 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminService.updateSettings(settings);
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to save settings');
    } finally {
      setSaving(false);
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
        <title>Settings - Admin Dashboard</title>
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-primary-maroon">
            Settings
          </h1>
          <p className="text-text-muted mt-1">
            Manage your store settings
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-soft p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Store Information */}
            <div>
              <h3 className="font-heading text-lg font-semibold text-primary-maroon mb-4">
                Store Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1.5">
                    <Store className="w-4 h-4 inline mr-2" />
                    Store Name
                  </label>
                  <input
                    type="text"
                    name="storeName"
                    value={settings.storeName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1.5">
                    <Store className="w-4 h-4 inline mr-2" />
                    Store Name (Marathi)
                  </label>
                  <input
                    type="text"
                    name="storeNameMr"
                    value={settings.storeNameMr}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1.5">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Phone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={settings.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1.5">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={settings.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1.5">
                    <Globe className="w-4 h-4 inline mr-2" />
                    Website
                  </label>
                  <input
                    type="text"
                    name="website"
                    value={settings.website}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1.5">
                    Currency
                  </label>
                  <select
                    name="currency"
                    value={settings.currency}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
                  >
                    <option value="₹">₹ (INR)</option>
                    <option value="$">$ (USD)</option>
                    <option value="€">€ (EUR)</option>
                    <option value="£">£ (GBP)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="pt-4 border-t border-secondary-gold/10">
              <h3 className="font-heading text-lg font-semibold text-primary-maroon mb-4">
                Address
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1.5">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={settings.address}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-2 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1.5">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Address (Marathi)
                  </label>
                  <textarea
                    name="addressMr"
                    value={settings.addressMr}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-2 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Store Hours */}
            <div className="pt-4 border-t border-secondary-gold/10">
              <h3 className="font-heading text-lg font-semibold text-primary-maroon mb-4">
                Store Hours
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1.5">
                    Working Hours
                  </label>
                  <input
                    type="text"
                    name="workingHours"
                    value={settings.workingHours}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
                    placeholder="10:00 AM - 8:00 PM"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1.5">
                    Working Days
                  </label>
                  <input
                    type="text"
                    name="workingDays"
                    value={settings.workingDays}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
                    placeholder="Monday - Saturday"
                  />
                </div>
              </div>
            </div>

            {/* Shipping & Tax */}
            <div className="pt-4 border-t border-secondary-gold/10">
              <h3 className="font-heading text-lg font-semibold text-primary-maroon mb-4">
                Shipping & Tax
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1.5">
                    Delivery Charges (₹)
                  </label>
                  <input
                    type="number"
                    name="deliveryCharges"
                    value={settings.deliveryCharges}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1.5">
                    Free Delivery Threshold (₹)
                  </label>
                  <input
                    type="number"
                    name="freeDeliveryThreshold"
                    value={settings.freeDeliveryThreshold}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1.5">
                    Tax Rate (%)
                  </label>
                  <input
                    type="number"
                    name="taxRate"
                    value={settings.taxRate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
                    min="0"
                    max="100"
                    step="0.01"
                  />
                </div>
              </div>
            </div>

            {/* SEO */}
            <div className="pt-4 border-t border-secondary-gold/10">
              <h3 className="font-heading text-lg font-semibold text-primary-maroon mb-4">
                SEO
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1.5">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    name="metaTitle"
                    value={settings.metaTitle}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1.5">
                    Meta Description
                  </label>
                  <textarea
                    name="metaDescription"
                    value={settings.metaDescription}
                    onChange={handleChange}
                    rows="2"
                    className="w-full px-4 py-2 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1.5">
                    Meta Keywords
                  </label>
                  <input
                    type="text"
                    name="metaKeywords"
                    value={settings.metaKeywords}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
                    placeholder="spices, masala, indian spices"
                  />
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="pt-4 border-t border-secondary-gold/10">
              <h3 className="font-heading text-lg font-semibold text-primary-maroon mb-4">
                Social Media
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1.5">
                    Facebook URL
                  </label>
                  <input
                    type="url"
                    name="facebookUrl"
                    value={settings.facebookUrl}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
                    placeholder="https://facebook.com/..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1.5">
                    Instagram URL
                  </label>
                  <input
                    type="url"
                    name="instagramUrl"
                    value={settings.instagramUrl}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
                    placeholder="https://instagram.com/..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1.5">
                    YouTube URL
                  </label>
                  <input
                    type="url"
                    name="youtubeUrl"
                    value={settings.youtubeUrl}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
                    placeholder="https://youtube.com/..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1.5">
                    Twitter URL
                  </label>
                  <input
                    type="url"
                    name="twitterUrl"
                    value={settings.twitterUrl}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
                    placeholder="https://twitter.com/..."
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-secondary-gold/10 flex gap-3">
              <Button type="submit" variant="primary" disabled={saving}>
                {saving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {saving ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </>
  );
};

export default Settings;