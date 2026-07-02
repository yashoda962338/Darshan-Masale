// 🔵 FRONTEND: src/pages/auth/Profile.jsx
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Edit, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import ProtectedRoute from '../../routes/ProtectedRoute';
import Button from '../../components/ui/Button';
import ProfileSidebar from '../../components/auth/ProfileSidebar';

const Profile = () => {
  const { user, updateProfile, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await updateProfile(formData);
    setIsLoading(false);
    if (result.success) {
      setIsEditing(false);
    }
  };

  return (
    <ProtectedRoute>
      <Helmet>
        <title>My Profile - Darshan Masale</title>
      </Helmet>

      <section className="min-h-screen bg-background-cream py-20">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-4 gap-8"
          >
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <ProfileSidebar />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-soft p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-heading text-2xl font-bold text-primary-maroon">
                    My Profile
                  </h2>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 text-secondary-gold hover:text-secondary-gold-dark transition-colors font-button text-sm font-medium"
                    >
                      <Edit className="w-4 h-4" />
                      Edit Profile
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-text-dark mb-1.5">
                          First Name
                        </label>
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
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
                          className="w-full px-4 py-3 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-dark mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-dark mb-1.5">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-background-cream border border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
                      />
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Saving...' : 'Save Changes'}
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
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
                        <p className="text-text-muted text-sm">{user?.phone}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-background-cream rounded-xl">
                        <p className="text-xs text-text-muted font-body uppercase tracking-wider">First Name</p>
                        <p className="font-medium text-text-dark">{user?.firstName}</p>
                      </div>
                      <div className="p-4 bg-background-cream rounded-xl">
                        <p className="text-xs text-text-muted font-body uppercase tracking-wider">Last Name</p>
                        <p className="font-medium text-text-dark">{user?.lastName}</p>
                      </div>
                      <div className="p-4 bg-background-cream rounded-xl">
                        <p className="text-xs text-text-muted font-body uppercase tracking-wider">Email</p>
                        <p className="font-medium text-text-dark">{user?.email}</p>
                      </div>
                      <div className="p-4 bg-background-cream rounded-xl">
                        <p className="text-xs text-text-muted font-body uppercase tracking-wider">Phone</p>
                        <p className="font-medium text-text-dark">{user?.phone}</p>
                      </div>
                    </div>

                    <button
                      onClick={logout}
                      className="flex items-center gap-2 text-red-500 hover:text-red-700 transition-colors font-button text-sm font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </ProtectedRoute>
  );
};

export default Profile;