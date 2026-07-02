// 🔵 FRONTEND: src/components/dashboard/customer/CustomerSidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, ShoppingBag, Heart, MapPin, User, 
  Settings, LogOut 
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

const CustomerSidebar = () => {
  const { logout } = useAuth();

  const menuItems = [
    { path: '/customer/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/customer/orders', icon: ShoppingBag, label: 'My Orders' },
    { path: '/customer/wishlist', icon: Heart, label: 'Wishlist' },
    { path: '/customer/addresses', icon: MapPin, label: 'Addresses' },
    { path: '/customer/profile', icon: User, label: 'Profile' },
    { path: '/customer/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-secondary-gold/10 shadow-soft hidden lg:block overflow-y-auto">
      <nav className="p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-body text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary-maroon text-white shadow-md'
                    : 'text-text-muted hover:bg-primary-maroon/5 hover:text-primary-maroon'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          );
        })}
        
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-body text-sm font-medium text-red-500 hover:bg-red-50 transition-all mt-4"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </nav>
    </aside>
  );
};

export default CustomerSidebar;