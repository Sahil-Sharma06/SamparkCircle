import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { user, token } = useSelector((state) => state.auth);
  
  // Check if user is authenticated
  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }
  
  // Check if user has required role (if specified)
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // If authenticated and authorized, render the child routes
  return <Outlet />;
};

export default ProtectedRoute; 