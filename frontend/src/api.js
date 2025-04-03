// api.js

import axios from 'axios';

// Define the base URL for your API
const BASE_URL = 'http://localhost:2200/api'; // Update with your actual API URL

const api = {
  // Admin Routes
  createAdmin: async (adminData) => {
    try {
      const response = await axios.post(`${BASE_URL}/admin/create`, adminData);
      return response.data;
    } catch (error) {
      console.error('Error creating admin:', error);
      throw error;
    }
  },

  loginAdmin: async (loginData) => {
    try {
      const response = await axios.post(`${BASE_URL}/admin/login`, loginData);
      return response.data;
    } catch (error) {
      console.error('Error logging in admin:', error);
      throw error;
    }
  },

  updateAdmin: async (adminId, updateData) => {
    try {
      const response = await axios.put(`${BASE_URL}/admin/update/${adminId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating admin:', error);
      throw error;
    }
  },

  deleteAdmin: async (adminId) => {
    try {
      const response = await axios.delete(`${BASE_URL}/admin/delete/${adminId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting admin:', error);
      throw error;
    }
  },

  // Customer Routes
  signUp: async (signUpData) => {
    try {
      const response = await axios.post(`${BASE_URL}/customers/sign-up`, signUpData);
      return response.data;
    } catch (error) {
      console.error('Error signing up customer:', error);
      throw error;
    }
  },

  logIn: async (loginData) => {
    try {
      const response = await axios.post(`${BASE_URL}/customers/log-in`, loginData);
      return response.data;
    } catch (error) {
      console.error('Error logging in customer:', error);
      throw error;
    }
  },

  logOut: async () => {
    try {
      const response = await axios.post(`${BASE_URL}/customers/log-out`);
      return response.data;
    } catch (error) {
      console.error('Error logging out customer:', error);
      throw error;
    }
  },

  updateAccount: async (updateData) => {
    try {
      const response = await axios.put(`${BASE_URL}/customers/update-account`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating account:', error);
      throw error;
    }
  },

  deleteAccount: async () => {
    try {
      const response = await axios.delete(`${BASE_URL}/customers/delete-account`);
      return response.data;
    } catch (error) {
      console.error('Error deleting account:', error);
      throw error;
    }
  },

  // Delivery Routes
  createDelivery: async (deliveryData) => {
    try {
      const response = await axios.post(`${BASE_URL}/delivery/create`, deliveryData);
      return response.data;
    } catch (error) {
      console.error('Error creating delivery:', error);
      throw error;
    }
  },

  getDeliveryDetails: async (orderId) => {
    try {
      const response = await axios.get(`${BASE_URL}/delivery/details/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching delivery details:', error);
      throw error;
    }
  },

  changeDeliveryStatus: async (deliveryId, status) => {
    try {
      const response = await axios.put(`${BASE_URL}/delivery/change-status/${deliveryId}`, { status });
      return response.data;
    } catch (error) {
      console.error('Error changing delivery status:', error);
      throw error;
    }
  },

  // Menu Routes
  addMenuItem: async (menuItemData) => {
    try {
      const response = await axios.post(`${BASE_URL}/menu/add-menu-item`, menuItemData);
      return response.data;
    } catch (error) {
      console.error('Error adding menu item:', error);
      throw error;
    }
  },

  updateMenuItem: async (menuId, updateData) => {
    try {
      const response = await axios.put(`${BASE_URL}/menu/update-menu-item/${menuId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating menu item:', error);
      throw error;
    }
  },

  deleteMenuItem: async (menuId) => {
    try {
      const response = await axios.delete(`${BASE_URL}/menu/delete-menu-item/${menuId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting menu item:', error);
      throw error;
    }
  },

  getAllMenuItems: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/menu/menu-items`);
      return response.data;
    } catch (error) {
      console.error('Error fetching menu items:', error);
      throw error;
    }
  },

  // Order Routes
  createOrder: async (orderData) => {
    try {
      const response = await axios.post(`${BASE_URL}/orders/create`, orderData);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  getAllOrders: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/orders/all`);
      return response.data;
    } catch (error) {
      console.error('Error fetching all orders:', error);
      throw error;
    }
  },

  trackOrder: async (orderId) => {
    try {
      const response = await axios.get(`${BASE_URL}/orders/track/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Error tracking order:', error);
      throw error;
    }
  },

  // Restaurant Routes
  addRestaurant: async (restaurantData) => {
    try {
      const response = await axios.post(`${BASE_URL}/restaurants/add`, restaurantData);
      return response.data;
    } catch (error) {
      console.error('Error adding restaurant:', error);
      throw error;
    }
  },

  updateRestaurant: async (updateData) => {
    try {
      const response = await axios.patch(`${BASE_URL}/restaurants/update`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating restaurant:', error);
      throw error;
    }
  },
};

export default api;