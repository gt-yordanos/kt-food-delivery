import React from 'react';
import Sidebar from '../../components/shared/Sidebar';
import {
  FaTachometerAlt,
  FaUtensils,
  FaStore,
  FaTruck,
  FaBoxOpen,
} from 'react-icons/fa';

const OwnerLayout = ({ children }) => {
  const links = [
    { label: 'Dashboard', path: '/owner/dashboard', icon: FaTachometerAlt },
    { label: 'Menu', path: '/owner/menu', icon: FaUtensils },
    { label: 'Restaurant', path: '/owner/restaurant', icon: FaStore },
    { label: 'Delivery People', path: '/owner/delivery-people', icon: FaTruck },
    { label: 'Delivery', path: '/owner/delivery', icon: FaBoxOpen },
  ];

  return (
    <div className="flex h-screen">
      <Sidebar links={links} />
      <div className="flex-1 p-4 overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default OwnerLayout;