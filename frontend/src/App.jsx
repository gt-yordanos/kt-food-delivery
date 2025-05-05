import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/shared/ProtectedRoute';

import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import ManageCustomers from './pages/admin/Customers';
import ManageOwners from './pages/admin/Owners';
import ManageDeliveryPeople from './pages/shared/DeliveryPerson';
import ManageRestaurant from './pages/shared/Restaurant';

import OwnerLayout from './pages/owner/OwnerLayout';
import OwnerDashboard from './pages/owner/Dashboard';
import ManageMenu from './pages/owner/Menu';
import ManageDelivery from './pages/owner/Delivery';
import ManageOrder from './pages/owner/Order';

import Login from './components/shared/Login';
import api from './api';
import './App.css';
import Home from './pages/customer/Home';
import Menu from './pages/customer/Menu';
import Navbar from './components/customer/Navbar';
import Footer from './components/customer/Footer';
import SignUp from './pages/customer/SignUp';
import Profile from './pages/customer/Profile';
import Cart from './pages/customer/Cart';
import Checkout from './pages/customer/CheckOut';
import PaymentVerification from './pages/customer/PaymentVerification';
import DeliveryPerson from './pages/shared/DeliveryPerson';

const App = () => {
  return (
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/admin/login" element={<ProtectedRoute><Login loginApi={api.loginAdmin} redirectLink="/admin/dashboard" /></ProtectedRoute>} />
          <Route path="/owner/login" element={<ProtectedRoute><Login loginApi={api.loginRestaurantOwner} redirectLink="/owner/dashboard" /></ProtectedRoute>} />
          <Route path="/delivery-person/login" element={<ProtectedRoute><Login loginApi={api.loginRestaurantOwner} redirectLink="/delivery-person" /></ProtectedRoute>} />

          {/* Customer*/}
          <Route path="/login" 
          element={
            <>
              <Navbar/>
              <Login loginApi={api.logIn} redirectLink="/" />
              <Footer/>
            </>
          } 
          />

          <Route path="/signup" 
          element={
            <>
              <Navbar/>
              <SignUp/>
              <Footer/>
            </>
          } 
          />

          <Route path="/" 
          element={
            <>
              <Navbar/>
              <Home/>
              <Footer/>
            </>
            } 
            /> 
          <Route path="/menu" 
          element={
            <>
              <Navbar/>
              <Menu/>
              <Footer/>
            </>
            } 
            /> 
            <Route path="/profile" 
          element={
            <>
              <Navbar/>
              <Profile/>
              <Footer/>
            </>
          } 
          />

          <Route path="/cart" 
          element={
            <>
              <Navbar/>
              <Cart/>
              <Footer/>
            </>
          } 
          />

        <Route path="/checkout" 
          element={
            <>
              <Navbar/>
              <Checkout/>
              <Footer/>
            </>
          } 
          />

        <Route path="/verify-payment/:tx_ref" element={<PaymentVerification/>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/dashboard" element={<ProtectedRoute requiredRole="admin"><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/customers" element={<ProtectedRoute requiredRole="admin"><AdminLayout><ManageCustomers /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/owners" element={<ProtectedRoute requiredRole="admin"><AdminLayout><ManageOwners /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/delivery-person" element={<ProtectedRoute requiredRole="admin"><AdminLayout><ManageDeliveryPeople /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/restaurant" element={<ProtectedRoute requiredRole="admin"><AdminLayout><ManageRestaurant /></AdminLayout></ProtectedRoute>} />

          {/* Owner Routes */}
          <Route path="/owner" element={<ProtectedRoute requiredRole="restaurantOwner"><OwnerLayout><OwnerDashboard /></OwnerLayout></ProtectedRoute>} />
          <Route path="/owner/dashboard" element={<ProtectedRoute requiredRole="restaurantOwner"><OwnerLayout><OwnerDashboard /></OwnerLayout></ProtectedRoute>} />
          <Route path="/owner/menu" element={<ProtectedRoute requiredRole="restaurantOwner"><OwnerLayout><ManageMenu /></OwnerLayout></ProtectedRoute>} />
          <Route path="/owner/restaurant" element={<ProtectedRoute requiredRole="restaurantOwner"><OwnerLayout><ManageRestaurant /></OwnerLayout></ProtectedRoute>} />
          <Route path="/owner/delivery-people" element={<ProtectedRoute requiredRole="restaurantOwner"><OwnerLayout><ManageDeliveryPeople /></OwnerLayout></ProtectedRoute>} />
          <Route path="/owner/delivery" element={<ProtectedRoute requiredRole="restaurantOwner"><OwnerLayout><ManageDelivery /></OwnerLayout></ProtectedRoute>} />
          <Route path="/owner/orders" element={<ProtectedRoute requiredRole="restaurantOwner"><OwnerLayout><ManageOrder /></OwnerLayout></ProtectedRoute>} />

          {/* DekiveryPerson Routes */}
          <Route path="/delivery-person" element={<ProtectedRoute requiredRole="deliveryPerson"><DeliveryPerson/></ProtectedRoute>} />
        </Routes>
      </Router>
  );
};

export default App;