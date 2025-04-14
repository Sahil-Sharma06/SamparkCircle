// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * ProtectedRoute component that checks if the user is authenticated
 * and optionally checks if they have the required role(s)
 * 
 * @param {Object} props - Component props
 * @param {Array} props.allowedRoles - Optional array of roles that are allowed to access the route
 * @param {ReactNode} props.children - Optional children to render
 */
const ProtectedRoute = ({ allowedRoles, children }) => {
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If allowedRoles is provided, check if user has any of the allowed roles
  if (allowedRoles && allowedRoles.length > 0) {
    const hasAllowedRole = allowedRoles.some(role => 
      user.role?.toLowerCase() === role.toLowerCase()
    );
    
    if (!hasAllowedRole) {
      // Redirect to dashboard if user doesn't have required role
      return <Navigate to="/dashboard" replace />;
    }
  }
  
  // If there are children, render them, otherwise render the Outlet
  return children ? children : <Outlet />;
};

export default ProtectedRoute;