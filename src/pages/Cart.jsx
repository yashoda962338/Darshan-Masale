import React from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { useCart } from '../context/CartContext'
import { config } from '../config'

const Cart = () => {
  const { language } = useLanguage()
  const { cart, removeFromCart, updateQuantity, getTotalPrice, getTotalItems, clearCart } = useCart()
  const totalPrice = getTotalPrice()
  const totalItems = getTotalItems()
  const freeShipping = totalPrice >= config.shipping.freeShippingThreshold

  return (
    <>
      <Helmet>
        <title>Cart - Darshan Masale</title>
        <meta name="description" content="Your shopping cart at Darshan Masale." />
      </Helmet>

      <section className="section-padding bg-background-cream">
        <div className="container-custom">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="heading-section text-primary-maroon">
                {language === 'mr' ? 'खरेदी कार्ट' : 'Shopping Cart'}
              </h1>
              <p className="subheading mt-1">
                {totalItems} {language === 'mr' ? 'वस्तू' : 'items'} in your cart
              </p>
            </div>
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-sm text-text-muted hover:text-primary-maroon transition-colors"
              >
                {language === 'mr' ? 'सर्व काढा' : 'Clear All'}
              </button>
            )}
          </div>

          {cart.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <ShoppingBag className="w-16 h-16 text-text-muted/30 mx-auto" />
              <h3 className="font-heading text-xl text-primary-maroon mt-4">
                {language === 'mr' ? 'कार्ट रिक्त आहे' : 'Your cart is empty'}
              </h3>
              <p className="text-text-muted mt-2">
                {language === 'mr' ? 'आमचे उत्तम मसाले पहा' : 'Explore our premium spices'}
              </p>
              <Link to="/shop" className="btn-primary inline-block mt-6">
                {language === 'mr' ? 'खरेदी सुरू करा' : 'Start Shopping'}
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cart.map((item, index) => {
                  const itemPrice = item.discountedPrice || item.price
                  const name = language === 'mr' ? item.nameMr : item.name
                  return (
                    <motion.div
                      key={`${item.id}-${item.weight}`}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="card-premium p-4 flex gap-4"
                    >
                      <img
                        src={item.image || '/images/placeholder.jpg'}
                        alt={name}
                        className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-heading font-semibold text-primary-maroon text-sm">{name}</h4>
                            {item.weight && (
                              <span className="text-xs text-text-muted">{item.weight}</span>
                            )}
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id, item.weight)}
                            className="p-1 text-text-muted hover:text-primary-maroon transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-secondary-gold/20 rounded-full overflow-hidden">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1, item.weight)}
                              className="p-1.5 px-3 hover:bg-primary-maroon/5 transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1, item.weight)}
                              className="p-1.5 px-3 hover:bg-primary-maroon/5 transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="font-bold text-primary-maroon">₹{(itemPrice * item.quantity).toFixed(0)}</span>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              {/* Order Summary */}
              <div>
                <div className="card-premium p-6 sticky top-24">
                  <h3 className="font-heading text-xl font-semibold text-primary-maroon">
                    {language === 'mr' ? 'ऑर्डर सारांश' : 'Order Summary'}
                  </h3>
                  <div className="space-y-3 mt-4 border-t border-secondary-gold/10 pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-text-muted">Subtotal ({totalItems} items)</span>
                      <span className="font-medium">₹{totalPrice.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-text-muted">Shipping</span>
                      <span className="font-medium">
                        {freeShipping ? 'FREE' : `₹${config.shipping.standardCost}`}
                      </span>
                    </div>
                    {!freeShipping && totalPrice > 0 && (
                      <div className="flex justify-between text-xs text-text-muted">
                        <span>Add ₹{config.shipping.freeShippingThreshold - totalPrice} more for free shipping</span>
                        <div className="w-24 h-1 bg-background-cream rounded-full overflow-hidden">
                          <div
                            className="h-full bg-secondary-gold rounded-full transition-all"
                            style={{ width: `${(totalPrice / config.shipping.freeShippingThreshold) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                    <div className="border-t border-secondary-gold/10 pt-3 flex justify-between">
                      <span className="font-heading text-lg font-semibold text-primary-maroon">Total</span>
                      <span className="font-heading text-2xl font-bold text-primary-maroon">
                        ₹{(totalPrice + (freeShipping ? 0 : config.shipping.standardCost)).toFixed(0)}
                      </span>
                    </div>
                  </div>
                  <button className="w-full mt-6 btn-gold flex items-center justify-center gap-2">
                    <span>{language === 'mr' ? 'चेकआउट करा' : 'Proceed to Checkout'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <Link to="/shop" className="block text-center text-sm text-text-muted hover:text-primary-maroon transition-colors mt-3">
                    {language === 'mr' ? 'खरेदी सुरू ठेवा' : 'Continue Shopping'}
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default Cart