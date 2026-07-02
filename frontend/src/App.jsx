// 🔵 FRONTEND: src/App.jsx - FIXED (Remove AuthProvider & WishlistProvider)
console.log('🔍 localStorage token:', localStorage.getItem('token'));
console.log('🔍 localStorage role:', localStorage.getItem('role'));

import React, { useEffect, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import MainLayout from './layouts/MainLayout'
import CustomerLayout from './layouts/CustomerLayout'
import AdminLayout from './layouts/AdminLayout'
import Loader from './components/common/Loader'
// ❌ REMOVE THESE - Already in main.jsx
// import { AuthProvider } from './context/AuthContext'
// import { WishlistProvider } from './context/WishlistContext'
import RoleProtectedRoute from './components/common/RoleProtectedRoute'

// ============================================
// PUBLIC PAGES
// ============================================
import Home from './pages/Home'
import Shop from './pages/Shop'
import Categories from './pages/Categories'
import Process from './pages/Process'
import ProductDetails from './pages/ProductDetails'
import About from './pages/About'
import Gallery from './pages/Gallery'
import Contact from './pages/Contact'
import Wishlist from './pages/Wishlist'
import Cart from './pages/Cart'
import Checkout from "./pages/Checkout";
import PrivacyPolicy from './pages/PrivacyPolicy'
import Terms from './pages/Terms'
import NotFound from './pages/NotFound'
import Forbidden from './pages/Forbidden'
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailed from "./pages/PaymentFailed";

// ============================================
// AUTH PAGES
// ============================================
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import VerifyRegistrationOTP from './pages/auth/VerifyRegistrationOTP'
import ForgotPassword from './pages/auth/ForgotPassword'
import VerifyForgotPasswordOTP from './pages/auth/VerifyForgotPasswordOTP'
import ResetPassword from './pages/auth/ResetPassword'

// ============================================
// CUSTOMER PAGES
// ============================================
import CustomerDashboard from './pages/customer/Dashboard'
import CustomerOrders from './pages/customer/Orders'
import CustomerOrderDetails from './pages/customer/OrderDetails';
import CustomerWishlist from './pages/customer/Wishlist'
import CustomerAddresses from './pages/customer/Addresses'
import CustomerProfile from './pages/customer/Profile'
import CustomerSettings from './pages/customer/Settings'

// ============================================
// ADMIN PAGES
// ============================================
import AdminDashboard from './pages/admin/Dashboard'
import AdminProducts from './pages/admin/Products'
import AdminAddProduct from './pages/admin/AddProduct'
import AdminEditProduct from './pages/admin/EditProduct'
import AdminCategories from './pages/admin/Categories'
import AdminOrders from './pages/admin/Orders'
import AdminOrderDetails from './pages/admin/OrderDetails'
import AdminCustomers from './pages/admin/Customers'
import AdminCustomerDetails from './pages/admin/CustomerDetails'
import AdminGallery from './pages/admin/Gallery'
import AdminHeroBanners from './pages/admin/HeroBanners'
import AdminReviews from './pages/admin/Reviews'
import AdminCoupons from './pages/admin/Coupons'
import AdminReports from './pages/admin/Reports'
import AdminAnalytics from './pages/admin/Analytics'
import AdminSettings from './pages/admin/Settings'
import AdminUsers from './pages/admin/Users'

function App() {
  const [loading, setLoading] = useState(true)
  const location = useLocation()

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <Loader />
  }

  // ✅ REMOVED AuthProvider and WishlistProvider from here
  // They are already in main.jsx
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#7B1F2B',
            color: '#FDF8F0',
            fontFamily: 'Poppins, sans-serif',
          },
        }}
      />
      
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          
          {/* ============================================ */}
          {/* PUBLIC ROUTES - MainLayout */}
          {/* ============================================ */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="shop" element={<Shop />} />
            <Route path="categories" element={<Categories />} />
            <Route path="process" element={<Process />} />
            <Route path="product/:slug" element={<ProductDetails />} />
            <Route path="about" element={<About />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="contact" element={<Contact />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-failed" element={<PaymentFailed />}/>
            <Route path="privacy-policy" element={<PrivacyPolicy />} />
            <Route path="terms" element={<Terms />} />

          </Route>

          {/* ============================================ */}
          {/* AUTH ROUTES - No Layout */}
          {/* ============================================ */}
          <Route path="auth/login" element={<Login />} />
          <Route path="auth/register" element={<Register />} />
          <Route path="auth/verify-registration-otp" element={<VerifyRegistrationOTP />} />
          <Route path="auth/forgot-password" element={<ForgotPassword />} />
          <Route path="auth/verify-forgot-password-otp" element={<VerifyForgotPasswordOTP />} />
          <Route path="auth/reset-password" element={<ResetPassword />} />

          {/* ============================================ */}
          {/* CUSTOMER ROUTES - Protected */}
          {/* ============================================ */}
          <Route 
            path="customer" 
            element={
              <RoleProtectedRoute allowedRoles={['CUSTOMER']}>
                <CustomerLayout />
              </RoleProtectedRoute>
            }
          >
            <Route path="dashboard" element={<CustomerDashboard />} />
            <Route path="orders" element={<CustomerOrders />} />
            <Route path="orders/:id" element={<CustomerOrderDetails />} />
            <Route path="wishlist" element={<CustomerWishlist />} />
            <Route path="addresses" element={<CustomerAddresses />} />
            <Route path="profile" element={<CustomerProfile />} />
            <Route path="settings" element={<CustomerSettings />} />
          </Route>

          {/* ============================================ */}
          {/* ADMIN ROUTES - Protected */}
          {/* ============================================ */}
          <Route 
            path="admin" 
            element={
              <RoleProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'SUPPORT']}>
                <AdminLayout />
              </RoleProtectedRoute>
            }
          >
            {/* Dashboard */}
            <Route path="dashboard" element={<AdminDashboard />} />
            
            {/* Products */}
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/add" element={<AdminAddProduct />} />
            <Route path="products/edit/:id" element={<AdminEditProduct />} />
            
            {/* Categories */}
            <Route path="categories" element={<AdminCategories />} />
            
            {/* Orders */}
            <Route path="orders" element={<AdminOrders />} />
            <Route path="orders/:id" element={<AdminOrderDetails />} />
            
            {/* Customers */}
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="customers/:id" element={<AdminCustomerDetails />} />
            
            {/* Gallery & Banners */}
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="banners" element={<AdminHeroBanners />} />
            
            {/* Reviews & Coupons */}
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="coupons" element={<AdminCoupons />} />
            
            {/* Reports & Analytics */}
            <Route path="reports" element={<AdminReports />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            
            {/* Settings & Users */}
            <Route path="settings" element={<AdminSettings />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>

          {/* ============================================ */}
          {/* ERROR PAGES */}
          {/* ============================================ */}
          <Route path="/403" element={<Forbidden />} />
          <Route path="*" element={<NotFound />} />
          
        </Routes>
      </AnimatePresence>
    </>
  )
}

export default App