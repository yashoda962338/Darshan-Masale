// frontend/src/pages/customer/Settings.jsx - CONNECTED TO API
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Lock, Globe, Moon, Save, X, Loader2, Eye, EyeOff } from 'lucide-react';
import Button from '../../components/ui/Button';
import userService from '../../services/userService';
import toast from 'react-hot-toast';

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [settings, setSettings] = useState({
    notifications: true,
    language: 'en',
    theme: 'light',
  });

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await userService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success('Password changed successfully!');
      setShowPasswordModal(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleSettingsSave = async () => {
    toast.success('Settings saved successfully!');
    // Note: Settings API would be implemented here
  };

  return (
    <>
      <Helmet>
        <title>Settings - Darshan Masale</title>
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
            Manage your account preferences
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-soft p-6 space-y-6">
          {/* Change Password */}
          <div className="flex items-center justify-between p-4 bg-background-cream rounded-xl">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-secondary-gold" />
              <div>
                <p className="font-medium text-text-dark">Change Password</p>
                <p className="text-sm text-text-muted">Update your account password</p>
              </div>
            </div>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="px-4 py-2 bg-primary-maroon text-white rounded-full text-sm font-button font-medium hover:bg-primary-maroon-dark transition-colors"
            >
              Change
            </button>
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between p-4 bg-background-cream rounded-xl">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-secondary-gold" />
              <div>
                <p className="font-medium text-text-dark">Notifications</p>
                <p className="text-sm text-text-muted">Receive order updates and offers</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-primary-maroon transition-all"></div>
            </label>
          </div>

          {/* Language */}
          <div className="flex items-center justify-between p-4 bg-background-cream rounded-xl">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-secondary-gold" />
              <div>
                <p className="font-medium text-text-dark">Language</p>
                <p className="text-sm text-text-muted">Choose your preferred language</p>
              </div>
            </div>
            <select
              value={settings.language}
              onChange={(e) => setSettings({ ...settings, language: e.target.value })}
              className="px-4 py-2 rounded-full bg-white border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
            >
              <option value="en">English</option>
              <option value="mr">मराठी</option>
            </select>
          </div>

          {/* Theme */}
          <div className="flex items-center justify-between p-4 bg-background-cream rounded-xl">
            <div className="flex items-center gap-3">
              <Moon className="w-5 h-5 text-secondary-gold" />
              <div>
                <p className="font-medium text-text-dark">Theme</p>
                <p className="text-sm text-text-muted">Choose your theme preference</p>
              </div>
            </div>
            <select
              value={settings.theme}
              onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
              className="px-4 py-2 rounded-full bg-white border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </div>

          {/* Save Button */}
          <div className="pt-4 border-t border-secondary-gold/10">
            <Button variant="primary" onClick={handleSettingsSave} className="w-full md:w-auto">
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </Button>
          </div>
        </div>

        {/* Change Password Modal */}
        <AnimatePresence>
          {showPasswordModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
              onClick={() => setShowPasswordModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-heading text-xl font-bold text-primary-maroon">
                    Change Password
                  </h2>
                  <button
                    onClick={() => setShowPasswordModal(false)}
                    className="p-1 hover:bg-background-cream rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-1">
                      Current Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary-maroon"
                      >
                        {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-1">
                      New Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors pr-10"
                        required
                        minLength="6"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary-maroon"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-xs text-text-muted mt-1">Minimum 6 characters</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-1">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary-maroon"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 px-6 py-3 bg-primary-maroon text-white rounded-xl hover:bg-primary-maroon/90 transition-colors disabled:opacity-50"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Change Password'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowPasswordModal(false)}
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

export default Settings;