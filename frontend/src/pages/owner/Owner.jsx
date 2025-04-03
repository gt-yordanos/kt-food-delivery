import React from 'react';
import AdminOwnerLayout from '../../components/shared/AdminOwnerLayout';
import { Link } from 'react-router-dom';

const OwnerPage = () => {
  const links = [
    { label: 'Dashboard', path: '/owner/dashboard', icon: FaTachometerAlt },
    { label: 'Menu', path: '/owner/menu', icon: FaBars },
    { label: 'Orders', path: '/owner/orders', icon: FaClipboardList },
    { label: 'Feedback', path: '/owner/feedback', icon: FaCommentDots },
    { label: 'Restaurant', path: '/owner/restaurant', icon: FaStore },
    { label: 'Delivery People', path: '/owner/delivery', icon: FaTruck },
  ];

  return (
    <AdminOwnerLayout links={links}>
      <h1>Owner Dashboard</h1>
      <p>Manage your restaurant operations here!</p>
    </AdminOwnerLayout>
  );
};

export default OwnerPage;