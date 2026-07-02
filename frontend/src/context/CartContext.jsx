// frontend/src/context/CartContext.jsx - FINAL FIXED
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import cartService from '../services/cartService';
import toast from 'react-hot-toast';
import { AuthContext } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const authContext = useContext(AuthContext);
  
  const [cart, setCart] = useState({ items: [], subtotal: 0, total: 0, count: 0 });
  const [loading, setLoading] = useState(false);

  const getTotalItems = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => total + (item.quantity || 0), 0);
  };

  const getTotalPrice = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => total + (item.price || 0) * (item.quantity || 0), 0);
  };

  // ✅ Use useCallback to memoize fetchCart
  const fetchCart = useCallback(async () => {
    // ✅ Check authContext.isAuthenticated directly (not local variable)
    if (!authContext?.isAuthenticated) {
      console.log('❌ Not authenticated, skipping cart fetch');
      setCart({ items: [], subtotal: 0, total: 0, count: 0 });
      return;
    }
    
    setLoading(true);
    try {
      console.log('✅ Fetching cart...');
      const data = await cartService.getCart();
      setCart(data);
      return data;
    } catch (error) {
      console.error('❌ Fetch cart error:', error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [authContext?.isAuthenticated]); // ✅ Dependency on authContext

  const addToCart = useCallback(async (variantId, quantity = 1) => {
    // ✅ Check authContext.isAuthenticated directly
    if (!authContext?.isAuthenticated) {
      toast.error('Please login to add items to cart');
      return null;
    }
    
    try {
      if (!variantId) {
        toast.error('Invalid product variant');
        return null;
      }
      const qty = parseInt(quantity) || 1;
      const result = await cartService.addToCart(variantId, qty);
      if (result) {
        await fetchCart();
        toast.success('Added to cart!');
        return result;
      }
      return null;
    } catch (error) {
      toast.error(error.message || 'Failed to add to cart');
      return null;
    }
  }, [authContext?.isAuthenticated, fetchCart]);

  const updateQuantity = useCallback(async (itemId, quantity) => {
    if (!authContext?.isAuthenticated) return null;
    try {
      if (quantity <= 0) {
        return await removeFromCart(itemId);
      }
      const result = await cartService.updateQuantity(itemId, quantity);
      if (result) {
        await fetchCart();
        return result;
      }
      return null;
    } catch (error) {
      toast.error(error.message || 'Failed to update quantity');
      return null;
    }
  }, [authContext?.isAuthenticated, fetchCart]);

  const removeFromCart = useCallback(async (itemId) => {
    if (!authContext?.isAuthenticated) return null;
    try {
      const result = await cartService.removeFromCart(itemId);
      if (result) {
        await fetchCart();
        toast.success('Item removed from cart');
        return result;
      }
      return null;
    } catch (error) {
      toast.error(error.message || 'Failed to remove item');
      return null;
    }
  }, [authContext?.isAuthenticated, fetchCart]);

  const clearCart = useCallback(async () => {
    if (!authContext?.isAuthenticated) return null;
    try {
      const result = await cartService.clearCart();
      if (result) {
        await fetchCart();
        toast.success('Cart cleared');
        return result;
      }
      return null;
    } catch (error) {
      toast.error(error.message || 'Failed to clear cart');
      return null;
    }
  }, [authContext?.isAuthenticated, fetchCart]);

  // ✅ This effect runs whenever authContext.isAuthenticated changes
  useEffect(() => {
    console.log('🔍 CartContext - isAuthenticated changed:', authContext?.isAuthenticated);
    if (authContext?.isAuthenticated) {
      fetchCart();
    } else {
      setCart({ items: [], subtotal: 0, total: 0, count: 0 });
    }
  }, [authContext?.isAuthenticated, fetchCart]); // ✅ fetchCart is now a dependency

  const value = {
    cart,
    loading,
    getTotalItems,
    getTotalPrice,
    fetchCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;