// 🔵 FRONTEND: src/services/authService.js
import axios from 'axios';
import toast from 'react-hot-toast';

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

// Prevents multiple redirect/toast spam if several requests fail at once
let authRedirectInProgress = false;

// Handle response errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Requests to these endpoints are login/register ATTEMPTS themselves.
        // A wrong password or duplicate email is a normal 401/400 response,
        // NOT an expired session — so it must NEVER trigger a redirect/reload.
        const isAuthAttempt =
            error.config?.url?.includes('/auth/login') ||
            error.config?.url?.includes('/auth/register') ||
            error.config?.url?.includes('/auth/verify-registration-otp') ||
            error.config?.url?.includes('/auth/resend-otp') ||
            error.config?.url?.includes('/auth/forgot-password') ||
            error.config?.url?.includes('/auth/verify-forgot-password-otp') ||
            error.config?.url?.includes('/auth/reset-password');

        if (error.response?.status === 401 && !isAuthAttempt) {
            const isOnLoginPage = window.location.pathname.startsWith('/auth/login');

            localStorage.removeItem('token');

            if (!isOnLoginPage && !authRedirectInProgress) {
                authRedirectInProgress = true;

                toast.error('Please login to continue', { id: 'auth-required' });

                const currentPath = window.location.pathname + window.location.search;
                const returnUrl = encodeURIComponent(currentPath);

                setTimeout(() => {
                    window.location.href = `/auth/login?returnUrl=${returnUrl}`;
                    authRedirectInProgress = false;
                }, 600);
            }
        }
        return Promise.reject(error);
    }
);

const authService = {
    register: async (userData) => {
        try {
            const response = await api.post('/auth/register', userData);
            return response.data.data;
        } catch (error) {
            throw error.response?.data || { message: 'Registration failed' };
        }
    },

    verifyOTP: async (data) => {
        try {
            const response = await api.post('/auth/verify-registration-otp', data);
            return response.data.data;
        } catch (error) {
            throw error.response?.data || { message: 'OTP verification failed' };
        }
    },

    resendOTP: async (data) => {
        try {
            const response = await api.post('/auth/resend-otp', data);
            return response.data.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to resend OTP' };
        }
    },

    login: async (credentials) => {
        try {
            const response = await api.post('/auth/login', credentials);
            return response.data.data;
        } catch (error) {
            throw error.response?.data || { message: 'Login failed' };
        }
    },

    logout: async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            // Ignore logout errors
        }
    },

    forgotPassword: async (data) => {
        try {
            const response = await api.post('/auth/forgot-password', data);
            return response.data.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to send OTP' };
        }
    },
    verifyForgotPasswordOTP: async (data) => {
        try {
            const response = await api.post(
                "/auth/verify-forgot-password-otp",
                data
            );
            return response.data.data;
        } catch (error) {
            throw error.response?.data || {
                message: "OTP verification failed",
            };
        }
    },

    resetPassword: async (data) => {
        try {
            const response = await api.post('/auth/reset-password', data);
            return response.data.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to reset password' };
        }
    },

    getProfile: async () => {
        try {
            const response = await api.get('/auth/profile');
            return response.data.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to get profile' };
        }
    },

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