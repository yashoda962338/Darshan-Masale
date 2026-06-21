// src/components/ui/ProductCard.jsx - Updated with Quick View support
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useLanguage } from '../../context/LanguageContext'
import toast from 'react-hot-toast'

const ProductCard = ({ product, index = 0, showQuickView = true }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useCart()
  const { language } = useLanguage()
  const [isHovered, setIsHovered] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [selectedWeight, setSelectedWeight] = useState(null)
  
  const name = language === 'mr' ? product.nameMr : product.name
  const description = language === 'mr' ? product.descriptionMr : product.description
  
  // Weight handling
  const defaultWeight = product.weightOptions?.[0] || null
  const activeWeight = selectedWeight || defaultWeight
  const displayPrice = activeWeight?.price || product.discountedPrice || product.price || 0
  const originalPrice = product.price || displayPrice
  
  // Calculate discount percentage
  const discountPercent = originalPrice > displayPrice 
    ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100) 
    : 0

  const hasWeightOptions = product.weightOptions && product.weightOptions.length > 0
  const isBestseller = product.tags?.includes('bestseller') || product.bestseller === true

  const handleAddToCart = (e) => {
    e.preventDefault()
    const weightLabel = activeWeight?.label || product.weight || null
    addToCart(product, 1, weightLabel)
  }

  const handleWishlist = (e) => {
    e.preventDefault()
    toggleWishlist(product)
  }

  const handleWeightSelect = (e, weight) => {
    e.preventDefault()
    e.stopPropagation()
    setSelectedWeight(weight)
  }

  const handleQuickView = (e) => {
    e.preventDefault()
    toast.success(`Quick view: ${name}`)
  }

  // Get weight display label
  const getWeightLabel = (weight) => {
    return weight.label.replace('gm', 'g').replace('KG', 'kg')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.05 }}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setSelectedWeight(null)
      }}
    >
      <div className="bg-white rounded-[20px] shadow-soft hover:shadow-elevated transition-all duration-500 hover:-translate-y-1 overflow-hidden relative">
        
        {/* Best Seller Badge */}
        {isBestseller && (
          <div className="absolute top-3 left-3 z-20">
            <div className="bg-gradient-to-r from-secondary-gold to-secondary-gold-dark text-text-dark text-[9px] font-button font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
              <Star className="w-3 h-3 fill-current" />
              BESTSELLER
            </div>
          </div>
        )}

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-3 left-3 z-20">
            <div className="bg-accent-orange text-white text-[9px] font-button font-bold px-3 py-1.5 rounded-full shadow-lg">
              {discountPercent}% OFF
            </div>
          </div>
        )}

        {/* Action Icons - Top Right */}
        <div className="absolute top-3 right-3 z-20 flex flex-col gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleWishlist}
            className="p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:bg-primary-maroon hover:text-white transition-all duration-300"
            aria-label="Add to wishlist"
          >
            <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-primary-maroon text-primary-maroon' : 'text-text-muted'}`} />
          </motion.button>
          {showQuickView && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleQuickView}
              className="p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:bg-primary-maroon hover:text-white transition-all duration-300"
              aria-label="Quick view"
            >
              <Eye className="w-4 h-4 text-text-muted hover:text-white transition-colors" />
            </motion.button>
          )}
        </div>

        {/* Image Container */}
        <Link to={`/product/${product.slug || product.id}`} className="block relative overflow-hidden">
          <div className="w-full aspect-square bg-gradient-to-b from-background-cream to-background-cream-light">
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-r from-background-cream via-background-cream-dark/10 to-background-cream animate-pulse" />
            )}
            <img
              src={product.image || '/assets/images/products/placeholder.jpg'}
              alt={name}
              className={`w-full h-full object-contain p-4 transition-all duration-700 ${
                isHovered ? 'scale-105' : 'scale-100'
              } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImageLoaded(true)}
              loading="lazy"
            />
          </div>

          {/* Weight Selector - Appears on Hover */}
          <AnimatePresence>
            {isHovered && hasWeightOptions && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white/90 to-transparent p-4 pt-8"
              >
                <div className="flex flex-wrap items-center justify-center gap-1.5">
                  {product.weightOptions.map((weight, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => handleWeightSelect(e, weight)}
                      className={`text-[10px] font-button font-medium px-3 py-1.5 rounded-full transition-all ${
                        activeWeight?.label === weight.label
                          ? 'bg-primary-maroon text-white shadow-md'
                          : 'bg-white/80 text-text-dark hover:bg-primary-maroon/10 border border-secondary-gold/20'
                      }`}
                    >
                      {getWeightLabel(weight)}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>

        {/* Product Info */}
        <div className="p-4 space-y-2.5">
          <Link to={`/product/${product.slug || product.id}`} className="block">
            <h3 className="font-heading text-base font-semibold text-primary-maroon group-hover:text-secondary-gold transition-colors line-clamp-1">
              {name}
            </h3>
            <p className="text-[10px] text-text-muted font-body uppercase tracking-wider line-clamp-1">
              {language === 'mr' ? product.categoryMr : product.category}
            </p>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <Star className="w-3.5 h-3.5 fill-secondary-gold text-secondary-gold" />
              <span className="text-sm font-medium text-text-dark ml-1">{product.rating || 4.5}</span>
            </div>
            <span className="text-xs text-text-muted">({product.reviews || 0})</span>
          </div>

          {/* Price Section */}
          <div className="flex items-center gap-3">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-primary-maroon font-heading">
                ₹{displayPrice}
              </span>
              {originalPrice > displayPrice && (
                <span className="text-xs text-text-muted line-through">
                  ₹{originalPrice}
                </span>
              )}
            </div>
          </div>

          {/* Add to Cart Button */}
          <motion.button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`w-full py-2.5 rounded-xl font-button font-medium text-sm tracking-wider transition-all duration-300 flex items-center justify-center gap-2 ${
              product.inStock
                ? 'bg-primary-maroon text-white hover:bg-primary-maroon-dark hover:shadow-lg hover:-translate-y-0.5'
                : 'bg-text-muted/10 text-text-muted cursor-not-allowed'
            }`}
            whileHover={product.inStock ? { scale: 1.02 } : {}}
            whileTap={product.inStock ? { scale: 0.98 } : {}}
          >
            <ShoppingBag className="w-4 h-4" />
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default ProductCard