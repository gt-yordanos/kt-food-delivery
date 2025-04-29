import React from 'react';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube, FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa'; // Added icons
import { FaTiktok } from 'react-icons/fa'; // Tiktok Icon from Font Awesome
import { useRestaurant } from '../../contexts/RestaurantContext';

const Footer = () => {
  const { restaurant, loading, error } = useRestaurant();

  // Check if the restaurant info is still loading or if there was an error
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const currentTime = new Date();
  const openTime = new Date();
  openTime.setHours(restaurant.openingHour.split(':')[0], restaurant.openingHour.split(':')[1]);
  const closeTime = new Date();
  closeTime.setHours(restaurant.closingHour.split(':')[0], restaurant.closingHour.split(':')[1]);

  const isOpen = currentTime >= openTime && currentTime <= closeTime;
  const openCloseMessage = isOpen 
    ? `Now open, will close at ${restaurant.closingHour}`
    : `Now closed, will open at ${restaurant.openingHour}`;

  return (
    <footer className="bg-base-300 py-10 px-4 sm:px-[5%] lg:px-[15%]">
      <div className="max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Nav Links */}
          <div>
            <h4 className="text-lg font-bold text-amber-500 mb-4">Quick Links</h4>
            <ul>
              <li><HashLink smooth to="#about" className="hover:text-amber-500">About</HashLink></li>
              <li><Link to="/menu" className="hover:text-amber-500">Menu</Link></li>
              <li><HashLink smooth to="#our-customer" className="hover:text-amber-500">Our Customer</HashLink></li>
              <li><HashLink smooth to="#contact" className="hover:text-amber-500">Contact Us</HashLink></li>
            </ul>
          </div>

          {/* Restaurant Info */}
          <div>
            <h4 className="text-lg font-bold text-amber-500 mb-4">Restaurant Info</h4>
            <p className="text-content mb-2"><strong>{restaurant.name}</strong></p>
            <p className="text-content mb-2">{restaurant.address}</p>

            {/* Phone & Email with Icons and Transition */}
            <div className="flex items-center mb-2 transition-transform hover:scale-105">
              <FaPhone className="mr-2 text-amber-500" />
              <a href={`tel:${restaurant.phone}`} className="text-content">{restaurant.phone}</a>
            </div>
            <div className="flex items-center mb-2 transition-transform hover:scale-105">
              <FaEnvelope className="mr-2 text-amber-500" />
              <a href={`mailto:${restaurant.email}`} className="text-content">{restaurant.email}</a>
            </div>
            <div className="flex items-center mb-2 transition-transform hover:scale-105">
              <FaMapMarkerAlt className="mr-2 text-amber-500" />
              <span className="text-content">{restaurant.address}</span>
            </div>

            {/* Opening/Closing Hours */}
            <div className="text-content">{openCloseMessage}</div>
          </div>

          {/* Social Media Links */}
          <div>
            <h4 className="text-lg font-bold text-amber-500 mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              {restaurant.socialLinks.facebook && (
                <a href={restaurant.socialLinks.facebook} target="_blank" rel="noopener noreferrer">
                  <FaFacebook className="w-6 h-6 text-amber-500 hover:text-amber-400" />
                </a>
              )}
              {restaurant.socialLinks.twitter && (
                <a href={restaurant.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                  <FaTwitter className="w-6 h-6 text-amber-500 hover:text-amber-400" />
                </a>
              )}
              {restaurant.socialLinks.instagram && (
                <a href={restaurant.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                  <FaInstagram className="w-6 h-6 text-amber-500 hover:text-amber-400" />
                </a>
              )}
              {restaurant.socialLinks.linkedin && (
                <a href={restaurant.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                  <FaLinkedin className="w-6 h-6 text-amber-500 hover:text-amber-400" />
                </a>
              )}
              {restaurant.socialLinks.youtube && (
                <a href={restaurant.socialLinks.youtube} target="_blank" rel="noopener noreferrer">
                  <FaYoutube className="w-6 h-6 text-amber-500 hover:text-amber-400" />
                </a>
              )}
              {restaurant.socialLinks.tiktok && (
                <a href={restaurant.socialLinks.tiktok} target="_blank" rel="noopener noreferrer">
                  <FaTiktok className="w-6 h-6 text-amber-500 hover:text-amber-400" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="mt-8 text-center text-content">
        <p>&copy; {new Date().getFullYear()} {restaurant.name}. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;