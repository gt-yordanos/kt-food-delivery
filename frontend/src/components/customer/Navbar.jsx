import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { ShoppingCart, Menu, X } from 'lucide-react';
import ThemeToggle from '../shared/ThemeToggle';
import ktLogo from '../../assets/ktLogo.png';
import ProfileModal from './ProfileModal';
import { useCart } from '../../contexts/CartContext';

const Navbar = () => {
  const location = useLocation();
  const [currentHash, setCurrentHash] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const { cartCount } = useCart();
  useEffect(() => {
    setCurrentHash(location.hash);

    // Scroll to top when navigating to /menu
    if (location.pathname === '/menu') {
      window.scrollTo(0, 0);
    }
  }, [location]);

  const getLinkClasses = (hashOrPath) => {
    const isActive =
      (hashOrPath.startsWith('/#') &&
        location.pathname === '/' &&
        location.hash === hashOrPath.replace('/', '')) ||
      location.pathname === hashOrPath;

    return `text-lg font-bold hover:text-amber-500 transition-all duration-300 ease-in-out ${
      isActive ? 'text-amber-500' : 'text-content'
    }`;
  };

  return (
    <nav className="flex items-center justify-between py-2 px-4 sm:px-[5%] lg:px-[15%] bg-base-300 shadow-md fixed top-0 left-0 w-full z-50">
      {/* Logo */}
      <HashLink smooth to="/#home" className="logo">
        <img src={ktLogo} alt="KT Restaurant Logo" className="h-12" />
      </HashLink>

      {/* Desktop Menu */}
      <ul className="hidden md:flex space-x-6">
        <li>
          <HashLink smooth to="/#about" className={getLinkClasses('/#about')}>
            About
          </HashLink>
        </li>
        <li>
          <Link to="/menu" className={getLinkClasses('/menu')}>
            Menu
          </Link>
        </li>
        <li>
          <HashLink smooth to="/#our-customer" className={getLinkClasses('/#our-customer')}>
            Our Customer
          </HashLink>
        </li>
        <li>
          <HashLink smooth to="/#contact" className={getLinkClasses('/#contact')}>
            Contact Us
          </HashLink>
        </li>
      </ul>

      {/* Right Side */}
      <div className="flex items-center space-x-4 px-4 py-2">
        <div className="flex items-center space-x-4 bg-amber-500 rounded-full px-4 h-10">
          <ThemeToggle colorException={true} />
          <div className="relative mr-6">
            <Link to="/cart" className="text-2xl text-black hover:text-black-focus">
              <ShoppingCart className="w-6 h-6" />
            </Link>
            {/* Cart counter */}
            <span className="absolute -top-1 left-6 bg-blue-900 opacity-90 text-white rounded-full text-xs min-w-4 h-4 p-1 text-center font-bold flex items-center justify-center">
              {cartCount}
            </span>
          </div>

          <button className="md:hidden text-black" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Profile Modal Dropdown */}
        <ProfileModal />
      </div>

      {/* Mobile Menu */}
      <ul
        className={`absolute top-full left-0 w-full bg-base-300 text-content shadow-lg md:hidden flex flex-col items-center space-y-6 px-6 py-4 z-50 mt-2 transform transition-all duration-300 ease-in-out ${
          menuOpen ? 'translate-y-0 flex' : 'translate-y-10 hidden'
        }`}
      >
        <li>
          <HashLink smooth to="/#about" className={getLinkClasses('/#about')} onClick={() => setMenuOpen(false)}>
            About
          </HashLink>
        </li>
        <li>
          <Link to="/menu" className={getLinkClasses('/menu')} onClick={() => setMenuOpen(false)}>
            Menu
          </Link>
        </li>
        <li>
          <HashLink smooth to="/#our-customer" className={getLinkClasses('/#our-customer')} onClick={() => setMenuOpen(false)}>
            Our Customer
          </HashLink>
        </li>
        <li>
          <HashLink smooth to="/#contact" className={getLinkClasses('/#contact')} onClick={() => setMenuOpen(false)}>
            Contact Us
          </HashLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;