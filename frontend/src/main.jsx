// frontend/src/main.jsx - CORRECT PROVIDER ORDER
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from './App'
import './styles/index.css'
import './styles/fonts.css'
import { LanguageProvider } from './context/LanguageContext'
import { AuthProvider } from './context/AuthContext'  // ✅ AuthProvider FIRST
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <LanguageProvider>
          <AuthProvider>  {/* ✅ AuthProvider MUST be BEFORE CartProvider */}
            <CartProvider>
              <WishlistProvider>
                <App />
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </LanguageProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
)