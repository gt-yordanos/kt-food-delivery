import React from 'react';
import Sidebar from '../../components/shared/Sidebar';
import {
  FaTachometerAlt,
  FaUtensils,
  FaRegBuilding,
  FaTruck,
  FaGift,
  FaClipboardList
} from 'react-icons/fa';

const OwnerLayout = ({ children }) => {
  const links = [
    { label: 'Dashboard', path: '/manager/dashboard', icon: FaTachometerAlt },
    { label: 'Menu', path: '/manager/menu', icon: FaUtensils },
    { label: 'Restaurant', path: '/manager/restaurant', icon: FaRegBuilding },
    { label: 'Delivery People', path: '/manager/delivery-people', icon: FaTruck },
    { label: 'Delivery', path: '/manager/delivery', icon: FaGift },
    { label: 'Orders', path: '/manager/orders', icon: FaClipboardList },
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