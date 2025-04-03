import React from 'react';
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
   <>
   hi
  </>
  );
};

export default OwnerPage;