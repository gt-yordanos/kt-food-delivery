import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/shared/ProtectedRoute';
import Login from './components/shared/Login';
// import AdminPage from './pages/AdminPage';
// import OwnerPage from './pages/OwnerPage';
// import DeliveryPersonPage from './pages/DeliveryPersonPage';
// import CustomerPage from './pages/CustomerPage';
import { useNavigate } from 'react-router-dom';
import './App.css';

const App = () => {
  const loginApi = async (email, password) => {
    // This is a mock API call. Replace with actual API.
    if (email === 'admin@example.com' && password === 'admin') {
      return { data: { token: 'admin-token' } }; // Mocked JWT token for admin
    }
    if (email === 'owner@example.com' && password === 'owner') {
      return { data: { token: 'owner-token' } }; // Mocked JWT token for owner
    }
    if (email === 'customer@example.com' && password === 'customer') {
      return { data: { token: 'customer-token' } }; // Mocked JWT token for customer
    }
    if (email === 'delivery@example.com' && password === 'delivery') {
      return { data: { token: 'delivery-token' } }; // Mocked JWT token for delivery person
    }
    throw new Error('Invalid credentials');
  };

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login loginApi={loginApi} redirectLink="/admin" />} />
          
          {/* Protected Routes */}
          <Route path="/" element={<ProtectedRoute requiredRole="customer" />}>
            <Route path="/" element={<p>Customer Page</p> /* Customer Page */} />
          </Route>
          <Route path="/admin" element={<ProtectedRoute requiredRole="admin" />}>
            <Route path="/admin" element={<p>Admin Page</p> /* Admin Page */} />
          </Route>
          <Route path="/owner" element={<ProtectedRoute requiredRole="owner" />}>
            <Route path="/owner" element={<p>Owner Page</p> /* Owner Page */} />
          </Route>
          <Route path="/delivery-person" element={<ProtectedRoute requiredRole="delivery-person" />}>
            <Route path="/delivery-person" element={<p>delevtybj</p> /* Delivery Person Page */} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;