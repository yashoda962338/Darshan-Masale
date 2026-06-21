import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { 
  Star, ShoppingBag, Heart, Share2, Minus, Plus, 
  Check, Scale, Leaf, Shield, Package 
} from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { useCart } from '../context/CartContext'
import toast from 'react-hot-toast'
import productsData from '../data/products.json'

const ProductDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { language } = useLanguage()
  const { addToCart, toggleWishlist, isInWishlist } = useCart()
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedWeight, setSelectedWeight] = useState(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const found = productsData.find(p => p.id === parseInt(id))
    if (found) {
      setProduct(found)
      setSelectedWeight(found.weightOptions?.[0] || null)
    }
    setLoading(false)
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-heading text-primary-maroon">Product not found</h2>
          <button onClick={() => navigate('/shop')} className="btn-primary mt-4">
            Back to Shop
          </button>
        </div>
      </div>
    )
  }

  const name = language === 'mr' ? product.nameMr : product.name
  const description = language === 'mr' ? product.descriptionMr : product.description
  const price = selectedWeight?.price || product.discountedPrice || product.price
  const originalPrice = selectedWeight ? null : product.price

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedWeight?.label || product.weight)
  }

  return (
    <>
      <Helmet>
        <title>{name} - Darshan Masale</title>
        <meta name="description" content={description} />
      </Helmet>

      <section className="section-padding bg-background-cream">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-background-cream-light">
                <img
                  src={product.images?.[selectedImage] || product.image}
                  alt={name}
                  className="w-full h-full object-cover"
                />
                {product.discountedPrice && (
                  <span className="absolute top-4 left-4 bg-accent-orange text-white text-xs font-button font-bold px-4 py-2 rounded-full">
                    SALE
                  </span>
                )}
                <button
                  onClick={() => toggleWishlist(product)}
                  className="absolute top-4 right-4 p-3 rounded-full bg-glass hover:bg-primary-maroon text-text-dark hover:text-background-cream transition-colors"
                >
                  <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-primary-maroon text-primary-maroon' : ''}`} />
                </button>
              </div>

              {/* Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                  {product.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImage === index ? 'border-primary-maroon' : 'border-transparent'
                      }`}
                    >
                      <img src={img} alt={`${name} ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-button tracking-widest uppercase text-secondary-gold">
                    {language === 'mr' ? product.categoryMr : product.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-secondary-gold text-secondary-gold" />
                    <span className="text-sm font-medium">{product.rating}</span>
                    <span className="text-xs text-text-muted">({product.reviews} reviews)</span>
                  </div>
                </div>
                <h1 className="heading-section text-primary-maroon mt-2">{name}</h1>
                <p className="body-text mt-4">{description}</p>
              </div>

              {/* Price */}
              <div className="flex items-end gap-3">
                <span className="text-4xl font-heading font-bold text-primary-maroon">₹{price}</span>
                {originalPrice && originalPrice !== price && (
                  <span className="text-xl text-text-muted line-through">₹{originalPrice}</span>
                )}
                {selectedWeight && <span className="text-sm text-text-muted">/ {selectedWeight.label}</span>}
              </div>

              {/* Weight Options */}
              {product.weightOptions && product.weightOptions.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-text-dark">Select Weight</p>
                  <div className="flex flex-wrap gap-2">
                    {product.weightOptions.map((weight, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedWeight(weight)}
                        className={`px-5 py-2 rounded-full border text-sm font-button transition-colors ${
                          selectedWeight === weight
                            ? 'bg-primary-maroon text-background-cream border-primary-maroon'
                            : 'border-secondary-gold/30 text-text-dark hover:border-primary-maroon'
                        }`}
                      >
                        {weight.label} - ₹{weight.price}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="flex items-center gap-4">
                <p className="text-sm font-medium text-text-dark">Qty</p>
                <div className="flex items-center border border-secondary-gold/20 rounded-full overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 px-4 hover:bg-primary-maroon/5 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 px-4 hover:bg-primary-maroon/5 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className={`flex-1 px-8 py-3 rounded-full font-button font-medium text-sm tracking-wider transition-colors flex items-center justify-center gap-2 ${
                    product.inStock
                      ? 'bg-primary-maroon text-background-cream hover:bg-primary-maroon-dark'
                      : 'bg-text-muted/20 text-text-muted cursor-not-allowed'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
                <button
                  onClick={() => toast.success('Added to wishlist!')}
                  className="px-8 py-3 rounded-full border border-secondary-gold/20 hover:bg-primary-maroon hover:text-background-cream transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-secondary-gold/10">
                <div className="flex items-center gap-2 text-sm text-text-dark-light">
                  <Check className="w-4 h-4 text-secondary-gold" />
                  <span>100% Pure</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-text-dark-light">
                  <Scale className="w-4 h-4 text-secondary-gold" />
                  <span>Premium Quality</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-text-dark-light">
                  <Leaf className="w-4 h-4 text-secondary-gold" />
                  <span>No Additives</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-text-dark-light">
                  <Shield className="w-4 h-4 text-secondary-gold" />
                  <span>Quality Tested</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 pt-2">
                {product.tags?.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-primary-maroon/5 text-primary-maroon text-xs rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Related Products would go here */}
        </div>
      </section>
    </>
  )
}

export default ProductDetails