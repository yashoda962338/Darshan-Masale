// frontend/src/components/common/RoleProtectedRoute.jsx - FULLY FIXED
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const RoleProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, role, loading } = useAuth();

  // ✅ Show loading while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-primary-maroon border-t-secondary-gold rounded-full animate-spin" />
      </div>
    );
  }

  // ✅ ONLY redirect to login if NOT authenticated
  // This ONLY affects routes wrapped with this component
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  // ✅ Check if user has required role
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/403" replace />;
  }

  return children;
};

export default RoleProtectedRoute;