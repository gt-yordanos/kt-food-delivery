import React from 'react';
import { FaTachometerAlt, FaUsers, FaUserTie, FaTruck, FaUtensils } from 'react-icons/fa';
import { Routes, Route } from 'react-router-dom'; // Import routes and route handling
import AdminOwnerLayout from '../../components/shared/AdminOwnerLayout';

// Import individual admin section components
import Dashboard from './Dashboard';
import Customers from './Customers';
import Owners from './Owners';
import DeliveryPerson from '../shared/Delivery';
import Restaurant from '../shared/Restaurant';

const AdminPage = () => {
  const links = [
    { label: 'Dashboard', path: 'dashboard', icon: FaTachometerAlt },
    { label: 'Customers', path: 'customers', icon: FaUsers },
    { label: 'Owners', path: 'owners', icon: FaUserTie },
    { label: 'Delivery People', path: 'delivery-person', icon: FaTruck },
    { label: 'Restaurant', path: 'restaurant', icon: FaUtensils },
  ];

  return (
    <AdminOwnerLayout links={links}>
      <Routes>
        {/* Nested routes inside /admin */}
        <Route path="/" element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="customers" element={<Customers />} />
        <Route path="owners" element={<Owners />} />
        <Route path="delivery-person" element={<DeliveryPerson />} />
        <Route path="restaurant" element={<Restaurant />} />
      </Routes>
    </AdminOwnerLayout>
  );
};

export default AdminPage;
