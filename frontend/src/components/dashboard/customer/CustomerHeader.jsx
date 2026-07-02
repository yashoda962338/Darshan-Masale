// 🔵 FRONTEND: src/components/dashboard/customer/CustomerHeader.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, Search, User } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';

const CustomerHeader = () => {
  const { user } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-white border-b border-secondary-gold/10 shadow-soft h-16 flex items-center px-6 lg:px-8">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-4">
          <Link to="/customer/dashboard" className="flex items-center gap-2">
            <span className="font-heading text-xl font-bold text-primary-maroon">Darshan</span>
            <span className="font-heading text-xl font-bold text-secondary-gold">Masale</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="hidden md:flex relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-1.5 rounded-full bg-background-cream border border-secondary-gold/10 focus:border-primary-maroon outline-none transition-colors text-sm w-48 lg:w-64"
            />
          </div>

          {/* Notifications */}
          <button className="relative p-2 rounded-full hover:bg-background-cream transition-colors">
            <Bell className="w-5 h-5 text-text-muted" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary-maroon/10 flex items-center justify-center">
              <span className="text-sm font-heading font-bold text-primary-maroon">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </span>
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-text-dark">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-text-muted">Customer</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default CustomerHeader;