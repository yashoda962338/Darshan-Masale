// frontend/src/services/userService.js
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
    return config;
  },
  (error) => Promise.reject(error)
);

const userService = {
  // Profile
  getProfile: async () => {
    try {
      const response = await api.get('/users/profile');
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch profile' };
    }
  },

  updateProfile: async (data) => {
    try {
      const response = await api.put('/users/profile', data);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update profile' };
    }
  },

  changePassword: async (data) => {
    try {
      const response = await api.put('/users/change-password', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to change password' };
    }
  },

  // Addresses
  getAddresses: async () => {
    try {
      const response = await api.get('/users/addresses');
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch addresses' };
    }
  },

  createAddress: async (data) => {
    try {
      const response = await api.post('/users/addresses', data);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create address' };
    }
  },

  updateAddress: async (id, data) => {
    try {
      const response = await api.put(`/users/addresses/${id}`, data);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update address' };
    }
  },

  deleteAddress: async (id) => {
    try {
      const response = await api.delete(`/users/addresses/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete address' };
    }
  },
};

export default userService;