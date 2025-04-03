import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/shared/ProtectedRoute';
import CustomerPage from './pages/customer/Customer';
import AdminPage from './pages/admin/Admin';
import OwnerPage from './pages/owner/Owner';
import Login from './components/shared/Login';
// import Unauthorized from './pages/Unauthorized';
import './App.css'

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login loginApi='http' redirectLink="/customer/dashboard" />} />
          <Route path="/admin/login" element={<Login loginApi="http:localhost://2200/admin/login" redirectLink="/admin/dashboard" />} />
          <Route path="/owner/login" element={<Login loginApi='http' redirectLink="/owner/dashboard" />} />
          {/* <Route path="/unauthorized" element={<Unauthorized />} /> */}

          {/* Protected Routes */}
          <Route path="/" element={<ProtectedRoute requiredRole="customer"><CustomerPage /></ProtectedRoute>} />
          <Route path="/admin/*" element={<ProtectedRoute requiredRole="admin"><AdminPage /></ProtectedRoute>} />
          <Route path="/owner/*" element={<ProtectedRoute requiredRole="owner"><OwnerPage /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;