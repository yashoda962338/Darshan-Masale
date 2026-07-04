import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  Heart,
  MapPin,
  User,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

const CustomerSidebar = ({ isOpen, setIsOpen }) => {
  const { logout } = useAuth();

  const menuItems = [
    { path: "/customer/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/customer/orders", icon: ShoppingBag, label: "My Orders" },
    { path: "/customer/wishlist", icon: Heart, label: "Wishlist" },
    { path: "/customer/addresses", icon: MapPin, label: "Addresses" },
    { path: "/customer/profile", icon: User, label: "Profile" },
    { path: "/customer/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`
          fixed left-0 top-16 bottom-0
          w-64 bg-white border-r border-secondary-gold/10 shadow-soft
          overflow-y-auto z-50
          transform transition-transform duration-300

          ${isOpen ? "translate-x-0" : "-translate-x-full"}

          lg:translate-x-0
        `}
      >
        <div className="lg:hidden flex justify-end p-3">
          <button onClick={() => setIsOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                    isActive
                      ? "bg-primary-maroon text-white"
                      : "hover:bg-primary-maroon/5"
                  }`
                }
              >
                <Icon size={20} />
                {item.label}
              </NavLink>
            );
          })}

          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 mt-4"
          >
            <LogOut size={20} />
            Logout
          </button>
        </nav>
      </aside>
    </>
  );
};

export default CustomerSidebar;