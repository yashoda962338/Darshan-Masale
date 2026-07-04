import React from "react";
import { Link } from "react-router-dom";
import { Bell, Search, Menu } from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";

const CustomerHeader = ({ setIsOpen }) => {
  const { user } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-white border-b border-secondary-gold/10 shadow-soft h-16 flex items-center px-4 lg:px-8">
      <div className="flex items-center justify-between w-full">

        {/* Left */}
        <div className="flex items-center gap-3">

          {/* Mobile Menu */}
          <button
            onClick={() => setIsOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu size={24} />
          </button>

          <Link
            to="/customer/dashboard"
            className="flex items-center gap-2"
          >
            <span className="font-heading text-xl font-bold text-primary-maroon">
              Darshan
            </span>

            <span className="font-heading text-xl font-bold text-secondary-gold">
              Masale
            </span>
          </Link>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">

          {/* Search */}
          <div className="hidden md:flex relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />

            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 rounded-full border border-secondary-gold/10 bg-background-cream focus:border-primary-maroon outline-none text-sm"
            />
          </div>

          {/* Notification */}
          <button className="relative p-2 rounded-full hover:bg-background-cream">
            <Bell size={20} />

            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-primary-maroon text-white flex items-center justify-center font-bold">
              {user?.firstName?.charAt(0)}
              {user?.lastName?.charAt(0)}
            </div>

            <div className="hidden md:block">
              <p className="text-sm font-semibold">
                {user?.firstName} {user?.lastName}
              </p>

              <p className="text-xs text-gray-500">
                Customer
              </p>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
};

export default CustomerHeader;