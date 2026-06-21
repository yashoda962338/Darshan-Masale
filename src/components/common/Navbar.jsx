import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Menu, X, ShoppingBag, Heart, Globe, Search, ChevronDown 
} from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import { useCart } from '../../context/CartContext'
import navigationData from '../../data/navigation.json'
import LanguageToggle from './LanguageToggle'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const location = useLocation()
  const { language, translate } = useLanguage()
  const { getTotalItems } = useCart()
  const searchRef = useRef(null)

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
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const navItems = navigationData[language] || navigationData.en

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-glass shadow-lg backdrop-blur-xl border-b border-secondary-gold/10'
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

            {/* Wishlist */}
            <Link to="/wishlist" className="p-2 rounded-full hover:bg-primary-maroon/5 transition-colors relative">
              <Heart className="w-5 h-5 text-text-dark-light" />
            </Link>

            {/* Cart */}
            <Link to="/cart" className="p-2 rounded-full hover:bg-primary-maroon/5 transition-colors relative">
              <ShoppingBag className="w-5 h-5 text-text-dark-light" />
              {getTotalItems() > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-primary-maroon text-background-cream text-xs font-button font-bold rounded-full flex items-center justify-center"
                >
                  {getTotalItems()}
                </motion.span>
              )}
            </Link>

            {/* Language Toggle */}
            <LanguageToggle />

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
              className="absolute top-full left-0 right-0 bg-glass backdrop-blur-xl border-b border-secondary-gold/10 p-4 shadow-lg"
            >
              <div className="container-custom">
                <div className="relative max-w-2xl mx-auto">
                  <input
                    type="text"
                    placeholder={translate('common.search')}
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
            className="lg:hidden bg-glass backdrop-blur-xl border-b border-secondary-gold/10 overflow-hidden"
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar