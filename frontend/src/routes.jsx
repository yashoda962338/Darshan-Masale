import { createBrowserRouter } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Categories from './pages/Categories'
import ProductDetails from './pages/ProductDetails'
import About from './pages/About'
import Process from './pages/Process'
import Gallery from './pages/Gallery'
import Contact from './pages/Contact'
import Wishlist from './pages/Wishlist'
import Cart from './pages/Cart'
import PrivacyPolicy from './pages/PrivacyPolicy'
import Terms from './pages/Terms'
import NotFound from './pages/NotFound'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'shop', element: <Shop /> },
      { path: 'categories', element: <Categories /> },
      { path: 'product/:slug', element: <ProductDetails /> },
      { path: 'about', element: <About /> },
      { path: 'process', element: <Process /> },
      { path: 'gallery', element: <Gallery /> },
      { path: 'contact', element: <Contact /> },
      { path: 'wishlist', element: <Wishlist /> },
      { path: 'cart', element: <Cart /> },
      { path: 'privacy-policy', element: <PrivacyPolicy /> },
      { path: 'terms', element: <Terms /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])