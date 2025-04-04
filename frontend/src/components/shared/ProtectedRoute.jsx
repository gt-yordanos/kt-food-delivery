import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  const location = useLocation(); // To check the current route

  if (loading) {
    return <div>Loading...</div>;
  }

  // If user is not logged in, redirect to the appropriate login page based on the route
  if (!user) {
    if (location.pathname.startsWith('/admin')) {
      return <Navigate to="/admin/login" state={{ from: location }} />;
    } else if (location.pathname.startsWith('/owner')) {
      return <Navigate to="/owner/login" state={{ from: location }} />;
    } else {
      return <Navigate to="/login" state={{ from: location }} />;
    }
  }

  // If the user is logged in but doesn't have the required role
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default ProtectedRoute;