// frontend/src/services/cartService.js - FIXED
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 
    'Content-Type': 'application/json',
  },
  withCredentials: true,
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
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
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

const cartService = {
  getCart: async () => {
    try {
      const response = await api.get('/cart');
      return response.data?.data || { items: [], subtotal: 0, total: 0, count: 0 };
    } catch (error) {
      console.error('❌ Get cart error:', error);
      throw error.response?.data || { message: 'Failed to fetch cart' };
    }
  },

  // ✅ FIX: Ensure proper data is sent
  addToCart: async (variantId, quantity = 1) => {
    try {
      console.log(`➕ Adding to cart: variantId=${variantId}, quantity=${quantity}`);
      
      if (!variantId) {
        console.error('❌ Variant ID is required');
        throw new Error('Variant ID is required');
      }
      
      // Ensure quantity is a number
      const qty = parseInt(quantity) || 1;
      
      // ✅ FIX: Send ONLY variantId and quantity
      const payload = { 
        variantId: variantId, 
        quantity: qty 
      };
      
      console.log('📦 Cart payload:', payload);
      
      const response = await api.post('/cart', payload);
      console.log('✅ Cart response:', response.data);
      
      return response.data?.data || response.data || null;
    } catch (error) {
      console.error('❌ Add to cart error:', error);
      console.error('❌ Error details:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Failed to add to cart' };
    }
  },

  updateQuantity: async (itemId, quantity) => {
    try {
      const response = await api.put(`/cart/${itemId}`, { quantity });
      return response.data?.data || response.data || null;
    } catch (error) {
      console.error('❌ Update quantity error:', error);
      throw error.response?.data || { message: 'Failed to update quantity' };
    }
  },

  removeFromCart: async (itemId) => {
    try {
      const response = await api.delete(`/cart/${itemId}`);
      return response.data?.data || response.data || null;
    } catch (error) {
      console.error('❌ Remove from cart error:', error);
      throw error.response?.data || { message: 'Failed to remove from cart' };
    }
  },

  clearCart: async () => {
    try {
      const response = await api.delete('/cart');
      return response.data || { success: true };
    } catch (error) {
      console.error('❌ Clear cart error:', error);
      throw error.response?.data || { message: 'Failed to clear cart' };
    }
  },
};

export default cartService;