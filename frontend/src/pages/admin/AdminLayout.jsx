import React from 'react';
import Sidebar from '../../components/shared/Sidebar';
import { FaTachometerAlt, FaUsers, FaUserTie, FaTruck, FaRegBuilding } from 'react-icons/fa'; 

const AdminLayout = ({ children }) => {
  const links = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: FaTachometerAlt },
    { label: 'Customers', path: '/admin/customers', icon: FaUsers },
    { label: 'Owners', path: '/admin/owners', icon: FaUserTie },
    { label: 'Delivery People', path: '/admin/delivery-person', icon: FaTruck },
    { label: 'Restaurant', path: '/admin/restaurant', icon: FaRegBuilding },
  ];
  
  return (
    <div className="flex h-screen">
      <Sidebar links={links} />
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;