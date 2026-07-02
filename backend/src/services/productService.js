// frontend/src/services/productService.js
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
  // ============================================
  // PUBLIC APIs
  // ============================================

  // Get all products with filters
  getProducts: async (params = {}) => {
    try {
      const response = await api.get('/products', { params });
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch products' };
    }
  },

  // Get product by slug
  getProductBySlug: async (slug) => {
    try {
      const response = await api.get(`/products/${slug}`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch product' };
    }
  },

  // Get featured products
  getFeaturedProducts: async () => {
    try {
      const response = await api.get('/products/featured');
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch featured products' };
    }
  },

  // Get best sellers
  getBestSellers: async () => {
    try {
      const response = await api.get('/products/bestsellers');
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch best sellers' };
    }
  },

  // Get products by category
  getProductsByCategory: async (category, params = {}) => {
    try {
      const response = await api.get(`/products/category/${encodeURIComponent(category)}`, { params });
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch products' };
    }
  },

  // ============================================
  // ADMIN APIs
  // ============================================

  // Get all products (Admin)
  getAdminProducts: async (params = {}) => {
    try {
      const response = await api.get('/admin/products', { params });
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch products' };
    }
  },

  // Get product by ID (Admin)
  getAdminProduct: async (id) => {
    try {
      const response = await api.get(`/admin/products/${id}`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch product' };
    }
  },

  // Create product (Admin)
  createProduct: async (data) => {
    try {
      const formData = new FormData();
      
      // Append all fields to FormData
      Object.keys(data).forEach(key => {
        if (key === 'images' && Array.isArray(data[key])) {
          data[key].forEach(file => {
            formData.append('images', file);
          });
        } else if (key === 'tags' && Array.isArray(data[key])) {
          formData.append(key, JSON.stringify(data[key]));
        } else if (key === 'variants' && Array.isArray(data[key])) {
          formData.append(key, JSON.stringify(data[key]));
        } else if (data[key] !== undefined && data[key] !== null) {
          formData.append(key, data[key]);
        }
      });

      const response = await api.post('/admin/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create product' };
    }
  },

  // Update product (Admin)
  updateProduct: async (id, data) => {
    try {
      const formData = new FormData();
      
      Object.keys(data).forEach(key => {
        if (key === 'images' && Array.isArray(data[key])) {
          data[key].forEach(file => {
            if (typeof file === 'string') {
              // Existing image URL
              formData.append('existingImages', file);
            } else {
              // New image file
              formData.append('images', file);
            }
          });
        } else if (key === 'tags' && Array.isArray(data[key])) {
          formData.append(key, JSON.stringify(data[key]));
        } else if (key === 'variants' && Array.isArray(data[key])) {
          formData.append(key, JSON.stringify(data[key]));
        } else if (data[key] !== undefined && data[key] !== null) {
          formData.append(key, data[key]);
        }
      });

      const response = await api.put(`/admin/products/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update product' };
    }
  },

  // Delete product (Admin)
  deleteProduct: async (id) => {
    try {
      const response = await api.delete(`/admin/products/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete product' };
    }
  },

  // Update product status (Admin)
  updateProductStatus: async (id, status) => {
    try {
      const response = await api.patch(`/admin/products/${id}/status`, { status });
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update product status' };
    }
  },
};

export default productService;