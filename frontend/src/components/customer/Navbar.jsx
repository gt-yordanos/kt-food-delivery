import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { ShoppingCart, UserRound, Menu, X } from 'lucide-react';
import ThemeToggle from '../shared/ThemeToggle';
import ktLogo from '../../assets/ktLogo.png';

const Navbar = () => {
  const location = useLocation();
  const [currentHash, setCurrentHash] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setCurrentHash(location.hash);
  }, [location]);

  // Function to get the link classes based on active state
  const getLinkClasses = (hashOrPath) => {
    const isActive = currentHash === hashOrPath || location.pathname === hashOrPath;
    return `text-lg font-bold hover:text-amber-500 transition-all duration-300 ease-in-out ${
      isActive ? 'text-amber-500' : 'text-content'
    }`;
  };

  return (
    <nav className="flex items-center justify-between py-2 px-4 sm:px-[5%] lg:px-[15%] bg-base-300 shadow-md fixed top-0 left-0 w-full z-50">
      {/* Logo */}
      <HashLink smooth to="#home" className="logo">
        <img src={ktLogo} alt="KT Restaurant Logo" className="h-12" />
      </HashLink>

      {/* Desktop Menu */}
      <ul className="hidden md:flex space-x-6">
        <li><HashLink smooth to="#about" className={getLinkClasses('#about')}>About</HashLink></li>
        <li><Link to="/menu" className={getLinkClasses('/menu')}>Menu</Link></li>
        <li><HashLink smooth to="#our-customer" className={getLinkClasses('#review')}>Our Customer</HashLink></li>
        <li><HashLink smooth to="#contact" className={getLinkClasses('#contact')}>Contact Us</HashLink></li>
      </ul>

      {/* Right Side - ThemeToggle, Cart, User, Hamburger */}
      <div className="flex items-center space-x-4 px-4 py-2">
        {/* Theme & Cart */}
        <div className="flex items-center space-x-4 bg-amber-500 rounded-full px-4 h-10">
          <ThemeToggle colorException={true} />
          <div className="relative mr-6">
            <HashLink smooth to="#cart" className="text-2xl text-black hover:text-black-focus">
              <ShoppingCart className="w-6 h-6" />
            </HashLink>
            <span
              id="cart-count"
              className="absolute -top-1 left-6 bg-blue-900 opacity-90 text-white rounded-full text-xs min-w-4 h-4 p-1 text-center font-bold flex items-center justify-center"
            >
              99
            </span>
          </div>

          {/* Hamburger Icon - Only on Mobile */}
          <button className="md:hidden text-black" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* User */}
        <div className="bg-amber-500 rounded-full h-10 w-10 text-xl text-black hover:text-black-focus flex items-center justify-center cursor-pointer">
          <UserRound className="w-6 h-6" />
        </div>
      </div>

      {/* Mobile Menu */}
      <ul
        className={`absolute top-full left-0 w-full bg-base-300 text-content shadow-lg md:hidden flex flex-col items-center space-y-6 px-6 py-4 z-50 mt-2 transform transition-all duration-300 ease-in-out ${
          menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}
      >
        <li><HashLink smooth to="#about" className={getLinkClasses('#about')} onClick={() => setMenuOpen(false)}>About</HashLink></li>
        <li><Link to="/menu" className={getLinkClasses('/menu')} onClick={() => setMenuOpen(false)}>Menu</Link></li>
        <li><HashLink smooth to="#our-customer" className={getLinkClasses('#review')} onClick={() => setMenuOpen(false)}>Our Customer</HashLink></li>
        <li><HashLink smooth to="#contact" className={getLinkClasses('#contact')} onClick={() => setMenuOpen(false)}>Contact Us</HashLink></li>
      </ul>
    </nav>
  );
};

export default Navbar;