import React from 'react';
import { FaTachometerAlt, FaUsers, FaUserTie, FaTruck, FaUtensils } from 'react-icons/fa';
import { Routes, Route } from 'react-router-dom'; // Import routes and route handling
import AdminOwnerLayout from '../../components/shared/AdminOwnerLayout';

// Import individual admin section components
import AdminDashboard from './Dashboard';
import AdminCustomers from './Customers';
import AdminOwners from './Owners';
import AdminDelivery from './Delivery';
import AdminRestaurant from './Restaurant';

const AdminPage = () => {
  const links = [
    { label: 'Dashboard', path: 'dashboard', icon: FaTachometerAlt },
    { label: 'Customers', path: 'customers', icon: FaUsers },
    { label: 'Owners', path: 'owners', icon: FaUserTie },
    { label: 'Delivery People', path: 'delivery', icon: FaTruck },
    { label: 'Restaurant', path: 'restaurant', icon: FaUtensils },
  ];

  return (
    <AdminOwnerLayout links={links}>
      <Routes>
        {/* Nested routes inside /admin */}
        <Route path="/" element={<Dashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="owners" element={<AdminOwners />} />
        <Route path="delivery" element={<AdminDelivery />} />
        <Route path="restaurant" element={<AdminRestaurant />} />
      </Routes>
    </AdminOwnerLayout>
  );
};

export default AdminPage;
