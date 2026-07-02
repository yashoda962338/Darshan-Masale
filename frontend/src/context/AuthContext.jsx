// frontend/src/context/AuthContext.jsx - FULLY FIXED
import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';
import authService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem('token');

            if (token) {
                try {
                    const userData = await authService.getProfile();
                    setUser(userData);
                    setRole(userData.role || 'CUSTOMER');
                    setIsAuthenticated(true);
                    localStorage.setItem('role', userData.role || 'CUSTOMER');
                } catch (error) {
                    console.error('Error loading user:', error);
                    localStorage.removeItem('token');
                    localStorage.removeItem('role');
                    setUser(null);
                    setRole(null);
                    setIsAuthenticated(false);
                }
            } else {
                // ✅ IMPORTANT: Set to false when no token
                setIsAuthenticated(false);
                setUser(null);
                setRole(null);
            }
            // ✅ IMPORTANT: Always set loading to false after check
            setLoading(false);
        };
        loadUser();
    }, []);

    // frontend/src/context/AuthContext.jsx - Add debug logs in login
    const login = async (credentials) => {
        try {
            const response = await authService.login(credentials);
            const { token, user } = response;

            localStorage.setItem('token', token);
            localStorage.setItem('role', user.role);

            setUser(user);
            setRole(user.role);
            setIsAuthenticated(true);

            console.log('✅ Login successful, isAuthenticated set to true');

            toast.success(`Welcome ${user.firstName}!`);
            return { success: true, role: user.role, user };
        } catch (error) {
            toast.error(error.message || 'Login failed');
            return { success: false, error: error.message };
        }
    };
    const logout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            // Ignore logout errors
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            setUser(null);
            setRole(null);
            setIsAuthenticated(false);
            toast.success('Logged out successfully');
        }
    };

    const register = async (userData) => {
        try {
            const response = await authService.register(userData);
            toast.success('Registration successful! Please verify your OTP.');
            return { success: true, data: response };
        } catch (error) {
            toast.error(error.message || 'Registration failed');
            return { success: false, error: error.message };
        }
    };

    const verifyOTP = async (otpData) => {
        try {
            const response = await authService.verifyOTP(otpData);
            toast.success('OTP verified successfully! Please login.');
            return { success: true, data: response };
        } catch (error) {
            toast.error(error.message || 'OTP verification failed');
            return { success: false, error: error.message };
        }
    };

    const resendOTP = async (data) => {
        try {
            const response = await authService.resendOTP(data);
            toast.success('OTP resent successfully!');
            return { success: true, data: response };
        } catch (error) {
            toast.error(error.message || 'Failed to resend OTP');
            return { success: false, error: error.message };
        }
    };

    const forgotPassword = async (data) => {
        try {
            const response = await authService.forgotPassword(data);
            toast.success('OTP sent to your email/phone!');
            return { success: true, data: response };
        } catch (error) {
            toast.error(error.message || 'Failed to send OTP');
            return { success: false, error: error.message };
        }
    };

    const resetPassword = async (data) => {
        try {
            const response = await authService.resetPassword(data);
            toast.success('Password reset successful! Please login.');
            return { success: true, data: response };
        } catch (error) {
            toast.error(error.message || 'Failed to reset password');
            return { success: false, error: error.message };
        }
    };

    const updateProfile = async (data) => {
        try {
            const updatedUser = await authService.updateProfile(data);
            setUser(updatedUser);
            toast.success('Profile updated successfully!');
            return { success: true, data: updatedUser };
        } catch (error) {
            toast.error(error.message || 'Failed to update profile');
            return { success: false, error: error.message };
        }
    };

    const hasRole = (requiredRoles) => {
        if (!role) return false;
        if (Array.isArray(requiredRoles)) {
            return requiredRoles.includes(role);
        }
        return role === requiredRoles;
    };

    const value = {
        user,
        role,
        loading,
        isAuthenticated,
        login,
        logout,
        register,
        verifyOTP,
        resendOTP,
        forgotPassword,
        resetPassword,
        updateProfile,
        hasRole,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// frontend/src/context/AuthContext.jsx - Add export for useAuth
// Make sure you have this at the end of the file:

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};