import React from 'react';
import { FaTachometerAlt, FaUsers, FaUserTie, FaTruck, FaUtensils } from 'react-icons/fa'; // Corrected icon for Restaurant
import AdminOwnerLayout from '../../components/shared/AdminOwnerLayout';

const AdminPage = () => {
  const links = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: FaTachometerAlt },
    { label: 'Customers', path: '/admin/customers', icon: FaUsers },
    { label: 'Owners', path: '/admin/owners', icon: FaUserTie },
    { label: 'Delivery People', path: '/admin/delivery', icon: FaTruck },
    { label: 'Restaurant', path: '/admin/restaurant', icon: FaUtensils },
  ];

  return (
    <AdminOwnerLayout links={links}>
      <h1>Admin Dashboard</h1>
      <p>Welcome to the admin dashboard!</p>
    </AdminOwnerLayout>
  );
};

export default AdminPage;
