import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaExpandAlt, FaCompressAlt } from 'react-icons/fa';
import { useTheme } from '../../contexts/ThemeContext';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../../contexts/AuthContext';
import logo from '../../assets/ktLogo.png';
const Sidebar = ({ links }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { theme } = useTheme();
  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleSidebarCollapse = () => {
    setCollapsed(!collapsed);
  };

  const getSelectedBg = (isSelected) => {
    if (isSelected) {
      return theme === 'light' ? 'bg-black text-white' : 'bg-white text-black';
    }
    return '';
  };

  const isSelected = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div
      className={`h-screen z-30 bg-base-300 p-2 transition-all duration-300 ${collapsed ? 'w-24' : 'w-56'}`}
      style={{ transition: 'width 0.3s ease' }}
    >
      {/* Logo Section */}
      <div className="mb-4 text-center mt-4">
        <img
          src={logo}
          alt="KT Restaurant Logo"
          className={`transition-all duration-300 ${collapsed ? 'w-12' : 'w-18'} mx-auto`}
        />
      </div>

      <div className="mb-4 flex justify-between items-center gap-2">
        <ThemeToggle />
        <button
          onClick={handleSidebarCollapse}
          className="text-xl p-2 rounded bg-base-200 hover:bg-base-100 cursor-pointer"
        >
          {collapsed ? <FaExpandAlt /> : <FaCompressAlt />}
        </button>
      </div>

      <ul className="menu p-0 text-base-content flex flex-col gap-2 m-auto">
        {links.map((link, index) => (
          <li key={index}>
            <Link
              to={link.path}
              className={`flex items-center py-2 px-4 rounded text-lg ${getSelectedBg(isSelected(link.path))}`}
            >
              {link.icon && <link.icon className={`${collapsed ? '' : 'mr-2'}`} />}
              {!collapsed && link.label}
            </Link>
          </li>
        ))}
        <li>
          <button
            onClick={handleLogout}
            className={`flex items-center py-2 px-4 rounded text-lg ${getSelectedBg()}`}
          >
            <FaSignOutAlt className={`${collapsed ? '' : 'mr-2'}`} />
            {!collapsed && 'Logout'}
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;