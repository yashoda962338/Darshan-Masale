// frontend/src/pages/Wishlist.jsx - FIXED
import React from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, ShoppingBag, Trash2 } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { useWishlist } from '../context/WishlistContext'  // ✅ CORRECT
import ProductCard from '../components/ui/ProductCard'  // ✅ CORRECT PATH

const Wishlist = () => {
  const { language } = useLanguage()
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist()  // ✅ CORRECT

  return (
    <>
      <Helmet>
        <title>Wishlist - Darshan Masale</title>
        <meta name="description" content="Your saved favorite spices at Darshan Masale." />
      </Helmet>

      <section className="section-padding bg-background-cream">
        <div className="container-custom">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="heading-section text-primary-maroon">
                {language === 'mr' ? 'इच्छासूची' : 'Wishlist'}
              </h1>
              <p className="subheading mt-2">
                {language === 'mr' ? 'तुमचे आवडते मसाले' : 'Your favorite spices'}
              </p>
            </div>
            {wishlist.length > 0 && (
              <button
                onClick={clearWishlist}
                className="text-sm text-text-muted hover:text-primary-maroon transition-colors"
              >
                {language === 'mr' ? 'सर्व काढा' : 'Clear All'}
              </button>
            )}
          </div>

          {wishlist.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <Heart className="w-16 h-16 text-text-muted/30 mx-auto" />
              <h3 className="font-heading text-xl text-primary-maroon mt-4">
                {language === 'mr' ? 'इच्छासूची रिक्त आहे' : 'Wishlist is empty'}
              </h3>
              <p className="text-text-muted mt-2">
                {language === 'mr' ? 'तुमचे आवडते मसाले येथे जतन करा' : 'Save your favorite spices here'}
              </p>
              <Link to="/shop" className="btn-primary inline-block mt-6">
                {language === 'mr' ? 'खरेदी सुरू करा' : 'Start Shopping'}
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
              {wishlist.map((item, index) => {
                const product = item.productId || item;
                return (
                  <div key={item._id || index} className="relative group">
                    <ProductCard product={product} />
                    <button
                      onClick={() => removeFromWishlist(item._id)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-red-500 hover:text-white transition-colors shadow-md"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default Wishlist