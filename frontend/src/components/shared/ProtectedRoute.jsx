import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  const location = useLocation(); // To check the current route

  if (loading) {
    return <div>Loading...</div>;
  }

  // If the user is logged in, redirect to the appropriate dashboard based on the role
  if (user) {
    if (location.pathname === `/admin/login` && user.role === 'admin') {
      return <Navigate to="/admin/dashboard" />;
    } else if (location.pathname === `/manager/login` && user.role === 'manager') {
      return <Navigate to="/manager/dashboard" />;
    } else if (location.pathname === `/delivery-person/login` && user.role === 'deliveryPerson') {
      return <Navigate to="/delivery-person" />;
    }
  }

  // If the user is not logged in, redirect to the appropriate login page based on the route
  if (!user) {
    if (location.pathname.startsWith('/admin')) {
      return <Navigate to="/admin/login" state={{ from: location }} />;
    } else if (location.pathname.startsWith('/manager')) {
      return <Navigate to="/manager/login" state={{ from: location }} />;
    } else if (location.pathname.startsWith('/delivery-person')) {
      return <Navigate to="/delivery-person/login" state={{ from: location }} />;
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