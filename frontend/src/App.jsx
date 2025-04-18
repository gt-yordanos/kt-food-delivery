import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/shared/ProtectedRoute';

import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Customers from './pages/admin/Customers';
import Owners from './pages/admin/Owners';
import DeliveryPerson from './pages/shared/DeliveryPerson';
import Restaurant from './pages/shared/Restaurant';

import OwnerLayout from './pages/owner/OwnerLayout';
import OwnerDashboard from './pages/owner/Dashboard';
import OwnerMenu from './pages/owner/Menu';
import OwnerRestaurant from './pages/owner/Restaurant';
import OwnerDeliveryPeople from './pages/owner/DeliveryPeople';
import OwnerDelivery from './pages/owner/Delivery';

import Login from './components/shared/Login';
import api from './api';
import './App.css';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login loginApi={api.logIn} redirectLink="/customer/dashboard" />} />
          <Route path="/admin/login" element={<Login loginApi={api.loginAdmin} redirectLink="/admin/dashboard" />} />
          <Route path="/owner/login" element={<Login loginApi={api.loginRestaurantOwner} redirectLink="/owner/dashboard" />} />

          {/* Customer Protected Route */}
          <Route path="/" element={<ProtectedRoute requiredRole="customer"><p>Customer</p></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminLayout><Dashboard /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/dashboard" element={<ProtectedRoute requiredRole="admin"><AdminLayout><Dashboard /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/customers" element={<ProtectedRoute requiredRole="admin"><AdminLayout><Customers /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/owners" element={<ProtectedRoute requiredRole="admin"><AdminLayout><Owners /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/delivery-person" element={<ProtectedRoute requiredRole="admin"><AdminLayout><DeliveryPerson /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/restaurant" element={<ProtectedRoute requiredRole="admin"><AdminLayout><Restaurant /></AdminLayout></ProtectedRoute>} />

          {/* Owner Routes */}
          <Route path="/owner/dashboard" element={<ProtectedRoute requiredRole="owner"><OwnerLayout><OwnerDashboard /></OwnerLayout></ProtectedRoute>} />
          <Route path="/owner/menu" element={<ProtectedRoute requiredRole="owner"><OwnerLayout><OwnerMenu /></OwnerLayout></ProtectedRoute>} />
          <Route path="/owner/restaurant" element={<ProtectedRoute requiredRole="owner"><OwnerLayout><OwnerRestaurant /></OwnerLayout></ProtectedRoute>} />
          <Route path="/owner/delivery-people" element={<ProtectedRoute requiredRole="owner"><OwnerLayout><OwnerDeliveryPeople /></OwnerLayout></ProtectedRoute>} />
          <Route path="/owner/delivery" element={<ProtectedRoute requiredRole="owner"><OwnerLayout><OwnerDelivery /></OwnerLayout></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;