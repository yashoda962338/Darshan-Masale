// frontend/src/services/productService.js - FIXED
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const productService = {
  getProducts: async (params = {}) => {
    try {
      const response = await api.get('/products', { params });
      const payload = response.data?.data ?? response.data;
      console.log('PRODUCT SERVICE getProducts response:', payload);
      if (Array.isArray(payload)) {
        return {
          products: payload,
          pagination: {
            page: 1,
            limit: payload.length,
            total: payload.length,
            pages: 1,
          },
        };
      }
      return payload;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch products' };
    }
  },

  getFeaturedProducts: async () => {
    try {
      const response = await api.get('/products/featured');
      const payload = response.data?.data ?? response.data;
      console.log('PRODUCT SERVICE getFeaturedProducts response:', payload);
      return Array.isArray(payload) ? payload : payload || [];
    } catch (error) {
      console.error('Featured products error:', error);
      return [];
    }
  },

  getBestSellers: async () => {
    try {
      const response = await api.get('/products/bestsellers');
      const payload = response.data?.data ?? response.data;
      console.log('PRODUCT SERVICE getBestSellers response:', payload);
      return Array.isArray(payload) ? payload : payload || [];
    } catch (error) {
      console.error('Best sellers error:', error);
      return [];
    }
  },

  // ✅ FIX: getProductBySlug - ensure correct URL and response handling
  getProductBySlug: async (slug) => {
    try {
      if (!slug) {
        console.error('❌ No slug provided');
        throw new Error('Product slug is required');
      }
      
      console.log(`🔍 Fetching product by slug: ${slug}`);
      const response = await api.get(`/products/${slug}`);
      console.log('📦 Product response:', response.data);
      
      const payload = response.data?.data ?? response.data;
      console.log('✅ Product data:', payload);
      
      if (!payload) {
        throw new Error('Product not found');
      }
      
      return payload;
    } catch (error) {
      console.error('❌ Get product by slug error:', error);
      if (error.response?.status === 404) {
        throw new Error('Product not found');
      }
      throw error.response?.data || { message: 'Failed to fetch product' };
    }
  },

  getProductsByCategory: async (category, params = {}) => {
    try {
      const response = await api.get(`/products/category/${encodeURIComponent(category)}`, { params });
      const payload = response.data?.data ?? response.data;
      console.log('PRODUCT SERVICE getProductsByCategory response:', payload);
      return payload;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch products' };
    }
  },

  // Admin APIs
  getAdminProducts: async (params = {}) => {
    try {
      const response = await api.get('/admin/products', { params });
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch products' };
    }
  },

  createProduct: async (data) => {
    try {
      const response = await api.post('/admin/products', data);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create product' };
    }
  },

  updateProduct: async (id, data) => {
    try {
      const response = await api.put(`/admin/products/${id}`, data);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update product' };
    }
  },

  deleteProduct: async (id) => {
    try {
      const response = await api.delete(`/admin/products/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete product' };
    }
  },
};

export default productService;