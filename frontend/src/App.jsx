import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/shared/ProtectedRoute';

import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import ManageCustomers from './pages/admin/Customers';
import ManageOwners from './pages/admin/Owners';
import ManageDeliveryPerson from './pages/shared/DeliveryPerson';
import ManageRestaurant from './pages/shared/Restaurant';

import OwnerLayout from './pages/owner/OwnerLayout';
import OwnerDashboard from './pages/owner/Dashboard';
import ManageMenu from './pages/owner/Menu';
import ManageDelivery from './pages/owner/Delivery';

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
          <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/dashboard" element={<ProtectedRoute requiredRole="admin"><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/customers" element={<ProtectedRoute requiredRole="admin"><AdminLayout><ManageCustomers /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/owners" element={<ProtectedRoute requiredRole="admin"><AdminLayout><ManageOwners /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/delivery-person" element={<ProtectedRoute requiredRole="admin"><AdminLayout><ManageDeliveryPerson /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/restaurant" element={<ProtectedRoute requiredRole="admin"><AdminLayout><ManageRestaurant /></AdminLayout></ProtectedRoute>} />

          {/* Owner Routes */}
          <Route path="/owner/dashboard" element={<ProtectedRoute requiredRole="owner"><OwnerLayout><OwnerDashboard /></OwnerLayout></ProtectedRoute>} />
          <Route path="/owner/menu" element={<ProtectedRoute requiredRole="owner"><OwnerLayout><ManageMenu /></OwnerLayout></ProtectedRoute>} />
          <Route path="/owner/restaurant" element={<ProtectedRoute requiredRole="owner"><OwnerLayout><ManageRestaurant /></OwnerLayout></ProtectedRoute>} />
          <Route path="/owner/delivery-people" element={<ProtectedRoute requiredRole="owner"><OwnerLayout><ManageDeliveryPeople /></OwnerLayout></ProtectedRoute>} />
          <Route path="/owner/delivery" element={<ProtectedRoute requiredRole="owner"><OwnerLayout><ManageDelivery /></OwnerLayout></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;