import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/shared/ProtectedRoute';
import CustomerPage from './pages/admin/Customer';
import AdminPage from './pages/admin/Admin'; // Import AdminPage which handles nested routes
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
          <Route path="/" element={<ProtectedRoute requiredRole="customer"><CustomerPage /></ProtectedRoute>} />
          
          {/* Admin Route (Handles all /admin subroutes) */}
          <Route path="/admin/*" element={<ProtectedRoute requiredRole="admin"><AdminPage /></ProtectedRoute>} />

          {/* Owner Dashboard */}
          <Route path="/owner" element={<ProtectedRoute requiredRole="owner"><OwnerPage /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;