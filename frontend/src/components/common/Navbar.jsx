// 🔵 FRONTEND: src/components/common/Navbar.jsx - Full Updated with Role-Based Auth
import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Menu, X, ShoppingBag, Heart, Globe, Search, ChevronDown,
  User, LogOut, Settings, Package, LayoutDashboard
} from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../hooks/useAuth'
import navigationData from '../../data/navigation.json'
import LanguageToggle from './LanguageToggle'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const location = useLocation()
  const { language, translate } = useLanguage()
  
  // ✅ FIX: Safely get cart context with fallback
  let cartContext;
  try {
    cartContext = useCart();
  } catch (error) {
    // If CartProvider is not available, use fallback
    cartContext = { 
      cart: { items: [] }, 
      getTotalItems: () => 0,
      loading: false 
    };
  }
  
  const { cart, getTotalItems, loading } = cartContext;
  
  // ✅ FIX: Safely get auth context with fallback
  let authContext;
  try {
    authContext = useAuth();
  } catch (error) {
    authContext = { 
      isAuthenticated: false, 
      user: null, 
      role: null, 
      logout: () => {} 
    };
  }
  
  const { isAuthenticated, user, role, logout } = authContext;
  
  const searchRef = useRef(null)
  const profileRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchOpen(false)
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  const navItems = navigationData[language] || navigationData.en

  // ✅ FIX: Safely get total items with fallback
  const getTotalCartItems = () => {
    try {
      if (typeof getTotalItems === 'function') {
        return getTotalItems();
      }
      // Fallback: calculate from cart
      if (cart && cart.items) {
        return cart.items.reduce((total, item) => total + (item.quantity || 0), 0);
      }
      return 0;
    } catch (error) {
      console.error('Error getting total items:', error);
      return 0;
    }
  };

  const totalItems = getTotalCartItems();

  // Role-based dashboard path
  const getDashboardPath = () => {
    if (!role) return '/'
    if (role === 'CUSTOMER') return '/customer/dashboard'
    return '/admin/dashboard'
  }

  // Profile dropdown items based on role
  const getProfileItems = () => {
    const items = []
    
    if (role === 'CUSTOMER') {
      items.push({ icon: User, label: 'My Profile', path: '/customer/profile' })
      items.push({ icon: Package, label: 'My Orders', path: '/customer/orders' })
      items.push({ icon: Heart, label: 'Wishlist', path: '/customer/wishlist' })
      items.push({ icon: Settings, label: 'Settings', path: '/customer/settings' })
    } else if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
      items.push({ icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' })
      items.push({ icon: User, label: 'Profile', path: '/admin/profile' })
      items.push({ icon: Settings, label: 'Settings', path: '/admin/settings' })
    }
    
    return items
  }

  const profileItems = getProfileItems()

  const handleLogout = async () => {
    try {
      await logout()
      setIsProfileDropdownOpen(false)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return 'U'
    return `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`.toUpperCase() || 'U'
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-white shadow-lg backdrop-blur-xl border-b border-secondary-gold/10'
          : 'bg-transparent'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary-maroon flex items-center justify-center"
            >
              <span className="font-heading text-lg md:text-xl font-bold text-secondary-gold">DM</span>
            </motion.div>
            <div>
              <span className="font-heading text-xl md:text-2xl font-bold text-primary-maroon leading-none">
                Darshan
              </span>
              <span className="block text-[10px] tracking-widest text-secondary-gold font-button font-medium uppercase">
                Masale
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className={`relative font-body text-sm font-medium tracking-wider transition-colors duration-300 ${
                  location.pathname === item.path
                    ? 'text-primary-maroon'
                    : 'text-text-dark-light hover:text-primary-maroon'
                }`}
              >
                {item.label}
                {location.pathname === item.path && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary-maroon"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-3 md:space-x-4">
            {/* Search */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 rounded-full hover:bg-primary-maroon/5 transition-colors"
            >
              <Search className="w-5 h-5 text-text-dark-light" />
            </button>

            {/* Wishlist - Only for customers */}
            {role === 'CUSTOMER' && (
              <Link to="/customer/wishlist" className="p-2 rounded-full hover:bg-primary-maroon/5 transition-colors relative">
                <Heart className="w-5 h-5 text-text-dark-light" />
              </Link>
            )}

            {/* Cart - Only for customers */}
            {role === 'CUSTOMER' && (
              <Link to="/cart" className="p-2 rounded-full hover:bg-primary-maroon/5 transition-colors relative">
                <ShoppingBag className="w-5 h-5 text-text-dark-light" />
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-primary-maroon text-background-cream text-xs font-button font-bold rounded-full flex items-center justify-center"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </Link>
            )}

            {/* Language Toggle */}
            <LanguageToggle />

            {/* User Profile / Auth */}
            {isAuthenticated ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-2 p-2 rounded-full hover:bg-primary-maroon/5 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-primary-maroon/10 flex items-center justify-center">
                    <span className="text-sm font-heading font-bold text-primary-maroon">
                      {getUserInitials()}
                    </span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-text-muted transition-transform duration-300 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isProfileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full right-0 mt-2 min-w-[220px] bg-white backdrop-blur-xl rounded-2xl shadow-xl border border-secondary-gold/10 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-secondary-gold/10">
                        <p className="font-heading font-semibold text-primary-maroon text-sm">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-xs text-text-muted">{user?.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 bg-primary-maroon/10 text-primary-maroon text-[8px] font-button font-bold rounded-full uppercase tracking-wider">
                          {role || 'CUSTOMER'}
                        </span>
                      </div>
                      {profileItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsProfileDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-primary-maroon/5 transition-colors font-body text-sm text-text-dark-light"
                          >
                            <Icon className="w-4 h-4" />
                            {item.label}
                          </Link>
                        );
                      })}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition-colors font-body text-sm text-red-500 border-t border-secondary-gold/10"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/auth/login"
                  className="px-4 py-2 text-sm font-button font-medium text-primary-maroon hover:text-secondary-gold transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/auth/register"
                  className="px-4 py-2 bg-primary-maroon text-white rounded-full text-sm font-button font-medium hover:bg-primary-maroon-dark transition-colors"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-full hover:bg-primary-maroon/5 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-text-dark-light" />
              ) : (
                <Menu className="w-6 h-6 text-text-dark-light" />
              )}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              ref={searchRef}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 bg-white backdrop-blur-xl border-b border-secondary-gold/10 p-4 shadow-lg"
            >
              <div className="container-custom">
                <div className="relative max-w-2xl mx-auto">
                  <input
                    type="text"
                    placeholder={translate('common.search') || 'Search...'}
                    className="w-full px-6 py-3 pr-12 rounded-full bg-background-cream text-text-dark border-2 border-secondary-gold/20 focus:border-primary-maroon outline-none transition-colors"
                  />
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white backdrop-blur-xl border-b border-secondary-gold/10 overflow-hidden"
          >
            <div className="container-custom py-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg font-body text-sm font-medium tracking-wider transition-colors ${
                    location.pathname === item.path
                      ? 'bg-primary-maroon/10 text-primary-maroon'
                      : 'text-text-dark-light hover:bg-primary-maroon/5'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Mobile Auth Links */}
              <div className="border-t border-secondary-gold/10 pt-3 mt-2">
                {isAuthenticated ? (
                  <>
                    {role === 'CUSTOMER' ? (
                      <>
                        <Link
                          to="/customer/dashboard"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-lg text-text-dark-light hover:bg-primary-maroon/5 transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          Dashboard
                        </Link>
                        <Link
                          to="/customer/profile"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-lg text-text-dark-light hover:bg-primary-maroon/5 transition-colors"
                        >
                          <User className="w-4 h-4" />
                          My Profile
                        </Link>
                      </>
                    ) : (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-text-dark-light hover:bg-primary-maroon/5 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false)
                        logout()
                      }}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 transition-colors w-full"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/auth/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-3 rounded-lg font-body text-sm font-medium text-primary-maroon hover:bg-primary-maroon/5 transition-colors"
                    >
                      Login
                    </Link>
                    <Link
                      to="/auth/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-3 rounded-lg font-body text-sm font-medium bg-primary-maroon text-white hover:bg-primary-maroon-dark transition-colors text-center"
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar