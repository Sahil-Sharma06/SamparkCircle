import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { user, token } = useSelector((state) => state.auth);
  
  // Check if user is authenticated
  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }
  
  // If no specific roles are required, allow access to any authenticated user
  if (allowedRoles.length === 0) {
    return <Outlet />;
  }
  
  // Check if user has required role (case-insensitive check)
  if (!allowedRoles.some(role => user.role.toLowerCase() === role.toLowerCase())) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <Outlet />;
};

export default ProtectedRoute;