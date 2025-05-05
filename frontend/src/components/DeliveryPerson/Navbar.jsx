import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaUserAlt, FaBox, FaSignOutAlt } from 'react-icons/fa';

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <div className="navbar bg-base-200 fixed top-0 left-0 w-full z-10">
      {/* Mobile Drawer Button */}
      <div className="flex-1 lg:hidden">
        <button
          className="btn btn-ghost text-2xl"
          onClick={handleDrawerToggle}
        >
          ☰
        </button>
      </div>

      {/* Navbar Center (Logo and Title) */}
      <div className="flex-1 hidden lg:flex justify-center items-center">
        <span className="text-2xl font-bold">Delivery</span>
      </div>

      {/* Desktop Navbar Links */}
      <div className="flex-none hidden lg:flex gap-4">
        <Link to="/home" className="btn btn-ghost">
          <FaHome className="mr-2" />
          Home
        </Link>
        <Link to="/profile" className="btn btn-ghost">
          <FaUserAlt className="mr-2" />
          Profile
        </Link>
        <Link to="/orders" className="btn btn-ghost">
          <FaBox className="mr-2" />
          Orders
        </Link>
        <button className="btn btn-ghost">
          <FaSignOutAlt className="mr-2" />
          Logout
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      <div
        className={`drawer ${drawerOpen ? 'drawer-open' : ''} lg:hidden`}
      >
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          {/* Mobile Menu content (will appear when drawer is open) */}
          <div className="drawer-side">
            <label htmlFor="my-drawer" className="drawer-overlay"></label>
            <ul className="menu p-4 w-60 bg-base-100 text-base-content">
              <li>
                <Link to="/home" className="btn btn-ghost">
                  <FaHome className="mr-2" />
                  Home
                </Link>
              </li>
              <li>
                <Link to="/profile" className="btn btn-ghost">
                  <FaUserAlt className="mr-2" />
                  Profile
                </Link>
              </li>
              <li>
                <Link to="/orders" className="btn btn-ghost">
                  <FaBox className="mr-2" />
                  Orders
                </Link>
              </li>
              <li>
                <button className="btn btn-ghost">
                  <FaSignOutAlt className="mr-2" />
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;