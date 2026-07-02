// 🔵 FRONTEND: src/components/dashboard/admin/AdminSidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { 
  LayoutDashboard, Package, Grid, ShoppingBag, Users, 
  Images, Sliders, Gift, Star, FileText, BarChart3, 
  Settings, User, LogOut 
} from 'lucide-react';

const AdminSidebar = () => {
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
    ...(isSuperAdmin ? [{ path: '/admin/users', icon: User, label: 'Users' }] : []),
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

export default AdminSidebar;