import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock, FaEdit, FaSave, FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaLink, FaYoutube, FaTiktok } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../api.js';

const getAuthHeader = () => {
  const token = localStorage.getItem('authToken');
  return { headers: { Authorization: `Bearer ${token}` } };
};

const Restaurant = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState({
    restaurantInfo: false,
    openingHours: false,
    socialLinks: false
  });
  const [editedRestaurant, setEditedRestaurant] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRestaurant();
  }, []);

  const fetchRestaurant = async () => {
    setLoading(true);
    try {
      const response = await axios.get(api.getAllRestaurantntInfo, getAuthHeader());
      console.log("Fetched restaurant data:", response.data);
      setRestaurant(response.data);
      setEditedRestaurant(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching restaurant:', error);
      toast.error('Failed to load restaurant details');
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (section) => {
    setIsEditing(prevState => ({
      ...prevState,
      [section]: !prevState[section]  // Toggle edit/save
    }));
  };

  const handleSaveClick = async (section) => {
    setLoading(true);
    try {
      let updatedData = {};

      if (section === 'restaurantInfo') {
        updatedData = editedRestaurant; // Save the whole restaurant info
      } else if (section === 'openingHours') {
        updatedData = { openingHours: editedRestaurant.openingHours }; // Save only the opening hours
      } else if (section === 'socialLinks') {
        updatedData = { socialLinks: editedRestaurant.socialLinks }; // Save only the social links
      }

      const response = await axios.patch(api.updateRestaurant, updatedData, getAuthHeader());
      toast.success(response.data.message || 'Restaurant updated successfully');
      await fetchRestaurant();
      setIsEditing(prevState => ({
        ...prevState,
        [section]: false
      }));
    } catch (error) {
      console.error('Error updating restaurant:', error);
      toast.error(error?.response?.data?.message || 'Failed to update restaurant');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle changes for social links separately since it's a nested object
    if (name.includes('socialLinks')) {
      const platform = name.split('.')[1]; // Extract platform name
      setEditedRestaurant((prevState) => ({
        ...prevState,
        socialLinks: {
          ...prevState.socialLinks,
          [platform]: value,
        }
      }));
    } else {
      setEditedRestaurant((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  if (loading && !restaurant) return <div className='flex justify-center items-center h-[100vh] w-full'><span className="loading loading-spinner loading-xl"></span></div>;
  if (error) return <p className="text-error">Error loading restaurant details. Please try again later.</p>;
  if (!restaurant) return <p>No restaurant data available.</p>;

  return (
    <div className="p-6 bg-base-100 rounded-lg shadow-md h-[100vh] overflow-y-auto">
      <h1 className="text-2xl font-bold mb-4">Restaurant Details</h1>

      {/* Restaurant Info Section */}
      <div className="mb-6">
        <div className="mb-4">
          <label className="font-semibold">Name:</label>
          <input
            type="text"
            name="name"
            value={isEditing.restaurantInfo ? editedRestaurant?.name || '' : restaurant.name}
            onChange={handleChange}
            disabled={!isEditing.restaurantInfo}
            className="input input-bordered w-full"
          />
        </div>

        <div className="mb-4">
          <label className="font-semibold">About:</label>
          <textarea
            name="about"
            value={isEditing.restaurantInfo ? editedRestaurant?.about || '' : restaurant.about}
            onChange={handleChange}
            disabled={!isEditing.restaurantInfo}
            className="textarea textarea-bordered w-full"
          />
        </div>

        <div className="mb-4">
          <label className="font-semibold">Address:</label>
          <input
            type="text"
            name="address"
            value={isEditing.restaurantInfo ? editedRestaurant?.address || '' : restaurant.address}
            onChange={handleChange}
            disabled={!isEditing.restaurantInfo}
            className="input input-bordered w-full"
          />
        </div>

        <div className="mb-4">
          <label className="font-semibold flex items-center">
            <FaPhoneAlt className="mr-2" /> Phone:
          </label>
          <input
            type="text"
            name="phone"
            value={isEditing.restaurantInfo ? editedRestaurant?.phone || '' : restaurant.phone}
            onChange={handleChange}
            disabled={!isEditing.restaurantInfo}
            className="input input-bordered w-full"
          />
        </div>

        <div className="mb-4">
          <label className="font-semibold flex items-center">
            <FaEnvelope className="mr-2" /> Email:
          </label>
          <input
            type="email"
            name="email"
            value={isEditing.restaurantInfo ? editedRestaurant?.email || '' : restaurant.email}
            onChange={handleChange}
            disabled={!isEditing.restaurantInfo}
            className="input input-bordered w-full"
          />
        </div>

        <button
          className="btn btn-info mt-4"
          onClick={() => isEditing.restaurantInfo ? handleSaveClick('restaurantInfo') : handleEditClick('restaurantInfo')}
          disabled={loading} // Disable the button when loading is true to prevent further edits while saving
        >
          {isEditing.restaurantInfo ? (
            <>
              <FaSave /> Save
              {loading && <span className="loading loading-spinner loading-sm ml-2"></span>}
            </>
          ) : (
            <>
              <FaEdit /> Edit
            </>
          )}
        </button>
      </div>

      {/* Opening Hours Section */}
      <div className="mb-6">
        <div className="mb-4">
          {restaurant?.openingHours ? (
            Object.entries(restaurant.openingHours).map(([day, hours]) => (
              <div key={day} className="mb-2">
                <input
                  type="text"
                  name={day}
                  value={isEditing.openingHours ? editedRestaurant?.openingHours[day] || '' : hours}
                  onChange={handleChange}
                  disabled={!isEditing.openingHours}
                  className="input input-bordered w-full"
                />
              </div>
            ))
          ) : (
            <p>Loading...</p>
          )}
        </div>

        <button
          className="btn btn-info mt-4"
          onClick={() => isEditing.openingHours ? handleSaveClick('openingHours') : handleEditClick('openingHours')}
          disabled={loading} // Disable the button when loading is true to prevent further edits while saving
        >
          {isEditing.openingHours ? (
            <>
              <FaSave /> Save
              {loading && <span className="loading loading-spinner loading-sm ml-2"></span>}
            </>
          ) : (
            <>
              <FaEdit /> Edit
            </>
          )}
        </button>
      </div>

      {/* Social Links Section */}
      <div className="mb-6">
        <div className="mb-4">
          {restaurant?.socialLinks ? (
            Object.entries(restaurant.socialLinks).map(([platform, link]) => {
              let Icon;
              switch (platform) {
                case 'facebook':
                  Icon = FaFacebook;
                  break;
                case 'instagram':
                  Icon = FaInstagram;
                  break;
                case 'twitter':
                  Icon = FaTwitter;
                  break;
                case 'linkedin':
                  Icon = FaLinkedin;
                  break;
                case 'youtube':
                  Icon = FaYoutube;
                  break;
                case 'tiktok':
                  Icon = FaTiktok;
                  break;
                default:
                  Icon = FaLink; // Fallback to a generic link icon
              }

              return (
                <div key={platform} className="flex items-center mb-2">
                  <Icon className="mr-2" />
                  <label className="mr-2">{platform.charAt(0).toUpperCase() + platform.slice(1)}:</label>
                  <input
                    type="text"
                    name={`socialLinks.${platform}`} // Name with platform to distinguish
                    value={isEditing.socialLinks ? editedRestaurant?.socialLinks[platform] || '' : link}
                    onChange={handleChange}
                    disabled={!isEditing.socialLinks}
                    className="input input-bordered w-full"
                  />
                </div>
              );
            })
          ) : (
            <p>Loading...</p>
          )}
        </div>

        <button
          className="btn btn-info mt-4"
          onClick={() => isEditing.socialLinks ? handleSaveClick('socialLinks') : handleEditClick('socialLinks')}
          disabled={loading} // Disable the button when loading is true to prevent further edits while saving
        >
          {isEditing.socialLinks ? (
            <>
              <FaSave /> Save
              {loading && <span className="loading loading-spinner loading-sm ml-2"></span>}
            </>
          ) : (
            <>
              <FaEdit /> Edit
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Restaurant;