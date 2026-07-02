// frontend/src/context/WishlistContext.jsx - FINAL FIXED
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import wishlistService from '../services/wishlistService';
import toast from 'react-hot-toast';
import { AuthContext } from './AuthContext';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const authContext = useContext(AuthContext);

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    // ✅ Check authContext.isAuthenticated directly
    if (!authContext?.isAuthenticated) {
      console.log('❌ Not authenticated, skipping wishlist fetch');
      setWishlist([]);
      return [];
    }
    
    setLoading(true);
    try {
      console.log('✅ Fetching wishlist...');
      const data = await wishlistService.getWishlist();
      console.log('Wishlist data:', data);
      setWishlist(Array.isArray(data) ? data : []);
      return data;
    } catch (error) {
      console.error('Fetch wishlist error:', error);
      setWishlist([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, [authContext?.isAuthenticated]);

  const isInWishlist = useCallback((productId) => {
    if (!productId || !authContext?.isAuthenticated) return false;
    return wishlist.some(item => {
      const id = item.productId?._id || item.productId;
      return id === productId;
    });
  }, [authContext?.isAuthenticated, wishlist]);

  const toggleWishlist = useCallback(async (product) => {
    if (!authContext?.isAuthenticated) {
      toast.error('Please login to manage wishlist');
      return;
    }
    
    if (!product) return;
    
    const productId = product._id || product.id;
    if (!productId) {
      toast.error('Invalid product');
      return;
    }

    const inList = isInWishlist(productId);
    
    try {
      if (inList) {
        const item = wishlist.find(item => {
          const id = item.productId?._id || item.productId;
          return id === productId;
        });
        
        if (item && item._id) {
          console.log('Removing from wishlist:', item._id);
          await wishlistService.removeFromWishlist(item._id);
          toast.success('Removed from wishlist');
        } else {
          toast.error('Item not found in wishlist');
        }
      } else {
        console.log('Adding to wishlist:', productId);
        await wishlistService.addToWishlist(productId);
        toast.success('Added to wishlist');
      }
      await fetchWishlist();
    } catch (error) {
      console.error('Toggle wishlist error:', error);
      toast.error(error.message || 'Failed to update wishlist');
    }
  }, [authContext?.isAuthenticated, isInWishlist, wishlist, fetchWishlist]);

  const removeFromWishlist = useCallback(async (id) => {
    if (!authContext?.isAuthenticated) return false;
    try {
      console.log('Removing from wishlist by ID:', id);
      await wishlistService.removeFromWishlist(id);
      await fetchWishlist();
      toast.success('Removed from wishlist');
      return true;
    } catch (error) {
      console.error('Remove from wishlist error:', error);
      toast.error(error.message || 'Failed to remove from wishlist');
      return false;
    }
  }, [authContext?.isAuthenticated, fetchWishlist]);

  const clearWishlist = useCallback(async () => {
    if (!authContext?.isAuthenticated) return false;
    try {
      await wishlistService.clearWishlist();
      await fetchWishlist();
      toast.success('Wishlist cleared');
      return true;
    } catch (error) {
      console.error('Clear wishlist error:', error);
      toast.error(error.message || 'Failed to clear wishlist');
      return false;
    }
  }, [authContext?.isAuthenticated, fetchWishlist]);

  // ✅ This effect runs whenever authContext.isAuthenticated changes
  useEffect(() => {
    console.log('🔍 WishlistContext - isAuthenticated changed:', authContext?.isAuthenticated);
    if (authContext?.isAuthenticated) {
      fetchWishlist();
    } else {
      setWishlist([]);
    }
  }, [authContext?.isAuthenticated, fetchWishlist]);

  const value = {
    wishlist,
    loading,
    fetchWishlist,
    isInWishlist,
    toggleWishlist,
    removeFromWishlist,
    clearWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistContext;