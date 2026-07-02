// frontend/src/services/categoryService.js
import axios from 'axios';

// ✅ Make sure this points to the correct backend port
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

const categoryService = {
  // Public APIs
  getCategories: async (params = {}) => {
    try {
      const response = await api.get('/categories', { params });
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch categories' };
    }
  },

  getCategoryBySlug: async (slug) => {
    try {
      const response = await api.get(`/categories/${slug}`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch category' };
    }
  },

  // Admin APIs
  getAdminCategories: async (params = {}) => {
    try {
      const response = await api.get('/admin/categories', { params });
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch categories' };
    }
  },

  createCategory: async (data) => {
    try {
      const response = await api.post('/admin/categories', data);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create category' };
    }
  },

  updateCategory: async (id, data) => {
    try {
      const response = await api.put(`/admin/categories/${id}`, data);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update category' };
    }
  },

  deleteCategory: async (id) => {
    try {
      const response = await api.delete(`/admin/categories/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete category' };
    }
  },
};

export default categoryService;