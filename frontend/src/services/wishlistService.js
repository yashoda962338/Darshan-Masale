// frontend/src/services/wishlistService.js - FIXED
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
    return response;
  },
  (error) => {
    console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url} - ${error.response?.status}`);
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      if (!window.location.pathname.includes('/auth/login')) {
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

const wishlistService = {
  // Get wishlist
  getWishlist: async () => {
    try {
      const response = await api.get('/wishlist');
      const data = response.data?.data || response.data || [];
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Get wishlist error:', error);
      return [];
    }
  },

  // Add to wishlist
  addToWishlist: async (productId, variantId = null) => {
    try {
      if (!productId) {
        throw new Error('Product ID is required');
      }
      const payload = { productId };
      if (variantId) {
        payload.variantId = variantId;
      }
      console.log('Adding to wishlist payload:', payload);
      const response = await api.post('/wishlist', payload);
      return response.data?.data || response.data || null;
    } catch (error) {
      console.error('Add to wishlist error:', error);
      throw error.response?.data || { message: 'Failed to add to wishlist' };
    }
  },

  // Remove from wishlist
  removeFromWishlist: async (id) => {
    try {
      if (!id) {
        throw new Error('Item ID is required');
      }
      console.log('Removing wishlist item:', id);
      const response = await api.delete(`/wishlist/${id}`);
      return response.data || { success: true };
    } catch (error) {
      console.error('Remove from wishlist error:', error);
      throw error.response?.data || { message: 'Failed to remove from wishlist' };
    }
  },

  // Check if product is in wishlist
  isInWishlist: async (productId, variantId = null) => {
    try {
      if (!productId) return { inWishlist: false, itemId: null };
      const response = await api.get(`/wishlist/check/${productId}`, { 
        params: variantId ? { variantId } : {} 
      });
      return response.data?.data || { inWishlist: false, itemId: null };
    } catch (error) {
      console.error('Check wishlist error:', error);
      return { inWishlist: false, itemId: null };
    }
  },

  // Clear wishlist
  clearWishlist: async () => {
    try {
      const response = await api.delete('/wishlist');
      return response.data || { success: true };
    } catch (error) {
      console.error('Clear wishlist error:', error);
      throw error.response?.data || { message: 'Failed to clear wishlist' };
    }
  },

  // Move to cart
  moveToCart: async (id) => {
    try {
      if (!id) {
        throw new Error('Item ID is required');
      }
      const response = await api.post(`/wishlist/${id}/move-to-cart`);
      return response.data || { success: true };
    } catch (error) {
      console.error('Move to cart error:', error);
      throw error.response?.data || { message: 'Failed to move to cart' };
    }
  },
};

export default wishlistService;