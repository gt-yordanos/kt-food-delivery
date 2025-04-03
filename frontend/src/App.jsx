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
import OwnerPage from './pages/owner/Owner';
import Login from './components/shared/Login';
import api from './api'; 
import './App.css';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login loginApi="http" redirectLink="/customer/dashboard" />} />
          <Route path="/admin/login" element={<Login loginApi={api.loginAdmin} redirectLink="/admin/dashboard" />} />
          <Route path="/owner/login" element={<Login loginApi="http" redirectLink="/owner/dashboard" />} />

          {/* Protected Routes */}
          <Route path="/" element={<ProtectedRoute requiredRole="customer"><p>Customer</p></ProtectedRoute>} />
          
          {/* Admin Routes (No Nesting) */}
          <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminLayout><Dashboard /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/dashboard" element={<ProtectedRoute requiredRole="admin"><AdminLayout><Dashboard /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/customers" element={<ProtectedRoute requiredRole="admin"><AdminLayout><Customers /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/owners" element={<ProtectedRoute requiredRole="admin"><AdminLayout><Owners /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/delivery-person" element={<ProtectedRoute requiredRole="admin"><AdminLayout><DeliveryPerson /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/restaurant" element={<ProtectedRoute requiredRole="admin"><AdminLayout><Restaurant /></AdminLayout></ProtectedRoute>} />

          {/* Owner Dashboard */}
          <Route path="/owner" element={<ProtectedRoute requiredRole="owner"><OwnerPage /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;