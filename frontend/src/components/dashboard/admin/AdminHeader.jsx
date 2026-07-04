import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, Search, Settings, Menu } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';

const AdminHeader = ({ onMenuClick }) => {
  const { user, role } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-secondary-gold/10 shadow-soft h-16 flex items-center px-4 lg:px-8">
      <div className="flex items-center justify-between w-full">

        {/* LEFT */}
        <div className="flex items-center gap-4">

          {/* Mobile Menu */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-background-cream transition"
          >
            <Menu className="w-6 h-6" />
          </button>

          <Link
            to="/admin/dashboard"
            className="flex items-center gap-2"
          >
            <span className="font-heading text-xl font-bold text-primary-maroon">
              Darshan
            </span>

            <span className="font-heading text-xl font-bold text-secondary-gold">
              Admin
            </span>
          </Link>

          <span className="hidden md:inline-block px-3 py-1 bg-primary-maroon/10 text-primary-maroon text-xs font-medium rounded-full">
            {role}
          </span>

        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">

          {/* Search */}
          <div className="hidden md:flex relative">

            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />

            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 rounded-full bg-background-cream border border-secondary-gold/10 focus:border-primary-maroon outline-none text-sm w-60"
            />

          </div>

          {/* Notification */}

          <button className="relative p-2 rounded-full hover:bg-background-cream transition">

            <Bell className="w-5 h-5 text-text-muted" />

            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>

          </button>

          {/* User */}

          <div className="flex items-center gap-3">

            <div className="w-9 h-9 rounded-full bg-primary-maroon/10 flex items-center justify-center">

              <span className="font-bold text-primary-maroon">

                {user?.firstName?.[0]}
                {user?.lastName?.[0]}

              </span>

            </div>

            <div className="hidden md:block">

              <p className="text-sm font-medium">

                {user?.firstName} {user?.lastName}

              </p>

              <p className="text-xs text-text-muted">

                {role}

              </p>

            </div>

            <Link
              to="/admin/settings"
              className="p-2 rounded-full hover:bg-background-cream transition"
            >
              <Settings className="w-5 h-5 text-text-muted" />
            </Link>

          </div>

        </div>

      </div>
    </header>
  );
};

export default AdminHeader;