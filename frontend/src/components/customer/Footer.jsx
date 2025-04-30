import React from 'react';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import {
  FaFacebook, FaTwitter, FaInstagram, FaLinkedin,
  FaYoutube, FaPhone, FaEnvelope, FaMapMarkerAlt
} from 'react-icons/fa';
import { FaTiktok } from 'react-icons/fa';
import { useRestaurant } from '../../contexts/RestaurantContext';

const Footer = () => {
  const { restaurant, loading, error } = useRestaurant();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!restaurant) return null;

  const daysOfWeek = [
    'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
  ];

  const openingHours = restaurant.openingHours || {};

  return (
    <footer className="bg-base-300 py-10 px-4 sm:px-[5%] lg:px-[15%]" id="contact">
      <div className="max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-amber-500 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><HashLink smooth to="/#about" className="hover:text-amber-500">About</HashLink></li>
              <li><Link to="/menu" className="hover:text-amber-500">Menu</Link></li>
              <li><HashLink smooth to="/#our-customer" className="hover:text-amber-500">Our Customer</HashLink></li>
              <li><HashLink smooth to="/#contact" className="hover:text-amber-500">Contact Us</HashLink></li>
            </ul>
          </div>

          {/* Restaurant Info */}
          <div>
            <h4 className="text-lg font-bold text-amber-500 mb-4">Restaurant Info</h4>
            <p className="text-content mb-2"><strong>{restaurant.name}</strong></p>

            <div className="flex items-center mb-2 transition-transform hover:scale-105 min-w-0">
              <FaPhone className="flex-shrink-0 mr-2 text-amber-500 w-5 h-5" />
              <a href={`tel:${restaurant.phone}`} className="text-content truncate">{restaurant.phone}</a>
            </div>
            <div className="flex items-center mb-2 transition-transform hover:scale-105 min-w-0">
              <FaEnvelope className="flex-shrink-0 mr-2 text-amber-500 w-5 h-5" />
              <a href={`mailto:${restaurant.email}`} className="text-content truncate">{restaurant.email}</a>
            </div>
            <div className="flex items-center mb-2 transition-transform hover:scale-105 min-w-0 cursor-pointer">
              <FaMapMarkerAlt className="flex-shrink-0 mr-2 text-amber-500 w-5 h-5" />
              <span className="text-content truncate">{restaurant.address}</span>
            </div>
          </div>

          {/* Opening Hours */}
          <div>
            <h4 className="text-lg font-bold text-amber-500 mb-4">Opening Hours</h4>
            <ul className="text-content space-y-1">
              {daysOfWeek.map((day) => (
                <li key={day}>
                  <span className="capitalize">{day}:</span>{' '}
                  {openingHours[day] ? `${openingHours[day].start} - ${openingHours[day].end}` : 'Closed'}
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-lg font-bold text-amber-500 mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              {restaurant.socialLinks?.facebook && (
                <a href={restaurant.socialLinks.facebook} target="_blank" rel="noopener noreferrer">
                  <FaFacebook className="w-6 h-6 text-amber-500 hover:text-amber-400" />
                </a>
              )}
              {restaurant.socialLinks?.twitter && (
                <a href={restaurant.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                  <FaTwitter className="w-6 h-6 text-amber-500 hover:text-amber-400" />
                </a>
              )}
              {restaurant.socialLinks?.instagram && (
                <a href={restaurant.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                  <FaInstagram className="w-6 h-6 text-amber-500 hover:text-amber-400" />
                </a>
              )}
              {restaurant.socialLinks?.linkedin && (
                <a href={restaurant.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                  <FaLinkedin className="w-6 h-6 text-amber-500 hover:text-amber-400" />
                </a>
              )}
              {restaurant.socialLinks?.youtube && (
                <a href={restaurant.socialLinks.youtube} target="_blank" rel="noopener noreferrer">
                  <FaYoutube className="w-6 h-6 text-amber-500 hover:text-amber-400" />
                </a>
              )}
              {restaurant.socialLinks?.tiktok && (
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