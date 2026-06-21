// src/App.jsx - Remove Recipes import and route
import React, { useEffect, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import MainLayout from './layouts/MainLayout'
import Loader from './components/common/Loader'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Categories from './pages/Categories'
import Process from './pages/Process'
import ProductDetails from './pages/ProductDetails'
import About from './pages/About'
// import Recipes from './pages/Recipes'  // REMOVED
import Gallery from './pages/Gallery'
import Contact from './pages/Contact'
import Wishlist from './pages/Wishlist'
import Cart from './pages/Cart'
import PrivacyPolicy from './pages/PrivacyPolicy'
import Terms from './pages/Terms'
import NotFound from './pages/NotFound'

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
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="shop" element={<Shop />} />
            <Route path="categories" element={<Categories />} />
            <Route path="process" element={<Process />} />
            <Route path="product/:id" element={<ProductDetails />} />
            <Route path="about" element={<About />} />
            {/* <Route path="recipes" element={<Recipes />} />  // REMOVED */}
            <Route path="gallery" element={<Gallery />} />
            <Route path="contact" element={<Contact />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="cart" element={<Cart />} />
            <Route path="privacy-policy" element={<PrivacyPolicy />} />
            <Route path="terms" element={<Terms />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </AnimatePresence>
    </>
  )
}

export default App