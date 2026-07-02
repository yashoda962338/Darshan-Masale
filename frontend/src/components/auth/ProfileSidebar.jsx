// 🔵 FRONTEND: src/components/auth/ProfileSidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { User, Package, Heart, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const ProfileSidebar = () => {
  const { user, logout } = useAuth();

  const menuItems = [
    { path: '/profile', icon: User, label: 'My Profile' },
    { path: '/orders', icon: Package, label: 'My Orders' },
    { path: '/wishlist', icon: Heart, label: 'Wishlist' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-soft p-6 sticky top-24">
      <div className="text-center mb-6 pb-6 border-b border-secondary-gold/10">
        <div className="w-20 h-20 rounded-full bg-primary-maroon/10 flex items-center justify-center mx-auto mb-3">
          <span className="text-3xl font-heading font-bold text-primary-maroon">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </span>
        </div>
        <h3 className="font-heading font-semibold text-primary-maroon">
          {user?.firstName} {user?.lastName}
        </h3>
        <p className="text-xs text-text-muted">{user?.email}</p>
      </div>

      <nav className="space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-button text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary-maroon text-white shadow-md'
                    : 'text-text-muted hover:bg-primary-maroon/5 hover:text-primary-maroon'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <button
        onClick={logout}
        className="w-full flex items-center gap-3 px-4 py-3 mt-4 rounded-xl font-button text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
      >
        <LogOut className="w-4 h-4" />
        Logout
      </button>
    </div>
  );
};

export default ProfileSidebar;