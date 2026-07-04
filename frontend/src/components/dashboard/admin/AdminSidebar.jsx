import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Grid,
  ShoppingBag,
  Users,
  Images,
  Sliders,
  Gift,
  Star,
  FileText,
  BarChart3,
  Settings,
  User,
  LogOut,
} from 'lucide-react';

import { useAuth } from '../../../context/AuthContext';

const AdminSidebar = ({ mobile = false, onClose }) => {
  const { logout, role } = useAuth();

  const isSuperAdmin = role === 'SUPER_ADMIN';

  const menuItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/products', icon: Package, label: 'Products' },
    { path: '/admin/categories', icon: Grid, label: 'Categories' },
    { path: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
    { path: '/admin/customers', icon: Users, label: 'Customers' },
    { path: '/admin/gallery', icon: Images, label: 'Gallery' },
    { path: '/admin/banners', icon: Sliders, label: 'Hero Banners' },
    { path: '/admin/coupons', icon: Gift, label: 'Coupons' },
    { path: '/admin/reviews', icon: Star, label: 'Reviews' },
    { path: '/admin/reports', icon: FileText, label: 'Reports' },
    { path: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/admin/settings', icon: Settings, label: 'Settings' },
    ...(isSuperAdmin
      ? [{ path: '/admin/users', icon: User, label: 'Users' }]
      : []),
  ];

  const sidebarContent = (
    <nav className="p-4 space-y-1">

      {menuItems.map((item) => {
        const Icon = item.icon;

        return (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => mobile && onClose && onClose()}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
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
        onClick={() => {
          logout();

          if (mobile && onClose) onClose();
        }}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 mt-6 transition"
      >
        <LogOut className="w-5 h-5" />

        Logout
      </button>

    </nav>
  );

  if (mobile) {
    return (
      <div className="h-full overflow-y-auto bg-white">
        {sidebarContent}
      </div>
    );
  }

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-secondary-gold/10 shadow-soft overflow-y-auto hidden lg:block">
      {sidebarContent}
    </aside>
  );
};

export default AdminSidebar;