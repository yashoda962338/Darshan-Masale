// src/context/CartContext.jsx - Updated with weight support
import React, { createContext, useState, useContext, useEffect } from 'react'
import toast from 'react-hot-toast'

const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart')
    return saved ? JSON.parse(saved) : []
  })
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('wishlist')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist))
  }, [wishlist])

  const addToCart = (product, quantity = 1, weight = null) => {
    const existingItem = cart.find(
      item => item.id === product.id && item.weight === weight
    )
    
    const productName = product.name || product.nameMr || 'Product'
    const weightLabel = weight ? ` (${weight})` : ''
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id && item.weight === weight
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ))
      toast.success(`${productName}${weightLabel} updated in cart`)
    } else {
      setCart([...cart, { 
        ...product, 
        quantity, 
        weight,
        // Store the price at time of adding
        addedPrice: product.discountedPrice || product.price || 0
      }])
      toast.success(`${productName}${weightLabel} added to cart`)
    }
  }

  const removeFromCart = (productId, weight = null) => {
    const item = cart.find(item => item.id === productId && item.weight === weight)
    setCart(cart.filter(item =>
      !(item.id === productId && item.weight === weight)
    ))
    if (item) {
      const productName = item.name || item.nameMr || 'Product'
      const weightLabel = weight ? ` (${weight})` : ''
      toast.success(`${productName}${weightLabel} removed from cart`)
    }
  }

  const updateQuantity = (productId, quantity, weight = null) => {
    if (quantity <= 0) {
      removeFromCart(productId, weight)
      return
    }
    setCart(cart.map(item =>
      item.id === productId && item.weight === weight
        ? { ...item, quantity }
        : item
    ))
  }

  const clearCart = () => {
    setCart([])
    toast.success('Cart cleared')
  }

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      const price = item.addedPrice || item.discountedPrice || item.price || 0
      return total + price * item.quantity
    }, 0)
  }

  const toggleWishlist = (product) => {
    const exists = wishlist.some(item => item.id === product.id)
    const productName = product.name || product.nameMr || 'Product'
    if (exists) {
      setWishlist(wishlist.filter(item => item.id !== product.id))
      toast.success(`${productName} removed from wishlist`)
    } else {
      setWishlist([...wishlist, product])
      toast.success(`${productName} added to wishlist`)
    }
  }

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId)
  }

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  return (
    <CartContext.Provider value={{
      cart,
      wishlist,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalItems,
      getTotalPrice,
      toggleWishlist,
      isInWishlist,
      getCartItemCount,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}