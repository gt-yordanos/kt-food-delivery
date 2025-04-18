import React from 'react';
import Sidebar from '../../components/shared/Sidebar';
import {
  FaTachometerAlt,   // Dashboard
  FaUtensils,        // Menu
  FaRegBuilding,            // Restaurant (house-style icon)
  FaTruck,           // Delivery People
  FaGift,            // Delivery
  FaClipboardList    // Orders
} from 'react-icons/fa';

const OwnerLayout = ({ children }) => {
  const links = [
    { label: 'Dashboard', path: '/owner/dashboard', icon: FaTachometerAlt },
    { label: 'Menu', path: '/owner/menu', icon: FaUtensils },
    { label: 'Restaurant', path: '/owner/restaurant', icon: FaRegBuilding },
    { label: 'Delivery People', path: '/owner/delivery-people', icon: FaTruck },
    { label: 'Delivery', path: '/owner/delivery', icon: FaGift },
    { label: 'Orders', path: '/owner/orders', icon: FaClipboardList },
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