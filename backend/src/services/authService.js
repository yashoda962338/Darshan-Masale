// src/services/authService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

const authService = {
  // Register
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Registration failed' };
    }
  },

  // Verify Registration OTP
  verifyOTP: async (data) => {
    try {
      const response = await api.post('/auth/verify-registration-otp', data);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'OTP verification failed' };
    }
  },

  // Resend OTP
  resendOTP: async (data) => {
    try {
      const response = await api.post('/auth/resend-otp', data);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to resend OTP' };
    }
  },

  // Login
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Login failed' };
    }
  },

  // Logout
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Ignore logout errors
    }
  },

  // Forgot Password
  forgotPassword: async (data) => {
    try {
      const response = await api.post('/auth/forgot-password', data);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to send OTP' };
    }
  },

  // Verify Forgot Password OTP
  verifyForgotPasswordOTP: async (data) => {
    try {
      const response = await api.post('/auth/verify-forgot-password-otp', data);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'OTP verification failed' };
    }
  },

  // Reset Password
  resetPassword: async (data) => {
    try {
      const response = await api.post('/auth/reset-password', data);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to reset password' };
    }
  },

  // Get Profile
  getProfile: async () => {
    try {
      const response = await api.get('/auth/profile');
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get profile' };
    }
  },

  // Update Profile
  updateProfile: async (data) => {
    try {
      const response = await api.put('/auth/profile', data);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update profile' };
    }
  },
};

export default authService;